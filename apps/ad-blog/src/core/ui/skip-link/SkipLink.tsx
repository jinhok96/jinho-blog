type Props = {
  /** 본문 영역 앵커 (예: '#main-content') */
  href: string;
};

/**
 * 본문 바로가기 (키보드 포커스 시에만 표시)
 */
export function SkipLink({ href }: Props) {
  return (
    <a
      href={href}
      className={`
        sr-only
        focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-foreground
        focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-background
      `}
    >
      본문 바로가기
    </a>
  );
}
