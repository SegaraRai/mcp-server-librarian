/**
 * MCP server implementation for Librarian
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { LibrarianConfig } from "./config.js";
import {
  getDocumentSchema,
  getDocumentsSchema,
  Librarian,
  listDocumentsSchema,
  listTagsSchema,
  searchDocumentsSchema,
} from "./librarian.js";
import {
  endSessionSchema,
  showSourceDocumentSchema,
  startSessionSchema,
  writeSectionSchema,
} from "./knowledgeStructuring/session.js";
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
        const formattedText = documents.some((doc) => doc.contents != null)
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
        const formattedText = results.some((doc) => doc.contents != null)
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

  // Add getDocuments tool
  server.tool("getDocuments", getDocumentsSchema.shape, async (args, extra) => {
    try {
      const documents = await librarian.getDocuments(args);

      // Format the documents
      const formattedText = formatDocumentListWithContents(documents);

      return {
        content: [
          {
            type: "text",
            text: formattedText,
          },
        ],
      };
    } catch (error: any) {
      console.error("Error in getDocuments:", error);
      return {
        content: [
          {
            type: "text",
            text: `Failed to get documents: ${error.message || "Unknown error"}`,
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
// Add knowledgeStructuringSession.start tool
server.tool(
  "knowledgeStructuringSession.start",
  startSessionSchema.shape,
  async (args, extra) => {
    try {
      const response = await librarian.getKnowledgeStructuringSessionManager().startSession(args);
      
      return {
        content: [
          {
            type: "text",
            text: response,
          },
        ],
      };
    } catch (error: any) {
      console.error("Error in knowledgeStructuringSession.start:", error);
      return {
        content: [
          {
            type: "text",
            text: `Failed to start knowledge structuring session: ${error.message || "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// Add knowledgeStructuringSession.showSourceDocument tool
server.tool(
  "knowledgeStructuringSession.showSourceDocument",
  showSourceDocumentSchema.shape,
  async (args, extra) => {
    try {
      const response = await librarian.getKnowledgeStructuringSessionManager().showSourceDocument(args);
      
      return {
        content: [
          {
            type: "text",
            text: response,
          },
        ],
      };
    } catch (error: any) {
      console.error("Error in knowledgeStructuringSession.showSourceDocument:", error);
      return {
        content: [
          {
            type: "text",
            text: `Failed to show source document: ${error.message || "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// Add knowledgeStructuringSession.writeSection tool
server.tool(
  "knowledgeStructuringSession.writeSection",
  writeSectionSchema.shape,
  async (args, extra) => {
    try {
      const response = await librarian.getKnowledgeStructuringSessionManager().writeSection(args);
      
      return {
        content: [
          {
            type: "text",
            text: response,
          },
        ],
      };
    } catch (error: any) {
      console.error("Error in knowledgeStructuringSession.writeSection:", error);
      return {
        content: [
          {
            type: "text",
            text: `Failed to write section: ${error.message || "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// Add knowledgeStructuringSession.end tool
server.tool(
  "knowledgeStructuringSession.end",
  endSessionSchema.shape,
  async (args, extra) => {
    try {
      const response = await librarian.getKnowledgeStructuringSessionManager().endSession(args);
      
      return {
        content: [
          {
            type: "text",
            text: response,
          },
        ],
      };
    } catch (error: any) {
      console.error("Error in knowledgeStructuringSession.end:", error);
      return {
        content: [
          {
            type: "text",
            text: `Failed to end knowledge structuring session: ${error.message || "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  },
);

return server;
}

