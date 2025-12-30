// HTTP 레벨 에러 (4xx, 5xx)
export const HTTP_ERROR_CODES = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  TIMEOUT: 'TIMEOUT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

// 비즈니스 로직 에러 - 콘텐츠 관련
export const CONTENT_ERROR_CODES = {
  POST_NOT_FOUND: 'POST_NOT_FOUND',
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
  LIBRARY_NOT_FOUND: 'LIBRARY_NOT_FOUND',
  INVALID_CATEGORY: 'INVALID_CATEGORY',
  INVALID_SLUG: 'INVALID_SLUG',
} as const;

// 비즈니스 로직 에러 - 유효성 검증
export const VALIDATION_ERROR_CODES = {
  INVALID_PAGINATION: 'INVALID_PAGINATION',
  INVALID_SORT_OPTION: 'INVALID_SORT_OPTION',
  INVALID_SEARCH_QUERY: 'INVALID_SEARCH_QUERY',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
} as const;

// 통합 에러 코드
export const ERROR_CODES = {
  ...HTTP_ERROR_CODES,
  ...CONTENT_ERROR_CODES,
  ...VALIDATION_ERROR_CODES,
} as const;

// 타입 정의
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
export type HttpErrorCode = (typeof HTTP_ERROR_CODES)[keyof typeof HTTP_ERROR_CODES];
export type ContentErrorCode = (typeof CONTENT_ERROR_CODES)[keyof typeof CONTENT_ERROR_CODES];
export type ValidationErrorCode = (typeof VALIDATION_ERROR_CODES)[keyof typeof VALIDATION_ERROR_CODES];

// 에러 응답 타입
export type ErrorResponse = {
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
    timestamp?: string;
  };
};

// HTTP 상태 코드 매핑
export const ERROR_STATUS_MAP: Record<ErrorCode, number> = {
  // HTTP 에러
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  TIMEOUT: 408,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,

  // 비즈니스 로직 에러 (404)
  POST_NOT_FOUND: 404,
  PROJECT_NOT_FOUND: 404,
  LIBRARY_NOT_FOUND: 404,

  // 유효성 검증 에러 (400)
  INVALID_CATEGORY: 400,
  INVALID_SLUG: 400,
  INVALID_PAGINATION: 400,
  INVALID_SORT_OPTION: 400,
  INVALID_SEARCH_QUERY: 400,
  MISSING_REQUIRED_FIELD: 400,
} as const;

// 기본 에러 메시지 (영문)
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // HTTP 에러
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Resource not found',
  METHOD_NOT_ALLOWED: 'Method not allowed',
  TIMEOUT: 'Request timeout',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service unavailable',

  // 비즈니스 로직 에러
  POST_NOT_FOUND: 'Blog post not found',
  PROJECT_NOT_FOUND: 'Project not found',
  LIBRARY_NOT_FOUND: 'Library not found',
  INVALID_CATEGORY: 'Invalid category',
  INVALID_SLUG: 'Invalid slug format',

  // 유효성 검증 에러
  INVALID_PAGINATION: 'Invalid pagination parameters',
  INVALID_SORT_OPTION: 'Invalid sort option',
  INVALID_SEARCH_QUERY: 'Invalid search query',
  MISSING_REQUIRED_FIELD: 'Missing required field',
} as const;
