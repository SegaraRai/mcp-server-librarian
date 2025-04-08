/**
 * Core Librarian implementation
 */
import { z } from "zod";
import { LibrarianConfig } from "./config.js";
import { KnowledgeStructuringSessionManager } from "./knowledgeStructuring/session.js";
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
  directory: z
    .string()
    .default("/")
    .describe("The directory path to list documents from"),
  tags: z.array(z.string()).default([]).describe("Tags to filter documents by"),
  includeContents: z
    .boolean()
    .default(false)
    .describe("Whether to include document contents in results"),
  depth: z
    .number()
    .default(-1)
    .describe("Maximum directory depth to traverse (-1 for infinite)"),
});

/**
 * Type for listDocuments parameters
 */
export type ListDocumentsParams = z.input<typeof listDocumentsSchema>;

/**
 * Input schema for searchDocuments
 */
export const searchDocumentsSchema = z.object({
  query: z.string().describe("The search query string"),
  mode: z
    .enum(["string", "regex"])
    .default("string")
    .describe("Search mode (string or regex)"),
  caseSensitive: z
    .boolean()
    .default(false)
    .describe("Whether the search should be case-sensitive"),
  directory: z
    .string()
    .default("/")
    .describe("The directory path to search documents in"),
  tags: z
    .array(z.string())
    .default([])
    .describe("Tags to filter search results by"),
  includeContents: z
    .boolean()
    .default(false)
    .describe("Whether to include document contents in results"),
  depth: z
    .number()
    .default(-1)
    .describe("Maximum directory depth to traverse (-1 for infinite)"),
});

/**
 * Type for searchDocuments parameters
 */
export type SearchDocumentsParams = z.input<typeof searchDocumentsSchema>;

/**
 * Input schema for getDocument
 */
export const getDocumentSchema = z.object({
  filepath: z.string().describe("The file path of the document to retrieve"),
});

/**
 * Type for getDocument parameters
 */
export type GetDocumentParams = z.input<typeof getDocumentSchema>;

/**
 * Input schema for getDocuments
 */
export const getDocumentsSchema = z.object({
  filepaths: z
    .array(z.string())
    .describe("The file paths of the documents to retrieve"),
});

/**
 * Type for getDocuments parameters
 */
export type GetDocumentsParams = z.input<typeof getDocumentsSchema>;

/**
 * Input schema for listTags
 */
export const listTagsSchema = z.object({
  directory: z
    .string()
    .default("/")
    .describe("The directory path to list tags from"),
  includeFilepaths: z
    .boolean()
    .default(false)
    .describe("Whether to include file paths for each tag"),
  depth: z
    .number()
    .default(-1)
    .describe("Maximum directory depth to traverse (-1 for infinite)"),
});

/**
 * Type for listTags parameters
 */
export type ListTagsParams = z.input<typeof listTagsSchema>;

/**
 * Librarian class for managing and retrieving markdown documents
 */
export class Librarian {
  private readonly config: LibrarianConfig;
  private documentCache: DocumentCache | null = null;
  private loading: Promise<DocumentCache> | null = null;

  readonly knowledgeStructuringSessionManager: KnowledgeStructuringSessionManager | null =
    null;

  constructor(config: LibrarianConfig) {
    this.config = config;

    if (config.enableWriteOperations) {
      this.knowledgeStructuringSessionManager =
        new KnowledgeStructuringSessionManager(config.docsRoot);
    }
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
    const { directory, tags, depth } = params;
    const cache = await this.ensureDocumentsLoaded();

    return filterDocuments(cache, directory, tags, depth);
  }

  /**
   * Search documents using string or regex patterns
   */
  async searchDocuments(params: SearchDocumentsParams): Promise<Document[]> {
    const { query, mode, caseSensitive, directory, tags, depth } = params;
    const cache = await this.ensureDocumentsLoaded();

    return searchDocs(
      cache,
      query,
      directory,
      tags,
      mode,
      caseSensitive,
      depth,
    );
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
   * Get multiple documents by their paths
   */
  async getDocuments(
    params: GetDocumentsParams,
  ): Promise<[string, Document | null][]> {
    const { filepaths } = params;
    const cache = await this.ensureDocumentsLoaded();

    return filepaths.map((filepath) => [filepath, getDoc(cache, filepath)]);
  }

  /**
   * List all tags with counts and optional filepaths
   */
  async listTags(
    params: ListTagsParams,
  ): Promise<{ tag: string; count: number; filepaths?: string[] }[]> {
    const { directory, includeFilepaths, depth } = params;
    const cache = await this.ensureDocumentsLoaded();

    return getTagsInDirectory(cache, directory, includeFilepaths, depth);
  }
}
