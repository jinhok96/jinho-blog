/**
 * Route interface representing a parsed route
 */
export interface Route {
    pathname: string;
    isDynamic: boolean;
    params: string[];
}
/**
 * Options for route processing
 */
interface RouteProcessingOptions {
    directory: string;
    pageExtensions: string[];
}
/**
 * Get routes from App Router directory
 */
export declare function getAppRoutes(files: string[], opts: RouteProcessingOptions): string[];
/**
 * Get routes from Pages Router directory
 */
export declare function getPageRoutes(files: string[], opts: RouteProcessingOptions): string[];
/**
 * Extract dynamic parameters from a pathname
 * [slug] -> ['slug']
 * [slug]/[id] -> ['slug', 'id']
 */
export declare function extractParams(pathname: string): string[];
/**
 * Parse pathnames into Route objects
 */
export declare function parseRoutes(pathnames: string[]): Route[];
/**
 * Generate TypeScript type declarations from routes
 */
export declare function generateTypeDeclaration(routes: Route[]): string;
/**
 * Write type declaration file to disk
 */
export declare function writeTypeFile(content: string, outputPath: string): void;
/**
 * Main function to generate Next.js routes type declarations
 */
export interface GenerateRoutesOptions {
    dir: string;
    outDir?: string;
    pageExtensions?: string[];
}
export declare function generateNextJSRoutes(options: GenerateRoutesOptions): {
    routesFound: number;
    staticCount: number;
    dynamicCount: number;
    outputPath: string;
};
export {};
