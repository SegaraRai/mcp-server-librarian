/**
 * Core Librarian implementation
 */
import { z } from "zod";
import { LibrarianConfig } from "./config.js";
import {
  Document,
  DocumentCache,
  filterDocuments,
  getDocument as getDoc,
  getTagsInDirectory,
  loadAllDocuments,
  searchDocuments as searchDocs,
} from "./load.js";

/**
 * Input schema for listDocuments
 */
export const listDocumentsSchema = z.object({
  directory: z.string().default("/"),
  tags: z.array(z.string()).default([]),
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
  includeContents: z.boolean().default(false),
});

/**
 * Type for searchDocuments parameters
 */
export type SearchDocumentsParams = z.infer<typeof searchDocumentsSchema>;

/**
 * Input schema for getDocument
 */
export const getDocumentSchema = z.object({
  filepath: z.string(),
});

/**
 * Type for getDocument parameters
 */
export type GetDocumentParams = z.infer<typeof getDocumentSchema>;

/**
 * Input schema for listTags
 */
export const listTagsSchema = z.object({
  directory: z.string().default("/"),
  includeFilepaths: z.boolean().default(false),
});

/**
 * Type for listTags parameters
 */
export type ListTagsParams = z.infer<typeof listTagsSchema>;

/**
 * Librarian class for managing and retrieving markdown documents
 */
export class Librarian {
  private config: LibrarianConfig;
  private documentCache: DocumentCache | null = null;
  private loading: Promise<DocumentCache> | null = null;

  constructor(config: LibrarianConfig) {
    this.config = config;
  }

  /**
   * Initialize the document cache
   */
  private async ensureDocumentsLoaded(): Promise<DocumentCache> {
    if (this.documentCache) {
      return this.documentCache;
    }

    if (!this.loading) {
      this.loading = loadAllDocuments(this.config.docsRoot);
    }

    this.documentCache = await this.loading;
    return this.documentCache;
  }

  /**
   * Reload all documents (useful if files have changed)
   */
  async reloadDocuments(): Promise<void> {
    this.documentCache = null;
    this.loading = null;
    await this.ensureDocumentsLoaded();
  }

  /**
   * List documents with optional filtering by directory and tags
   */
  async listDocuments(params: ListDocumentsParams): Promise<Document[]> {
    const { directory, tags } = params;
    const cache = await this.ensureDocumentsLoaded();

    const documents = filterDocuments(cache, directory, tags);

    // Remove contents to keep response size small
    return documents.map(({ contents, ...rest }) => rest);
  }

  /**
   * Search documents using string or regex patterns
   */
  async searchDocuments(params: SearchDocumentsParams): Promise<Document[]> {
    const { query, directory, tags, includeContents } = params;
    const cache = await this.ensureDocumentsLoaded();

    return searchDocs(cache, query, directory, tags, includeContents);
  }

  /**
   * Get a specific document by path
   */
  async getDocument(params: GetDocumentParams): Promise<Document> {
    const { filepath } = params;
    const cache = await this.ensureDocumentsLoaded();

    return getDoc(cache, filepath);
  }

  /**
   * List all tags with counts and optional filepaths
   */
  async listTags(
    params: ListTagsParams,
  ): Promise<{ tag: string; count: number; filepaths?: string[] }[]> {
    const { directory, includeFilepaths } = params;
    const cache = await this.ensureDocumentsLoaded();

    return getTagsInDirectory(cache, directory, includeFilepaths);
  }
}
