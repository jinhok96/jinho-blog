import type {
  FetchWithRetryOptions,
  FetchWithTimeoutOptions,
  Http,
  HttpOptions,
  HttpResponse,
  HttpResponseDefault,
} from '@/core/http/internal/types';
import type { ErrorResponse } from '@jinho-blog/shared';

import { ERROR_CODES } from '@jinho-blog/shared';

import {
  HTTP_DEFAULT_BASE_URL,
  HTTP_DEFAULT_RETRY,
  HTTP_DEFAULT_REVALIDATE_TIME,
  HTTP_DEFAULT_TIMEOUT,
} from '@/core/http/internal/config';
import { HttpError } from '@/core/http/internal/types';

/**
 * 타임아웃이 적용된 fetch
 * @param url
 * @param options timeout 기본값: 10초
 */
async function fetchWithTimeout(url: string | URL | Request, options: FetchWithTimeoutOptions): Promise<Response> {
  const { timeout = HTTP_DEFAULT_TIMEOUT, signal: externalSignal, ...fetchOptions } = options;

  const timeoutSignal = AbortSignal.timeout(timeout);
  const signal = externalSignal ? AbortSignal.any([externalSignal, timeoutSignal]) : timeoutSignal;

  try {
    const response = await fetch(url, { ...fetchOptions, signal });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError')
      console.error(`FetchWithTimeout(타임아웃: ${timeout / 1000}초)`);
    else if (signal.aborted) console.error(`FetchWithTimeout(취소 요청됨)`, error);
    else console.error('FetchWithTimeout(기타)', error);

    throw error;
  }
}

/**
 * 재시도, 타임아웃이 적용된 fetch
 * @param url
 * @param options retry 기본값: 3
 */
async function fetchWithRetry(url: string | URL | Request, options: FetchWithRetryOptions): Promise<Response> {
  const { retry = HTTP_DEFAULT_RETRY, ...fetchOptions } = options;

  for (let i = 1; i <= retry; i++) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions);
      return response;
    } catch (error) {
      console.error(`FetchWithRetry(시도: ${i}/${retry})`);
      if (i === retry) throw error;
    }
  }

  throw new Error('FetchWithRetry 실패');
}

export const http: Http = (baseUrl: string = HTTP_DEFAULT_BASE_URL, defaultOptions?: HttpOptions) => {
  const getUrl = (url: string | URL | Request): string | URL | Request => {
    if (url instanceof URL) return url;
    if (url instanceof Request) return url;
    return `${baseUrl}${url}`;
  };

  const getOptions = (options?: HttpOptions): HttpOptions => {
    return { ...defaultOptions, ...options };
  };

  const getTagFromUrl = (url: string | URL | Request): string => {
    if (url instanceof URL) return url.href;
    if (url instanceof Request) return url.url;
    return url;
  };

  const resolveResponse = async <T extends HttpResponseDefault>(
    response: Response,
    responseType?: HttpOptions['responseType'],
  ): Promise<HttpResponse<T>> => {
    // 에러 응답 처리
    if (!response.ok) {
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        try {
          const errorData = (await response.json()) as ErrorResponse;
          throw HttpError.fromResponse(errorData, response.status);
        } catch (error) {
          // JSON 파싱 실패 시 기본 에러
          if (error instanceof HttpError) throw error;
          throw new HttpError(ERROR_CODES.INTERNAL_SERVER_ERROR, response.status);
        }
      }

      // JSON이 아닌 경우 기본 에러
      throw new HttpError(ERROR_CODES.INTERNAL_SERVER_ERROR, response.status);
    }

    // 정상 응답 처리
    switch (responseType) {
      case 'arrayBuffer':
        return response.arrayBuffer() as Promise<T>;
      case 'blob':
        return response.blob() as Promise<T>;
      case 'formData':
        return response.formData() as Promise<T>;
      case 'json':
        return response.json() as Promise<T>;
      case 'text':
        return response.text() as Promise<T>;
      default:
        return response.json() as Promise<T>;
    }
  };

  // GET
  const get = async <T extends HttpResponseDefault>(
    url: string | URL | Request,
    options?: HttpOptions,
  ): Promise<HttpResponse<T>> => {
    const fullUrl = getUrl(url);
    const { responseType, ...restOptions } = getOptions(options);
    const revalidate = options?.next?.revalidate || HTTP_DEFAULT_REVALIDATE_TIME; // GET 요청 기본 10분 캐싱
    const defaultTag = getTagFromUrl(url);
    const tags = options?.next?.tags || [defaultTag];

    const response = await fetchWithRetry(fullUrl, {
      ...restOptions,
      method: 'GET',
      next: { revalidate, tags },
    });
    return resolveResponse<T>(response, responseType);
  };

  // POST
  const post = async <T extends HttpResponseDefault>(
    url: string | URL | Request,
    options?: HttpOptions,
  ): Promise<HttpResponse<T>> => {
    const fullUrl = getUrl(url);
    const { responseType, ...restOptions } = getOptions(options);

    const response = await fetchWithRetry(fullUrl, { ...restOptions, method: 'POST' });
    return resolveResponse<T>(response, responseType);
  };

  // PUT
  const put = async <T extends HttpResponseDefault>(
    url: string | URL | Request,
    options?: HttpOptions,
  ): Promise<HttpResponse<T>> => {
    const fullUrl = getUrl(url);
    const { responseType, ...restOptions } = getOptions(options);

    const response = await fetchWithRetry(fullUrl, { ...restOptions, method: 'PUT' });
    return resolveResponse<T>(response, responseType);
  };

  // PATCH
  const patch = async <T extends HttpResponseDefault>(
    url: string | URL | Request,
    options?: HttpOptions,
  ): Promise<HttpResponse<T>> => {
    const fullUrl = getUrl(url);
    const { responseType, ...restOptions } = getOptions(options);

    const response = await fetchWithRetry(fullUrl, { ...restOptions, method: 'PATCH' });
    return resolveResponse<T>(response, responseType);
  };

  // DELETE
  const del = async <T extends HttpResponseDefault>(
    url: string | URL | Request,
    options?: HttpOptions,
  ): Promise<HttpResponse<T>> => {
    const fullUrl = getUrl(url);
    const { responseType, ...restOptions } = getOptions(options);

    const response = await fetchWithRetry(fullUrl, { ...restOptions, method: 'DELETE' });
    return resolveResponse<T>(response, responseType);
  };

  return { get, post, put, patch, del };
};
