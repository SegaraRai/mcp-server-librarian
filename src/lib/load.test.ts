import * as path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import {
  DocumentCache,
  filterDocuments,
  getDocument,
  getTagsInDirectory,
  loadAllDocuments,
  searchDocuments,
} from "./load.js";

// Use the examples directory for testing
const TEST_DOCS_ROOT = path.resolve("./examples/docs");
let documentCache: DocumentCache;

// Load documents once before all tests
beforeAll(async () => {
  documentCache = await loadAllDocuments(TEST_DOCS_ROOT);
  // Ensure documents were loaded
  expect(documentCache.documents.length).toBeGreaterThan(0);
});

describe("loadAllDocuments", () => {
  it("should load all documents from the examples directory", async () => {
    const cache = await loadAllDocuments(TEST_DOCS_ROOT);

    // Verify cache structure
    expect(cache).toHaveProperty("documents");
    expect(cache).toHaveProperty("documentMap");
    expect(cache).toHaveProperty("tagMap");
    expect(cache).toHaveProperty("allTags");

    // Verify documents were loaded
    expect(cache.documents.length).toBeGreaterThan(0);

    // Verify a specific document exists
    const indexDoc = cache.documentMap.get("index.md");
    expect(indexDoc).toBeDefined();
    expect(indexDoc?.tags).toContain("documentation");
  });
});

describe("filterDocuments", () => {
  it("should filter documents by directory", () => {
    const tailwindDocs = filterDocuments(documentCache, "/tailwind");

    // All documents should be in the tailwind directory
    for (const doc of tailwindDocs) {
      expect(doc.filepath.startsWith("tailwind/")).toBe(true);
    }
  });

  it("should filter documents by tags", () => {
    const uiDocs = filterDocuments(documentCache, "/", ["ui"]);

    // All documents should have the 'ui' tag
    for (const doc of uiDocs) {
      expect(doc.tags).toContain("ui");
    }
  });

  it("should return all documents when no filters are applied", () => {
    const allDocs = filterDocuments(documentCache);
    expect(allDocs.length).toBe(documentCache.documents.length);
  });
});

describe("searchDocuments", () => {
  it("should search documents by string query", () => {
    // Create a mock document cache with a document that contains our search term
    const mockDocCache: DocumentCache = {
      documents: [
        {
          filepath: "test.md",
          tags: ["test"],
          contents: "This is a test document with the search term",
        },
      ],
      documentMap: new Map(),
      tagMap: new Map(),
      allTags: [],
    };

    // Call searchDocuments with includeContents=true to keep contents
    const results = searchDocuments(mockDocCache, "search term", "/", [], true);

    // Verify we got a result
    expect(results.length).toBe(1);
    expect(results[0].filepath).toBe("test.md");
    expect(results[0].contents).toContain("search term");
  });

  it("should search documents by regex pattern", () => {
    // Create a mock document cache with a document that contains our search term
    const mockDocCache: DocumentCache = {
      documents: [
        {
          filepath: "test.md",
          tags: ["test"],
          contents: "This is a test document with a button element",
        },
      ],
      documentMap: new Map(),
      tagMap: new Map(),
      allTags: [],
    };

    // Call searchDocuments with a regex pattern
    const results = searchDocuments(
      mockDocCache,
      "\\bbutton\\b",
      "/",
      [],
      true,
      "regex",
    );

    // Verify we got a result
    expect(results.length).toBe(1);
    expect(results[0].filepath).toBe("test.md");
    expect(results[0].contents).toContain("button");
  });

  it("should filter search results by directory", () => {
    const results = searchDocuments(documentCache, "component", "/tailwind");

    // All results should be in the tailwind directory
    for (const doc of results) {
      expect(doc.filepath.startsWith("tailwind/")).toBe(true);
    }
  });

  it("should filter search results by tags", () => {
    const results = searchDocuments(documentCache, "component", "/", ["ui"]);

    // All results should have the 'ui' tag
    for (const doc of results) {
      expect(doc.tags).toContain("ui");
    }
  });

  it("should include contents when requested", () => {
    const results = searchDocuments(documentCache, "button", "/", [], true);

    // All results should have contents
    for (const doc of results) {
      expect(doc.contents).toBeDefined();
    }
  });

  it("should exclude contents when not requested", () => {
    const results = searchDocuments(documentCache, "button", "/", [], false);

    // No results should have contents
    for (const doc of results) {
      expect(doc.contents).toBeUndefined();
    }
  });
});

describe("getDocument", () => {
  it("should get a document by filepath", () => {
    const doc = getDocument(documentCache, "index.md");

    expect(doc).toBeDefined();
    expect(doc.filepath).toBe("index.md");
    expect(doc.contents).toBeDefined();
  });

  it("should throw an error for non-existent document", () => {
    expect(() => {
      getDocument(documentCache, "non-existent.md");
    }).toThrow();
  });
});

describe("getTagsInDirectory", () => {
  it("should get all tags in the root directory", () => {
    const tags = getTagsInDirectory(documentCache);

    // Verify tags were found
    expect(tags.length).toBeGreaterThan(0);

    // Each tag should have a name and count
    for (const tag of tags) {
      expect(tag).toHaveProperty("tag");
      expect(tag).toHaveProperty("count");
      expect(typeof tag.tag).toBe("string");
      expect(typeof tag.count).toBe("number");
    }
  });

  it("should get tags in a specific directory", () => {
    const tags = getTagsInDirectory(documentCache, "/tailwind");

    // Verify tags were found
    expect(tags.length).toBeGreaterThan(0);
  });

  it("should include filepaths when requested", () => {
    const tags = getTagsInDirectory(documentCache, "/", true);

    // Each tag should have filepaths
    for (const tag of tags) {
      expect(tag).toHaveProperty("filepaths");
      expect(Array.isArray(tag.filepaths)).toBe(true);

      // Each tag should have at least one filepath
      if (tag.count > 0) {
        expect(tag.filepaths?.length).toBeGreaterThan(0);
      }
    }
  });

  it("should exclude filepaths when not requested", () => {
    const tags = getTagsInDirectory(documentCache, "/", false);

    // No tag should have filepaths
    for (const tag of tags) {
      expect(tag.filepaths).toBeUndefined();
    }
  });
});
