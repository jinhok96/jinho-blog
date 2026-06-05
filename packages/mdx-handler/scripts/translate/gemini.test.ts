import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  FatalGeminiError,
  callGeminiWithRetry,
  extractAndReplaceLinkUrls,
  extractRetryDelay,
  restoreLinkUrls,
  translateWithGemini,
} from './gemini.js';

const mockGenerateContent = vi.fn();

const mockGenAI = {
  models: {
    generateContent: mockGenerateContent,
  },
} as never;

describe('extractRetryDelay', () => {
  it('retryDelay 문자열에서 밀리초 파싱', () => {
    const error = {
      errorDetails: [
        {
          '@type': 'type.googleapis.com/google.rpc.RetryInfo',
          retryDelay: '10s',
        },
      ],
    };
    expect(extractRetryDelay(error)).toBe(11000);
  });

  it('retryDelay 소수점 처리 (ceil)', () => {
    const error = {
      errorDetails: [
        {
          '@type': 'type.googleapis.com/google.rpc.RetryInfo',
          retryDelay: '5.3s',
        },
      ],
    };
    expect(extractRetryDelay(error)).toBe(7000);
  });

  it('errorDetails 없으면 15000 반환', () => {
    expect(extractRetryDelay({})).toBe(15000);
  });

  it('RetryInfo 타입이 없으면 15000 반환', () => {
    const error = {
      errorDetails: [{ '@type': 'other.type', retryDelay: '10s' }],
    };
    expect(extractRetryDelay(error)).toBe(15000);
  });

  it('retryDelay 파싱 불가 (NaN)이면 15000 반환', () => {
    const error = {
      errorDetails: [
        {
          '@type': 'type.googleapis.com/google.rpc.RetryInfo',
          retryDelay: 'invalid',
        },
      ],
    };
    expect(extractRetryDelay(error)).toBe(15000);
  });

  it('null/undefined 에러 객체는 15000 반환', () => {
    expect(extractRetryDelay(null)).toBe(15000);
    expect(extractRetryDelay(undefined)).toBe(15000);
    expect(extractRetryDelay('string')).toBe(15000);
  });
});

describe('callGeminiWithRetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('성공 시 텍스트 반환', async () => {
    mockGenerateContent.mockResolvedValue({ text: 'Generated text' });

    const result = await callGeminiWithRetry(mockGenAI, 'prompt');

    expect(result).toBe('Generated text');
  });

  it('result.text가 undefined면 null 반환', async () => {
    mockGenerateContent.mockResolvedValue({ text: undefined });

    const result = await callGeminiWithRetry(mockGenAI, 'prompt');

    expect(result).toBeNull();
  });

  it('429 → 재시도 후 성공', async () => {
    const rateLimitError = { status: 429, message: 'Rate limit exceeded' };
    mockGenerateContent.mockRejectedValueOnce(rateLimitError).mockResolvedValue({ text: 'Success' });

    const promise = callGeminiWithRetry(mockGenAI, 'prompt');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe('Success');
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
  });

  it('429 spending cap → FatalGeminiError throw', async () => {
    const error = { status: 429, message: 'You have exceeded your spending cap' };
    mockGenerateContent.mockRejectedValue(error);

    await expect(callGeminiWithRetry(mockGenAI, 'prompt')).rejects.toBeInstanceOf(FatalGeminiError);
  });

  it('404 → FatalGeminiError throw', async () => {
    const error = { status: 404, message: 'Not found' };
    mockGenerateContent.mockRejectedValue(error);

    await expect(callGeminiWithRetry(mockGenAI, 'prompt')).rejects.toBeInstanceOf(FatalGeminiError);
  });

  it('401 → FatalGeminiError throw', async () => {
    const error = { status: 401, message: 'Unauthorized' };
    mockGenerateContent.mockRejectedValue(error);

    await expect(callGeminiWithRetry(mockGenAI, 'prompt')).rejects.toBeInstanceOf(FatalGeminiError);
  });

  it('403 → FatalGeminiError throw', async () => {
    const error = { status: 403, message: 'Forbidden' };
    mockGenerateContent.mockRejectedValue(error);

    await expect(callGeminiWithRetry(mockGenAI, 'prompt')).rejects.toBeInstanceOf(FatalGeminiError);
  });

  it('MAX_RETRIES(3) 초과 후 null 반환', async () => {
    // 429이지만 모든 시도에서 계속 실패 → MAX_RETRIES 번 호출 후 null
    mockGenerateContent.mockRejectedValue({ status: 429, message: 'Rate limit exceeded' });

    const promise = callGeminiWithRetry(mockGenAI, 'prompt');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBeNull();
    expect(mockGenerateContent).toHaveBeenCalledTimes(3);
  });
});

describe('extractAndReplaceLinkUrls', () => {
  it('일반 링크 URL을 플레이스홀더로 치환', () => {
    const { processed, urls } = extractAndReplaceLinkUrls('[docs](https://example.com/docs)');
    expect(processed).toBe('[docs](__URL_0__)');
    expect(urls).toEqual(['https://example.com/docs']);
  });

  it('이미지 링크 URL을 플레이스홀더로 치환', () => {
    const { processed, urls } = extractAndReplaceLinkUrls('![alt](https://example.com/img.webp)');
    expect(processed).toBe('![alt](__URL_0__)');
    expect(urls).toEqual(['https://example.com/img.webp']);
  });

  it('일반 링크와 이미지 링크를 순서대로 인덱싱', () => {
    const input = '[link](https://a.com) ![img](https://b.com/img.webp)';
    const { processed, urls } = extractAndReplaceLinkUrls(input);
    expect(processed).toBe('[link](__URL_0__) ![img](__URL_1__)');
    expect(urls).toEqual(['https://a.com', 'https://b.com/img.webp']);
  });

  it('링크 없으면 원본 그대로 반환, urls 빈 배열', () => {
    const { processed, urls } = extractAndReplaceLinkUrls('텍스트만 있는 콘텐츠');
    expect(processed).toBe('텍스트만 있는 콘텐츠');
    expect(urls).toEqual([]);
  });

  it('상대 경로는 치환하지 않음', () => {
    const { processed, urls } = extractAndReplaceLinkUrls('![img](./local.webp)');
    expect(processed).toBe('![img](./local.webp)');
    expect(urls).toEqual([]);
  });
});

describe('restoreLinkUrls', () => {
  it('플레이스홀더를 원본 URL로 복원', () => {
    const urls = ['https://example.com/docs'];
    expect(restoreLinkUrls('[문서](__URL_0__)', urls)).toBe('[문서](https://example.com/docs)');
  });

  it('여러 플레이스홀더를 인덱스 순서대로 복원', () => {
    const urls = ['https://a.com', 'https://b.com/img.webp'];
    const input = '[링크](__URL_0__) ![이미지](__URL_1__)';
    expect(restoreLinkUrls(input, urls)).toBe('[링크](https://a.com) ![이미지](https://b.com/img.webp)');
  });

  it('인덱스 범위 초과 플레이스홀더는 그대로 유지', () => {
    const urls = ['https://a.com'];
    expect(restoreLinkUrls('[링크](__URL_1__)', urls)).toBe('[링크](__URL_1__)');
  });
});

describe('translateWithGemini', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  const validResponse = `TITLE: React 컴파일러 소개
DESCRIPTION: React 컴파일러의 동작 방식과 최적화 기법
BODY:
## 개요

React 컴파일러는 자동으로 최적화합니다.`;

  it('올바른 형식의 응답 파싱', async () => {
    mockGenerateContent.mockResolvedValue({ text: validResponse });

    const result = await translateWithGemini(mockGenAI, 'content', 'React Compiler', 'React Blog');

    expect(result).toEqual({
      title: 'React 컴파일러 소개',
      description: 'React 컴파일러의 동작 방식과 최적화 기법',
      body: '## 개요\n\nReact 컴파일러는 자동으로 최적화합니다.',
    });
  });

  it('DESCRIPTION 없어도 빈 문자열로 반환', async () => {
    const noDesc = `TITLE: 제목
BODY:
본문`;
    mockGenerateContent.mockResolvedValue({ text: noDesc });

    const result = await translateWithGemini(mockGenAI, 'content', 'Title', 'Source');

    expect(result!.description).toBe('');
  });

  it('TITLE 없으면 null 반환', async () => {
    const noTitle = `DESCRIPTION: 설명
BODY:
본문`;
    mockGenerateContent.mockResolvedValue({ text: noTitle });

    const result = await translateWithGemini(mockGenAI, 'content', 'Title', 'Source');

    expect(result).toBeNull();
  });

  it('BODY 없으면 null 반환', async () => {
    const noBody = `TITLE: 제목
DESCRIPTION: 설명`;
    mockGenerateContent.mockResolvedValue({ text: noBody });

    const result = await translateWithGemini(mockGenAI, 'content', 'Title', 'Source');

    expect(result).toBeNull();
  });

  it('callGeminiWithRetry가 null이면 null 반환', async () => {
    mockGenerateContent.mockResolvedValue({ text: undefined });

    const result = await translateWithGemini(mockGenAI, 'content', 'Title', 'Source');

    expect(result).toBeNull();
  });

  it('FatalGeminiError는 그대로 throw', async () => {
    mockGenerateContent.mockRejectedValue({ status: 401, message: 'Unauthorized' });

    await expect(translateWithGemini(mockGenAI, 'content', 'Title', 'Source')).rejects.toBeInstanceOf(
      FatalGeminiError,
    );
  });

  it('링크 URL을 플레이스홀더로 치환하여 Gemini에 전달하고 결과를 복원', async () => {
    mockGenerateContent.mockResolvedValue({
      text: `TITLE: 제목\nDESCRIPTION: 설명\nBODY:\n[문서](__URL_0__) ![스크린샷](__URL_1__)`,
    });

    const content = '[docs](https://example.com/docs) ![screenshot](https://example.com/img.webp)';
    const result = await translateWithGemini(mockGenAI, content, 'Title', 'Source');

    expect(result!.body).toBe('[문서](https://example.com/docs) ![스크린샷](https://example.com/img.webp)');

    const calledPrompt = mockGenerateContent.mock.calls[0][0].contents as string;
    expect(calledPrompt).toContain('__URL_0__');
    expect(calledPrompt).not.toContain('https://example.com/docs');
  });

  it('mode가 summary면 요약 프롬프트 사용 (결과 파싱은 동일)', async () => {
    mockGenerateContent.mockResolvedValue({ text: validResponse });

    const result = await translateWithGemini(mockGenAI, 'content', 'React Compiler', 'Next.js Blog', 'summary');

    expect(result).toEqual({
      title: 'React 컴파일러 소개',
      description: 'React 컴파일러의 동작 방식과 최적화 기법',
      body: '## 개요\n\nReact 컴파일러는 자동으로 최적화합니다.',
    });
    // 프롬프트에 요약 규칙 키워드가 포함됐는지 확인
    const calledPrompt = mockGenerateContent.mock.calls[0][0].contents as string;
    expect(calledPrompt).toContain('15% 이내로 압축');
  });
});
