import { HOME_PATH } from '@/core/routes';
import { buildMetadata, JsonLd, websiteJsonLd } from '@/core/seo';

import { getHubPosts, getPostsPage } from '@/entities/post';

import { HomeView } from '@/views/home';

export const metadata = buildMetadata({ path: HOME_PATH, absoluteTitle: true });

export default function HomePage() {
  const { items, pagination } = getPostsPage(1);

  return (
    <>
      <JsonLd jsonLd={websiteJsonLd()} />
      <HomeView
        hubs={getHubPosts()}
        posts={items}
        totalPages={pagination.totalPages}
      />
    </>
  );
}
