/**
 * Utility functions for formatting knowledge structuring session responses
 */

/**
 * Format the response for starting a knowledge structuring session
 */
export function formatSessionStartResponse(
  sessionToken: string,
  remainingFiles: string[],
  sourceDocument: string
): string {
  const formattedRemainingFiles = remainingFiles
    .map((file) => `- ${file}`)
    .join("\n");

  return `Accepted. Call \`knowledgeStructuringSession.writeSection\` to write the structured files.

**Session Token:** \`${sessionToken}\`

**Remaining Files:**

${formattedRemainingFiles}

**Source Document:**

======

${sourceDocument}`;
}

/**
 * Format the response for showing the source document
 */
export function formatSourceDocumentResponse(sourceDocument: string): string {
  return sourceDocument;
}

/**
 * Format the response for writing a section
 */
export function formatWriteSectionResponse(
  sessionToken: string,
  remainingFiles: string[],
  completedFiles: string[],
  sourceDocument?: string,
  isError: boolean = false,
  errorMessage?: string
): string {
  if (isError && errorMessage) {
    return `Error. ${errorMessage}

**Session Token:** \`${sessionToken}\`

**Remaining Files:**

${remainingFiles.map((file) => `- ${file}`).join("\n")}

**Completed Files:**

${completedFiles.map((file) => `- ${file}`).join("\n")}`;
  }

  const status = remainingFiles.length === 0
    ? "OK. Call `knowledgeStructuringSession.end` to finish the session."
    : "OK. Continue calling `knowledgeStructuringSession.writeSection` to write remaining files.";

  let response = `${status}

**Session Token:** \`${sessionToken}\`

**Remaining Files:**

${remainingFiles.map((file) => `- ${file}`).join("\n")}

**Completed Files:**

${completedFiles.map((file) => `- ${file}`).join("\n")}`;

  if (sourceDocument) {
    response += `

**Source Document:**

======

${sourceDocument}`;
  }

  return response;
}

/**
 * Format the response for ending a session
 */
export function formatEndSessionResponse(
  completedFiles: string[],
  isError: boolean = false,
  errorMessage?: string,
  remainingFiles?: string[],
  sessionToken?: string
): string {
  if (isError && errorMessage) {
    if (remainingFiles && sessionToken) {
      return `Error. ${errorMessage}

**Session Token:** \`${sessionToken}\`

**Remaining Files:**

${remainingFiles.map((file) => `- ${file}`).join("\n")}

**Completed Files:**

${completedFiles.map((file) => `- ${file}`).join("\n")}`;
    }
    
    return `Error. ${errorMessage}`;
  }

  return `OK. The session is finished. The following files are written:

${completedFiles.map((file) => `- ${file}`).join("\n")}

You can now use these files for your work. Call \`listDocuments\` with \`directory: "/foo/"\` to see the list of documents.`;
}
