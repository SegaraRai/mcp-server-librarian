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
    expect(result).toBe(
      "- /path/to/doc1.md\n  - tags: tag1, tag2\n" +
        "- /path/to/doc2.md\n  - tags: tag2, tag3",
    );
  });

  it("should handle documents with empty tags", () => {
    const docs: Document[] = [{ filepath: "/path/to/doc1.md", tags: [] }];

    const result = formatDocumentList(docs);
    expect(result).toBe("- /path/to/doc1.md\n  - tags: ");
  });
});

describe("formatDocumentListWithContents", () => {
  it("should format an empty document list", () => {
    const result = formatDocumentListWithContents([]);
    expect(result).toBe("No documents found.");
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
    expect(result).toBe(
      "**/path/to/doc1.md**\n======\nContent of doc1\n======\n\n" +
        "**/path/to/doc2.md**\n======\nContent of doc2\n======",
    );
  });

  it("should handle documents with undefined contents", () => {
    const docs: Document[] = [{ filepath: "/path/to/doc1.md", tags: ["tag1"] }];

    const result = formatDocumentListWithContents(docs);
    expect(result).toBe("**/path/to/doc1.md**\n======\n\n======");
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
    expect(result).toBe(
      "**/path/to/doc.md**\n======\nDocument content\n======",
    );
  });

  it("should handle a document with undefined contents", () => {
    const doc: Document = {
      filepath: "/path/to/doc.md",
      tags: ["tag1", "tag2"],
    };

    const result = formatDocument(doc);
    expect(result).toBe("**/path/to/doc.md**\n======\n\n======");
  });
});

describe("formatTagList", () => {
  it("should format an empty tag list", () => {
    const result = formatTagList([]);
    expect(result).toBe("No tags found.");
  });

  it("should format a list of tags without filepaths", () => {
    const tags = [
      { tag: "tag1", count: 5 },
      { tag: "tag2", count: 3 },
      { tag: "tag3", count: 1 },
    ];

    const result = formatTagList(tags);
    expect(result).toBe("- tag1 (5)\n" + "- tag2 (3)\n" + "- tag3 (1)");
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
    expect(result).toBe(
      "- tag1 (2)\n" +
        "  - files:\n" +
        "    - /path/to/doc1.md\n" +
        "    - /path/to/doc2.md\n" +
        "- tag2 (1)\n" +
        "  - files:\n" +
        "    - /path/to/doc1.md",
    );
  });

  it("should handle tags with empty filepaths array", () => {
    const tags = [{ tag: "tag1", count: 0, filepaths: [] }];

    const result = formatTagList(tags);
    expect(result).toBe("- tag1 (0)");
  });
});
