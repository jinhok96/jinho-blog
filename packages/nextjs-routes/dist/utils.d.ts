/**
 * Get the pages directory path (Pages Router)
 */
export declare function getPagesDirectory(cwd: string): string | undefined;
/**
 * Get the app directory path (App Router)
 */
export declare function getAppDirectory(cwd: string): string | undefined;
/**
 * Recursively find all files in a directory
 * Excludes node_modules
 */
export declare function findFiles(entry: string): string[];
/**
 * Type guard to filter out undefined values
 */
export declare function isNotUndefined<T>(value: T | undefined): value is T;
