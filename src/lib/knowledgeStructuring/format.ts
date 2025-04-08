/**
 * Utility functions for formatting knowledge structuring session responses
 */

import { withLineNumber } from "../util.js";

const MAX_LINES = 4000;

function formatSessionStatus(
  sessionToken: string,
  remainingFiles: readonly string[],
  completedFiles: readonly string[],
): string {
  const chunks = [`**Session Token:** \`${sessionToken}\``];

  if (remainingFiles.length > 0) {
    chunks.push(
      `**Remaining File${remainingFiles.length !== 1 ? "s" : ""}:**\n${remainingFiles
        .map((file) => `- ${file}`)
        .join("\n")}`,
    );
  }

  if (completedFiles.length > 0) {
    chunks.push(
      `**Completed File${completedFiles.length !== 1 ? "s" : ""}:**\n${completedFiles
        .map((file) => `- ${file}`)
        .join("\n")}`,
    );
  }

  return chunks.join("\n\n");
}

function formatSourceDocument(
  sourceDocumentLines: readonly string[],
  range?: string,
): string {
  let start = 0;
  let end = Math.min(sourceDocumentLines.length, MAX_LINES);

  const match = range?.match(/^\D*(\d+)(-(?:\D*(\d+))?)?$/);
  if (match) {
    start = parseInt(match[1], 10) - 1;
    const orgEnd = match[2]
      ? match[3]
        ? parseInt(match[3], 10)
        : sourceDocumentLines.length
      : start + 1;
    end = Math.min(
      Math.max(orgEnd, start + 1),
      sourceDocumentLines.length,
      start + MAX_LINES,
    );
  }

  const selectedLines = sourceDocumentLines.slice(start, end).join("\n");
  const suffix =
    start !== 0 || end !== sourceDocumentLines.length
      ? ` (L${start + 1}-L${end} of ${sourceDocumentLines.length} lines)`
      : 2;
  return `**Source Document${suffix}:**======\n${selectedLines}`;
}

export function formatInitialPrompt(
  sessionToken: string,
  sourceDocumentLines: readonly string[],
): string {
  const truncated = sourceDocumentLines.length > MAX_LINES;

  const steps = [
    "Carefully analyze the Source Document below to understand its overall structure and content hierarchy.",
    "Identify logical sections and subsections, noting their line numbers and creating appropriate lower-kebab-case filepaths for each (e.g., `[L123-L456,L500-L600] /path/to/dir/getting-started.md`).",
    truncated
      ? "Use `knowledgeStructuringSession.showSourceDocument` with line ranges to view additional portions of the document."
      : "",
    truncated
      ? "Continue analyzing each section until you've processed the entire document."
      : "",
    "Once analysis is complete, call `knowledgeStructuringSession.start` with the provided session token and your planned filepath structure.",
  ].filter(Boolean);

  return `You are an expert editor with deep knowledge of computer science and IT documentation. Your task is to analyze, classify, and structure a large document into a well-organized hierarchy.

Your goal is to break down this document into logical sections and organize them into a coherent file tree of markdown files.

Follow these steps to analyze and structure the document:

${steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}

**Session Token:** \`${sessionToken}\`

**Source Document${truncated ? ` (L1-L${MAX_LINES} of ${sourceDocumentLines.length} lines)` : ""}:**
======
${sourceDocumentLines.slice(0, MAX_LINES).join("\n")}`;
}

/**
 * Format the response for starting a knowledge structuring session
 */
export function formatSessionStartResponse(
  sessionToken: string,
  remainingFiles: readonly string[],
): string {
  return `OK. Call \`knowledgeStructuringSession.writeSections\` to write the structured files.

${formatSessionStatus(sessionToken, remainingFiles, [])}`;
}

/**
 * Format the response for showing the source document
 */
export function formatSourceDocumentResponse(
  sourceDocumentLines: readonly string[],
  range?: string,
): string {
  return formatSourceDocument(sourceDocumentLines, range);
}

/**
 * Format the response for writing a section
 */
export function formatWriteSectionsResponse(
  sessionToken: string,
  remainingFiles: readonly string[],
  completedFiles: readonly string[],
  filesWritten: readonly { filepath: string; content: string }[],
): string {
  const heading =
    remainingFiles.length === 0
      ? "OK. All files have been written. Call `knowledgeStructuringSession.end` to finish the session. You can call `knowledgeStructuringSession.writeSections` again to correct any mistakes."
      : "OK. Continue calling `knowledgeStructuringSession.writeSections` to write remaining files or to correct any mistakes.";

  const written = filesWritten
    .map(
      ({ filepath, content }) =>
        `- ${filepath}:\n\n${withLineNumber(content, "  ")}`,
    )
    .join("\n\n");

  return `${heading}

${formatSessionStatus(sessionToken, remainingFiles, completedFiles)}

**Files Written:**

${written}`;
}

/**
 * Format the response for ending a session
 */
export function formatEndSessionResponse(
  completedFiles: readonly string[],
  sessionToken: string,
  commonPrefix: string,
  documentName: string,
): string {
  const prefixWarning =
    commonPrefix !== `/${documentName}/`
      ? `Note that the files are written under "/${documentName}/" instead of "${commonPrefix}" based on the user request.`
      : "";

  return `OK. The session is finished. The following files are written:

${completedFiles.map((file) => `- ${file}`).join("\n")}

The session "${sessionToken}" is now closed. Do not perform any further actions with it.

You can now use these files for your work. Call \`listDocuments\` with \`directory: "/${documentName}/"\` to see the list of documents.
${prefixWarning}`.trim();
}

export function formatErrorResponse(
  error: string,
  sessionToken: string,
  remainingFiles: readonly string[],
  completedFiles: readonly string[],
  sourceDocumentLines?: readonly string[],
  sourceDocumentRange?: string,
): string {
  return `Error: ${error}
${formatSessionStatus(sessionToken, remainingFiles, completedFiles)}

${sourceDocumentLines ? formatSourceDocument(sourceDocumentLines, sourceDocumentRange) : ""}`.trim();
}
