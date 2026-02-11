import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('./core.js', async () => {
    const actual = await vi.importActual('./core.js');
    return {
        ...actual,
        generateNextJSRoutes: vi.fn(),
    };
});
import { generateNextJSRoutes } from './core.js';
import { generateRoutes, withRoutes } from './index.js';
const mockGenerateNextJSRoutes = vi.mocked(generateNextJSRoutes);
beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
});
afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});
describe('generateRoutes()', () => {
    it('성공 시 생성된 라우트 수를 console.log로 출력한다', () => {
        mockGenerateNextJSRoutes.mockReturnValue({
            routesFound: 5,
            staticCount: 3,
            dynamicCount: 2,
            outputPath: '/some/path',
        });
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
        generateRoutes('/my-dir');
        expect(consoleSpy).toHaveBeenCalledWith('[nextjs-routes] Generated types for 5 routes');
    });
    it('에러 시 console.error를 출력한다', () => {
        const error = new Error('Something went wrong');
        mockGenerateNextJSRoutes.mockImplementation(() => {
            throw error;
        });
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        generateRoutes('/my-dir');
        expect(consoleSpy).toHaveBeenCalledWith('[nextjs-routes] Error generating route types:', error);
    });
    it('dir 미입력 시 process.cwd()를 사용한다', () => {
        mockGenerateNextJSRoutes.mockReturnValue({
            routesFound: 0,
            staticCount: 0,
            dynamicCount: 0,
            outputPath: '',
        });
        vi.spyOn(console, 'log').mockImplementation(() => { });
        const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue('/cwd');
        generateRoutes();
        expect(mockGenerateNextJSRoutes).toHaveBeenCalledWith({ dir: '/cwd' });
        cwdSpy.mockRestore();
    });
    it('지정된 dir을 generateNextJSRoutes에 전달한다', () => {
        mockGenerateNextJSRoutes.mockReturnValue({
            routesFound: 0,
            staticCount: 0,
            dynamicCount: 0,
            outputPath: '',
        });
        vi.spyOn(console, 'log').mockImplementation(() => { });
        generateRoutes('/custom-dir');
        expect(mockGenerateNextJSRoutes).toHaveBeenCalledWith({ dir: '/custom-dir' });
    });
});
describe('withRoutes()', () => {
    it('전달받은 nextConfig를 그대로 반환한다', () => {
        const config = { reactStrictMode: true };
        const result = withRoutes(config);
        expect(result).toEqual(config);
    });
    it('빈 객체를 입력해도 빈 객체를 반환한다', () => {
        const result = withRoutes({});
        expect(result).toEqual({});
    });
    it('인자 없이 호출해도 빈 객체를 반환한다', () => {
        const result = withRoutes();
        expect(result).toEqual({});
    });
    it('setImmediate 실행 후 generateNextJSRoutes를 호출한다', () => {
        mockGenerateNextJSRoutes.mockReturnValue({
            routesFound: 0,
            staticCount: 0,
            dynamicCount: 0,
            outputPath: '',
        });
        vi.spyOn(console, 'log').mockImplementation(() => { });
        // withRoutes 호출 직후에는 generateNextJSRoutes가 호출되지 않아야 함
        withRoutes({});
        expect(mockGenerateNextJSRoutes).not.toHaveBeenCalled();
        // setImmediate 실행 후 generateNextJSRoutes가 호출되어야 함
        vi.runAllTimers();
        expect(mockGenerateNextJSRoutes).toHaveBeenCalledOnce();
    });
});
