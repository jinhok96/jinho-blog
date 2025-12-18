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
        // Filter out undefined and null values
        const filteredSearch = Object.fromEntries(Object.entries(route.search).filter(([_, value]) => value != null && value != undefined));
        const searchParams = new URLSearchParams(filteredSearch);
        const query = searchParams.toString();
        if (query)
            url += `?${searchParams.toString()}`;
    }
    // Add hash
    if (route.hash) {
        url += `#${route.hash}`;
    }
    return url;
}
