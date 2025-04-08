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

function formatSourceDocument(sourceDocument: string, range?: string): string {
  const match = range?.match(/^\D*(\d+)-\D*(\d+)/);
  if (match) {
    const lines = sourceDocument.split("\n");
    const start = parseInt(match[1], 10) - 1;
    const end = parseInt(match[2], 10);
    const selectedLines = lines.slice(start, end).join("\n");
    return `**Source Document (L${start}-L${end}):**\n======\n${selectedLines}`;
  }

  return `**Source Document:**\n======\n${sourceDocument}`;
}

/**
 * Format the response for starting a knowledge structuring session
 */
export function formatSessionStartResponse(
  sessionToken: string,
  remainingFiles: string[],
  sourceDocument: string,
): string {
  return `OK. Call \`knowledgeStructuringSession.writeSection\` to write the structured files.

${formatSessionStatus(sessionToken, remainingFiles, [])}

${formatSourceDocument(sourceDocument)}`;
}

/**
 * Format the response for showing the source document
 */
export function formatSourceDocumentResponse(
  sourceDocument: string,
  range?: string,
): string {
  return formatSourceDocument(sourceDocument, range);
}

/**
 * Format the response for writing a section
 */
export function formatWriteSectionResponse(
  sessionToken: string,
  remainingFiles: readonly string[],
  completedFiles: readonly string[],
  sourceDocument?: string,
  sourceDocumentRange?: string,
): string {
  const heading =
    remainingFiles.length === 0
      ? "OK. All files have been written. Call `knowledgeStructuringSession.end` to finish the session."
      : "OK. Continue calling `knowledgeStructuringSession.writeSection` to write remaining files.";

  return `${heading}

${formatSessionStatus(sessionToken, remainingFiles, completedFiles)}

${sourceDocument ? formatSourceDocument(sourceDocument, sourceDocumentRange) : ""}`.trim();
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
  sourceDocument?: string,
  sourceDocumentRange?: string,
): string {
  return `Error: ${error}
${formatSessionStatus(sessionToken, remainingFiles, completedFiles)}

${sourceDocument ? formatSourceDocument(sourceDocument, sourceDocumentRange) : ""}`.trim();
}
