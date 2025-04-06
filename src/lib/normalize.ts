/**
 * Utility functions for path normalization
 */

/**
 * Ensure a path has a leading slash
 * @param path The path to normalize
 * @returns The normalized path with a leading slash
 */
export function normalizePath(path: string): string {
  return `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}`;
}
