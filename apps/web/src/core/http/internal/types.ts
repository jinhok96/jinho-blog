import type { ErrorCode, ErrorResponse } from '@jinho-blog/shared';

export type FetchWithTimeoutOptions = RequestInit & {
  timeout?: number;
};

export type FetchWithRetryOptions = FetchWithTimeoutOptions & {
  retry?: number;
};

export type HttpOptions = Omit<FetchWithRetryOptions, 'method'> & {
  responseType?: 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text';
};

export type HttpResponseDefault =
  | Record<string, unknown>
  | Array<unknown>
  | ArrayBuffer
  | Blob
  | FormData
  | boolean
  | number
  | string
  | null
  | undefined;

export type HttpResponse<T extends HttpResponseDefault> = T;

export type HttpClient = {
  get: <T extends HttpResponseDefault>(url: string | URL | Request, options?: HttpOptions) => Promise<HttpResponse<T>>;
  post: <T extends HttpResponseDefault>(url: string | URL | Request, options?: HttpOptions) => Promise<HttpResponse<T>>;
  put: <T extends HttpResponseDefault>(url: string | URL | Request, options?: HttpOptions) => Promise<HttpResponse<T>>;
  patch: <T extends HttpResponseDefault>(
    url: string | URL | Request,
    options?: HttpOptions,
  ) => Promise<HttpResponse<T>>;
  del: <T extends HttpResponseDefault>(url: string | URL | Request, options?: HttpOptions) => Promise<HttpResponse<T>>;
};

export type Http = (baseUrl?: string, defaultOptions?: HttpOptions | undefined) => HttpClient;

/**
 * HTTP 에러 클래스
 * 백엔드에서 반환된 에러 코드를 포함
 */
export class HttpError extends Error {
  constructor(
    public code: ErrorCode,
    public status: number,
    public details?: Record<string, unknown> | string,
    public timestamp?: string,
  ) {
    super(`HTTP Error: ${code}`);
    this.name = 'HttpError';
    this.timestamp = new Date().toISOString();
  }

  static fromResponse(
    errorResponse: ErrorResponse,
    status: number,
    details?: Record<string, unknown> | string,
  ): HttpError {
    return new HttpError(errorResponse.error.code, status, details, errorResponse.error.timestamp);
  }
}

/**
 * HttpError 타입 가드
 */
export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}
