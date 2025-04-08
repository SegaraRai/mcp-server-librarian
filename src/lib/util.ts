/**
 * Utility functions for formatting responses
 */
import { Document } from "./load.js";
import { normalizePath } from "./normalize.js";

export function withLineNumber(text: string, indent = ""): string {
  const lines = text.split("\n");
  const lineNumberWidth = String(lines.length).length;
  return lines
    .map(
      (line, index) =>
        `${indent}${String(index + 1).padStart(lineNumberWidth, " ")} | ${line}`,
    )
    .join("\n");
}

/**
 * Format a list of tags as plaintext
 */
export function formatTags(tags: readonly string[]): string {
  if (tags.length === 0) {
    return "(no tags)";
  }

  return tags.join(", ");
}

/**
 * Format a list of documents as plaintext
 */
export function formatDocumentList(
  documents: [string, Document | null][],
): string {
  if (documents.length === 0) {
    return "No documents found.";
  }

  return documents
    .map(([filepath, doc]) => {
      return doc
        ? `- ${filepath}\n  - tags: ${formatTags(doc.tags)}`
        : `- ${filepath}\n  Document not found.`;
    })
    .join("\n");
}

/**
 * Format a list of documents with contents as plaintext
 */
export function formatDocumentListWithContents(
  documents: [string, Document | null][],
): string {
  if (documents.length === 0) {
    return "No documents found.";
  }

  return documents
    .map(([filepath, doc]) =>
      doc ? formatDocument(doc) : `- ${filepath}\n  Document not found.`,
    )
    .join("\n\n");
}

/**
 * Format a single document as plaintext
 */
export function formatDocument(document: Document): string {
  const filepath = normalizePath(document.filepath);
  return `- ${filepath}\n  - tags: ${formatTags(document.tags)}\n${withLineNumber(document.contents, "  ")}`;
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
          .map((file) => `  - ${normalizePath(file)}`)
          .join("\n");
        result += `\n${files}`;
      }

      return result;
    })
    .join("\n");
}

/**
 * Format an overview of documents and tags as plaintext
 */
export function formatOverview(
  documents: Document[],
  tags: { tag: string; count: number; filepaths?: string[] }[],
): string {
  const documentsSection =
    documents.length === 0
      ? "No documents found."
      : documents
          .map((doc) => `- ${doc.filepath}\n  - tags: ${formatTags(doc.tags)}`)
          .join("\n");

  const tagsSection = formatTagList(tags);

  return `# Documents\n\n${documentsSection}\n\n# Tags\n\n${tagsSection}`;
}
