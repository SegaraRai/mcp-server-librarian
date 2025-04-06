import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import fg from "fast-glob";
import matter from "gray-matter";

// Define document types
interface Document {
  filepath: string;
  tags: string[];
  contents?: string;
}

// Configuration
const getDocsRoot = (): string => {
  // Check command line arguments first
  const argIndex = process.argv.findIndex((arg: string) => arg === "--docs-root");
  if (argIndex !== -1 && process.argv.length > argIndex + 1) {
    return process.argv[argIndex + 1];
  }
  
  // Check environment variable next
  if (process.env.LIBRARIAN_DOCS_ROOT) {
    return process.env.LIBRARIAN_DOCS_ROOT;
  }
  
  // Default to ./docs
  return "./docs";
};

const docsRoot = getDocsRoot();
console.log(`Using docs root: ${docsRoot}`);

// Ensure docs directory exists
if (!fs.existsSync(docsRoot)) {
  console.warn(`Docs root directory does not exist: ${docsRoot}`);
  fs.mkdirSync(docsRoot, { recursive: true });
  console.log(`Created docs root directory: ${docsRoot}`);
}

// Helper functions
const readMarkdownFile = (filepath: string): Document => {
  const fullPath = path.join(docsRoot, filepath);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${filepath}`);
  }
  
  const fileContent = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContent);
  
  return {
    filepath,
    tags: Array.isArray(data.tags) ? data.tags : [],
    contents: content
  };
};

const getInheritedTags = (filepath: string): string[] => {
  const parts = filepath.split("/").filter(Boolean);
  const allTags: string[] = [];
  
  // Start from root and traverse down the path
  let currentPath = "";
  
  // Check root index.md
  try {
    const rootIndexPath = "index.md";
    if (fs.existsSync(path.join(docsRoot, rootIndexPath))) {
      const { data } = matter(fs.readFileSync(path.join(docsRoot, rootIndexPath), "utf-8"));
      if (Array.isArray(data.tags)) {
        allTags.push(...data.tags);
      }
    }
  } catch (error) {
    console.error(`Error reading root index.md:`, error);
  }
  
  // Check each directory level
  for (let i = 0; i < parts.length - 1; i++) {
    currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
    
    try {
      const indexPath = `${currentPath}/index.md`;
      if (fs.existsSync(path.join(docsRoot, indexPath))) {
        const { data } = matter(fs.readFileSync(path.join(docsRoot, indexPath), "utf-8"));
        if (Array.isArray(data.tags)) {
          allTags.push(...data.tags);
        }
      }
    } catch (error) {
      console.error(`Error reading ${currentPath}/index.md:`, error);
    }
  }
  
  // Remove duplicates
  return [...new Set(allTags)];
};

const enrichDocumentWithTags = (doc: Document): Document => {
  const inheritedTags = getInheritedTags(doc.filepath);
  return {
    ...doc,
    tags: [...new Set([...inheritedTags, ...doc.tags])]
  };
};

// Create an MCP server
const server = new McpServer({
  name: "Librarian",
  version: "1.0.0",
  description: "A server for listing, searching, and retrieving markdown files"
});

// Add listDocuments tool
server.tool(
  "listDocuments",
  {
    directory: z.string().default("/"),
    tags: z.array(z.string()).default([])
  },
  async (args, extra) => {
    try {
      const { directory, tags } = args;
      const normalizedDir = directory.startsWith("/") ? directory.substring(1) : directory;
      const pattern = `${normalizedDir === "/" ? "" : normalizedDir + "/"}**/*.md`;
      
      const files = await fg(pattern, {
        cwd: docsRoot,
        ignore: ["**/node_modules/**"]
      });
      
      const documents: Document[] = [];
      
      for (const file of files) {
        try {
          const doc = readMarkdownFile(file);
          const enrichedDoc = enrichDocumentWithTags(doc);
          
          // Filter by tags if specified
          if (tags.length === 0 || tags.some(tag => enrichedDoc.tags.includes(tag))) {
            // Remove contents to keep response size small
            const { contents, ...docWithoutContents } = enrichedDoc;
            documents.push(docWithoutContents);
          }
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
        }
      }
      
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(documents, null, 2)
        }]
      };
    } catch (error: any) {
      console.error("Error in listDocuments:", error);
      return {
        content: [{ 
          type: "text", 
          text: `Failed to list documents: ${error.message || "Unknown error"}`
        }],
        isError: true
      };
    }
  }
);

// Add searchDocuments tool
server.tool(
  "searchDocuments",
  {
    query: z.string(),
    directory: z.string().default("/"),
    tags: z.array(z.string()).default([]),
    includeContents: z.boolean().default(false)
  },
  async (args, extra) => {
    try {
      const { query, directory, tags, includeContents } = args;
      const normalizedDir = directory.startsWith("/") ? directory.substring(1) : directory;
      const pattern = `${normalizedDir === "/" ? "" : normalizedDir + "/"}**/*.md`;
      
      const files = await fg(pattern, {
        cwd: docsRoot,
        ignore: ["**/node_modules/**"]
      });
      
      const results: Document[] = [];
      
      // Determine if query is a regex
      let regex: RegExp;
      try {
        // Default to case-insensitive global matching
        regex = new RegExp(query, "gim");
      } catch (error) {
        // If invalid regex, treat as a plain string
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        regex = new RegExp(escapedQuery, "gim");
      }
      
      for (const file of files) {
        try {
          const doc = readMarkdownFile(file);
          const enrichedDoc = enrichDocumentWithTags(doc);
          
          // Filter by tags if specified
          if (tags.length === 0 || tags.some(tag => enrichedDoc.tags.includes(tag))) {
            // Check if content matches the query
            if (enrichedDoc.contents && regex.test(enrichedDoc.contents)) {
              if (!includeContents) {
                // Remove contents to keep response size small
                const { contents, ...docWithoutContents } = enrichedDoc;
                results.push(docWithoutContents);
              } else {
                results.push(enrichedDoc);
              }
            }
          }
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
        }
      }
      
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(results, null, 2)
        }]
      };
    } catch (error: any) {
      console.error("Error in searchDocuments:", error);
      return {
        content: [{ 
          type: "text", 
          text: `Failed to search documents: ${error.message || "Unknown error"}`
        }],
        isError: true
      };
    }
  }
);

// Add getDocument tool
server.tool(
  "getDocument",
  {
    filepath: z.string()
  },
  async (args, extra) => {
    try {
      // Normalize filepath
      const { filepath } = args;
      const normalizedPath = filepath.startsWith("/") ? filepath.substring(1) : filepath;
      
      const doc = readMarkdownFile(normalizedPath);
      const enrichedDoc = enrichDocumentWithTags(doc);
      
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(enrichedDoc, null, 2)
        }]
      };
    } catch (error: any) {
      console.error("Error in getDocument:", error);
      return {
        content: [{ 
          type: "text", 
          text: `Failed to get document: ${error.message || "Unknown error"}`
        }],
        isError: true
      };
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
const start = async () => {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("Librarian MCP server started");
  } catch (error: any) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
