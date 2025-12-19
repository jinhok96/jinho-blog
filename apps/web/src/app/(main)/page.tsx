import type { Metadata } from 'next';

import Link from 'next/link';

import { routes } from '@jinho-blog/nextjs-routes';

import { generatePageMetadata } from '@/core/utils';

export const metadata: Metadata = generatePageMetadata({ path: routes({ pathname: '/' }) });

export default function HomePage() {
  return (
    <div className="size-full">
      <h1 className="font-title-44">
        안녕하세요,
        <br />
        프론트엔드 개발자
        <br />
        <span className="text-blue-7">강진호</span>입니다.
      </h1>
      <p>소개, 이력서 다운, 핵심 역량, 기술 스택, 경력 사항, 주요 프로젝트, 블로그, 교육, 연락처</p>
      <div>
        <Link href={routes({ pathname: '/projects' })}>Projects</Link>
      </div>
      <div>
        <Link href={routes({ pathname: '/blog' })}>Blog</Link>
      </div>
      <div>
        <Link href={routes({ pathname: '/libraries' })}>Libraries</Link>
      </div>
    </div>
  );
}
