import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, parse, dirname } from 'path';
import { findFiles } from './utils.js';
/**
 * Convert Windows path to Unix-style path
 */
function convertWindowsPathToUnix(file) {
    return file.replace(/\\/g, '/');
}
/**
 * Common processing for all route files
 */
function commonProcessing(paths, opts) {
    return (paths
        // Filter page extensions
        .filter(file => {
        return opts.pageExtensions.some(ext => file.endsWith(ext));
    })
        // Remove file extensions (.tsx, .test.tsx)
        .map(file => file.replace(/(\.\w+)+$/, ''))
        // Remove duplicates from file extension removal (eg foo.ts and foo.test.ts)
        .filter((file, idx, array) => array.indexOf(file) === idx)
        // Remove page directory path
        .map(file => file.replace(opts.directory, ''))
        // Normalize paths from windows users
        .map(convertWindowsPathToUnix)
        // Exclude paths starting with underscore (_app, _document, _components, etc.)
        .filter(file => {
        const segments = file.split('/');
        return !segments.some(segment => segment.startsWith('_'));
    }));
}
/**
 * App Router specific route detection
 */
const APP_ROUTABLE_FILES = ['page', 'route'];
const APP_INTERCEPTING_ROUTE = ['(.)', '(..)', '(..)(..)', '(...)'];
function isAppDirectoryRoutable(file) {
    const name = parse(file).name;
    return (
    // Only consider page and route
    APP_ROUTABLE_FILES.includes(name) &&
        // Remove any filepaths that contain intercepts
        !APP_INTERCEPTING_ROUTE.some(intercept => file.includes(intercept)));
}
/**
 * Get routes from App Router directory
 */
export function getAppRoutes(files, opts) {
    return (commonProcessing(files, opts)
        .filter(isAppDirectoryRoutable)
        .map(file => 
    // Transform filepath to URL path
    file
        .split('/')
        // Remove route groups (group)
        .filter(segment => !(segment.startsWith('(') && segment.endsWith(')')))
        // Remove page + route from path
        .filter(segment => !APP_ROUTABLE_FILES.includes(parse(segment).name))
        // Remove parallel routes @modal
        .filter(segment => !segment.startsWith('@'))
        .join('/'))
        // Handle index page
        .map(file => (file === '' ? '/' : file)));
}
/**
 * Next.js non-routable special files
 */
const NEXTJS_NON_ROUTABLE = ['/middleware'];
/**
 * Get routes from Pages Router directory
 */
export function getPageRoutes(files, opts) {
    return (commonProcessing(files, opts)
        // Remove index if present (/foos/index.ts is the same as /foos.ts)
        .map(file => file.replace(/index$/, ''))
        // Remove trailing slash if present
        .map(file => (file.endsWith('/') && file.length > 2 ? file.slice(0, -1) : file))
        // Exclude Next.js special routes
        .filter(file => !NEXTJS_NON_ROUTABLE.includes(file))
        // Handle root index
        .map(file => (file === '' ? '/' : file)));
}
/**
 * Extract dynamic parameters from a pathname
 * [slug] -> ['slug']
 * [slug]/[id] -> ['slug', 'id']
 */
export function extractParams(pathname) {
    const DYNAMIC_SEGMENT_RE = /\[(.*?)\]/g;
    const matches = pathname.match(DYNAMIC_SEGMENT_RE);
    if (!matches) {
        return [];
    }
    return matches.map(match => match.replace(/\[/g, '').replace(/\]/g, '').replace('...', ''));
}
/**
 * Parse pathnames into Route objects
 */
export function parseRoutes(pathnames) {
    return pathnames.map(pathname => {
        const params = extractParams(pathname);
        return {
            pathname,
            isDynamic: params.length > 0,
            params,
        };
    });
}
/**
 * Generate RouteObject type declaration
 */
function generateRouteObjectType() {
    return `
/**
 * Route object for type-safe navigation
 * Supports both static and dynamic routes with optional search params and hash
 *
 * @example
 * // Static route
 * { pathname: '/blog', search: { page: '1' }, hash: 'section-1' }
 *
 * // Dynamic route
 * { pathname: '/blog/[slug]', params: { slug: 'hello' }, search: { page: '1' } }
 */
export type RouteObject<
  S extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>,
  H extends string = string
> =
  | {
      pathname: StaticPathname;
      search?: SearchParams<S>;
      hash?: HashParam<H>;
    }
  | {
      pathname: DynamicPathname;
      params: PathParams<DynamicPathname>;
      search?: SearchParams<S>;
      hash?: HashParam<H>;
    };
`;
}
/**
 * Generate @jinho-blog/nextjs-routes module override
 */
function generateNextJSRoutesModuleOverride() {
    return `
declare module '@jinho-blog/nextjs-routes' {
  export type { DynamicPathname, HashParam, Pathname, PathParams, RouteObject, SearchParams, StaticPathname };
  export function isRouteObject(value: unknown): value is RouteObject;
  export function routes<S extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>, H extends string = string>(
    route: RouteObject<S, H>,
  ): string;
}
`;
}
/**
 * Generate next/navigation module override
 */
function generateNavigationModuleOverride() {
    return `
declare module 'next/navigation' {
  export * from 'next/navigation';

  import type { DynamicPathname, PathParams } from '@jinho-blog/nextjs-routes';

  // useParams overloads
  export function useParams(): { [key: string]: string | string[] };
  export function useParams<P extends DynamicPathname>(): PathParams<P>;

  // useSearchParams overloads
  interface TypedURLSearchParams<S extends Record<string, string | string[] | undefined>> {
    get<K extends keyof S>(name: K): S[K] | null;
    getAll<K extends keyof S>(name: K): S[K][];
    has<K extends keyof S>(name: K): boolean;
    keys(): IterableIterator<keyof S>;
    values(): IterableIterator<S[keyof S]>;
    entries(): IterableIterator<[keyof S, S[keyof S]]>;
    forEach(callback: <K extends keyof S>(value: S[K], key: K) => void): void;
    [Symbol.iterator](): IterableIterator<[keyof S, S[keyof S]]>;
    readonly size: number;
  }

  export function useSearchParams(): ReadonlyURLSearchParams;
  export function useSearchParams<S extends Record<string, string | string[] | undefined>>(): TypedURLSearchParams<S>;
}
`;
}
/**
 * Generate module overrides based on router types used
 */
function generateModuleOverrides(hasAppRouter, hasPagesRouter) {
    let output = '';
    // nextjs-routes module override (always include)
    output += generateNextJSRoutesModuleOverride();
    // App Router module override
    if (hasAppRouter) {
        output += generateNavigationModuleOverride();
    }
    return output;
}
/**
 * Generate TypeScript type declarations from routes
 */
export function generateTypeDeclaration(routes) {
    const staticRoutes = routes.filter(r => !r.isDynamic);
    const dynamicRoutes = routes.filter(r => r.isDynamic);
    // Generate StaticPathname union type
    const staticPathnames = staticRoutes.length > 0 ? staticRoutes.map(r => `'${r.pathname}'`).join(' | ') : 'never';
    // Generate DynamicPathname union type
    const dynamicPathnames = dynamicRoutes.length > 0 ? dynamicRoutes.map(r => `'${r.pathname}'`).join(' | ') : 'never';
    // Generate PathParams conditional type
    let pathParamsType = 'export type PathParams<P extends DynamicPathname> =\n';
    if (dynamicRoutes.length > 0) {
        dynamicRoutes.forEach((route, index) => {
            const paramsObject = route.params.map(param => `${param}: string`).join('; ');
            pathParamsType += `  P extends '${route.pathname}' ? { ${paramsObject} } :\n`;
        });
        pathParamsType += '  never;\n';
    }
    else {
        pathParamsType += '  never;\n';
    }
    // Generate RouteObject type
    const routeObjectType = generateRouteObjectType();
    // Generate full type declaration file
    return `\
// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
// Generated by @jinho-blog/nextjs-routes

/**
 * Static route pathnames (no dynamic parameters)
 */
export type StaticPathname = ${staticPathnames};

/**
 * Dynamic route pathnames (with parameters like [slug])
 */
export type DynamicPathname = ${dynamicPathnames};

/**
 * All route pathnames
 */
export type Pathname = StaticPathname | DynamicPathname;

/**
 * Path parameters for dynamic routes
 * Maps each DynamicPathname to its required parameters
 *
 * @example
 * PathParams<'/blog/[slug]'> = { slug: string }
 * PathParams<'/blog/[slug]/[id]'> = { slug: string; id: string }
 */
${pathParamsType}
/**
 * Search/query parameters (customizable via generic)
 *
 * @example
 * SearchParams<{ page: string; limit: string }>
 */
export type SearchParams<T = Record<string, string | string[] | undefined>> = T;

/**
 * Hash parameter (customizable via generic)
 *
 * @example
 * HashParam<'section-1' | 'section-2'>
 */
export type HashParam<T = string> = T;
${routeObjectType}`;
}
/**
 * Write type declaration file to disk
 */
export function writeTypeFile(content, outputPath) {
    const dir = dirname(outputPath);
    // Ensure output directory exists
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
    writeFileSync(outputPath, content, 'utf-8');
}
export function generateNextJSRoutes(options) {
    const opts = {
        dir: options.dir,
        outDir: options.outDir ?? join(options.dir, '@types'),
        pageExtensions: options.pageExtensions ?? ['tsx', 'ts', 'jsx', 'js'],
    };
    const allPathnames = [];
    // Check for App Router
    const appDir = join(opts.dir, 'src', 'app');
    const appDirAlt = join(opts.dir, 'app');
    let hasAppRouter = false;
    if (existsSync(appDir)) {
        hasAppRouter = true;
        const files = findFiles(appDir);
        const routes = getAppRoutes(files, {
            directory: appDir,
            pageExtensions: opts.pageExtensions,
        });
        allPathnames.push(...routes);
    }
    else if (existsSync(appDirAlt)) {
        hasAppRouter = true;
        const files = findFiles(appDirAlt);
        const routes = getAppRoutes(files, {
            directory: appDirAlt,
            pageExtensions: opts.pageExtensions,
        });
        allPathnames.push(...routes);
    }
    // Check for Pages Router
    const pagesDir = join(opts.dir, 'src', 'pages');
    const pagesDirAlt = join(opts.dir, 'pages');
    let hasPagesRouter = false;
    if (existsSync(pagesDir)) {
        hasPagesRouter = true;
        const files = findFiles(pagesDir);
        const routes = getPageRoutes(files, {
            directory: pagesDir,
            pageExtensions: opts.pageExtensions,
        });
        allPathnames.push(...routes);
    }
    else if (existsSync(pagesDirAlt)) {
        hasPagesRouter = true;
        const files = findFiles(pagesDirAlt);
        const routes = getPageRoutes(files, {
            directory: pagesDirAlt,
            pageExtensions: opts.pageExtensions,
        });
        allPathnames.push(...routes);
    }
    // Remove duplicates and sort
    const uniquePathnames = [...new Set(allPathnames)].sort();
    // Parse routes
    const routes = parseRoutes(uniquePathnames);
    // Generate type declaration
    const typeDeclaration = generateTypeDeclaration(routes);
    // Generate module overrides
    const moduleOverrides = generateModuleOverrides(hasAppRouter, hasPagesRouter);
    // Combine type declaration and module overrides
    const fullContent = typeDeclaration + '\n' + moduleOverrides;
    // Write to file
    const outputPath = join(opts.outDir, 'nextjs-routes.d.ts');
    writeTypeFile(fullContent, outputPath);
    return {
        routesFound: routes.length,
        staticCount: routes.filter(r => !r.isDynamic).length,
        dynamicCount: routes.filter(r => r.isDynamic).length,
        outputPath,
    };
}
