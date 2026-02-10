import type { Metadata } from 'next';

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/core/config';

type GeneratePageMetadataParams = {
  path: string;
  title?: string;
  description?: string;
  type?: 'website' | 'article';
};

export function generatePageMetadata({ path, title, description, type = 'website' }: GeneratePageMetadataParams): Metadata {
  const pageTitle = title || SITE_NAME;
  const pageDescription = description || SITE_DESCRIPTION;

  const query = path.startsWith('/') ? path : `/${path}`;
  const url = `${SITE_URL}${query}`;

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
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
    },
  };
}
