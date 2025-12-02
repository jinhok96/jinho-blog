import type { Metadata } from 'next';

import Link from 'next/link';

import { ROUTER } from '@/core/config';
import { generatePageMetadata } from '@/core/utils';

export const metadata: Metadata = generatePageMetadata({ routerName: 'home' });

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Jinho&apos;s Blog</h1>
        <p>소개, 이력서 다운, 핵심 역량, 기술 스택, 경력 사항, 프로젝트 상세, 블로그, 교육, 연락처</p>
        <div>
          <Link href={ROUTER.projects}>Projects</Link>
        </div>
        <div>
          <Link href={ROUTER.blog}>Blog</Link>
        </div>
        <div>
          <Link href={ROUTER.libraries}>Libraries</Link>
        </div>
      </div>
    </main>
  );
}
