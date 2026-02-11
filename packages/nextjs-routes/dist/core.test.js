import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('fs', () => ({
    existsSync: vi.fn(),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
}));
vi.mock('./utils.js', async () => {
    const actual = await vi.importActual('./utils.js');
    return { ...actual, findFiles: vi.fn() };
});
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { extractParams, generateNextJSRoutes, generateTypeDeclaration, getAppRoutes, getPageRoutes, parseRoutes, writeTypeFile, } from './core.js';
import { findFiles } from './utils.js';
const mockExistsSync = vi.mocked(existsSync);
const mockWriteFileSync = vi.mocked(writeFileSync);
const mockMkdirSync = vi.mocked(mkdirSync);
const mockFindFiles = vi.mocked(findFiles);
beforeEach(() => {
    vi.clearAllMocks();
    mockExistsSync.mockReturnValue(false);
});
afterEach(() => {
    vi.restoreAllMocks();
});
const DEFAULT_EXTENSIONS = ['tsx', 'ts', 'jsx', 'js'];
describe('getAppRoutes()', () => {
    const opts = { directory: '/app', pageExtensions: DEFAULT_EXTENSIONS };
    it('파일이 없으면 빈 배열을 반환한다', () => {
        expect(getAppRoutes([], opts)).toEqual([]);
    });
    it('루트 page.tsx를 /로 변환한다', () => {
        expect(getAppRoutes(['/app/page.tsx'], opts)).toEqual(['/']);
    });
    it('중첩 page.tsx를 변환한다', () => {
        expect(getAppRoutes(['/app/blog/page.tsx'], opts)).toEqual(['/blog']);
    });
    it('동적 세그먼트를 유지한다', () => {
        expect(getAppRoutes(['/app/blog/[slug]/page.tsx'], opts)).toEqual(['/blog/[slug]']);
    });
    it('route.ts(API route)를 포함한다', () => {
        expect(getAppRoutes(['/app/api/route.ts'], opts)).toEqual(['/api']);
    });
    it('loading.tsx를 제외한다', () => {
        expect(getAppRoutes(['/app/loading.tsx'], opts)).toEqual([]);
    });
    it('layout.tsx를 제외한다', () => {
        expect(getAppRoutes(['/app/layout.tsx'], opts)).toEqual([]);
    });
    it('error.tsx를 제외한다', () => {
        expect(getAppRoutes(['/app/error.tsx'], opts)).toEqual([]);
    });
    it('라우트 그룹 (group)을 경로에서 제거한다', () => {
        expect(getAppRoutes(['/app/(marketing)/about/page.tsx'], opts)).toEqual(['/about']);
    });
    it('라우트 그룹이 루트인 경우 /로 처리한다', () => {
        expect(getAppRoutes(['/app/(group)/page.tsx'], opts)).toEqual(['/']);
    });
    it('@slot 병렬 라우트 세그먼트를 제거하여 부모 경로로 처리한다', () => {
        // @modal은 병렬 slot — 세그먼트가 제거되어 부모 경로(/)가 됨
        expect(getAppRoutes(['/app/@modal/page.tsx'], opts)).toEqual(['/']);
    });
    it('@slot 병렬 라우트가 중첩된 경우 부모 경로를 반환한다', () => {
        expect(getAppRoutes(['/app/blog/@modal/page.tsx'], opts)).toEqual(['/blog']);
    });
    it('인터셉트 라우트 (.)를 제외한다', () => {
        expect(getAppRoutes(['/app/feed/(.)photo/page.tsx'], opts)).toEqual([]);
    });
    it('인터셉트 라우트 (..)를 제외한다', () => {
        expect(getAppRoutes(['/app/feed/(..)/photo/page.tsx'], opts)).toEqual([]);
    });
    it('인터셉트 라우트 (...)를 제외한다', () => {
        expect(getAppRoutes(['/app/(...)photo/page.tsx'], opts)).toEqual([]);
    });
    it('언더스코어로 시작하는 세그먼트를 제외한다', () => {
        expect(getAppRoutes(['/app/_components/page.tsx'], opts)).toEqual([]);
    });
    it('pageExtensions에 없는 확장자를 무시한다', () => {
        expect(getAppRoutes(['/app/page.mdx'], opts)).toEqual([]);
    });
    it('커스텀 pageExtensions를 지원한다', () => {
        const customOpts = { directory: '/app', pageExtensions: ['tsx', 'ts', 'mdx'] };
        expect(getAppRoutes(['/app/blog/page.mdx'], customOpts)).toEqual(['/blog']);
    });
    it('Windows 경로(백슬래시)를 Unix 경로로 변환한다', () => {
        const winOpts = { directory: '\\app', pageExtensions: DEFAULT_EXTENSIONS };
        expect(getAppRoutes(['\\app\\blog\\page.tsx'], winOpts)).toEqual(['/blog']);
    });
});
describe('getPageRoutes()', () => {
    const opts = { directory: '/pages', pageExtensions: DEFAULT_EXTENSIONS };
    it('파일이 없으면 빈 배열을 반환한다', () => {
        expect(getPageRoutes([], opts)).toEqual([]);
    });
    it('index.tsx를 /로 변환한다', () => {
        expect(getPageRoutes(['/pages/index.tsx'], opts)).toEqual(['/']);
    });
    it('about.tsx를 /about으로 변환한다', () => {
        expect(getPageRoutes(['/pages/about.tsx'], opts)).toEqual(['/about']);
    });
    it('blog/index.tsx를 /blog로 변환한다', () => {
        expect(getPageRoutes(['/pages/blog/index.tsx'], opts)).toEqual(['/blog']);
    });
    it('동적 세그먼트를 유지한다', () => {
        expect(getPageRoutes(['/pages/blog/[slug].tsx'], opts)).toEqual(['/blog/[slug]']);
    });
    it('404.tsx를 포함한다', () => {
        expect(getPageRoutes(['/pages/404.tsx'], opts)).toEqual(['/404']);
    });
    it('catch-all 라우트를 포함한다', () => {
        expect(getPageRoutes(['/pages/[...slug].tsx'], opts)).toEqual(['/[...slug]']);
    });
    it('optional catch-all 라우트를 포함한다', () => {
        expect(getPageRoutes(['/pages/[[...slug]].tsx'], opts)).toEqual(['/[[...slug]]']);
    });
    it('middleware.ts를 제외한다', () => {
        expect(getPageRoutes(['/pages/middleware.ts'], opts)).toEqual([]);
    });
    it('_app.tsx를 제외한다', () => {
        expect(getPageRoutes(['/pages/_app.tsx'], opts)).toEqual([]);
    });
    it('_document.tsx를 제외한다', () => {
        expect(getPageRoutes(['/pages/_document.tsx'], opts)).toEqual([]);
    });
    it('Windows 경로(백슬래시)를 Unix 경로로 변환한다', () => {
        const winOpts = { directory: '\\pages', pageExtensions: DEFAULT_EXTENSIONS };
        expect(getPageRoutes(['\\pages\\about.tsx'], winOpts)).toEqual(['/about']);
    });
});
describe('extractParams()', () => {
    it('정적 경로는 빈 배열을 반환한다', () => {
        expect(extractParams('/about')).toEqual([]);
    });
    it('루트 경로는 빈 배열을 반환한다', () => {
        expect(extractParams('/')).toEqual([]);
    });
    it('[slug] 파라미터를 추출한다', () => {
        expect(extractParams('/blog/[slug]')).toEqual(['slug']);
    });
    it('다중 파라미터를 추출한다', () => {
        expect(extractParams('/[category]/[slug]')).toEqual(['category', 'slug']);
    });
    it('[...segments] catch-all에서 ...를 제거한다', () => {
        expect(extractParams('/[...segments]')).toEqual(['segments']);
    });
    it('[[...slug]] optional catch-all에서 ...를 제거한다', () => {
        expect(extractParams('/[[...slug]]')).toEqual(['slug']);
    });
});
describe('parseRoutes()', () => {
    it('정적 경로를 isDynamic: false로 파싱한다', () => {
        const result = parseRoutes(['/about']);
        expect(result).toEqual([{ pathname: '/about', isDynamic: false, params: [] }]);
    });
    it('동적 경로를 isDynamic: true로 파싱한다', () => {
        const result = parseRoutes(['/blog/[slug]']);
        expect(result).toEqual([{ pathname: '/blog/[slug]', isDynamic: true, params: ['slug'] }]);
    });
    it('여러 경로를 파싱한다', () => {
        const result = parseRoutes(['/', '/about', '/blog/[slug]']);
        expect(result).toEqual([
            { pathname: '/', isDynamic: false, params: [] },
            { pathname: '/about', isDynamic: false, params: [] },
            { pathname: '/blog/[slug]', isDynamic: true, params: ['slug'] },
        ]);
    });
    it('빈 배열을 입력하면 빈 배열을 반환한다', () => {
        expect(parseRoutes([])).toEqual([]);
    });
});
describe('generateTypeDeclaration()', () => {
    it('라우트가 없으면 두 타입 모두 never를 생성한다', () => {
        const result = generateTypeDeclaration([]);
        expect(result).toContain('StaticPathname = never');
        expect(result).toContain('DynamicPathname = never');
    });
    it('정적 라우트만 있을 때 StaticPathname union을 생성한다', () => {
        const routes = [
            { pathname: '/', isDynamic: false, params: [] },
            { pathname: '/about', isDynamic: false, params: [] },
        ];
        const result = generateTypeDeclaration(routes);
        expect(result).toContain("StaticPathname = '/' | '/about'");
        expect(result).toContain('DynamicPathname = never');
    });
    it('동적 라우트만 있을 때 DynamicPathname union을 생성한다', () => {
        const routes = [{ pathname: '/blog/[slug]', isDynamic: true, params: ['slug'] }];
        const result = generateTypeDeclaration(routes);
        expect(result).toContain("DynamicPathname = '/blog/[slug]'");
        expect(result).toContain('StaticPathname = never');
    });
    it('동적 라우트의 PathParams 조건부 타입을 생성한다', () => {
        const routes = [{ pathname: '/blog/[slug]', isDynamic: true, params: ['slug'] }];
        const result = generateTypeDeclaration(routes);
        expect(result).toContain("P extends '/blog/[slug]' ? { slug: string }");
    });
    it('다중 params를 가진 PathParams를 생성한다', () => {
        const routes = [
            { pathname: '/[category]/[slug]', isDynamic: true, params: ['category', 'slug'] },
        ];
        const result = generateTypeDeclaration(routes);
        expect(result).toContain('category: string; slug: string');
    });
    it('정적/동적 혼합 라우트를 처리한다', () => {
        const routes = [
            { pathname: '/', isDynamic: false, params: [] },
            { pathname: '/blog/[slug]', isDynamic: true, params: ['slug'] },
        ];
        const result = generateTypeDeclaration(routes);
        expect(result).toContain("StaticPathname = '/'");
        expect(result).toContain("DynamicPathname = '/blog/[slug]'");
    });
    it('자동 생성 파일 헤더를 포함한다', () => {
        const result = generateTypeDeclaration([]);
        expect(result).toContain('THIS IS AN AUTOGENERATED FILE');
    });
    it('Pathname 타입을 포함한다', () => {
        const result = generateTypeDeclaration([]);
        expect(result).toContain('Pathname = StaticPathname | DynamicPathname');
    });
});
describe('writeTypeFile()', () => {
    it('파일을 지정 경로에 쓴다', () => {
        mockExistsSync.mockReturnValue(true);
        writeTypeFile('content', '/out/nextjs-routes.d.ts');
        expect(mockWriteFileSync).toHaveBeenCalledWith('/out/nextjs-routes.d.ts', 'content', 'utf-8');
    });
    it('디렉토리가 없으면 mkdirSync로 생성한다', () => {
        mockExistsSync.mockReturnValue(false);
        writeTypeFile('content', '/out/nextjs-routes.d.ts');
        expect(mockMkdirSync).toHaveBeenCalledWith('/out', { recursive: true });
    });
    it('디렉토리가 있으면 mkdirSync를 호출하지 않는다', () => {
        mockExistsSync.mockReturnValue(true);
        writeTypeFile('content', '/out/nextjs-routes.d.ts');
        expect(mockMkdirSync).not.toHaveBeenCalled();
    });
});
describe('generateNextJSRoutes()', () => {
    it('App Router 디렉토리가 없으면 라우트를 생성하지 않는다', () => {
        mockExistsSync.mockReturnValue(false);
        const result = generateNextJSRoutes({ dir: '/project' });
        expect(result.routesFound).toBe(0);
        expect(result.staticCount).toBe(0);
        expect(result.dynamicCount).toBe(0);
    });
    it('src/app 디렉토리에서 App Router 라우트를 수집한다', () => {
        mockExistsSync.mockImplementation(p => p === join('/project', 'src', 'app'));
        mockFindFiles.mockReturnValue([join('/project', 'src', 'app', 'page.tsx')]);
        const result = generateNextJSRoutes({ dir: '/project' });
        expect(result.routesFound).toBe(1);
        expect(result.staticCount).toBe(1);
        expect(result.dynamicCount).toBe(0);
    });
    it('app 디렉토리에서 App Router 라우트를 수집한다', () => {
        mockExistsSync.mockImplementation(p => p === join('/project', 'app'));
        mockFindFiles.mockReturnValue([
            join('/project', 'app', 'page.tsx'),
            join('/project', 'app', 'blog', '[slug]', 'page.tsx'),
        ]);
        const result = generateNextJSRoutes({ dir: '/project' });
        expect(result.routesFound).toBe(2);
        expect(result.staticCount).toBe(1);
        expect(result.dynamicCount).toBe(1);
    });
    it('pages 디렉토리에서 Pages Router 라우트를 수집한다', () => {
        mockExistsSync.mockImplementation(p => p === join('/project', 'pages'));
        mockFindFiles.mockReturnValue([
            join('/project', 'pages', 'index.tsx'),
            join('/project', 'pages', 'about.tsx'),
        ]);
        const result = generateNextJSRoutes({ dir: '/project' });
        expect(result.routesFound).toBe(2);
        expect(result.staticCount).toBe(2);
        expect(result.dynamicCount).toBe(0);
    });
    it('생성된 파일 경로를 반환한다', () => {
        mockExistsSync.mockReturnValue(false);
        const result = generateNextJSRoutes({ dir: '/project' });
        expect(result.outputPath).toBe(join('/project', '@types', 'nextjs-routes.d.ts'));
    });
    it('커스텀 outDir을 사용한다', () => {
        mockExistsSync.mockReturnValue(false);
        const result = generateNextJSRoutes({ dir: '/project', outDir: '/project/custom-types' });
        expect(result.outputPath).toBe(join('/project/custom-types', 'nextjs-routes.d.ts'));
    });
    it('타입 파일을 디스크에 기록한다', () => {
        mockExistsSync.mockReturnValue(false);
        generateNextJSRoutes({ dir: '/project' });
        expect(mockWriteFileSync).toHaveBeenCalledOnce();
        const [path, content] = mockWriteFileSync.mock.calls[0];
        expect(String(path)).toContain('nextjs-routes.d.ts');
        expect(String(content)).toContain('THIS IS AN AUTOGENERATED FILE');
    });
    it('App Router가 있으면 next/navigation module override를 포함한다', () => {
        mockExistsSync.mockImplementation(p => p === join('/project', 'app'));
        mockFindFiles.mockReturnValue([join('/project', 'app', 'page.tsx')]);
        generateNextJSRoutes({ dir: '/project' });
        const content = String(mockWriteFileSync.mock.calls[0][1]);
        expect(content).toContain("declare module 'next/navigation'");
    });
    it('Pages Router만 있으면 next/navigation module override를 포함하지 않는다', () => {
        mockExistsSync.mockImplementation(p => p === join('/project', 'pages'));
        mockFindFiles.mockReturnValue([join('/project', 'pages', 'index.tsx')]);
        generateNextJSRoutes({ dir: '/project' });
        const content = String(mockWriteFileSync.mock.calls[0][1]);
        expect(content).not.toContain("declare module 'next/navigation'");
    });
    it('@jinho-blog/nextjs-routes module override를 항상 포함한다', () => {
        mockExistsSync.mockReturnValue(false);
        generateNextJSRoutes({ dir: '/project' });
        const content = String(mockWriteFileSync.mock.calls[0][1]);
        expect(content).toContain("declare module '@jinho-blog/nextjs-routes'");
    });
});
