import { ImageResponse } from 'next/og';

import { SITE_DESCRIPTION, SITE_NAME } from '@/core/config';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '64px',
              background: '#3b82f6',
              borderRadius: '4px',
              marginRight: '24px',
            }}
          />
          <div
            style={{
              fontSize: '72px',
              fontWeight: '700',
              color: '#ffffff',
            }}
          >
            {SITE_NAME}
          </div>
        </div>

        <div
          style={{
            fontSize: '30px',
            color: '#71717a',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
