/**
 * Utility function to convert RouteObject to URL string
 */
/**
 * Check if a value is a RouteObject
 */
export function isRouteObject(value) {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const obj = value;
    const allowedKeys = new Set(['pathname', 'params', 'search', 'hash']);
    // Check for unexpected keys
    if (!Object.keys(obj).every(key => allowedKeys.has(key))) {
        return false;
    }
    // pathname is required and must be a string
    if (!('pathname' in obj) || typeof obj.pathname !== 'string') {
        return false;
    }
    // params is optional, but if present must be Record<string, string>
    if ('params' in obj && obj.params !== undefined) {
        if (typeof obj.params !== 'object' || obj.params === null || Array.isArray(obj.params)) {
            return false;
        }
        if (!Object.values(obj.params).every(v => typeof v === 'string')) {
            return false;
        }
    }
    // search is optional, but if present must be Record<string, string | string[] | undefined>
    if ('search' in obj && obj.search !== undefined) {
        if (typeof obj.search !== 'object' || obj.search === null || Array.isArray(obj.search)) {
            return false;
        }
        if (!Object.values(obj.search).every(v => v === undefined || typeof v === 'string' || (Array.isArray(v) && v.every(item => typeof item === 'string')))) {
            return false;
        }
    }
    // hash is optional, but if present must be a string
    if ('hash' in obj && obj.hash !== undefined) {
        if (typeof obj.hash !== 'string') {
            return false;
        }
    }
    return true;
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
