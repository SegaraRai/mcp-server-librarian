import { describe, expect, it } from "vitest";
import { Document } from "./load.js";
import {
  formatDocument,
  formatDocumentList,
  formatDocumentListWithContents,
  formatTagList,
} from "./util.js";

describe("formatDocumentList", () => {
  it("should format an empty document list", () => {
    const result = formatDocumentList([]);
    expect(result).toBe("No documents found.");
  });

  it("should format a list of documents without contents", () => {
    const docs: Document[] = [
      { filepath: "/path/to/doc1.md", tags: ["tag1", "tag2"] },
      { filepath: "/path/to/doc2.md", tags: ["tag2", "tag3"] },
    ];

    const result = formatDocumentList(docs);
    expect(result).toMatchInlineSnapshot(`
      "- /path/to/doc1.md
        - tags: tag1, tag2
      - /path/to/doc2.md
        - tags: tag2, tag3"
    `);
  });

  it("should handle documents with empty tags", () => {
    const docs: Document[] = [{ filepath: "/path/to/doc1.md", tags: [] }];

    const result = formatDocumentList(docs);
    expect(result).toMatchInlineSnapshot(`
      "- /path/to/doc1.md
        - tags: (no tags)"
    `);
  });
});

describe("formatDocumentListWithContents", () => {
  it("should format an empty document list", () => {
    const result = formatDocumentListWithContents([]);
    expect(result).toMatchInlineSnapshot(`"No documents found."`);
  });

  it("should format a list of documents with contents", () => {
    const docs: Document[] = [
      {
        filepath: "/path/to/doc1.md",
        tags: ["tag1", "tag2"],
        contents: "Content of doc1",
      },
      {
        filepath: "/path/to/doc2.md",
        tags: ["tag2", "tag3"],
        contents: "Content of doc2",
      },
    ];

    const result = formatDocumentListWithContents(docs);
    expect(result).toMatchInlineSnapshot(`
      "**/path/to/doc1.md**
      - tags: tag1, tag2
      ======
      Content of doc1
      ======

      **/path/to/doc2.md**
      - tags: tag2, tag3
      ======
      Content of doc2
      ======"
    `);
  });

  it("should handle documents with undefined contents", () => {
    const docs: Document[] = [{ filepath: "/path/to/doc1.md", tags: ["tag1"] }];

    const result = formatDocumentListWithContents(docs);
    expect(result).toMatchInlineSnapshot(`
      "**/path/to/doc1.md**
      - tags: tag1
      ======

      ======"
    `);
  });
});

describe("formatDocument", () => {
  it("should format a document with contents", () => {
    const doc: Document = {
      filepath: "/path/to/doc.md",
      tags: ["tag1", "tag2"],
      contents: "Document content",
    };

    const result = formatDocument(doc);
    expect(result).toMatchInlineSnapshot(`
      "**/path/to/doc.md**
      - tags: tag1, tag2
      ======
      Document content
      ======"
    `);
  });

  it("should handle a document with undefined contents", () => {
    const doc: Document = {
      filepath: "/path/to/doc.md",
      tags: ["tag1", "tag2"],
    };

    const result = formatDocument(doc);
    expect(result).toMatchInlineSnapshot(`
      "**/path/to/doc.md**
      - tags: tag1, tag2
      ======

      ======"
    `);
  });
});

describe("formatTagList", () => {
  it("should format an empty tag list", () => {
    const result = formatTagList([]);
    expect(result).toMatchInlineSnapshot(`"No tags found."`);
  });

  it("should format a list of tags without filepaths", () => {
    const tags = [
      { tag: "tag1", count: 5 },
      { tag: "tag2", count: 3 },
      { tag: "tag3", count: 1 },
    ];

    const result = formatTagList(tags);
    expect(result).toMatchInlineSnapshot(`
      "- tag1 (5)
      - tag2 (3)
      - tag3 (1)"
    `);
  });

  it("should format a list of tags with filepaths", () => {
    const tags = [
      {
        tag: "tag1",
        count: 2,
        filepaths: ["/path/to/doc1.md", "/path/to/doc2.md"],
      },
      {
        tag: "tag2",
        count: 1,
        filepaths: ["/path/to/doc1.md"],
      },
    ];

    const result = formatTagList(tags);
    expect(result).toMatchInlineSnapshot(`
      "- tag1 (2)
        - /path/to/doc1.md
        - /path/to/doc2.md
      - tag2 (1)
        - /path/to/doc1.md"
    `);
  });

  it("should handle tags with empty filepaths array", () => {
    const tags = [{ tag: "tag1", count: 0, filepaths: [] }];

    const result = formatTagList(tags);
    expect(result).toMatchInlineSnapshot(`"- tag1 (0)"`);
  });
});
