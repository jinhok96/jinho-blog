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
  S extends Record<string, string> = Record<string, string>,
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
  export function routes<S extends Record<string, string> = Record<string, string>, H extends string = string>(
    route: RouteObject<S, H>,
  ): string;
}
`;
}
/**
 * Generate next/link module override
 */
function generateLinkModuleOverride() {
    return `
declare module 'next/link' {
  import type { RouteObject } from '@jinho-blog/nextjs-routes';
  import type { LinkProps as NextLinkProps } from 'next/dist/client/link';
  import type { ReactElement } from 'react';

  // Extend LinkProps to support RouteObject
  interface LinkProps<S = Record<string, string>, H = string> extends Omit<NextLinkProps, 'href'> {
    href: string | NextLinkProps['href'] | RouteObject<S, H>;
  }

  const Link: <S = Record<string, string>, H = string>(props: LinkProps<S, H>) => ReactElement;

  export default Link;
}
`;
}
/**
 * Generate next/navigation module override
 */
function generateNavigationModuleOverride() {
    return `
declare module "next/navigation" {
  export * from 'next/dist/client/components/navigation';

  import type { DynamicPathname, PathParams, RouteObject } from '@jinho-blog/nextjs-routes';
  import type { AppRouterInstance as NextAppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

  // Get original types
  type RedirectType = "replace" | "push";
  type NavigateOptions = { scroll?: boolean };
  type PrefetchOptions = { kind?: "auto" | "full" | "temporary" };

  // redirect overloads
  export function redirect(path: string, type?: RedirectType): never;
  export function redirect<S = Record<string, string>, H = string>(
    route: RouteObject<S, H>,
    type?: RedirectType
  ): never;

  // permanentRedirect overloads
  export function permanentRedirect(path: string, type?: RedirectType): never;
  export function permanentRedirect<S = Record<string, string>, H = string>(
    route: RouteObject<S, H>,
    type?: RedirectType
  ): never;

  // useParams overloads
  export function useParams(): { [key: string]: string | string[] };
  export function useParams<P extends DynamicPathname>(): PathParams<P>;

  // usePathname overloads
  export function usePathname(): string;
  export function usePathname<S = Record<string, string>, H = string>(options: {
    isRouteObject: true;
  }): RouteObject<S, H>;

  // useRouter override
  type TypeSafeAppRouterInstance = Omit<NextAppRouterInstance, 'push' | 'replace' | 'prefetch'> & {
    push(href: string, options?: NavigateOptions): void;
    push<S = Record<string, string>, H = string>(
      route: RouteObject<S, H>,
      options?: NavigateOptions
    ): void;

    replace(href: string, options?: NavigateOptions): void;
    replace<S = Record<string, string>, H = string>(
      route: RouteObject<S, H>,
      options?: NavigateOptions
    ): void;

    prefetch(href: string, options?: PrefetchOptions): void;
    prefetch<S = Record<string, string>, H = string>(
      route: RouteObject<S, H>,
      options?: PrefetchOptions
    ): void;
  };

  export function useRouter(): TypeSafeAppRouterInstance;

  // useSearchParams overloads
  interface TypedURLSearchParams<S extends Record<string, string>> {
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
  export function useSearchParams<S extends Record<string, string>>(): TypedURLSearchParams<S>;
}
`;
}
/**
 * Generate next/router module override (Pages Router)
 */
function generateRouterModuleOverride() {
    return `
declare module "next/router" {
  export * from "next/dist/client/router";

  import type { RouteObject } from "@jinho-blog/nextjs-routes";
  import type { NextRouter as NextRouterType } from "next/dist/client/router";

  type TransitionOptions = {
    shallow?: boolean;
    locale?: string | false;
    scroll?: boolean;
  };

  // NextRouter extension
  type TypeSafeNextRouter = Omit<NextRouterType, 'push' | 'replace'> & {
    push(url: string, as?: string, options?: TransitionOptions): Promise<boolean>;
    push<S = Record<string, string>, H = string>(
      route: RouteObject<S, H>,
      as?: string,
      options?: TransitionOptions
    ): Promise<boolean>;

    replace(url: string, as?: string, options?: TransitionOptions): Promise<boolean>;
    replace<S = Record<string, string>, H = string>(
      route: RouteObject<S, H>,
      as?: string,
      options?: TransitionOptions
    ): Promise<boolean>;
  };

  export function useRouter(): TypeSafeNextRouter;
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
    // Link component override (always include)
    output += generateLinkModuleOverride();
    // App Router module override
    if (hasAppRouter) {
        output += generateNavigationModuleOverride();
    }
    // Pages Router module override
    if (hasPagesRouter) {
        output += generateRouterModuleOverride();
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
export type SearchParams<T = Record<string, string>> = T;

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
