import { NextResponse } from 'next/server';

import { ERROR_MESSAGES, ERROR_STATUS_MAP, type ErrorCode, type ErrorResponse } from '@jinho-blog/shared';

/**
 * API 에러 클래스
 * 에러 코드와 추가 세부 정보를 포함
 */
export class ApiError extends Error {
  constructor(
    public code: ErrorCode,
    public details?: Record<string, unknown>,
  ) {
    super(ERROR_MESSAGES[code]);
    this.name = 'ApiError';
  }
}

/**
 * 표준화된 에러 응답 생성
 */
export function createErrorResponse(code: ErrorCode, details?: Record<string, unknown>): NextResponse<ErrorResponse> {
  const status = ERROR_STATUS_MAP[code];
  const message = ERROR_MESSAGES[code];

  return NextResponse.json(
    {
      error: {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
      },
    },
    { status },
  );
}

/**
 * ApiError 타입 가드
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * 에러 로깅 유틸리티
 * 향후 Sentry 등 모니터링 서비스 통합 가능
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  console.error('[API Error]', {
    error: isApiError(error)
      ? {
          code: error.code,
          message: error.message,
          details: error.details,
        }
      : error,
    context,
    timestamp: new Date().toISOString(),
  });
}
