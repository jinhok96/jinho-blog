import type { BlogPosting, Person, TechArticle, WebSite, WithContext } from 'schema-dts';

import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/core/config';

type ContentJsonLdParams = {
  title: string;
  description: string;
  path: string;
  createdAt: string;
  updatedAt?: string;
  thumbnail?: string;
};

function resolveImageUrl(thumbnail?: string): string | undefined {
  if (!thumbnail) return undefined;
  return thumbnail.startsWith('http') ? thumbnail : `${SITE_URL}${thumbnail}`;
}

function createAuthor(): WithContext<Person> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: SITE_URL,
  };
}

export function generateWebSiteJsonLd(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  };
}

export function generateBlogPostingJsonLd({
  title,
  description,
  path,
  createdAt,
  updatedAt,
  thumbnail,
}: ContentJsonLdParams): WithContext<BlogPosting> {
  const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const imageUrl = resolveImageUrl(thumbnail);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    datePublished: createdAt,
    dateModified: updatedAt || createdAt,
    author: createAuthor(),
    ...(imageUrl && { image: imageUrl }),
  };
}

export function generateArticleJsonLd({
  title,
  description,
  path,
  createdAt,
  updatedAt,
  thumbnail,
}: ContentJsonLdParams): WithContext<TechArticle> {
  const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const imageUrl = resolveImageUrl(thumbnail);

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    url,
    datePublished: createdAt,
    dateModified: updatedAt || createdAt,
    author: createAuthor(),
    ...(imageUrl && { image: imageUrl }),
  };
}
