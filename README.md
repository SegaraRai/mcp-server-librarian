# Librarian MCP Server

<div align="center">
  <img src="./logo.svg" alt="Librarian Logo" width="300" height="200">
  <h3>Knowledge at your fingertips</h3>
</div>

## Overview

Librarian is a Model Context Protocol (MCP) server that provides an API for listing, searching, and retrieving markdown files stored in a structured manner. It serves as a knowledge base for Large Language Models (LLMs), providing them with the information they need on demand.

Librarian does not provide any writing operations - it is a read-only service designed to efficiently deliver document content to LLMs through the MCP framework.

## Features

- **Structured Document Organization**: Documents are organized by section (e.g., `daisyui/components/button.md`)
- **Tag-Based Filtering**: Filter documents by tags defined in frontmatter
- **Hierarchical Tag Inheritance**: Tags are inherited from parent directories
- **Flexible Search Capabilities**:
  - Simple string searches (case insensitive)
  - Regular expression searches with customizable flags
- **Efficient Document Retrieval**: Quickly access specific documents by path
- **MCP Integration**: Seamlessly integrates with the Model Context Protocol

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or pnpm

### Installation Steps

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-server-librarian.git
cd mcp-server-librarian

# Install dependencies
pnpm install

# Build the project
pnpm build
```

## Configuration

The document folder path can be configured using the following methods (in order of priority):

### Command-line Arguments

```bash
node dist/index.js --docs-root /path/to/your/docs
```

### Environment Variables

```bash
LIBRARIAN_DOCS_ROOT=/path/to/your/docs node dist/index.js
```

## Document Structure

### Organization

Documents are organized by section, following a hierarchical structure:

```text
<docs_root>/
├── daisyui/
│   ├── index.md              # DaisyUI section info with tags
│   └── components/
│       ├── index.md          # Components section info with tags
│       ├── button.md         # Document with specific tags
│       └── card.md           # Another document with specific tags
└── tailwind4/
    ├── index.md              # Tailwind section info with tags
    └── getting-started.md    # Document with specific tags
```

### Frontmatter

Each markdown document can include frontmatter with a `tags` field:

```markdown
---
tags: ["frontend", "ui", "button"]
---

# Button Component

This document describes the button component...
```

### Tag Inheritance

Tags are inherited through the folder hierarchy:

1. A document inherits all tags from `index.md` files in its parent directories
2. Tags are merged from the most general (root) to the most specific (document)

For example, if we have:

- `/daisyui/index.md` with tags: `["ui"]`
- `/daisyui/components/index.md` with tags: `["components"]`
- `/daisyui/components/button.md` with tags: `["interactive", "form"]`

Then `/daisyui/components/button.md` will effectively have all tags: `["documentation", "ui", "components", "interactive", "form"]`

### Folder Description

You can describe a folder itself by creating an `index.md` file within that folder. This file can contain both frontmatter (with tags) and content describing the purpose of that section.

## API Reference

The Librarian MCP server provides the following tools:

### listDocuments

Lists all documents with optional filtering by directory and tags.

**Parameters:**

- `directory` (optional): The directory path to list documents from (default: "/")
- `tags` (optional): Array of tags to filter by (default: [])
- `includeContents` (optional): Whether to include document contents in results (default: false)

**Response:**

```typescript
// When includeContents is false
{
  filepath: string;  // Relative path to the document
  tags: string[];    // Array of tags (including inherited tags)
}[]

// When includeContents is true
{
  filepath: string;  // Relative path to the document
  tags: string[];    // Array of tags (including inherited tags)
  contents: string;  // Document contents
}[]
```

### searchDocuments

Searches document content using string or regex patterns.

**Parameters:**

- `query`: The search query (string or regex pattern)
- `mode` (optional): Search mode ("string" or "regex", default: "string")
- `caseSensitive` (optional): Whether the search should be case-sensitive (default: false)
- `directory` (optional): The directory path to search in (default: "/")
- `tags` (optional): Array of tags to filter by (default: [])
- `includeContents` (optional): Whether to include document contents in results (default: false)

**Response:**

```typescript
// When includeContents is false
{
  filepath: string;  // Relative path to the document
  tags: string[];    // Array of tags (including inherited tags)
}[]

// When includeContents is true
{
  filepath: string;  // Relative path to the document
  tags: string[];    // Array of tags (including inherited tags)
  contents: string;  // Document contents
}[]
```

### getDocument

Retrieves a specific document by path.

**Parameters:**

- `filepath`: The path to the document

**Response:**

```typescript
{
  filepath: string;    // Relative path to the document
  tags: string[];      // Array of tags (including inherited tags)
  contents: string;    // Document contents
}
```

## Usage Examples

### Starting the Server

```bash
# Start with default configuration
node dist/index.js

# Start with custom docs directory
node dist/index.js --docs-root ./my-documentation

# Start with environment variable
LIBRARIAN_DOCS_ROOT=./my-documentation node dist/index.js
```

### Example Queries

#### Listing Documents

```javascript
// List all documents
const allDocs = await mcp.useTool("librarian", "listDocuments", {});

// List documents in a specific directory
const uiDocs = await mcp.useTool("librarian", "listDocuments", {
  directory: "/daisyui/components",
});

// List documents with specific tags
const buttonDocs = await mcp.useTool("librarian", "listDocuments", {
  tags: ["button", "interactive"],
});
```

#### Searching Documents

```javascript
// Simple string search
const results = await mcp.useTool("librarian", "searchDocuments", {
  query: "button styling",
});

// Regex search
const regexResults = await mcp.useTool("librarian", "searchDocuments", {
  query: "\\bbutton\\b.*\\bstyle\\b",
  mode: "regex",
  caseSensitive: true,
  includeContents: true,
});

// Search with tag filtering
const filteredResults = await mcp.useTool("librarian", "searchDocuments", {
  query: "installation",
  tags: ["tutorial"],
  directory: "/tailwind4",
});
```

#### Retrieving a Document

```javascript
// Get a specific document
const document = await mcp.useTool("librarian", "getDocument", {
  filepath: "/daisyui/components/button.md",
});
```

## Integration with LLMs

Librarian is designed to work seamlessly with LLMs through the Model Context Protocol. Here's how an LLM might use Librarian:

1. **Discovery**: The LLM can list available documents to understand what knowledge is available
2. **Search**: When the LLM needs specific information, it can search across documents
3. **Retrieval**: Once the LLM identifies a relevant document, it can retrieve its full content
4. **Context Building**: The LLM can use the retrieved content to build context for generating responses

## Error Handling

Librarian uses standard MCP error responses with appropriate error codes and messages:

- `INVALID_ARGUMENT`: When provided parameters are invalid
- `NOT_FOUND`: When a requested document or directory doesn't exist
- `INTERNAL`: For unexpected server errors

Each error response includes:

- An error code
- A descriptive message
- Optional details for debugging

## Troubleshooting

### Common Issues

#### Document Not Found

If you're getting `NOT_FOUND` errors:

- Check that the document path is correct
- Verify that the `--docs-root` points to the correct directory
- Ensure file permissions allow the server to read the files

#### Search Returns No Results

If searches aren't returning expected results:

- Check that the query syntax is correct (especially for regex searches)
- Verify that the documents contain the expected content
- Try broadening your search terms or using simpler patterns

#### Tag Filtering Not Working

If tag filtering isn't working as expected:

- Verify that the tags are correctly defined in the frontmatter
- Check the inheritance hierarchy to understand which tags apply to which documents
- Ensure tag names match exactly (tags are case-sensitive)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
