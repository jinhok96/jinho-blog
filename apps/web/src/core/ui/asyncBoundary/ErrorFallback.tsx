'use client';

import type { ErrorFallbackProps } from './ErrorBoundary';

import { getErrorMessage } from '@/core/error/messages';
import { isHttpError } from '@/core/http';

/**
 * 에러 코드 기반 에러 UI 컴포넌트
 */
export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  const errorCode = isHttpError(error) ? error.code : null;
  const errorMessage = errorCode ? getErrorMessage(errorCode) : null;

  const title = errorMessage?.title || '오류가 발생했습니다';
  const description = errorMessage?.description || '일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
  const action = errorMessage?.action || '다시 시도';

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
      <div className="text-center">
        <h2
          className={`
            mb-2 text-2xl font-bold text-gray-900
            dark:text-gray-100
          `}
        >
          {title}
        </h2>
        <p
          className={`
            text-gray-600
            dark:text-gray-400
          `}
        >
          {description}
        </p>
      </div>

      <button
        onClick={reset}
        className={`
          rounded-md bg-blue-600 px-4 py-2 text-white transition-colors
          hover:bg-blue-700
          dark:bg-blue-500 dark:hover:bg-blue-600
        `}
      >
        {action}
      </button>

      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 w-full max-w-2xl">
          <summary
            className={`
              cursor-pointer text-sm text-gray-500
              dark:text-gray-400
            `}
          >
            에러 상세 정보
          </summary>
          <pre
            className={`
              mt-2 overflow-auto rounded-md bg-gray-100 p-4 text-xs
              dark:bg-gray-800
            `}
          >
            {isHttpError(error)
              ? JSON.stringify(
                  {
                    name: error.name,
                    code: error.code,
                    status: error.status,
                    details: error.details,
                    timestamp: error.timestamp,
                    message: error.message,
                  },
                  null,
                  2,
                )
              : error instanceof Error
                ? error.message
                : String(error)}
          </pre>
        </details>
      )}
    </div>
  );
}
