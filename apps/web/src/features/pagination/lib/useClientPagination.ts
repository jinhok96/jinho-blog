'use client';

import type { PaginationInfo } from '@jinho-blog/shared';

import { useState } from 'react';

type UseClientPaginationParams = {
  totalItems: number;
  itemsPerPage: number;
};

type UseClientPaginationReturn = {
  pagination: PaginationInfo;
  /** 현재 페이지에 해당하는 slice 범위 */
  startIndex: number;
  endIndex: number;
  setPage: (page: number) => void;
};

/**
 * URL 쿼리 없이 로컬 상태로 페이지를 관리합니다.
 *
 * `useSearchParams`를 사용하면 정적 프리렌더된 페이지에서 해당 서브트리가
 * 클라이언트 렌더링으로 밀려나 서버 HTML에 내부 링크가 남지 않습니다.
 * 상세 페이지의 '다른 글' 같은 부가 목록은 로컬 상태로 처리해
 * 첫 페이지를 서버에서 렌더링하고 중복 URL(`?page=N`)도 만들지 않습니다.
 */
export function useClientPagination({
  totalItems,
  itemsPerPage,
}: UseClientPaginationParams): UseClientPaginationReturn {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const [page, setPage] = useState(1);

  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  const startIndex = (currentPage - 1) * itemsPerPage;

  return {
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNext,
      hasPrev,
      nextPage: hasNext ? currentPage + 1 : null,
      prevPage: hasPrev ? currentPage - 1 : null,
    },
    startIndex,
    endIndex: startIndex + itemsPerPage,
    setPage,
  };
}
