import type {
  BlogPosting,
  BreadcrumbList,
  CollectionPage,
  Person,
  ProfilePage,
  TechArticle,
  WebSite,
  WithContext,
} from 'schema-dts';

import {
  AUTHOR_FULL_NAME,
  AUTHOR_NAME,
  AUTHOR_SAME_AS,
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  SITE_NAME,
  SITE_URL,
} from '@/core/config';

type ContentJsonLdParams = {
  title: string;
  description: string;
  path: string;
  createdAt: string;
  updatedAt?: string;
  thumbnail?: string;
  /** 번역 콘텐츠의 원문 URL */
  sourceUrl?: string;
};

function toAbsoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function resolveImageUrl(thumbnail?: string): string {
  return toAbsoluteUrl(thumbnail || DEFAULT_OG_IMAGE);
}

/** 중첩용 Person 노드 (@context 없음 — 최상위 노드에만 @context를 둔다) */
function createAuthor(): Person & object {
  return {
    '@type': 'Person',
    name: AUTHOR_NAME,
    alternateName: AUTHOR_FULL_NAME,
    url: SITE_URL,
    sameAs: AUTHOR_SAME_AS,
  };
}

export function generateWebSiteJsonLd(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: `${AUTHOR_FULL_NAME} 기술 블로그`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: SITE_LANGUAGE,
    author: createAuthor(),
    publisher: createAuthor(),
  };
}

/** 홈(포트폴리오) 페이지용 ProfilePage */
export function generateProfilePageJsonLd(): WithContext<ProfilePage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: SITE_URL,
    inLanguage: SITE_LANGUAGE,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      ...createAuthor(),
      jobTitle: '프론트엔드 개발자',
      description: SITE_DESCRIPTION,
      knowsAbout: ['프론트엔드 개발', 'React', 'Next.js', 'TypeScript', 'UI/UX'],
    },
  };
}

type BreadcrumbItem = {
  name: string;
  path: string;
};

/** 검색 결과에 경로를 노출시키는 BreadcrumbList */
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

type CollectionPageJsonLdParams = {
  title: string;
  description: string;
  path: string;
};

/** 목록 페이지용 CollectionPage */
export function generateCollectionPageJsonLd({
  title,
  description,
  path,
}: CollectionPageJsonLdParams): WithContext<CollectionPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: toAbsoluteUrl(path),
    inLanguage: SITE_LANGUAGE,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    author: createAuthor(),
  };
}

function createArticleBase({ title, description, path, createdAt, updatedAt, thumbnail }: ContentJsonLdParams) {
  const url = toAbsoluteUrl(path);

  return {
    headline: title,
    description,
    url,
    mainEntityOfPage: { '@type': 'WebPage' as const, '@id': url },
    datePublished: createdAt,
    dateModified: updatedAt || createdAt,
    inLanguage: SITE_LANGUAGE,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    author: createAuthor(),
    publisher: createAuthor(),
    image: resolveImageUrl(thumbnail),
  };
}

export function generateBlogPostingJsonLd(params: ContentJsonLdParams): WithContext<BlogPosting> {
  const { sourceUrl } = params;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    ...createArticleBase(params),
    // 번역 콘텐츠는 원문을 명시해 스크래핑 중복으로 오인되지 않도록 한다
    ...(sourceUrl && { isBasedOn: sourceUrl, citation: sourceUrl }),
  };
}

export function generateArticleJsonLd(params: ContentJsonLdParams): WithContext<TechArticle> {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    ...createArticleBase(params),
  };
}
