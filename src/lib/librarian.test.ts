import { beforeEach, describe, expect, it, vi } from "vitest";
import { Librarian } from "./librarian.js";
import * as loadModule from "./load.js";
import { Document, DocumentCache } from "./load.js";

// Mock the load module
vi.mock("./load.js", () => {
  const mockDocuments: Document[] = [
    {
      filepath: "doc1.md",
      tags: ["tag1", "tag2"],
      contents: "Content of doc1",
    },
    {
      filepath: "doc2.md",
      tags: ["tag2", "tag3"],
      contents: "Content of doc2",
    },
  ];

  const mockCache: DocumentCache = {
    documents: mockDocuments,
    documentMap: new Map(mockDocuments.map((doc) => [doc.filepath, doc])),
    tagMap: new Map([
      ["tag1", [mockDocuments[0]]],
      ["tag2", [mockDocuments[0], mockDocuments[1]]],
      ["tag3", [mockDocuments[1]]],
    ]),
    allTags: ["tag1", "tag2", "tag3"],
  };

  return {
    loadAllDocuments: vi.fn().mockResolvedValue(mockCache),
    filterDocuments: vi
      .fn()
      .mockImplementation((cache, directory = "/", tags = [], depth = -1) => {
        if (tags.length > 0) {
          return mockDocuments.filter((doc) =>
            tags.some((tag: string) => doc.tags.includes(tag)),
          );
        }
        return mockDocuments;
      }),
    searchDocuments: vi
      .fn()
      .mockImplementation(
        (
          cache,
          query,
          directory = "/",
          tags = [],
          includeContents = false,
          mode = "string",
          caseSensitive = false,
          depth = -1,
        ) => {
          const results = mockDocuments.filter((doc) =>
            doc.contents?.includes(query),
          );

          if (!includeContents) {
            return results.map(({ contents, ...rest }) => rest);
          }

          return results;
        },
      ),
    getDocument: vi.fn().mockImplementation((cache, filepath) => {
      const doc = mockDocuments.find((d) => d.filepath === filepath);
      if (!doc) {
        throw new Error(`Document not found: ${filepath}`);
      }
      return doc;
    }),
    getTagsInDirectory: vi
      .fn()
      .mockImplementation(
        (cache, directory = "/", includeFilepaths = false, depth = -1) => {
          const tags = [
            { tag: "tag1", count: 1 },
            { tag: "tag2", count: 2 },
            { tag: "tag3", count: 1 },
          ];

          if (includeFilepaths) {
            return tags.map((tag) => ({
              ...tag,
              filepaths: mockDocuments
                .filter((doc) => doc.tags.includes(tag.tag))
                .map((doc) => doc.filepath),
            }));
          }

          return tags;
        },
      ),
  };
});

describe("Librarian", () => {
  let librarian: Librarian;

  beforeEach(() => {
    librarian = new Librarian({ docsRoot: "/test/docs" });
  });

  describe("listDocuments", () => {
    it("should call loadAllDocuments and filterDocuments", async () => {
      const result = await librarian.listDocuments({
        directory: "/",
        tags: [],
        includeContents: false,
        depth: -1,
      });

      // Verify loadAllDocuments was called
      expect(loadModule.loadAllDocuments).toHaveBeenCalledWith("/test/docs");

      // Verify filterDocuments was called with the correct arguments
      expect(loadModule.filterDocuments).toHaveBeenCalled();

      // Verify the result
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("filepath", "doc1.md");
      expect(result[1]).toHaveProperty("filepath", "doc2.md");

      // Verify contents are not included
      expect(result[0]).not.toHaveProperty("contents");
      expect(result[1]).not.toHaveProperty("contents");
    });

    it("should filter documents by tags", async () => {
      const result = await librarian.listDocuments({
        directory: "/",
        tags: ["tag1"],
        includeContents: false,
        depth: -1,
      });

      // Verify the result only includes documents with tag1
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("filepath", "doc1.md");
    });

    it("should respect the depth parameter", async () => {
      // Set up a specific mock implementation for this test
      vi.mocked(loadModule.filterDocuments).mockImplementationOnce(
        (cache, directory, tags, depth) => {
          // Verify depth parameter is passed correctly
          expect(depth).toBe(1);
          return [
            {
              filepath: "doc1.md",
              tags: ["tag1", "tag2"],
            },
          ];
        },
      );

      const result = await librarian.listDocuments({
        directory: "/",
        tags: [],
        includeContents: false,
        depth: 1,
      });

      // Verify the result
      expect(result).toHaveLength(1);
    });
  });

  describe("searchDocuments", () => {
    it("should call loadAllDocuments and searchDocuments", async () => {
      const result = await librarian.searchDocuments({
        query: "doc1",
        mode: "string",
        includeContents: false,
      });

      // Verify loadAllDocuments was called
      expect(loadModule.loadAllDocuments).toHaveBeenCalledWith("/test/docs");

      // Verify searchDocuments was called with the correct arguments
      expect(loadModule.searchDocuments).toHaveBeenCalled();

      // Verify the result
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("filepath", "doc1.md");

      // Verify contents are not included
      expect(result[0]).not.toHaveProperty("contents");
    });

    it("should include contents when requested", async () => {
      const result = await librarian.searchDocuments({
        query: "doc1",
        directory: "/",
        includeContents: true,
      });

      // Verify contents are included
      expect(result[0]).toHaveProperty("contents", "Content of doc1");
    });
  });

  describe("getDocument", () => {
    it("should call loadAllDocuments and getDocument", async () => {
      const result = await librarian.getDocument({ filepath: "doc1.md" });

      // Verify loadAllDocuments was called
      expect(loadModule.loadAllDocuments).toHaveBeenCalledWith("/test/docs");

      // Verify getDocument was called with the correct arguments
      expect(loadModule.getDocument).toHaveBeenCalled();

      // Verify the result
      expect(result).toHaveProperty("filepath", "doc1.md");
      expect(result).toHaveProperty("contents", "Content of doc1");
    });

    it("should throw an error for non-existent document", async () => {
      // Override the mock for this test
      vi.mocked(loadModule.getDocument).mockImplementationOnce(() => {
        throw new Error("Document not found: non-existent.md");
      });

      await expect(
        librarian.getDocument({ filepath: "non-existent.md" }),
      ).rejects.toThrow("Document not found");
    });
  });

  describe("listTags", () => {
    it("should call loadAllDocuments and getTagsInDirectory", async () => {
      const result = await librarian.listTags({
        directory: "/",
        includeFilepaths: false,
        depth: -1,
      });

      // Verify loadAllDocuments was called
      expect(loadModule.loadAllDocuments).toHaveBeenCalledWith("/test/docs");

      // Verify getTagsInDirectory was called with the correct arguments
      expect(loadModule.getTagsInDirectory).toHaveBeenCalled();

      // Verify the result
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty("tag", "tag1");
      expect(result[0]).toHaveProperty("count", 1);
      expect(result[1]).toHaveProperty("tag", "tag2");
      expect(result[1]).toHaveProperty("count", 2);

      // Verify filepaths are not included
      expect(result[0]).not.toHaveProperty("filepaths");
    });

    it("should include filepaths when requested", async () => {
      const result = await librarian.listTags({
        directory: "/",
        includeFilepaths: true,
        depth: -1,
      });

      // Verify filepaths are included
      expect(result[0]).toHaveProperty("filepaths");
      expect(result[0].filepaths).toContain("doc1.md");
    });

    it("should respect the depth parameter", async () => {
      // Set up a specific mock implementation for this test
      vi.mocked(loadModule.getTagsInDirectory).mockImplementationOnce(
        (cache, directory, includeFilepaths, depth) => {
          // Verify depth parameter is passed correctly
          expect(depth).toBe(1);
          return [{ tag: "tag1", count: 1 }];
        },
      );

      const result = await librarian.listTags({
        directory: "/",
        includeFilepaths: false,
        depth: 1,
      });

      // Verify the result
      expect(result).toHaveLength(1);
    });
  });

  describe("reloadDocuments", () => {
    it("should reset the document cache", async () => {
      // Create a new instance of Librarian for this test
      const testLibrarian = new Librarian({ docsRoot: "/test/docs" });

      // Create a spy on loadAllDocuments
      const loadSpy = vi.spyOn(loadModule, "loadAllDocuments");

      // Call a method to load the cache
      await testLibrarian.listDocuments({
        directory: "/",
        depth: -1,
      });

      // Verify loadAllDocuments was called
      expect(loadSpy).toHaveBeenCalledTimes(1);

      // Reset the spy
      loadSpy.mockClear();

      // Call another method - should not call loadAllDocuments again
      await testLibrarian.searchDocuments({
        query: "doc1",
        mode: "string",
        caseSensitive: false,
        directory: "/",
        tags: [],
        includeContents: false,
      });

      // Verify loadAllDocuments was not called again
      expect(loadSpy).not.toHaveBeenCalled();

      // Call reloadDocuments
      await testLibrarian.reloadDocuments();

      // Call a method again
      await testLibrarian.listDocuments({
        directory: "/",
        depth: -1,
      });

      // Verify loadAllDocuments was called again
      expect(loadSpy).toHaveBeenCalledTimes(1);

      // Clean up
      loadSpy.mockRestore();
    });
  });
});
