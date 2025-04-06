/**
 * MCP server implementation for Librarian
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Librarian, listDocumentsSchema, searchDocumentsSchema, getDocumentSchema, listTagsSchema } from './librarian.js';
import { LibrarianConfig } from './config.js';

/**
 * Create an MCP server for the Librarian
 */
export function createLibrarianServer(config: LibrarianConfig): McpServer {
  const librarian = new Librarian(config);
  
  // Create an MCP server
  const server = new McpServer({
    name: "Librarian",
    version: "1.0.0",
    description: "A server for listing, searching, and retrieving markdown files"
  });

  // Add listDocuments tool
  server.tool(
    "listDocuments",
    listDocumentsSchema.shape,
    async (args, extra) => {
      try {
        const documents = await librarian.listDocuments(args);
        
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify(documents, null, 2)
          }]
        };
      } catch (error: any) {
        console.error("Error in listDocuments:", error);
        return {
          content: [{ 
            type: "text", 
            text: `Failed to list documents: ${error.message || "Unknown error"}`
          }],
          isError: true
        };
      }
    }
  );

  // Add searchDocuments tool
  server.tool(
    "searchDocuments",
    searchDocumentsSchema.shape,
    async (args, extra) => {
      try {
        const results = await librarian.searchDocuments(args);
        
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify(results, null, 2)
          }]
        };
      } catch (error: any) {
        console.error("Error in searchDocuments:", error);
        return {
          content: [{ 
            type: "text", 
            text: `Failed to search documents: ${error.message || "Unknown error"}`
          }],
          isError: true
        };
      }
    }
  );

  // Add getDocument tool
  server.tool(
    "getDocument",
    getDocumentSchema.shape,
    async (args, extra) => {
      try {
        const document = await librarian.getDocument(args);
        
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify(document, null, 2)
          }]
        };
      } catch (error: any) {
        console.error("Error in getDocument:", error);
        return {
          content: [{ 
            type: "text", 
            text: `Failed to get document: ${error.message || "Unknown error"}`
          }],
          isError: true
        };
      }
    }
  );

  // Add listTags tool
  server.tool(
    "listTags",
    listTagsSchema.shape,
    async (args, extra) => {
      try {
        const tags = await librarian.listTags(args);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(tags, null, 2)
          }]
        };
      } catch (error: any) {
        console.error("Error in listTags:", error);
        return {
          content: [{
            type: "text",
            text: `Failed to list tags: ${error.message || "Unknown error"}`
          }],
          isError: true
        };
      }
    }
  );

  return server;
}
