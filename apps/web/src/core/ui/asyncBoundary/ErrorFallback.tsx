'use client';

import type { ErrorFallbackProps } from './ErrorBoundary';

import { getErrorMessage } from '@/core/error/messages';
import { isHttpError } from '@/core/http';
import { Button } from '@/core/ui/button';
import { Show } from '@/core/ui/wrapper';

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
    <div className="flex-col-center gap-6 p-layout">
      <div className="text-center">
        <h2 className="mb-3 font-title-20">{title}</h2>
        <p className="text-gray-5">{description}</p>
      </div>

      <Button
        onClick={reset}
        color="blue"
        size="md"
      >
        {action}
      </Button>

      <Show when={process.env.NODE_ENV === 'development'}>
        <details className="mt-4 w-full max-w-2xl">
          <summary
            className={`
              cursor-pointer font-caption-14 text-gray-5 animated-100
              hover:text-gray-8
            `}
          >
            에러 상세 정보
          </summary>
          <pre className="mt-3 overflow-auto rounded-xl bg-gray-1 p-4 font-body-12">
            {isHttpError(error)
              ? JSON.stringify(error, null, 2)
              : error instanceof Error
                ? error.message
                : String(error)}
          </pre>
        </details>
      </Show>
    </div>
  );
}
