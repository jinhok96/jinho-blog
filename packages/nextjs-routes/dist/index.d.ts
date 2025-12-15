import type { NextConfig } from "next";
/**
 * Generates Next.js route types immediately
 */
export declare function generateRoutes(dir?: string): void;
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
export declare function withRoutes(nextConfig?: NextConfig): NextConfig;
export { generateNextJSRoutes } from "./core.js";
export type { Route, GenerateRoutesOptions } from "./core.js";
export { routes } from "./routes.js";
