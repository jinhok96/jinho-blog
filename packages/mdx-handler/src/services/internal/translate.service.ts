import type { GetBlogPostsOptions, MdxInfo, PaginatedResult, TranslateMetadata } from '@jinho-blog/shared';

import { MDX_ROUTES } from '../../core/config';
import {
  filterByCategory,
  getRegistry,
  paginateContentWithMeta,
  type RegistryEntry,
  searchContent,
  sortContent,
} from '../../core/utils';

export type Translate = TranslateMetadata & MdxInfo & RegistryEntry;

export async function getTranslatePosts(options?: GetBlogPostsOptions): Promise<PaginatedResult<Translate>> {
  const { category, sort, page, count, search } = options || {};

  let data = getRegistry<Translate>('translate', MDX_ROUTES);

  data = filterByCategory(data, category);
  data = searchContent<Translate, keyof TranslateMetadata>(data, ['title', 'description'], search);
  data = sortContent(data, sort);

  return paginateContentWithMeta(data, page, count);
}

export async function getTranslatePost(slug: string): Promise<Translate | null> {
  const registry = getRegistry<Translate>('translate', MDX_ROUTES);
  return registry.find(post => post.slug === slug) || null;
}

export async function getTranslateContent(slug: string): Promise<string | null> {
  const post = await getTranslatePost(slug);
  if (!post || !post.content) return null;

  return post.content as string;
}
