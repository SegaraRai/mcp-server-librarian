/**
 * Utility functions for formatting responses
 */
import { Document } from "./load.js";

/**
 * Format a list of tags as plaintext
 */
export function formatTags(tags: readonly string[]): string {
  if (tags.length === 0) {
    return "(no tags)";
  }

  return tags.map((tag) => `- ${tag}`).join("\n");
}

/**
 * Format a list of documents as plaintext
 */
export function formatDocumentList(documents: Document[]): string {
  if (documents.length === 0) {
    return "No documents found.";
  }

  return documents
    .map((doc) => {
      const filepath = doc.filepath.startsWith("/")
        ? doc.filepath
        : `/${doc.filepath}`;
      return `- ${filepath}\n  - tags: ${formatTags(doc.tags)}`;
    })
    .join("\n");
}

/**
 * Format a list of documents with contents as plaintext
 */
export function formatDocumentListWithContents(documents: Document[]): string {
  if (documents.length === 0) {
    return "No documents found.";
  }

  return documents.map((doc) => formatDocument(doc)).join("\n\n");
}

/**
 * Format a single document as plaintext
 */
export function formatDocument(document: Document): string {
  const filepath = document.filepath.startsWith("/")
    ? document.filepath
    : `/${document.filepath}`;
  return `**${filepath}**\ntags: ${formatTags(document.tags)}\n======\n${document.contents ?? ""}\n======`;
}

/**
 * Format a list of tags as plaintext
 */
export function formatTagList(
  tags: { tag: string; count: number; filepaths?: string[] }[],
): string {
  if (tags.length === 0) {
    return "No tags found.";
  }

  return tags
    .map((tagInfo) => {
      let result = `- ${tagInfo.tag} (${tagInfo.count})`;

      if (tagInfo.filepaths && tagInfo.filepaths.length > 0) {
        const files = tagInfo.filepaths
          .map((file) => `  - ${file.startsWith("/") ? file : `/${file}`}`)
          .join("\n");
        result += `\n${files}`;
      }

      return result;
    })
    .join("\n");
}
