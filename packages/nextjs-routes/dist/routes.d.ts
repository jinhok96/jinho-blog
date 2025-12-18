/**
 * Utility function to convert RouteObject to URL string
 */
export type RouteObject<S extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>, H extends string = string> = {
    pathname: never;
    params?: Record<string, string>;
    search?: S;
    hash?: H;
};
/**
 * Check if a value is a RouteObject
 */
export declare function isRouteObject<S extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>, H extends string = string>(value: unknown): value is RouteObject<S, H>;
/**
 * Convert RouteObject to URL string
 * null, undefined 필터링
 *
 * @example
 * routes({
 *   pathname: '/blog/[slug]',
 *   params: { slug: 'hello' },
 *   search: { page: '1' },
 *   hash: 'section-1'
 * }) // returns '/blog/hello?page=1#section-1'
 */
export declare function routes<S extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>, H extends string = string>(route: RouteObject<S, H>): string;
