import type { Metadata } from 'next';

import {
  AUTHOR_NAME,
  DEFAULT_OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_DESCRIPTION,
  SITE_INDEXABLE,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
} from '../../config';
import { absoluteUrl } from './url';

export type OgImage = {
  /** 사이트 경로 또는 절대 URL */
  url: string;
  width?: number;
  height?: number;
};

export type BuildMetadataParams = {
  /** 사이트 루트 기준 경로 (예: '/', '/posts/slug') — canonical·og:url */
  path: string;
  /** 페이지 제목. 루트 레이아웃 템플릿(`%s | 사이트 이름`)이 적용됨. 미지정 시 사이트 이름 */
  title?: string;
  /** true면 템플릿 없이 title 그대로 사용 (홈 등) */
  absoluteTitle?: boolean;
  description?: string;
  type?: 'website' | 'article';
  image?: OgImage;
  /** 글 발행일·수정일 (ISO 8601, type: 'article'일 때 사용) */
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  /** 검색 결과에서 제외 (링크는 따라감) */
  noindex?: boolean;
};

/** 기본 OG 이미지 (1200x630) */
export const DEFAULT_OG: OgImage = { url: DEFAULT_OG_IMAGE, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT };

/**
 * 글의 OG 이미지 선택
 * - ogImage(빌드 시 생성한 1200x630 JPEG) → thumbnail(크기 미상) → 기본 OG 이미지
 */
export function selectOgImage({ ogImage, thumbnail }: { ogImage?: string; thumbnail?: string }): OgImage {
  if (ogImage) return { url: ogImage, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT };
  if (thumbnail) return { url: thumbnail };
  return DEFAULT_OG;
}

const INDEX_ROBOTS: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

const NOINDEX_ROBOTS: Metadata['robots'] = {
  index: false,
  follow: true,
};

/**
 * 페이지 메타데이터 생성 (canonical, Open Graph, Twitter, robots)
 * - 사이트 URL 미설정(SITE_INDEXABLE=false) 상태에서는 모든 페이지 noindex
 */
export function buildMetadata({
  path,
  title,
  absoluteTitle,
  description = SITE_DESCRIPTION,
  type = 'website',
  image = DEFAULT_OG,
  publishedTime,
  modifiedTime,
  keywords,
  noindex,
}: BuildMetadataParams): Metadata {
  const url = absoluteUrl(path);
  const pageTitle = title ?? SITE_NAME;
  const imageUrl = absoluteUrl(image.url);
  const ogImage = { url: imageUrl, alt: pageTitle, width: image.width, height: image.height };
  const mergedKeywords = Array.from(new Set([...(keywords ?? []), ...SITE_KEYWORDS]));

  return {
    title: absoluteTitle || !title ? { absolute: pageTitle } : pageTitle,
    description,
    ...(mergedKeywords.length > 0 && { keywords: mergedKeywords }),
    robots: noindex || !SITE_INDEXABLE ? NOINDEX_ROBOTS : INDEX_ROBOTS,
    alternates: {
      canonical: url,
      types: { 'application/rss+xml': absoluteUrl('/rss.xml') },
    },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type,
      images: [ogImage],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [AUTHOR_NAME],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [{ url: imageUrl, alt: pageTitle }],
    },
  };
}
