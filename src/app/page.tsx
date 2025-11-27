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
        <div>
          <Link href={ROUTER.portfolio}>Portfolio</Link>
        </div>
        <div>
          <Link href={ROUTER.blog}>Blog</Link>
        </div>
        <div>
          <Link href={ROUTER.projects}>Projects</Link>
        </div>
        <div>
          <Link href={ROUTER.libraries}>Libraries</Link>
        </div>
      </div>
    </main>
  );
}
