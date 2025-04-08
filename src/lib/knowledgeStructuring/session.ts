/**
 * Knowledge Structuring Session Manager
 */
import fs, { promises as fsp } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { Answer } from "../answer.js";
import { normalizePath } from "../normalize.js";
import { composeContent } from "./composeContent.js";
import {
  formatEndSessionResponse,
  formatErrorResponse,
  formatInitialPrompt,
  formatSessionStartResponse,
  formatSourceDocumentResponse,
  formatWriteSectionsResponse,
} from "./format.js";
import {
  fetchSourceDocument,
  sourceDocumentToLines,
} from "./sourceDocument.js";

/**
 * Session data structure
 */
interface PendingSessionData {
  documentName: string;
  documentSource: string;
  sourceDocument: string;
  sourceDocumentLines: string[];
  sourceDocumentLinesWithoutLineNumbers: string[];
  lastRequestedRange: string | null;
  timestamp: number;
}

/**
 * Session data structure
 */
interface SessionData extends PendingSessionData {
  commonPathPrefix: string;
  remainingFilepaths: string[];
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
    .optional()
    .describe(
      "The lines of the source document to be shown. This can be a range like `L123-L456`. Only up to 4000 lines will be shown at a time.",
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
export const writeSectionsSchema = z.object({
  sessionToken: z
    .string()
    .describe(
      "The token for the session to be started provided in the prompt.",
    ),
  sections: z
    .array(
      z.object({
        filepath: z
          .string()
          .describe("The filepath of the section to be written."),
        tags: z
          .array(z.string())
          .describe(
            "The tags to be assigned to the section. This is a list of tags in lower-kebab-case.",
          ),
        contentSpecifiers: z
          .array(z.string())
          .describe(
            "The content specifier for the section. This is a list of content specifiers. The content specifier is a string that specifies the content of the section, for example, `@L123`, `@L123-L456`, or `=any string`.",
          ),
      }),
    )
    .describe(
      "The sections to be written. You can specify up to 25 items at a time.",
    ),
});

/**
 * Type for writeSections parameters
 */
export type WriteSectionsParams = z.input<typeof writeSectionsSchema>;

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
  private readonly pendingSessions: Map<string, PendingSessionData> = new Map();
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
      lastRequestedRange: null,
      sectionFilepaths,
      remainingFilepaths: [...sectionFilepaths],
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
      ),
    };
  }

  /**
   * Show the source document for a session
   */
  async showSourceDocument(params: ShowSourceDocumentParams): Promise<Answer> {
    const { sessionToken, sourceDocumentRange } = params;

    // Check if session exists
    const session =
      this.sessions.get(sessionToken) ?? this.pendingSessions.get(sessionToken);
    if (!session) {
      return {
        isError: true,
        role: "assistant",
        message: "Error. Session does not exist or has already been finished.",
      };
    }

    if (sourceDocumentRange) {
      if (sourceDocumentRange === session.lastRequestedRange) {
        return {
          isError: true,
          role: "assistant",
          message: `Error. You have requested the same range of the source document immediately before. Please request a different range.`,
        };
      }

      session.lastRequestedRange = sourceDocumentRange;
    }

    // In a real implementation, we would filter the source document based on the range
    // For now, we'll just return the entire source document
    return {
      isError: false,
      role: "assistant",
      message: formatSourceDocumentResponse(
        session.sourceDocumentLines,
        sourceDocumentRange,
      ),
    };
  }

  /**
   * Write a section for a session
   */
  async writeSections(params: WriteSectionsParams): Promise<Answer> {
    const { sessionToken, sections } = params;

    // Check if session exists
    const session = this.sessions.get(sessionToken);
    if (!session) {
      if (this.pendingSessions.has(sessionToken)) {
        return {
          isError: true,
          role: "assistant",
          message: "Error. Session is not started yet.",
        };
      }

      return {
        isError: true,
        role: "assistant",
        message: "Error. Session does not exist or has already been finished.",
      };
    }

    for (const { filepath } of sections) {
      // Check if the filepath is already completed
      if (session.completedFilepaths.includes(filepath)) {
        return {
          isError: true,
          role: "assistant",
          message: formatErrorResponse(
            `The specified filepath ${JSON.stringify(filepath)} has already been completed.`,
            sessionToken,
            session.remainingFilepaths,
            session.completedFilepaths,
          ),
        };
      }

      // Check if the filepath is in the session
      if (!session.sectionFilepaths.includes(filepath)) {
        return {
          isError: true,
          role: "assistant",
          message: formatErrorResponse(
            `The specified filepath ${JSON.stringify(filepath)} is not part of the session.`,
            sessionToken,
            session.remainingFilepaths,
            session.completedFilepaths,
          ),
        };
      }
    }

    const contentsToWrite: {
      filepath: string;
      actualFilepath: string;
      content: string;
    }[] = [];

    for (const { filepath, tags, contentSpecifiers } of sections) {
      // In a real implementation, we would write the section to the file system
      // For now, we'll just mark it as completed
      if (!session.completedFilepaths.includes(filepath)) {
        session.completedFilepaths.push(filepath);
      }

      const actualFilepath = `${this.docsRoot}/${session.documentName}/${filepath.slice(session.commonPathPrefix.length)}`;

      const content = composeContent(
        contentSpecifiers,
        session.sourceDocumentLinesWithoutLineNumbers,
      );

      contentsToWrite.push({
        filepath,
        actualFilepath,
        content: `---\ntags: [${tags.map((tag) => JSON.stringify(tag)).join(", ")}]\nsource: ${JSON.stringify(session.documentSource)}\n---\n\n${content}`,
      });
    }

    for (const { actualFilepath, content } of contentsToWrite) {
      await fsp.mkdir(path.dirname(actualFilepath), { recursive: true });
      await fsp.writeFile(actualFilepath, content);
    }

    // Calculate remaining filepaths
    session.remainingFilepaths = session.remainingFilepaths.filter(
      (fp) => !session.completedFilepaths.includes(fp),
    );

    // Return formatted response
    return {
      isError: false,
      role: "assistant",
      message: formatWriteSectionsResponse(
        sessionToken,
        session.remainingFilepaths,
        session.completedFilepaths,
        contentsToWrite,
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
      if (this.pendingSessions.has(sessionToken)) {
        return {
          isError: true,
          role: "assistant",
          message: "Error. Session is not started yet.",
        };
      }

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
          session.remainingFilepaths,
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

    // Check if the document already exists
    if (fs.existsSync(`${this.docsRoot}/${documentName}`)) {
      return `Error. The document ${documentName} already exists.`;
    }

    // In a real implementation, we would load the source document from documentSource
    const sourceDocument = await fetchSourceDocument(documentSource);

    const sourceDocumentLines = sourceDocumentToLines(sourceDocument);

    // Store the pending session
    this.pendingSessions.set(sessionToken, {
      documentName,
      documentSource,
      sourceDocument,
      sourceDocumentLines,
      sourceDocumentLinesWithoutLineNumbers: sourceDocument.split("\n"),
      lastRequestedRange: null,
      timestamp: Date.now(),
    });

    // Generate the prompt
    return formatInitialPrompt(sessionToken, sourceDocumentLines);
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
