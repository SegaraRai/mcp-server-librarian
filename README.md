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
- **Tag Discovery**: List all available tags with usage counts and optional file paths
- **MCP Integration**: Seamlessly integrates with the Model Context Protocol

## Project Structure

The Librarian MCP server is organized into modular components:

- **src/lib/config.ts**: Type definitions and loader for configuration
- **src/lib/load.ts**: Document loading and processing functionality
- **src/lib/librarian.ts**: Core librarian implementation with schemas
- **src/lib/util.ts**: Formatting utilities for plaintext responses
- **src/lib/server.ts**: MCP server implementation
- **src/bin.ts**: CLI entry point
- **src/index.ts**: Library entry point

This modular design allows for easy extension and maintenance, with clear separation of concerns.

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
node dist/bin.js --docs-root /path/to/your/docs
```

### Environment Variables

```bash
LIBRARIAN_DOCS_ROOT=/path/to/your/docs node dist/bin.js
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
- `depth` (optional): Maximum directory depth to traverse (-1 for infinite, default: -1)
- `includeContents` (optional): Whether to include document contents in results (default: false)

**Response:**

```
// When includeContents is false
- /path/to/document1.md
  - tags: tag1, tag2, tag3
- /path/to/document2.md
  - tags: tag1, tag4, tag5
...

// When includeContents is true
**/path/to/document1.md**
======
Document 1 content with frontmatter
======

**/path/to/document2.md**
======
Document 2 content with frontmatter
======
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
- `depth` (optional): Maximum directory depth to traverse (-1 for infinite, default: -1)

**Response:**

```
// When includeContents is false
- /path/to/document1.md
  - tags: tag1, tag2, tag3
- /path/to/document2.md
  - tags: tag1, tag4, tag5
...

// When includeContents is true
**/path/to/document1.md**
======
Document 1 content with frontmatter
======

**/path/to/document2.md**
======
Document 2 content with frontmatter
======
```

### getDocument

Retrieves a specific document by path.

**Parameters:**

- `filepath`: The path to the document

**Response:**

```
**/path/to/document.md**
======
Document content with frontmatter
======
```

### listTags

Lists all tags with counts and optional filepaths.

**Parameters:**

- `directory` (optional): The directory path to list tags from (default: "/")
- `includeFilepaths` (optional): Whether to include filepaths in results (default: false)
- `depth` (optional): Maximum directory depth to traverse (-1 for infinite, default: -1)

**Response:**

```
// When includeFilepaths is false
- tag1 (5)
- tag2 (3)
- tag3 (2)
...

// When includeFilepaths is true
- tag1 (5)
  - files:
    - /path/to/document1.md
    - /path/to/document2.md
    - ...
- tag2 (3)
  - files:
    - /path/to/document3.md
    - ...
```

## Usage Examples

### Starting the Server

```bash
# Start with default configuration
node dist/bin.js

# Start with custom docs directory
node dist/bin.js --docs-root ./my-documentation

# Start with environment variable
LIBRARIAN_DOCS_ROOT=./my-documentation node dist/bin.js
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

// List documents with depth limit
const topLevelDocs = await mcp.useTool("librarian", "listDocuments", {
  directory: "/daisyui",
  depth: 1, // Only include direct children, not nested subdirectories
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

// Search with depth limit
const topLevelResults = await mcp.useTool("librarian", "searchDocuments", {
  query: "component",
  directory: "/daisyui",
  depth: 1, // Only search in direct children, not nested subdirectories
});
```

#### Retrieving a Document

```javascript
// Get a specific document
const document = await mcp.useTool("librarian", "getDocument", {
  filepath: "/daisyui/components/button.md",
});
```

#### Listing Tags

```javascript
// List all tags
const allTags = await mcp.useTool("librarian", "listTags", {});

// List tags in a specific directory
const tailwindTags = await mcp.useTool("librarian", "listTags", {
  directory: "/tailwind",
});

// List tags with filepaths
const tagsWithFiles = await mcp.useTool("librarian", "listTags", {
  includeFilepaths: true,
});

// List tags with depth limit
const topLevelTags = await mcp.useTool("librarian", "listTags", {
  directory: "/daisyui",
  depth: 1, // Only include tags from direct children, not nested subdirectories
});
```

## Integration with LLMs

Librarian is designed to work seamlessly with LLMs through the Model Context Protocol. Here's how an LLM might use Librarian:

1. **Tag Discovery**: The LLM can list available tags to understand the knowledge taxonomy
2. **Document Discovery**: The LLM can list available documents to understand what knowledge is available
3. **Search**: When the LLM needs specific information, it can search across documents
4. **Retrieval**: Once the LLM identifies a relevant document, it can retrieve its full content
5. **Context Building**: The LLM can use the retrieved content to build context for generating responses

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
