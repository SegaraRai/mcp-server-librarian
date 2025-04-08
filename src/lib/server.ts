/**
 * MCP server implementation for Librarian
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { LibrarianConfig } from "./config.js";
import {
  endSessionSchema,
  showSourceDocumentSchema,
  startPendingSessionSchema,
  startSessionSchema,
  writeSectionSchema,
} from "./knowledgeStructuring/session.js";
import {
  getDocumentsSchema,
  Librarian,
  listDocumentsSchema,
  listTagsSchema,
  searchDocumentsSchema,
} from "./librarian.js";
import type { Document } from "./load.js";
import {
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
      "A server for listing, searching, and retrieving documents curated exclusively for the project. If you want to know about project-specific knowledge or rules, you should first use the tools on this server to acquire the knowledge you need.",
  });

  // Add listDocuments tool
  server.tool(
    "listDocuments",
    "Lists documents in the specified directory (defaults to the root dir), optionally filtering by tags and including contents.",
    listDocumentsSchema.shape,
    async (args, extra) => {
      try {
        const results = (await librarian.listDocuments(args)).map(
          (doc): [string, Document] => [doc.filepath, doc],
        );

        // Format the response based on whether contents are included
        const formattedText = args.includeContents
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
    "Searches documents in the specified directory (defaults to the root dir), optionally filtering by tags and including contents.",
    searchDocumentsSchema.shape,
    async (args, extra) => {
      try {
        const results = (await librarian.searchDocuments(args)).map(
          (doc): [string, Document] => [doc.filepath, doc],
        );

        // Format the response based on whether contents are included
        const formattedText = args.includeContents
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

  // Add getDocuments tool
  server.tool(
    "getDocuments",
    "Retrieves documents in the specified directory (defaults to the root dir), optionally filtering by tags and including contents.",
    getDocumentsSchema.shape,
    async (args, extra) => {
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
    },
  );

  // Add listTags tool
  server.tool(
    "listTags",
    "Lists all tags in the specified directory (defaults to the root dir).",
    listTagsSchema.shape,
    async (args, extra) => {
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
    },
  );

  const { knowledgeStructuringSessionManager } = librarian;
  if (knowledgeStructuringSessionManager) {
    // Add knowledgeStructure prompt
    server.prompt(
      "knowledgeStructure",
      "A prompt for knowledge structuring",
      startPendingSessionSchema.shape,
      async (args, extra) => {
        try {
          const { documentName, documentSource } = args;
          const response =
            await knowledgeStructuringSessionManager.startPendingSession({
              documentName,
              documentSource,
            });

          return {
            messages: [
              {
                role: "user",
                content: {
                  type: "text",
                  text: response,
                },
              },
            ],
          };
        } catch (error: any) {
          console.error("Error in knowledgeStructure prompt:", error);

          return {
            messages: [
              {
                role: "assistant",
                content: {
                  type: "text",
                  text: `Failed to start pending knowledge structuring session: ${error.message || "Unknown error"}`,
                },
              },
            ],
          };
        }
      },
    );

    // Add knowledgeStructuringSession.start tool
    server.tool(
      "knowledgeStructuringSession.start",
      "Starts a knowledge structuring session. Never use this tool unless you are explicitly instructed to do so in the previous prompt, as it requires a pre-generated session token.",
      startSessionSchema.shape,
      async (args, extra) => {
        try {
          const response =
            await knowledgeStructuringSessionManager.startSession(args);

          return {
            isError: response.isError,
            content: [
              {
                type: "text",
                text: response.message,
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
      "Displays the source document of the current session. Never use this tool unless you are explicitly instructed to do so in the previous tool response, as it requires a pre-generated session token.",
      showSourceDocumentSchema.shape,
      async (args, extra) => {
        try {
          const response =
            await knowledgeStructuringSessionManager.showSourceDocument(args);

          return {
            isError: response.isError,
            content: [
              {
                type: "text",
                text: response.message,
              },
            ],
          };
        } catch (error: any) {
          console.error(
            "Error in knowledgeStructuringSession.showSourceDocument:",
            error,
          );
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
      "Writes the extracted section to the file. Never use this tool unless you are explicitly instructed to do so in the previous tool response, as it requires a pre-generated session token.",
      writeSectionSchema.shape,
      async (args, extra) => {
        try {
          const response =
            await knowledgeStructuringSessionManager.writeSection(args);

          await librarian.reloadDocuments();

          return {
            isError: response.isError,
            content: [
              {
                type: "text",
                text: response.message,
              },
            ],
          };
        } catch (error: any) {
          console.error(
            "Error in knowledgeStructuringSession.writeSection:",
            error,
          );
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
      "Finished the current session. Only available after all files are written. Never use this tool unless you are explicitly instructed to do so in the previous tool response, as it requires a pre-generated session token.",
      endSessionSchema.shape,
      async (args, extra) => {
        try {
          const response =
            await knowledgeStructuringSessionManager.endSession(args);

          await librarian.reloadDocuments();

          return {
            isError: response.isError,
            content: [
              {
                type: "text",
                text: response.message,
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
  }

  return server;
}
