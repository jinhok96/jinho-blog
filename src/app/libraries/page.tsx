import type { Metadata } from 'next';

import { AsyncBoundary } from '@/core/ui';
import { generatePageMetadata } from '@/core/utils';

import { LibrariesContentSection } from '@/views/libraries';

export const metadata: Metadata = generatePageMetadata({
  routerName: 'libraries',
  title: '라이브러리',
  description: '라이브러리 목록',
});

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LibrariesListPage({ searchParams }: Props) {
  return (
    <div className="flex-col-start size-full gap-6">
      <h1 className="font-title-36">라이브러리</h1>

      <p>사이드바 목록, 모바일에서 드로어</p>

      <AsyncBoundary>
        <LibrariesContentSection searchParams={searchParams} />
      </AsyncBoundary>
    </div>
  );
}
