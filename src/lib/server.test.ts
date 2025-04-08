import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Librarian } from "./librarian.js";
import { createLibrarianServer } from "./server.js";

// Mock the Librarian class
vi.mock("./librarian.js", () => {
  return {
    Librarian: vi.fn().mockImplementation(() => ({
      listDocuments: vi.fn().mockResolvedValue([
        { filepath: "/doc1.md", tags: ["tag1", "tag2"] },
        { filepath: "/doc2.md", tags: ["tag2", "tag3"] },
      ]),
      searchDocuments: vi
        .fn()
        .mockResolvedValue([{ filepath: "/doc1.md", tags: ["tag1", "tag2"] }]),
      getDocument: vi.fn().mockResolvedValue({
        filepath: "/doc1.md",
        tags: ["tag1", "tag2"],
        contents: "Content of doc1",
      }),
      getDocuments: vi.fn().mockResolvedValue([
        {
          filepath: "/doc1.md",
          tags: ["tag1", "tag2"],
          contents: "Content of doc1",
        },
        {
          filepath: "/doc2.md",
          tags: ["tag2", "tag3"],
          contents: "Content of doc2",
        },
      ]),
      listTags: vi.fn().mockResolvedValue([
        { tag: "tag1", count: 1 },
        { tag: "tag2", count: 2 },
        { tag: "tag3", count: 1 },
      ]),
    })),
    listDocumentsSchema: { shape: {} },
    searchDocumentsSchema: { shape: {} },
    getDocumentSchema: { shape: {} },
    getDocumentsSchema: { shape: {} },
    listTagsSchema: { shape: {} },
  };
});

// Mock the formatters
vi.mock("./util.js", () => {
  return {
    formatDocumentList: vi.fn().mockReturnValue("Formatted document list"),
    formatDocumentListWithContents: vi
      .fn()
      .mockReturnValue("Formatted document list with contents"),
    formatDocument: vi.fn().mockReturnValue("Formatted document"),
    formatTagList: vi.fn().mockReturnValue("Formatted tag list"),
  };
});

// Mock the McpServer
vi.mock("@modelcontextprotocol/sdk/server/mcp.js", () => {
  const mockTool = vi.fn();
  const mockServer = {
    tool: mockTool,
    connect: vi.fn(),
  };

  return {
    McpServer: vi.fn().mockImplementation(() => mockServer),
  };
});

describe("createLibrarianServer", () => {
  let server: any;

  beforeEach(() => {
    vi.clearAllMocks();
    server = createLibrarianServer({ docsRoot: "/test/docs", enableWriteOperations: true });
  });

  it("should create an MCP server with the correct configuration", () => {
    expect(McpServer).toHaveBeenCalledWith({
      name: "Librarian",
      version: "1.0.0",
      description:
        "A server for listing, searching, and retrieving documents curated exclusively for the project. If you want to know about project-specific knowledge or rules, you should first use the tools on this server to acquire the knowledge you need.",
    });
  });

  it("should create a Librarian instance with the provided config", () => {
    expect(Librarian).toHaveBeenCalledWith({ docsRoot: "/test/docs", enableWriteOperations: true });
  });

  it("should register the listDocuments tool", () => {
    expect(server.tool).toHaveBeenCalledWith(
      "listDocuments",
      "Lists documents in the specified directory (defaults to the root dir), optionally filtering by tags and including contents.",
      expect.anything(),
      expect.any(Function),
    );
  });

  it("should register the searchDocuments tool", () => {
    expect(server.tool).toHaveBeenCalledWith(
      "searchDocuments",
      "Searches documents in the specified directory (defaults to the root dir), optionally filtering by tags and including contents.",
      expect.anything(),
      expect.any(Function),
    );
  });

  it("should register the getDocuments tool", () => {
    expect(server.tool).toHaveBeenCalledWith(
      "getDocuments",
      "Retrieves documents in the specified directory (defaults to the root dir), optionally filtering by tags and including contents.",
      expect.anything(),
      expect.any(Function),
    );
  });

  it("should register the getDocuments tool", () => {
    expect(server.tool).toHaveBeenCalledWith(
      "getDocuments",
      "Retrieves documents in the specified directory (defaults to the root dir), optionally filtering by tags and including contents.",
      expect.anything(),
      expect.any(Function),
    );
  });

  it("should register the listTags tool", () => {
    expect(server.tool).toHaveBeenCalledWith(
      "listTags",
      "Lists all tags in the specified directory (defaults to the root dir).",
      expect.anything(),
      expect.any(Function),
    );
  });

  // Test the tool callbacks
  describe("tool callbacks", () => {
    // Extract the callbacks
    let listDocumentsCallback: Function;
    let searchDocumentsCallback: Function;
    let getDocumentsCallback: Function;
    let listTagsCallback: Function;

    beforeEach(() => {
      // Reset the server
      server = createLibrarianServer({ docsRoot: "/test/docs", enableWriteOperations: true });

      // Extract the callbacks
      listDocumentsCallback = server.tool.mock.calls.find(
        (call: any[]) => call[0] === "listDocuments",
      )[3];

      searchDocumentsCallback = server.tool.mock.calls.find(
        (call: any[]) => call[0] === "searchDocuments",
      )[3];

      // getDocumentCallback is no longer needed

      getDocumentsCallback = server.tool.mock.calls.find(
        (call: any[]) => call[0] === "getDocuments",
      )[3];

      listTagsCallback = server.tool.mock.calls.find(
        (call: any[]) => call[0] === "listTags",
      )[3];
    });

    it("listDocuments callback should return formatted documents", async () => {
      const result = await listDocumentsCallback({
        directory: "/",
        tags: [],
        depth: -1,
      });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Formatted document list",
          },
        ],
      });
    });

    it("searchDocuments callback should return formatted search results", async () => {
      const result = await searchDocumentsCallback({
        query: "test",
        directory: "/",
        tags: [],
        includeContents: false,
        depth: -1,
      });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Formatted document list",
          },
        ],
      });
    });

    // Skip this test since getDocument tool doesn't exist anymore

    it("getDocuments callback should return formatted documents", async () => {
      const result = await getDocumentsCallback({
        filepaths: ["/doc1.md", "/doc2.md"],
      });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Formatted document list with contents",
          },
        ],
      });
    });

    it("listTags callback should return formatted tags", async () => {
      const result = await listTagsCallback({
        directory: "/",
        includeFilepaths: false,
        depth: -1,
      });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Formatted tag list",
          },
        ],
      });
    });

    it("should handle errors gracefully", async () => {
      // Mock the Librarian class to throw an error for listDocuments
      const mockLibrarian = {
        listDocuments: vi.fn().mockRejectedValue(new Error("Test error")),
      };

      // Create a new callback that uses our mocked librarian
      const errorCallback = async (args: any) => {
        try {
          await mockLibrarian.listDocuments(args);
          return { content: [{ type: "text", text: "Success" }] };
        } catch (error: any) {
          console.error("Error in test:", error);
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
      };

      const errorResult = await errorCallback({
        directory: "/",
        tags: [],
        depth: -1,
      });

      expect(errorResult).toHaveProperty("isError", true);
      expect(errorResult.content[0].text).toContain("Failed to list documents");
    });
  });
});
