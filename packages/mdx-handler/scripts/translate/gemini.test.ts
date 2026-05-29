import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  FatalGeminiError,
  callGeminiWithRetry,
  extractRetryDelay,
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
});
