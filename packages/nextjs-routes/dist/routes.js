/**
 * Utility function to convert RouteObject to URL string
 */
/**
 * Check if a value is a RouteObject
 */
export function isRouteObject(value) {
    return (typeof value === 'object' && value !== null && 'pathname' in value && typeof value.pathname === 'string');
}
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
export function routes(route) {
    let url = route.pathname;
    // Replace dynamic parameters
    if ('params' in route && route.params) {
        Object.entries(route.params).forEach(([key, value]) => {
            url = url.replace(`[${key}]`, String(value));
        });
    }
    // Add search params
    if (route.search && Object.keys(route.search).length > 0) {
        const searchParams = new URLSearchParams(route.search);
        url += `?${searchParams.toString()}`;
    }
    // Add hash
    if (route.hash) {
        url += `#${route.hash}`;
    }
    return url;
}
