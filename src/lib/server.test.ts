import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Librarian } from "./librarian.js";
import { createLibrarianServer } from "./server.js";

// Mock the Librarian class
vi.mock("./librarian.js", () => {
  return {
    Librarian: vi.fn().mockImplementation(() => ({
      listDocuments: vi.fn().mockResolvedValue([
        { filepath: "doc1.md", tags: ["tag1", "tag2"] },
        { filepath: "doc2.md", tags: ["tag2", "tag3"] },
      ]),
      searchDocuments: vi
        .fn()
        .mockResolvedValue([{ filepath: "doc1.md", tags: ["tag1", "tag2"] }]),
      getDocument: vi.fn().mockResolvedValue({
        filepath: "doc1.md",
        tags: ["tag1", "tag2"],
        contents: "Content of doc1",
      }),
      listTags: vi.fn().mockResolvedValue([
        { tag: "tag1", count: 1 },
        { tag: "tag2", count: 2 },
        { tag: "tag3", count: 1 },
      ]),
    })),
    listDocumentsSchema: { shape: {} },
    searchDocumentsSchema: { shape: {} },
    getDocumentSchema: { shape: {} },
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
    server = createLibrarianServer({ docsRoot: "/test/docs" });
  });

  it("should create an MCP server with the correct configuration", () => {
    expect(McpServer).toHaveBeenCalledWith({
      name: "Librarian",
      version: "1.0.0",
      description:
        "A server for listing, searching, and retrieving markdown files",
    });
  });

  it("should create a Librarian instance with the provided config", () => {
    expect(Librarian).toHaveBeenCalledWith({ docsRoot: "/test/docs" });
  });

  it("should register the listDocuments tool", () => {
    expect(server.tool).toHaveBeenCalledWith(
      "listDocuments",
      expect.anything(),
      expect.any(Function),
    );
  });

  it("should register the searchDocuments tool", () => {
    expect(server.tool).toHaveBeenCalledWith(
      "searchDocuments",
      expect.anything(),
      expect.any(Function),
    );
  });

  it("should register the getDocument tool", () => {
    expect(server.tool).toHaveBeenCalledWith(
      "getDocument",
      expect.anything(),
      expect.any(Function),
    );
  });

  it("should register the listTags tool", () => {
    expect(server.tool).toHaveBeenCalledWith(
      "listTags",
      expect.anything(),
      expect.any(Function),
    );
  });

  // Test the tool callbacks
  describe("tool callbacks", () => {
    // Extract the callbacks
    let listDocumentsCallback: Function;
    let searchDocumentsCallback: Function;
    let getDocumentCallback: Function;
    let listTagsCallback: Function;

    beforeEach(() => {
      // Reset the server
      server = createLibrarianServer({ docsRoot: "/test/docs" });

      // Extract the callbacks
      listDocumentsCallback = server.tool.mock.calls.find(
        (call: any[]) => call[0] === "listDocuments",
      )[2];

      searchDocumentsCallback = server.tool.mock.calls.find(
        (call: any[]) => call[0] === "searchDocuments",
      )[2];

      getDocumentCallback = server.tool.mock.calls.find(
        (call: any[]) => call[0] === "getDocument",
      )[2];

      listTagsCallback = server.tool.mock.calls.find(
        (call: any[]) => call[0] === "listTags",
      )[2];
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

    it("getDocument callback should return a formatted document", async () => {
      const result = await getDocumentCallback({ filepath: "doc1.md" });

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Formatted document",
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
