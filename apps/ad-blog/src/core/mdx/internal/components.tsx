import type { HeadingLevel } from './heading';
import type { MDXComponents } from 'next-mdx-remote-client/rsc';
import type { ComponentPropsWithoutRef } from 'react';

import Link from 'next/link';

import { AdSlot } from '../../ads';
import { CONTENT_AD_COMPONENTS } from './contentAds';
import { resolveHeadingLevel } from './heading';
import { isVideoSrc, resolveImageSize } from './image';
import { isExternalHref, isInternalPageLink } from './link';

/**
 * 본문 제목: `#`만 h2로 바꿔 렌더링 (페이지 `<h1>`은 글 제목)
 */
function createHeading(level: HeadingLevel) {
  const Tag = `h${resolveHeadingLevel(level)}` as const;

  function MdxHeading(props: ComponentPropsWithoutRef<'h2'>) {
    return <Tag {...props} />;
  }

  MdxHeading.displayName = `MdxHeading${level}`;
  return MdxHeading;
}

/**
 * 링크
 * - 사이트 내부 페이지 → next/link (클라이언트 이동·프리페치), 내부 파일(/rss.xml 등) → 일반 `<a>`
 * - 외부 링크 → 새 탭 + `rel="noopener noreferrer"`, 스크린 리더에 새 탭 안내
 * - 앵커·mailto 등 → 일반 `<a>`
 */
function MdxLink({ href = '', children, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (isInternalPageLink(href)) {
    return (
      <Link
        href={href}
        {...props}
      >
        {children}
      </Link>
    );
  }

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
        <span className="sr-only"> (새 탭에서 열림)</span>
      </a>
    );
  }

  return (
    <a
      href={href}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * 이미지
 * - 로컬 이미지는 원본 크기를 width·height로 지정해 레이아웃 이동(CLS) 방지
 * - 크기를 알 수 없는 외부 이미지는 지연 로딩만 적용
 * - 이미지 문법으로 넣은 동영상은 `<video>`로 렌더링
 */
function MdxImage({ src, alt = '', title }: ComponentPropsWithoutRef<'img'>) {
  if (typeof src !== 'string' || !src) return null;

  if (isVideoSrc(src)) {
    return (
      <video
        src={src}
        title={title}
        aria-label={alt || undefined}
        controls
        playsInline
        preload="metadata"
        className="h-auto w-full rounded-lg"
      />
    );
  }

  const size = resolveImageSize(src);

  return (
    // 정적 export(최적화 로더 없음): 원본 파일을 그대로 쓰고 크기만 명시
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      title={title}
      width={size?.width}
      height={size?.height}
      loading="lazy"
      decoding="async"
      className="h-auto max-w-full rounded-lg"
    />
  );
}

/**
 * 표: 좁은 화면에서 가로 스크롤 (본문 레이아웃이 넘치지 않도록)
 */
function MdxTable(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="my-8 overflow-x-auto">
      <table
        {...props}
        className="my-0"
      />
    </div>
  );
}

/** `not-prose`: 본문 타이포그래피 스타일이 광고 영역에 적용되지 않도록 제외 */
const CONTENT_AD_CLASS_NAME = 'not-prose my-10';

function PostTopAd() {
  return (
    <AdSlot
      placement="postTop"
      className={CONTENT_AD_CLASS_NAME}
    />
  );
}

function InArticleAd() {
  return (
    <AdSlot
      placement="postMiddle"
      className={CONTENT_AD_CLASS_NAME}
    />
  );
}

/**
 * 본문 광고 컴포넌트 (`rehypeContentAds`가 삽입한 `<PostTopAd />`·`<InArticleAd />`)
 * - renderMdx의 `ads` 옵션일 때만 주입: 정적 페이지 MDX에 직접 써도 렌더링되지 않고 빌드 에러 (광고 금지 페이지 보호)
 */
export const contentAdComponents: MDXComponents = {
  [CONTENT_AD_COMPONENTS.top]: PostTopAd,
  [CONTENT_AD_COMPONENTS.middle]: InArticleAd,
};

export const mdxComponents: MDXComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  a: MdxLink,
  img: MdxImage,
  table: MdxTable,
};
