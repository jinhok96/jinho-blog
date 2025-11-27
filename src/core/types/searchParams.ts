import type { SEARCH_PARAMS } from '@/core/config';

type SearchParamsKeys = keyof typeof SEARCH_PARAMS;
type SearchParamsValue<T extends SearchParamsKeys = SearchParamsKeys> =
  (typeof SEARCH_PARAMS)[T]['value'][keyof (typeof SEARCH_PARAMS)[T]['value']];

export type SearchParams<
  K extends SearchParamsKeys = SearchParamsKeys,
  V extends string | string[] | SearchParamsValue<K> = SearchParamsValue<K>,
> = {
  searchParams: Promise<{ [key in K]: V | undefined }>;
};
