/**
 * Core Librarian implementation
 */
import * as fs from 'fs';
import * as path from 'path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { z } from 'zod';
import { LibrarianConfig } from './config.js';

/**
 * Document interface representing a markdown document
 */
export interface Document {
  filepath: string;
  tags: string[];
  contents?: string;
}

/**
 * Input schema for listDocuments
 */
export const listDocumentsSchema = z.object({
  directory: z.string().default("/"),
  tags: z.array(z.string()).default([])
});

/**
 * Type for listDocuments parameters
 */
export type ListDocumentsParams = z.infer<typeof listDocumentsSchema>;

/**
 * Input schema for searchDocuments
 */
export const searchDocumentsSchema = z.object({
  query: z.string(),
  directory: z.string().default("/"),
  tags: z.array(z.string()).default([]),
  includeContents: z.boolean().default(false)
});

/**
 * Type for searchDocuments parameters
 */
export type SearchDocumentsParams = z.infer<typeof searchDocumentsSchema>;

/**
 * Input schema for getDocument
 */
export const getDocumentSchema = z.object({
  filepath: z.string()
});

/**
 * Type for getDocument parameters
 */
export type GetDocumentParams = z.infer<typeof getDocumentSchema>;

/**
 * Librarian class for managing and retrieving markdown documents
 */
export class Librarian {
  private config: LibrarianConfig;

  constructor(config: LibrarianConfig) {
    this.config = config;
  }

  /**
   * Read a markdown file and parse its frontmatter
   */
  private readMarkdownFile(filepath: string): Document {
    const fullPath = path.join(this.config.docsRoot, filepath);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${filepath}`);
    }
    
    const fileContent = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(fileContent);
    
    return {
      filepath,
      tags: Array.isArray(data.tags) ? data.tags : [],
      contents: content
    };
  }

  /**
   * Get inherited tags from parent directories
   */
  private getInheritedTags(filepath: string): string[] {
    const parts = filepath.split("/").filter(Boolean);
    const allTags: string[] = [];
    
    // Start from root and traverse down the path
    let currentPath = "";
    
    // Check root index.md
    try {
      const rootIndexPath = "index.md";
      if (fs.existsSync(path.join(this.config.docsRoot, rootIndexPath))) {
        const { data } = matter(fs.readFileSync(path.join(this.config.docsRoot, rootIndexPath), "utf-8"));
        if (Array.isArray(data.tags)) {
          allTags.push(...data.tags);
        }
      }
    } catch (error) {
      console.error(`Error reading root index.md:`, error);
    }
    
    // Check each directory level
    for (let i = 0; i < parts.length - 1; i++) {
      currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
      
      try {
        const indexPath = `${currentPath}/index.md`;
        if (fs.existsSync(path.join(this.config.docsRoot, indexPath))) {
          const { data } = matter(fs.readFileSync(path.join(this.config.docsRoot, indexPath), "utf-8"));
          if (Array.isArray(data.tags)) {
            allTags.push(...data.tags);
          }
        }
      } catch (error) {
        console.error(`Error reading ${currentPath}/index.md:`, error);
      }
    }
    
    // Remove duplicates
    return [...new Set(allTags)];
  }

  /**
   * Enrich a document with inherited tags
   */
  private enrichDocumentWithTags(doc: Document): Document {
    const inheritedTags = this.getInheritedTags(doc.filepath);
    return {
      ...doc,
      tags: [...new Set([...inheritedTags, ...doc.tags])]
    };
  }

  /**
   * List documents with optional filtering by directory and tags
   */
  async listDocuments(params: ListDocumentsParams): Promise<Document[]> {
    const { directory, tags } = params;
    const normalizedDir = directory.startsWith("/") ? directory.substring(1) : directory;
    const pattern = `${normalizedDir === "/" ? "" : normalizedDir + "/"}**/*.md`;
    
    const files = await fg(pattern, {
      cwd: this.config.docsRoot,
      ignore: ["**/node_modules/**"]
    });
    
    const documents: Document[] = [];
    
    for (const file of files) {
      try {
        const doc = this.readMarkdownFile(file);
        const enrichedDoc = this.enrichDocumentWithTags(doc);
        
        // Filter by tags if specified
        if (tags.length === 0 || tags.some((tag: string) => enrichedDoc.tags.includes(tag))) {
          // Remove contents to keep response size small
          const { contents, ...docWithoutContents } = enrichedDoc;
          documents.push(docWithoutContents);
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
    
    return documents;
  }

  /**
   * Search documents using string or regex patterns
   */
  async searchDocuments(params: SearchDocumentsParams): Promise<Document[]> {
    const { query, directory, tags, includeContents } = params;
    const normalizedDir = directory.startsWith("/") ? directory.substring(1) : directory;
    const pattern = `${normalizedDir === "/" ? "" : normalizedDir + "/"}**/*.md`;
    
    const files = await fg(pattern, {
      cwd: this.config.docsRoot,
      ignore: ["**/node_modules/**"]
    });
    
    const results: Document[] = [];
    
    // Determine if query is a regex
    let regex: RegExp;
    try {
      // Default to case-insensitive global matching
      regex = new RegExp(query, "gim");
    } catch (error) {
      // If invalid regex, treat as a plain string
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      regex = new RegExp(escapedQuery, "gim");
    }
    
    for (const file of files) {
      try {
        const doc = this.readMarkdownFile(file);
        const enrichedDoc = this.enrichDocumentWithTags(doc);
        
        // Filter by tags if specified
        if (tags.length === 0 || tags.some((tag: string) => enrichedDoc.tags.includes(tag))) {
          // Check if content matches the query
          if (enrichedDoc.contents && regex.test(enrichedDoc.contents)) {
            if (!includeContents) {
              // Remove contents to keep response size small
              const { contents, ...docWithoutContents } = enrichedDoc;
              results.push(docWithoutContents);
            } else {
              results.push(enrichedDoc);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
    
    return results;
  }

  /**
   * Get a specific document by path
   */
  async getDocument(params: GetDocumentParams): Promise<Document> {
    const { filepath } = params;
    const normalizedPath = filepath.startsWith("/") ? filepath.substring(1) : filepath;
    
    const doc = this.readMarkdownFile(normalizedPath);
    const enrichedDoc = this.enrichDocumentWithTags(doc);
    
    return enrichedDoc;
  }
}
