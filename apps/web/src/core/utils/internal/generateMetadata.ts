import type { Metadata } from 'next';

import {
  AUTHOR_FULL_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_WIDTH,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
} from '@/core/config';

type GeneratePageMetadataParams = {
  path: string;
  siteName?: string;
  title?: string;
  description?: string;
  type?: 'website' | 'article';
  thumbnail?: string;
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  /**
   * 타이틀 처리 방식
   * - `template`: 루트 레이아웃용. 하위 페이지 타이틀에 ` | Jinho Blog` 접미사를 붙이는 템플릿을 등록
   * - `absolute`: 템플릿을 무시하고 주어진 타이틀을 그대로 사용
   * - 미지정: 문자열 타이틀 (상위 템플릿이 적용됨)
   */
  titleMode?: 'template' | 'absolute';
};

/** 검색엔진 크롤러 디렉티브: 색인 허용 + 리치 결과용 미리보기 제한 해제 */
const ROBOTS: Metadata['robots'] = {
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

export function generatePageMetadata({
  path,
  siteName = SITE_NAME,
  title,
  description,
  type = 'website',
  thumbnail,
  keywords,
  publishedTime,
  modifiedTime,
  titleMode,
}: GeneratePageMetadataParams): Metadata {
  const pageTitle = title || siteName;
  const pageDescription = description || SITE_DESCRIPTION;

  const query = path.startsWith('/') ? path : `/${path}`;
  const url = `${SITE_URL}${query}`;

  const resolvedThumbnail = thumbnail ?? DEFAULT_OG_IMAGE;

  const imageUrl = resolvedThumbnail.startsWith('http') ? resolvedThumbnail : `${SITE_URL}${resolvedThumbnail}`;

  // 기본 OG 이미지는 규격을 알고 있으므로 width/height를 명시해 크롤러가 큰 미리보기를 쓰도록 유도
  const isDefaultImage = resolvedThumbnail === DEFAULT_OG_IMAGE;

  const metadataTitle: Metadata['title'] = (() => {
    if (titleMode === 'template') return { default: pageTitle, template: `%s | ${SITE_NAME}` };
    if (titleMode === 'absolute') return { absolute: pageTitle };
    return pageTitle;
  })();

  return {
    metadataBase: new URL(SITE_URL),
    title: metadataTitle,
    description: pageDescription,
    keywords: keywords?.length ? Array.from(new Set([...keywords, ...SITE_KEYWORDS])) : SITE_KEYWORDS,
    authors: [{ name: AUTHOR_FULL_NAME, url: SITE_URL }],
    creator: AUTHOR_FULL_NAME,
    publisher: AUTHOR_FULL_NAME,
    robots: ROBOTS,
    alternates: {
      canonical: url,
      types: {
        'application/rss+xml': `${SITE_URL}/rss.xml`,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName,
      locale: SITE_LOCALE,
      type,
      images: [
        {
          url: imageUrl,
          alt: pageTitle,
          ...(isDefaultImage && { width: DEFAULT_OG_IMAGE_WIDTH, height: DEFAULT_OG_IMAGE_HEIGHT }),
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [AUTHOR_FULL_NAME],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [{ url: imageUrl, alt: pageTitle }],
    },
  };
}
