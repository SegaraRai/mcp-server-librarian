import { describe, it, expect, vi, afterEach } from 'vitest';
import { getConfig, ensureDocsRoot, LibrarianConfig } from './config.js';
import * as fs from 'fs';
import * as path from 'path';

// Mock process.argv and process.env
vi.mock('process', () => ({
  argv: ['node', 'script.js'],
  env: {}
}));

// Mock fs functions
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  mkdirSync: vi.fn()
}));

// Reset mocks after each test
afterEach(() => {
  vi.resetAllMocks();
  process.argv = ['node', 'script.js'];
  process.env = {};
});

describe('getConfig', () => {
  it('should use command line arguments when provided', () => {
    // Setup command line arguments
    process.argv = ['node', 'script.js', '--docs-root', '/custom/docs/path'];
    
    const config = getConfig();
    expect(config.docsRoot).toBe('/custom/docs/path');
  });
  
  it('should use environment variable when command line arguments are not provided', () => {
    // Setup environment variable
    process.env.LIBRARIAN_DOCS_ROOT = '/env/docs/path';
    
    const config = getConfig();
    expect(config.docsRoot).toBe('/env/docs/path');
  });
  
  it('should use default path when neither command line arguments nor environment variable are provided', () => {
    const config = getConfig();
    expect(config.docsRoot).toBe('./docs');
  });
});

describe('ensureDocsRoot', () => {
  it('should do nothing if the directory exists', () => {
    // Mock fs.existsSync to return true
    vi.mocked(fs.existsSync).mockReturnValue(true);
    
    const config: LibrarianConfig = { docsRoot: '/existing/path' };
    ensureDocsRoot(config);
    
    // Verify existsSync was called
    expect(fs.existsSync).toHaveBeenCalledWith('/existing/path');
    
    // Verify mkdirSync was not called
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });
  
  it('should create the directory if it does not exist', () => {
    // Mock fs.existsSync to return false
    vi.mocked(fs.existsSync).mockReturnValue(false);
    
    const config: LibrarianConfig = { docsRoot: '/non-existing/path' };
    ensureDocsRoot(config);
    
    // Verify existsSync was called
    expect(fs.existsSync).toHaveBeenCalledWith('/non-existing/path');
    
    // Verify mkdirSync was called with the correct arguments
    expect(fs.mkdirSync).toHaveBeenCalledWith('/non-existing/path', { recursive: true });
  });
});
