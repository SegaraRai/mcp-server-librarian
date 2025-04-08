import fs from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { checkDocsRootExists, getConfig, LibrarianConfig } from "./config.js";

// Mock process.argv and process.env
const { getArgv, getEnv } = vi.hoisted(() => ({
  getArgv: vi.fn(() => ["node", "script.js"]),
  getEnv: vi.fn(() => ({})),
}));

vi.mock("node:process", () => ({
  get argv() {
    return getArgv();
  },
  get env() {
    return getEnv();
  },
  get default() {
    return {
      get argv() {
        return getArgv();
      },
      get env() {
        return getEnv();
      },
    };
  },
}));

// Mock fs functions
vi.mock("node:fs", () => {
  const existsSyncMock = vi.fn();
  const mkdirSyncMock = vi.fn();
  
  return {
    existsSync: existsSyncMock,
    mkdirSync: mkdirSyncMock,
    default: {
      existsSync: existsSyncMock,
      mkdirSync: mkdirSyncMock,
    },
  };
});

// Reset mocks after each test
afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllEnvs();
});

describe("getConfig", () => {
  it("should use command line arguments when provided", () => {
    // Setup command line arguments
    getArgv.mockReturnValue([
      "node",
      "script.js",
      "--docs-root",
      "/custom/docs/path",
    ]);

    const config = getConfig();
    expect(config.docsRoot).toBe("/custom/docs/path");
  });

  it("should use environment variable when command line arguments are not provided", () => {
    // Setup environment variable
    getEnv.mockReturnValue({
      LIBRARIAN_DOCS_ROOT: "/env/docs/path",
    });

    const config = getConfig();
    expect(config.docsRoot).toBe("/env/docs/path");
  });

  it("should use default path when neither command line arguments nor environment variable are provided", () => {
    const config = getConfig();
    expect(config.docsRoot).toBe("./docs");
  });
});

describe("checkDocsRootExists", () => {
  it("should do nothing if the directory exists", () => {
    // Mock fs.existsSync to return true
    vi.mocked(fs.existsSync).mockReturnValue(true);

    const config: LibrarianConfig = {
      docsRoot: "/existing/path",
      enableWriteOperations: true,
    };
    expect(() => checkDocsRootExists(config)).not.toThrow();

    // Verify existsSync was called
    expect(fs.existsSync).toHaveBeenCalledWith("/existing/path");
  });

  it("should throw an error if the directory does not exist", () => {
    // Mock fs.existsSync to return false
    vi.mocked(fs.existsSync).mockReturnValue(false);

    const config: LibrarianConfig = {
      docsRoot: "/non-existing/path",
      enableWriteOperations: true,
    };
    expect(() => checkDocsRootExists(config)).toThrow(
      "Docs root directory does not exist: /non-existing/path"
    );

    // Verify existsSync was called
    expect(fs.existsSync).toHaveBeenCalledWith("/non-existing/path");
  });
});
