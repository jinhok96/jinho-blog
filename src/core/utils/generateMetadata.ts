import type { Metadata } from 'next';

import { ROUTER, type RouterName } from '@/core/config';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/core/config/site';

type GeneratePageMetadataParams = {
  routerName: RouterName;
  title?: string;
  description?: string;
};

export function generatePageMetadata({
  routerName,
  title,
  description,
}: GeneratePageMetadataParams): Metadata {
  const pageTitle = title || SITE_NAME;
  const pageDescription = description || SITE_DESCRIPTION;
  const url = `${SITE_URL}${ROUTER[routerName]}`;

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
      type: 'website',
    },
  };
}
