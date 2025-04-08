/**
 * Knowledge Structuring Session Manager
 */
import * as fsp from "node:fs/promises";
import { z } from "zod";
import { Answer } from "../answer.js";
import { normalizePath } from "../normalize.js";
import { fetchSourceDocument } from "./fetchSourceDocument.js";
import {
  formatEndSessionResponse,
  formatErrorResponse,
  formatSessionStartResponse,
  formatSourceDocumentResponse,
  formatWriteSectionResponse,
} from "./format.js";

/**
 * Session data structure
 */
interface PendingSessionData {
  documentName: string;
  documentSource: string;
  sourceDocument: string;
  timestamp: number;
}

/**
 * Session data structure
 */
interface SessionData extends PendingSessionData {
  commonPathPrefix: string;
  sectionFilepaths: string[];
  completedFilepaths: string[];
}

/**
 * Input schema for starting a knowledge structuring session
 */
export const startSessionSchema = z.object({
  sessionToken: z
    .string()
    .describe(
      "The token for the session to be started provided in the prompt.",
    ),
  sectionFilepaths: z
    .array(z.string())
    .describe(
      "The files to be written in the session. This is a list of filepaths.",
    ),
});

/**
 * Type for startSession parameters
 */
export type StartSessionParams = z.input<typeof startSessionSchema>;

/**
 * Input schema for showing the source document
 */
export const showSourceDocumentSchema = z.object({
  sessionToken: z
    .string()
    .describe(
      "The token for the session to be started provided in the prompt.",
    ),
  sourceDocumentRange: z
    .string()
    .describe(
      "The lines of the source document to be shown. This can be a range like `L123-L456` or `all`.",
    ),
});

/**
 * Input schema for starting a pending session
 */
export const startPendingSessionSchema = z.object({
  documentName: z
    .string()
    .describe("The name of the document to be structured."),
  documentSource: z
    .string()
    .describe(
      "The source of the document to be structured. This can be a URL or a file path.",
    ),
});

/**
 * Type for startPendingSession parameters
 */
export type StartPendingSessionParams = z.input<
  typeof startPendingSessionSchema
>;

/**
 * Type for showSourceDocument parameters
 */
export type ShowSourceDocumentParams = z.input<typeof showSourceDocumentSchema>;

/**
 * Input schema for writing a section
 */
export const writeSectionSchema = z.object({
  sessionToken: z
    .string()
    .describe(
      "The token for the session to be started provided in the prompt.",
    ),
  sectionFilepath: z
    .string()
    .describe("The filepath of the section to be written."),
  sectionTags: z
    .array(z.string())
    .describe(
      "The tags to be assigned to the section. This is a list of tags in lower-kebab-case.",
    ),
  sectionContent: z
    .string()
    .describe(
      "The content of the section to be written. This is a markdown string.",
    ),
  showSourceDocument: z
    .boolean()
    .default(false)
    .describe("Whether to include the source document in the response."),
  sourceDocumentRange: z
    .string()
    .optional()
    .describe(
      "The lines of the source document to be shown. This can be a range like `L123-L456` or `all`.",
    ),
});

/**
 * Type for writeSection parameters
 */
export type WriteSectionParams = z.input<typeof writeSectionSchema>;

/**
 * Input schema for ending a session
 */
export const endSessionSchema = z.object({
  sessionToken: z
    .string()
    .describe(
      "The token for the session to be started provided in the prompts.",
    ),
});

/**
 * Type for endSession parameters
 */
export type EndSessionParams = z.input<typeof endSessionSchema>;

/**
 * Knowledge Structuring Session Manager
 */
export class KnowledgeStructuringSessionManager {
  private readonly sessions: Map<string, SessionData> = new Map();
  private readonly pendingSessions: Map<
    string,
    {
      documentName: string;
      documentSource: string;
      sourceDocument: string;
      timestamp: number;
    }
  > = new Map();
  private readonly docsRoot: string;

  constructor(docsRoot: string) {
    this.docsRoot = docsRoot;
  }

  /**
   * Start a new knowledge structuring session
   */
  async startSession(params: StartSessionParams): Promise<Answer> {
    const { sessionToken, sectionFilepaths } = params;

    // Check if session already exists
    if (this.sessions.has(sessionToken)) {
      return {
        isError: true,
        role: "assistant",
        message: "Error. Session already started.",
      };
    }

    // Check if there's a pending session with this token
    const pendingSession = this.pendingSessions.get(sessionToken);
    if (!pendingSession) {
      return {
        isError: true,
        role: "assistant",
        message: "Error. No pending session found with this token.",
      };
    }

    // Remove the pending session
    this.pendingSessions.delete(sessionToken);

    const normalizedFilepaths = sectionFilepaths
      .filter((filepath) => !filepath.endsWith("/"))
      .map((filepath) => normalizePath(filepath));
    const commonPathPrefixParts = normalizedFilepaths[0]?.split("/") ?? [];
    for (const filepath of normalizedFilepaths) {
      const parts = filepath.split("/");
      for (let i = 0; i < commonPathPrefixParts.length; i++) {
        if (commonPathPrefixParts[i] !== parts[i]) {
          commonPathPrefixParts.splice(i);
          break;
        }
      }

      if (commonPathPrefixParts.length <= 1) {
        break;
      }
    }
    const commonPathPrefix = commonPathPrefixParts.join("/");

    const errorFilepaths = sectionFilepaths.filter(
      (filepath) => !filepath.endsWith(".md") || /\/\.|\.\//.test(filepath),
    );
    if (errorFilepaths.length) {
      return {
        isError: true,
        role: "assistant",
        message: `Error. The following filepaths are invalid:\n- ${errorFilepaths.join(
          "\n- ",
        )}\n\nAll files must end with .md and cannot contain paths that start or end with a dot.`,
      };
    }

    // Create a new session
    const sessionData: SessionData = {
      ...pendingSession,
      sectionFilepaths,
      completedFilepaths: [],
      commonPathPrefix,
    };

    // Store the session
    this.sessions.set(sessionToken, sessionData);

    // Return formatted response
    return {
      isError: false,
      role: "assistant",
      message: formatSessionStartResponse(
        sessionToken,
        sessionData.sectionFilepaths,
        sessionData.sourceDocument,
      ),
    };
  }

  /**
   * Show the source document for a session
   */
  async showSourceDocument(params: ShowSourceDocumentParams): Promise<Answer> {
    const { sessionToken, sourceDocumentRange } = params;

    // Check if session exists
    const session = this.sessions.get(sessionToken);
    if (!session) {
      return {
        isError: true,
        role: "assistant",
        message: "Error. Session does not exist or has already been finished.",
      };
    }

    // In a real implementation, we would filter the source document based on the range
    // For now, we'll just return the entire source document
    return {
      isError: false,
      role: "assistant",
      message: formatSourceDocumentResponse(
        session.sourceDocument,
        sourceDocumentRange,
      ),
    };
  }

  /**
   * Write a section for a session
   */
  async writeSection(params: WriteSectionParams): Promise<Answer> {
    const {
      sessionToken,
      sectionFilepath,
      sectionTags,
      sectionContent,
      showSourceDocument,
      sourceDocumentRange,
    } = params;

    // Check if session exists
    const session = this.sessions.get(sessionToken);
    if (!session) {
      return {
        isError: true,
        role: "assistant",
        message: "Error. Session does not exist or has already been finished.",
      };
    }

    // Check if the filepath is already completed
    if (session.completedFilepaths.includes(sectionFilepath)) {
      return {
        isError: true,
        role: "assistant",
        message: formatErrorResponse(
          "The specified filepath has already been completed.",
          sessionToken,
          session.sectionFilepaths,
          session.completedFilepaths,
          showSourceDocument ? session.sourceDocument : undefined,
          sourceDocumentRange,
        ),
      };
    }

    // Check if the filepath is in the session
    if (!session.sectionFilepaths.includes(sectionFilepath)) {
      return {
        isError: true,
        role: "assistant",
        message: formatErrorResponse(
          "The specified filepath is not part of the session.",
          sessionToken,
          session.sectionFilepaths,
          session.completedFilepaths,
          showSourceDocument ? session.sourceDocument : undefined,
          sourceDocumentRange,
        ),
      };
    }

    // In a real implementation, we would write the section to the file system
    // For now, we'll just mark it as completed
    session.completedFilepaths.push(sectionFilepath);

    // Calculate remaining filepaths
    const remainingFilepaths = session.sectionFilepaths.filter(
      (fp) => !session.completedFilepaths.includes(fp),
    );

    await fsp.writeFile(
      `${this.docsRoot}/${session.documentName}/${sectionFilepath.slice(session.commonPathPrefix.length)}`,
      `---\ntags: [${sectionTags.map((tag) => JSON.stringify(tag)).join(", ")}]\nsource: ${JSON.stringify(session.documentSource)}\n---\n\n${sectionContent}`,
    );

    // Return formatted response
    return {
      isError: false,
      role: "assistant",
      message: formatWriteSectionResponse(
        sessionToken,
        remainingFilepaths,
        session.completedFilepaths,
        showSourceDocument ? session.sourceDocument : undefined,
        sourceDocumentRange,
      ),
    };
  }

  /**
   * End a knowledge structuring session
   */
  async endSession(params: EndSessionParams): Promise<Answer> {
    const { sessionToken } = params;

    // Check if session exists
    const session = this.sessions.get(sessionToken);
    if (!session) {
      return {
        isError: true,
        role: "assistant",
        message: "Error. Session does not exist or has already been finished.",
      };
    }

    // Check if all sections are completed
    const remainingFilepaths = session.sectionFilepaths.filter(
      (fp) => !session.completedFilepaths.includes(fp),
    );

    if (remainingFilepaths.length > 0) {
      return {
        isError: true,
        role: "assistant",
        message: formatErrorResponse(
          "The session cannot be ended because there are still sections to be completed.",
          sessionToken,
          session.sectionFilepaths,
          session.completedFilepaths,
        ),
      };
    }

    // Delete the session
    this.sessions.delete(sessionToken);

    // Return formatted response
    return {
      isError: false,
      role: "assistant",
      message: formatEndSessionResponse(
        session.completedFilepaths,
        sessionToken,
        session.commonPathPrefix,
        session.documentName,
      ),
    };
  }

  /**
   * Start a pending knowledge structuring session
   */
  async startPendingSession(
    params: StartPendingSessionParams,
  ): Promise<string> {
    const { documentName, documentSource } = params;

    // Generate a session token
    const sessionToken = crypto.randomUUID();

    // In a real implementation, we would load the source document from documentSource
    const sourceDocument = await fetchSourceDocument(documentSource);

    // Store the pending session
    this.pendingSessions.set(sessionToken, {
      documentName,
      documentSource,
      sourceDocument,
      timestamp: Date.now(),
    });

    // Generate the prompt based on IDEA.md
    return `You are an outstanding editor, well-versed in computer science and IT, and you are good at analyzing, classifying, and structuring documents.
Our ultimate goal is to break down a large document into sections, tag and organize them into a hierarchy of markdown files in a file tree.

To get started, let's understand the outline of the document.
Please focus on analyzing the structure of the document.

1. Read the document below (Source Document) thoroughly and understand its structure.
2. Identify the sections and subsections of the document and consider the filepath in lower-kebab-case for each. (e.g. \`/path/to/dir/getting-started.md\`).
3. Call \`knowledgeStructuringSession.start\` with the following session token and the filepaths you considered."

**Session Token:** \`${sessionToken}\`

**Source Document:**
======
${sourceDocument}`;
  }

  /**
   * Get a session by token
   */
  getSession(sessionToken: string): SessionData | undefined {
    return this.sessions.get(sessionToken);
  }

  /**
   * Check if a session exists
   */
  hasSession(sessionToken: string): boolean {
    return this.sessions.has(sessionToken);
  }

  /**
   * Delete a session
   */
  deleteSession(sessionToken: string): boolean {
    return this.sessions.delete(sessionToken);
  }

  /**
   * Get all sessions
   */
  getAllSessions(): Map<string, SessionData> {
    return new Map(this.sessions);
  }

  /**
   * Clear all sessions
   */
  clearSessions(): void {
    this.sessions.clear();
    this.pendingSessions.clear();
  }
}
