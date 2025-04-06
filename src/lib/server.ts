/**
 * MCP server implementation for Librarian
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { LibrarianConfig } from "./config.js";
import {
  getDocumentSchema,
  Librarian,
  listDocumentsSchema,
  listTagsSchema,
  searchDocumentsSchema,
} from "./librarian.js";
import {
  formatDocument,
  formatDocumentList,
  formatDocumentListWithContents,
  formatTagList,
} from "./util.js";

/**
 * Create an MCP server for the Librarian
 */
export function createLibrarianServer(config: LibrarianConfig): McpServer {
  const librarian = new Librarian(config);

  // Create an MCP server
  const server = new McpServer({
    name: "Librarian",
    version: "1.0.0",
    description:
      "A server for listing, searching, and retrieving markdown files",
  });

  // Add listDocuments tool
  server.tool(
    "listDocuments",
    listDocumentsSchema.shape,
    async (args, extra) => {
      try {
        const documents = await librarian.listDocuments(args);

        // Format the response based on whether contents are included
        const formattedText = documents.some((doc) => doc.contents)
          ? formatDocumentListWithContents(documents)
          : formatDocumentList(documents);

        return {
          content: [
            {
              type: "text",
              text: formattedText,
            },
          ],
        };
      } catch (error: any) {
        console.error("Error in listDocuments:", error);
        return {
          content: [
            {
              type: "text",
              text: `Failed to list documents: ${error.message || "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // Add searchDocuments tool
  server.tool(
    "searchDocuments",
    searchDocumentsSchema.shape,
    async (args, extra) => {
      try {
        const results = await librarian.searchDocuments(args);

        // Format the response based on whether contents are included
        const formattedText = results.some((doc) => doc.contents)
          ? formatDocumentListWithContents(results)
          : formatDocumentList(results);

        return {
          content: [
            {
              type: "text",
              text: formattedText,
            },
          ],
        };
      } catch (error: any) {
        console.error("Error in searchDocuments:", error);
        return {
          content: [
            {
              type: "text",
              text: `Failed to search documents: ${error.message || "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // Add getDocument tool
  server.tool("getDocument", getDocumentSchema.shape, async (args, extra) => {
    try {
      const document = await librarian.getDocument(args);

      // Format the document
      const formattedText = formatDocument(document);

      return {
        content: [
          {
            type: "text",
            text: formattedText,
          },
        ],
      };
    } catch (error: any) {
      console.error("Error in getDocument:", error);
      return {
        content: [
          {
            type: "text",
            text: `Failed to get document: ${error.message || "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Add listTags tool
  server.tool("listTags", listTagsSchema.shape, async (args, extra) => {
    try {
      const tags = await librarian.listTags(args);

      // Format the tag list
      const formattedText = formatTagList(tags);

      return {
        content: [
          {
            type: "text",
            text: formattedText,
          },
        ],
      };
    } catch (error: any) {
      console.error("Error in listTags:", error);
      return {
        content: [
          {
            type: "text",
            text: `Failed to list tags: ${error.message || "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}
