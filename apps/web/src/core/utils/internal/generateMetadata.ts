import type { Metadata } from 'next';

import { routes } from '@jinho-blog/nextjs-routes';

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/core/config';

type GeneratePageMetadataParams = {
  path: string;
  title?: string;
  description?: string;
  type?: 'website' | 'article';
  thumbnail?: string;
};

export function generatePageMetadata({
  path,
  title,
  description,
  type = 'website',
  thumbnail,
}: GeneratePageMetadataParams): Metadata {
  const pageTitle = title || SITE_NAME;
  const pageDescription = description || SITE_DESCRIPTION;

  const query = path.startsWith('/') ? path : `/${path}`;
  const url = `${SITE_URL}${query}`;

  const resolvedThumbnail = thumbnail ?? routes({ pathname: '/api/og', search: { title } });
  const imageUrl = resolvedThumbnail.startsWith('http') ? resolvedThumbnail : `${SITE_URL}${resolvedThumbnail}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
  };
}
