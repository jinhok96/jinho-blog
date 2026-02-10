import { ImageResponse } from 'next/og';

import { SITE_NAME } from '@/core/config';

import { createBlogService } from '@/entities/blog';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const blogService = createBlogService();
  const post = await blogService.getBlogPost({ slug });

  const title = post?.title ?? SITE_NAME;
  const description = post?.description ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        {/* 상단 사이트명 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '28px',
              background: '#3b82f6',
              borderRadius: '3px',
            }}
          />
          <div
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#71717a',
            }}
          >
            {SITE_NAME}
          </div>
        </div>

        {/* 본문 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontSize: '52px',
              fontWeight: '700',
              color: '#ffffff',
              lineHeight: '1.2',
              maxWidth: '1000px',
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: '24px',
              color: '#71717a',
              maxWidth: '900px',
            }}
          >
            {description}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
