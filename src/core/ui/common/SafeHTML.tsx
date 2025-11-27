import type { HTMLAttributes } from 'react';

type SafeHTMLProps = Omit<HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML'> & {
  html?: string;
};

/**
 * 안전하게 HTML을 렌더링하는 컴포넌트
 * 참고: 프로덕션에서는 DOMPurify를 사용하는 것이 좋습니다
 */
export function SafeHTML({ html, ...props }: SafeHTMLProps) {
  if (!html) return null;

  return (
    <div
      {...props}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
