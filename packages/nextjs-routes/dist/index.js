import { generateNextJSRoutes } from "./core.js";
/**
 * Generates Next.js route types immediately
 */
export function generateRoutes(dir = process.cwd()) {
    try {
        const result = generateNextJSRoutes({ dir });
        console.log(`[nextjs-routes] Generated types for ${result.routesFound} routes`);
    }
    catch (error) {
        console.error("[nextjs-routes] Error generating route types:", error);
    }
}
/**
 * Wraps Next.js config to automatically generate route types
 * Usage in next.config.ts:
 *
 * import { withRoutes } from '@jinho-blog/nextjs-routes';
 *
 * export default withRoutes({
 *   // your Next.js config
 * });
 */
export function withRoutes(nextConfig = {}) {
    // Generate routes on config load
    const dir = process.cwd();
    // Run generation in background to not block config loading
    setImmediate(() => {
        generateRoutes(dir);
    });
    return nextConfig;
}
// Re-export core functionality for programmatic usage
export { generateNextJSRoutes } from "./core.js";
