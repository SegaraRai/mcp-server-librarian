/**
 * Utility functions for formatting knowledge structuring session responses
 */

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
  const match = range?.match(/^\D*(\d+)-\D*(\d+)/);
  if (match) {
    const start = parseInt(match[1], 10) - 1;
    const end = parseInt(match[2], 10);
    const selectedLines = sourceDocumentLines.slice(start, end).join("\n");
    return `**Source Document (L${start}-L${end}):**\n======\n${selectedLines}`;
  }

  return `**Source Document:**\n======\n${sourceDocumentLines.join("\n")}`;
}

export function formatInitialPrompt(
  sessionToken: string,
  sourceDocumentLines: readonly string[],
): string {
  return `You are an outstanding editor, well-versed in computer science and IT, and you are good at analyzing, classifying, and structuring documents.
Our ultimate goal is to break down a large document into sections, tag and organize them into a hierarchy of markdown files in a file tree.

To get started, let's understand the outline of the document.
Please focus on analyzing the structure of the document.

1. Read the document below (Source Document) thoroughly and understand its structure.
2. Identify the sections and subsections of the document and consider the filepath in lower-kebab-case for each. (e.g. \`/path/to/dir/getting-started.md\`).
3. Call \`knowledgeStructuringSession.start\` with the following session token and the filepaths you considered."

**Session Token:** \`${sessionToken}\`

**Source Document:**
======
${sourceDocumentLines.join("\n")}`;
}

/**
 * Format the response for starting a knowledge structuring session
 */
export function formatSessionStartResponse(
  sessionToken: string,
  remainingFiles: readonly string[],
  sourceDocumentLines: readonly string[],
): string {
  return `OK. Call \`knowledgeStructuringSession.writeSection\` to write the structured files.

${formatSessionStatus(sessionToken, remainingFiles, [])}

${formatSourceDocument(sourceDocumentLines)}`;
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
export function formatWriteSectionResponse(
  sessionToken: string,
  remainingFiles: readonly string[],
  completedFiles: readonly string[],
  sourceDocumentLines?: readonly string[],
  sourceDocumentRange?: string,
): string {
  const heading =
    remainingFiles.length === 0
      ? "OK. All files have been written. Call `knowledgeStructuringSession.end` to finish the session."
      : "OK. Continue calling `knowledgeStructuringSession.writeSection` to write remaining files.";

  return `${heading}

${formatSessionStatus(sessionToken, remainingFiles, completedFiles)}

${sourceDocumentLines ? formatSourceDocument(sourceDocumentLines, sourceDocumentRange) : ""}`.trim();
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
