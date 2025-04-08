/**
 * Knowledge Structuring Session Manager
 */
import { z } from "zod";
import { formatEndSessionResponse, formatSessionStartResponse, formatSourceDocumentResponse, formatWriteSectionResponse } from "./format.js";

/**
 * Session data structure
 */
interface SessionData {
  documentName: string;
  documentSource: string;
  sourceDocument: string;
  sectionFilepaths: string[];
  completedFilepaths: string[];
  active: boolean;
}

/**
 * Input schema for starting a knowledge structuring session
 */
export const startSessionSchema = z.object({
  sessionToken: z.string().describe("The token for the session to be started provided in the prompt."),
  documentName: z.string().describe("The name of the document to be structured provided in the prompt."),
  documentSource: z.string().describe("The source of the document to be structured. This can be a URL or a file path."),
  sectionFilepaths: z.array(z.string()).describe("The files to be written in the session. This is a list of filepaths."),
});

/**
 * Type for startSession parameters
 */
export type StartSessionParams = z.input<typeof startSessionSchema>;

/**
 * Input schema for showing the source document
 */
export const showSourceDocumentSchema = z.object({
  sessionToken: z.string().describe("The token for the session to be started provided in the prompt."),
  sourceDocumentRange: z.string().describe("The lines of the source document to be shown. This can be a range like `L123-L456` or `all`."),
});

/**
 * Type for showSourceDocument parameters
 */
export type ShowSourceDocumentParams = z.input<typeof showSourceDocumentSchema>;

/**
 * Input schema for writing a section
 */
export const writeSectionSchema = z.object({
  sessionToken: z.string().describe("The token for the session to be started provided in the prompt."),
  sectionFilepath: z.string().describe("The filepath of the section to be written."),
  sectionTags: z.array(z.string()).describe("The tags to be assigned to the section. This is a list of tags in lower-kebab-case."),
  sectionContent: z.string().describe("The content of the section to be written. This is a markdown string."),
  showSourceDocument: z.boolean().default(false).describe("Whether to include the source document in the response."),
  sourceDocumentRange: z.string().optional().describe("The lines of the source document to be shown. This can be a range like `L123-L456` or `all`."),
});

/**
 * Type for writeSection parameters
 */
export type WriteSectionParams = z.input<typeof writeSectionSchema>;

/**
 * Input schema for ending a session
 */
export const endSessionSchema = z.object({
  sessionToken: z.string().describe("The token for the session to be started provided in the prompts."),
});

/**
 * Type for endSession parameters
 */
export type EndSessionParams = z.input<typeof endSessionSchema>;

/**
 * Knowledge Structuring Session Manager
 */
export class KnowledgeStructuringSessionManager {
  private sessions: Map<string, SessionData> = new Map();
  private docsRoot: string;

  constructor(docsRoot: string) {
    this.docsRoot = docsRoot;
  }

  /**
   * Start a new knowledge structuring session
   */
  async startSession(params: StartSessionParams): Promise<string> {
    const { sessionToken, documentName, documentSource, sectionFilepaths } = params;

    // Check if session already exists
    if (this.sessions.has(sessionToken)) {
      throw new Error("Session already exists");
    }

    // Create a new session
    const sessionData: SessionData = {
      documentName,
      documentSource,
      sourceDocument: "<!-- Source Document -->", // In a real implementation, this would be loaded from documentSource
      sectionFilepaths,
      completedFilepaths: [],
      active: true,
    };

    // Store the session
    this.sessions.set(sessionToken, sessionData);

    // Return formatted response
    return formatSessionStartResponse(
      sessionToken,
      sectionFilepaths,
      sessionData.sourceDocument
    );
  }

  /**
   * Show the source document for a session
   */
  async showSourceDocument(params: ShowSourceDocumentParams): Promise<string> {
    const { sessionToken, sourceDocumentRange } = params;

    // Check if session exists
    const session = this.sessions.get(sessionToken);
    if (!session) {
      throw new Error("Session does not exist");
    }

    // Check if session is active
    if (!session.active) {
      throw new Error("Session is not active");
    }

    // In a real implementation, we would filter the source document based on the range
    // For now, we'll just return the entire source document
    return formatSourceDocumentResponse(session.sourceDocument);
  }

  /**
   * Write a section for a session
   */
  async writeSection(params: WriteSectionParams): Promise<string> {
    const { 
      sessionToken, 
      sectionFilepath, 
      sectionTags, 
      sectionContent, 
      showSourceDocument,
      sourceDocumentRange 
    } = params;

    // Check if session exists
    const session = this.sessions.get(sessionToken);
    if (!session) {
      throw new Error("Session does not exist");
    }

    // Check if session is active
    if (!session.active) {
      throw new Error("Session is not active");
    }

    // Check if the filepath is in the session
    if (!session.sectionFilepaths.includes(sectionFilepath)) {
      return formatWriteSectionResponse(
        sessionToken,
        session.sectionFilepaths,
        session.completedFilepaths,
        undefined,
        true,
        "The specified filepath is not in the session."
      );
    }

    // Check if the filepath is already completed
    if (session.completedFilepaths.includes(sectionFilepath)) {
      return formatWriteSectionResponse(
        sessionToken,
        session.sectionFilepaths.filter(fp => !session.completedFilepaths.includes(fp)),
        session.completedFilepaths,
        undefined,
        true,
        "The specified filepath is already completed."
      );
    }

    // In a real implementation, we would write the section to the file system
    // For now, we'll just mark it as completed
    session.completedFilepaths.push(sectionFilepath);

    // Calculate remaining filepaths
    const remainingFilepaths = session.sectionFilepaths.filter(
      (fp) => !session.completedFilepaths.includes(fp)
    );

    // Determine if we should include the source document in the response
    let sourceDoc: string | undefined;
    if (showSourceDocument) {
      // In a real implementation, we would filter the source document based on the range
      sourceDoc = session.sourceDocument;
    }

    // Return formatted response
    return formatWriteSectionResponse(
      sessionToken,
      remainingFilepaths,
      session.completedFilepaths,
      sourceDoc
    );
  }

  /**
   * End a knowledge structuring session
   */
  async endSession(params: EndSessionParams): Promise<string> {
    const { sessionToken } = params;

    // Check if session exists
    const session = this.sessions.get(sessionToken);
    if (!session) {
      return formatEndSessionResponse([], true, "The session does not exist or has already been finished.");
    }

    // Check if session is active
    if (!session.active) {
      return formatEndSessionResponse([], true, "The session does not exist or has already been finished.");
    }

    // Check if all sections are completed
    const remainingFilepaths = session.sectionFilepaths.filter(
      (fp) => !session.completedFilepaths.includes(fp)
    );

    if (remainingFilepaths.length > 0) {
      return formatEndSessionResponse(
        session.completedFilepaths,
        true,
        "Some files are not written yet. Call `knowledgeStructuringSession.writeSection` to write the remaining files.",
        remainingFilepaths,
        sessionToken
      );
    }

    // Mark session as inactive
    session.active = false;

    // Return formatted response
    return formatEndSessionResponse(session.completedFilepaths);
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
  }
}
