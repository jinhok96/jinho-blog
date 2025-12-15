/**
 * Utility function to convert RouteObject to URL string
 */
export type RouteObject<S extends Record<string, string> = Record<string, string>, H extends string = string> = {
    pathname: never;
    params?: Record<string, string>;
    search?: S;
    hash?: H;
};
/**
 * Convert RouteObject to URL string
 *
 * @example
 * routes({
 *   pathname: '/blog/[slug]',
 *   params: { slug: 'hello' },
 *   search: { page: '1' },
 *   hash: 'section-1'
 * }) // returns '/blog/hello?page=1#section-1'
 */
export declare function routes<S extends Record<string, string> = Record<string, string>, H extends string = string>(route: RouteObject<S, H>): string;
