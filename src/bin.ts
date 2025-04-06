#!/usr/bin/env node

/**
 * Command-line entry point for the Librarian MCP server
 */
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { checkDocsRootExists, getConfig } from "./lib/config.js";
import { createLibrarianServer } from "./lib/server.js";

/**
 * Start the Librarian MCP server
 */
async function start() {
  try {
    // Get configuration
    const config = getConfig();
    console.log(`Using docs root: ${config.docsRoot}`);

    // Check if the docs root directory exists
    checkDocsRootExists(config);

    // Create server
    const server = createLibrarianServer(config);

    // Connect to transport
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.log("Librarian MCP server started");
  } catch (error: any) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
start();
