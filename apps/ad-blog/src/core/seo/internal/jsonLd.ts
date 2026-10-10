import type { BlogPosting, BreadcrumbList, Person, WebSite, WithContext } from 'schema-dts';

import { AUTHOR_NAME, AUTHOR_SAME_AS, SITE_DESCRIPTION, SITE_LANGUAGE, SITE_NAME } from '../../config';
import { absoluteUrl } from './url';

function author(): Person {
  return {
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: absoluteUrl('/about'),
    ...(AUTHOR_SAME_AS.length > 0 && { sameAs: AUTHOR_SAME_AS }),
  };
}

/**
 * 사이트 정보 (홈)
 */
export function websiteJsonLd(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl('/'),
    inLanguage: SITE_LANGUAGE,
    publisher: author(),
  };
}

export type BlogPostingJsonLdParams = {
  title: string;
  description: string;
  /** 글 경로 (예: '/posts/slug') */
  path: string;
  /** 대표 이미지 (사이트 경로 또는 절대 URL) */
  image?: string;
  publishedTime: string;
  modifiedTime: string;
  /** 카테고리 표시 이름 */
  section?: string;
  keywords?: string[];
};

/**
 * 글 구조화 데이터 (Google Article 리치 결과)
 */
export function blogPostingJsonLd({
  title,
  description,
  path,
  image,
  publishedTime,
  modifiedTime,
  section,
  keywords,
}: BlogPostingJsonLdParams): WithContext<BlogPosting> {
  const url = absoluteUrl(path);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(image && { image: [absoluteUrl(image)] }),
    datePublished: publishedTime,
    dateModified: modifiedTime,
    inLanguage: SITE_LANGUAGE,
    author: author(),
    publisher: author(),
    ...(section && { articleSection: section }),
    ...(keywords && keywords.length > 0 && { keywords: keywords.join(', ') }),
  };
}

export type BreadcrumbItem = {
  name: string;
  /** 사이트 경로 (예: '/categories/general') */
  path: string;
};

/**
 * 탐색 경로 구조화 데이터 (검색 결과의 경로 표시)
 */
export function breadcrumbJsonLd(items: BreadcrumbItem[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
