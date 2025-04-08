/**
 * Configuration module for the Librarian MCP server
 */
import fs from "node:fs";
import process from "node:process";

/**
 * Configuration options for the Librarian
 */
export interface LibrarianConfig {
  /**
   * Root directory for documentation files
   */
  docsRoot: string;

  enableWriteOperations: boolean;
}

/**
 * Get configuration from command line arguments and environment variables
 */
export function getConfig(): LibrarianConfig {
  // Check command line arguments first
  const argIndex = process.argv.findIndex(
    (arg: string) => arg === "--docs-root",
  );
  if (argIndex !== -1 && process.argv.length > argIndex + 1) {
    return {
      docsRoot: process.argv[argIndex + 1],
      enableWriteOperations: true,
    };
  }

  // Check environment variable next
  if (process.env.LIBRARIAN_DOCS_ROOT) {
    return {
      docsRoot: process.env.LIBRARIAN_DOCS_ROOT,
      enableWriteOperations: true,
    };
  }

  // Default to ./docs
  return {
    docsRoot: "./docs",
    enableWriteOperations: true,
  };
}

/**
 * Check if the docs root directory exists
 */
export function checkDocsRootExists(config: LibrarianConfig): void {
  if (!fs.existsSync(config.docsRoot)) {
    throw new Error(`Docs root directory does not exist: ${config.docsRoot}`);
  }
}
