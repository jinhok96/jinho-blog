import type { TocItem } from '@/core/mdx';

import { cn } from '@/core/utils';

/** 가장 얕은 제목 대비 들여쓰기 (목차는 `#`~`###`, 최대 2단계 차이) */
const INDENT_CLASS_NAME = ['', 'pl-4', 'pl-8'] as const;

/** 제목이 이보다 적으면 목차를 표시하지 않음 */
const MIN_ITEMS = 2;

type Props = {
  toc: TocItem[];
  className?: string;
};

/**
 * 본문 목차 (앵커 링크만 사용 — JS 없음)
 */
export function Toc({ toc, className }: Props) {
  if (toc.length < MIN_ITEMS) return null;

  const minDepth = Math.min(...toc.map(item => item.depth));

  return (
    <nav
      aria-label="목차"
      className={cn(
        `
          rounded-lg border border-border bg-surface p-4
          sm:p-5
        `,
        className,
      )}
    >
      <p className="text-sm font-semibold">목차</p>
      <ol className="mt-2 text-sm">
        {toc.map(item => (
          <li
            key={item.href}
            className={INDENT_CLASS_NAME[Math.min(item.depth - minDepth, INDENT_CLASS_NAME.length - 1)]}
          >
            <a
              href={item.href}
              className={`
                inline-block py-1 text-muted underline-offset-4
                hover:text-foreground hover:underline
              `}
            >
              {item.value}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
