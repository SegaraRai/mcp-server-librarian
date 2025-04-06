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
  // Helper function to create a mock document cache with nested documents
  function createNestedDocCache(): DocumentCache {
    const documents = [
      {
        filepath: "parent/index.md",
        tags: ["parent"],
        contents: "Parent index",
      },
      {
        filepath: "parent/child1.md",
        tags: ["child"],
        contents: "Child 1",
      },
      {
        filepath: "parent/nested/child2.md",
        tags: ["nested"],
        contents: "Nested child 2",
      },
      {
        filepath: "parent/nested/deep/child3.md",
        tags: ["deep"],
        contents: "Deep nested child 3",
      },
    ];

    return {
      documents,
      documentMap: new Map(documents.map((doc) => [doc.filepath, doc])),
      tagMap: new Map(),
      allTags: ["parent", "child", "nested", "deep"],
    };
  }
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

  it("should respect depth=0 to only include documents in the exact directory", () => {
    const mockCache = createNestedDocCache();
    const results = filterDocuments(mockCache, "parent", [], 0);
    
    // Should only include parent/index.md
    expect(results.length).toBe(1);
    expect(results[0].filepath).toBe("parent/index.md");
  });

  it("should respect depth=1 to include documents one level deep", () => {
    const mockCache = createNestedDocCache();
    const results = filterDocuments(mockCache, "parent", [], 1);
    
    // Should include parent/index.md and parent/child1.md but not deeper nested files
    expect(results.length).toBe(2);
    expect(results.map(d => d.filepath).sort()).toEqual([
      "parent/child1.md",
      "parent/index.md"
    ]);
  });

  it("should respect depth=2 to include documents two levels deep", () => {
    const mockCache = createNestedDocCache();
    const results = filterDocuments(mockCache, "parent", [], 2);
    
    // Should include all except the deepest nested file
    expect(results.length).toBe(3);
    expect(results.map(d => d.filepath).sort()).toEqual([
      "parent/child1.md",
      "parent/index.md",
      "parent/nested/child2.md"
    ]);
  });

  it("should include all nested documents when depth=-1", () => {
    const mockCache = createNestedDocCache();
    const results = filterDocuments(mockCache, "parent", [], -1);
    
    // Should include all documents
    expect(results.length).toBe(4);
  });
});

describe("searchDocuments", () => {
  // Helper function to create a mock document cache with nested documents for search testing
  function createNestedSearchDocCache(): DocumentCache {
    const documents = [
      {
        filepath: "parent/index.md",
        tags: ["parent"],
        contents: "Parent index with search term",
      },
      {
        filepath: "parent/child1.md",
        tags: ["child"],
        contents: "Child 1 with search term",
      },
      {
        filepath: "parent/nested/child2.md",
        tags: ["nested"],
        contents: "Nested child 2 with search term",
      },
      {
        filepath: "parent/nested/deep/child3.md",
        tags: ["deep"],
        contents: "Deep nested child 3 with search term",
      },
    ];

    return {
      documents,
      documentMap: new Map(documents.map((doc) => [doc.filepath, doc])),
      tagMap: new Map(),
      allTags: ["parent", "child", "nested", "deep"],
    };
  }
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
  
  it("should respect depth parameter when searching documents", () => {
    const mockCache = createNestedSearchDocCache();
    
    // Test with depth=0
    const resultsDepth0 = searchDocuments(
      mockCache,
      "search term",
      "parent",
      [],
      true,
      "string",
      false,
      0
    );
    expect(resultsDepth0.length).toBe(1);
    expect(resultsDepth0[0].filepath).toBe("parent/index.md");
    
    // Test with depth=1
    const resultsDepth1 = searchDocuments(
      mockCache,
      "search term",
      "parent",
      [],
      true,
      "string",
      false,
      1
    );
    expect(resultsDepth1.length).toBe(1);
    expect(resultsDepth1[0].filepath).toBe("parent/index.md");
    
    // Test with depth=2
    const resultsDepth2 = searchDocuments(
      mockCache,
      "search term",
      "parent",
      [],
      true,
      "string",
      false,
      2
    );
    expect(resultsDepth2.length).toBe(2);
    expect(resultsDepth2.map(d => d.filepath).sort()).toEqual([
      "parent/index.md",
      "parent/nested/child2.md"
    ]);
    
    // Test with depth=-1 (all)
    const resultsAll = searchDocuments(
      mockCache,
      "search term",
      "parent",
      [],
      true,
      "string",
      false,
      -1
    );
    expect(resultsAll.length).toBe(2);
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
  // Helper function to create a mock document cache with nested documents and tags
  function createNestedTagDocCache(): DocumentCache {
    const documents = [
      {
        filepath: "parent/index.md",
        tags: ["parent-tag"],
        contents: "Parent index",
      },
      {
        filepath: "parent/child1.md",
        tags: ["child-tag"],
        contents: "Child 1",
      },
      {
        filepath: "parent/nested/child2.md",
        tags: ["nested-tag"],
        contents: "Nested child 2",
      },
      {
        filepath: "parent/nested/deep/child3.md",
        tags: ["deep-tag"],
        contents: "Deep nested child 3",
      },
    ];

    const tagMap = new Map();
    documents.forEach(doc => {
      doc.tags.forEach(tag => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag).push(doc);
      });
    });

    return {
      documents,
      documentMap: new Map(documents.map((doc) => [doc.filepath, doc])),
      tagMap,
      allTags: ["parent-tag", "child-tag", "nested-tag", "deep-tag"],
    };
  }
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

  it("should respect depth parameter when listing tags", () => {
    const mockCache = createNestedTagDocCache();
    
    // Test with depth=1
    const tagsDepth1 = getTagsInDirectory(mockCache, "parent", false, 1);
    expect(tagsDepth1.length).toBe(2); // Should only include parent-tag and child-tag
    expect(tagsDepth1.map(t => t.tag).sort()).toEqual(["child-tag", "parent-tag"]);
    
    // Test with depth=2
    const tagsDepth2 = getTagsInDirectory(mockCache, "parent", false, 2);
    expect(tagsDepth2.length).toBe(3); // Should include parent-tag, child-tag, and nested-tag
    expect(tagsDepth2.map(t => t.tag).sort()).toEqual(["child-tag", "nested-tag", "parent-tag"]);
    
    // Test with depth=-1 (all)
    const tagsAll = getTagsInDirectory(mockCache, "parent", false, -1);
    expect(tagsAll.length).toBe(4); // Should include all tags
  });
});
