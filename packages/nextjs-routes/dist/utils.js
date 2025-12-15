import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
/**
 * Find a directory in the current working directory or src subdirectory
 */
function findDir(cwd, dir) {
    const paths = [join(cwd, dir), join(cwd, "src", dir)];
    for (const path of paths) {
        if (existsSync(path)) {
            return path;
        }
    }
}
/**
 * Get the pages directory path (Pages Router)
 */
export function getPagesDirectory(cwd) {
    return findDir(cwd, "pages");
}
/**
 * Get the app directory path (App Router)
 */
export function getAppDirectory(cwd) {
    return findDir(cwd, "app");
}
/**
 * Recursively find all files in a directory
 * Excludes node_modules
 */
export function findFiles(entry) {
    return readdirSync(entry).flatMap((file) => {
        const filepath = join(entry, file);
        // Exclude node_modules
        if (filepath.includes("node_modules")) {
            return [];
        }
        // Recursively search directories
        if (statSync(filepath).isDirectory()) {
            return findFiles(filepath);
        }
        return filepath;
    });
}
/**
 * Type guard to filter out undefined values
 */
export function isNotUndefined(value) {
    return value !== undefined;
}
