/**
 * Document loading module for the Librarian MCP server
 */
import fg from "fast-glob";
import matter from "gray-matter";
import * as fs from "node:fs";
import * as path from "node:path";
import { normalizePath } from "./normalize.js";

/**
 * Document interface representing a markdown document
 */
export interface Document {
  /**
   * Relative path to the document
   */
  filepath: string;

  /**
   * Tags associated with the document (including inherited tags)
   */
  tags: string[];

  /**
   * Document contents (markdown)
   */
  contents: string;
}

/**
 * Raw document data before tag inheritance is applied
 */
interface RawDocument {
  filepath: string;
  tags: string[];
  contents: string;
}

/**
 * Cache of loaded documents
 */
export interface DocumentCache {
  /**
   * All documents with their tags and contents
   */
  documents: Document[];

  /**
   * Map of filepath to document for quick lookup
   */
  documentMap: Map<string, Document>;

  /**
   * Map of tag to documents with that tag
   */
  tagMap: Map<string, Document[]>;

  /**
   * All available tags across all documents
   */
  allTags: string[];
}

/**
 * Read a markdown file and parse its frontmatter
 */
function readMarkdownFile(docsRoot: string, filepath: string): RawDocument {
  const fullPath = path.join(docsRoot, filepath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${filepath}`);
  }

  const fileContent = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContent);
  // Ensure filepath has a leading "/"
  const normalizedFilepath = normalizePath(filepath);

  return {
    filepath: normalizedFilepath,
    tags: Array.isArray(data.tags) ? data.tags : [],
    contents: content,
  };
}

/**
 * Get inherited tags from parent directories
 */
function getInheritedTags(
  docsRoot: string,
  filepath: string,
  documentMap: Map<string, RawDocument>,
): string[] {
  const parts = normalizePath(filepath).slice(1).split("/").filter(Boolean);
  const allTags: string[] = [];

  // Start from root and traverse down the path
  let currentPath = "";

  // Check root index.md
  const rootIndexPath = "/index.md";
  const rootIndexDoc = documentMap.get(rootIndexPath);
  if (rootIndexDoc) {
    allTags.push(...rootIndexDoc.tags);
  }

  // Check each directory level
  for (let i = 0; i < parts.length - 1; i++) {
    currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];

    const indexPath = `/${currentPath}/index.md`;
    const indexDoc = documentMap.get(indexPath);
    if (indexDoc) {
      allTags.push(...indexDoc.tags);
    }
  }

  // Remove duplicates
  return [...new Set(allTags)];
}

/**
 * Enrich a document with inherited tags
 */
function enrichDocumentWithTags(
  docsRoot: string,
  doc: RawDocument,
  documentMap: Map<string, RawDocument>,
): Document {
  const inheritedTags = getInheritedTags(docsRoot, doc.filepath, documentMap);
  return {
    ...doc,
    tags: [...new Set([...inheritedTags, ...doc.tags])],
  };
}

/**
 * Load all documents from the docs root directory
 */
export async function loadAllDocuments(
  docsRoot: string,
): Promise<DocumentCache> {
  // Find all markdown files
  const files = await fg("**/*.md", {
    cwd: docsRoot,
    ignore: ["**/node_modules/**"],
  });

  // First pass: read all documents
  const rawDocuments: RawDocument[] = [];
  const rawDocumentMap = new Map<string, RawDocument>();

  for (const file of files) {
    try {
      const doc = readMarkdownFile(docsRoot, file);
      rawDocuments.push(doc);
      // Use the normalized filepath (with leading "/") as the key
      const normalizedFile = normalizePath(file);
      rawDocumentMap.set(normalizedFile, doc);
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }

  // Second pass: enrich documents with inherited tags
  const documents: Document[] = [];
  const documentMap = new Map<string, Document>();
  const tagMap = new Map<string, Document[]>();
  const allTags = new Set<string>();

  for (const rawDoc of rawDocuments) {
    try {
      const enrichedDoc = enrichDocumentWithTags(
        docsRoot,
        rawDoc,
        rawDocumentMap,
      );
      documents.push(enrichedDoc);
      documentMap.set(enrichedDoc.filepath, enrichedDoc);

      // Add to tag map
      for (const tag of enrichedDoc.tags) {
        allTags.add(tag);

        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag)!.push(enrichedDoc);
      }
    } catch (error) {
      console.error(`Error enriching document ${rawDoc.filepath}:`, error);
    }
  }

  // Sort documents by path components
  documents.sort((a, b) => {
    // Split paths into components
    const pathA = a.filepath.split("/").filter(Boolean);
    const pathB = b.filepath.split("/").filter(Boolean);

    // Compare each path component
    for (let i = 0; i < Math.min(pathA.length, pathB.length); i++) {
      // If we're at the filename level for both paths
      if (i === pathA.length - 1 && i === pathB.length - 1) {
        // Both are files in the same directory
        // index.md comes first
        if (pathA[i] === "index.md" && pathB[i] !== "index.md") return -1;
        if (pathA[i] !== "index.md" && pathB[i] === "index.md") return 1;

        // Otherwise sort alphabetically
        return pathA[i].localeCompare(pathB[i]);
      }

      // If components differ
      if (pathA[i] !== pathB[i]) {
        // Check if one is a file (last component)
        if (i === pathA.length - 1) return 1; // A is a file, so it comes after B
        if (i === pathB.length - 1) return -1; // B is a file, so it comes after A

        // Both are directories, sort alphabetically
        return pathA[i].localeCompare(pathB[i]);
      }
    }

    // If one path is shorter, it comes first (directories before files)
    return pathA.length - pathB.length;
  });

  return {
    documents,
    documentMap,
    tagMap,
    allTags: [...allTags],
  };
}

/**
 * Filter documents by directory and tags
 */
export function filterDocuments(
  cache: DocumentCache,
  directory: string = "/",
  tags: string[] = [],
  depth: number = -1,
): Document[] {
  // Remove the leading "/" for directory comparison
  const normalizedDir = normalizePath(directory);
  const dirPrefix = normalizedDir === "/" ? "/" : `${normalizedDir}/`;

  // Filter by directory
  const dirFiltered = cache.documents.filter((doc) => {
    // Check if document is in the specified directory
    // Remove the leading "/" from the filepath for comparison
    const normalizedFilepath = normalizePath(doc.filepath);
    if (!normalizedFilepath.startsWith(dirPrefix)) {
      return false;
    }

    // If depth is -1, include all documents in the directory
    if (depth < 0) {
      return true;
    }

    // Calculate the relative path from the specified directory
    const relativePath = normalizedFilepath.substring(dirPrefix.length);

    // If relativePath is empty, it's the directory itself or an index file
    if (relativePath === "" || relativePath === "index.md") {
      return true;
    }

    // Count the number of directory separators to determine depth
    const pathDepth = relativePath.split("/").filter(Boolean).length;

    // Include the document if its depth is within the specified limit
    return pathDepth <= depth;
  });

  // Filter by tags
  if (tags.length === 0) {
    return dirFiltered;
  }

  return dirFiltered.filter((doc) =>
    tags.some((tag: string) => doc.tags.includes(tag)),
  );
}

/**
 * Search documents by query
 */
export function searchDocuments(
  cache: DocumentCache,
  query: string,
  directory: string = "/",
  tags: string[] = [],
  mode: "string" | "regex" = "string",
  caseSensitive: boolean = false,
  depth: number = -1,
): Document[] {
  // First filter by directory and tags
  const filtered = filterDocuments(cache, directory, tags, depth);

  // Create regex flags based on parameters
  const flags = caseSensitive ? "g" : "gi";

  // Create regex pattern based on mode
  let pattern: RegExp;
  if (mode === "string") {
    // Escape special characters for string mode
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    pattern = new RegExp(escapedQuery, flags);
  } else {
    // Use query directly as regex pattern
    try {
      pattern = new RegExp(query, flags);
    } catch (error) {
      // If invalid regex, treat as a plain string
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      pattern = new RegExp(escapedQuery, flags);
    }
  }

  // Search in document contents
  const results = filtered.filter((doc) => {
    pattern.lastIndex = 0; // Reset regex index for each document
    return doc.contents != null && pattern.test(doc.contents);
  });

  return results;
}

/**
 * Get a document by filepath
 */
export function getDocument(
  cache: DocumentCache,
  filepath: string,
): Document | null {
  // Ensure filepath has a leading "/"
  const normalizedPath = normalizePath(filepath);
  return cache.documentMap.get(normalizedPath) ?? null;
}

/**
 * Get all tags in a specific directory
 */
export function getTagsInDirectory(
  cache: DocumentCache,
  directory: string = "/",
  includeFilepaths: boolean = false,
  depth: number = -1,
): { tag: string; count: number; filepaths?: string[] }[] {
  // Filter documents by directory
  const documents = filterDocuments(cache, directory, [], depth);

  // Count tags and collect filepaths
  const tagCounts = new Map<string, number>();
  const tagFilepaths = new Map<string, Set<string>>();

  for (const doc of documents) {
    for (const tag of doc.tags) {
      // Increment tag count
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);

      // Add filepath to tag if needed
      if (includeFilepaths) {
        if (!tagFilepaths.has(tag)) {
          tagFilepaths.set(tag, new Set());
        }
        tagFilepaths.get(tag)!.add(doc.filepath);
      }
    }
  }

  // Convert to result format
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => {
      const result: { tag: string; count: number; filepaths?: string[] } = {
        tag,
        count,
      };

      if (includeFilepaths) {
        result.filepaths = Array.from(tagFilepaths.get(tag) ?? []);
      }

      return result;
    })
    .sort((a, b) => b.count - a.count); // Sort by count descending
}
