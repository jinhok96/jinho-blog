import type { Category } from '@/core/config';
import type { BreadcrumbItem } from '@/core/seo';
import type { Metadata } from 'next';

import { CATEGORY_MAP } from '@/core/config';
import { categoryPath, HOME_BREADCRUMB, paginatedPath, paginatedTitle } from '@/core/routes';
import { buildMetadata } from '@/core/seo';

import { getCategorySummaries } from '@/entities/post';

/**
 * 경로 파라미터 → 카테고리 (글이 있는 카테고리만 — 빈 카테고리 페이지는 생성하지 않음)
 */
export function findCategory(value: string): Category | null {
  return getCategorySummaries().find(({ category }) => category === value)?.category ?? null;
}

/**
 * 카테고리 목록 탐색 경로 (홈 › 카테고리 › n페이지)
 */
export function getCategoryBreadcrumbs(category: Category, page: number): BreadcrumbItem[] {
  const basePath = categoryPath(category);
  const items: BreadcrumbItem[] = [HOME_BREADCRUMB, { name: CATEGORY_MAP[category].name, path: basePath }];

  if (page > 1) items.push({ name: `${page}페이지`, path: paginatedPath(basePath, page) });

  return items;
}

/**
 * 카테고리 목록 메타데이터 (설명 = 카테고리 설명, 2페이지부터 제목·설명에 페이지 번호)
 */
export function buildCategoryMetadata(category: Category, page: number): Metadata {
  const { name, description } = CATEGORY_MAP[category];

  return buildMetadata({
    path: paginatedPath(categoryPath(category), page),
    title: paginatedTitle(name, page),
    description: page > 1 ? `${description} (${page}페이지)` : description,
  });
}
