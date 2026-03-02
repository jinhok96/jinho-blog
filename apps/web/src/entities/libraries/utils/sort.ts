import type { GetLibraryGroupsByCategory } from '@/entities/libraries/types';
import type { TechStack } from '@jinho-blog/shared';

// 우선 정렬 카테고리
const LIBRARY_PRIORITY_CATEGORIES: TechStack[] = ['javascript', 'typescript', 'react', 'nextjs', 'vue'];

export function sortLibraryGroupsByCategory(groups: GetLibraryGroupsByCategory['response']): TechStack[] {
  return (Object.keys(groups) as TechStack[]).sort((a, b) => {
    // 우선 정렬 카테고리 먼저 정렬
    const aIndex = LIBRARY_PRIORITY_CATEGORIES.indexOf(a);
    const bIndex = LIBRARY_PRIORITY_CATEGORIES.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    // 나머지 알파벳순 정렬
    return a.localeCompare(b);
  });
}
