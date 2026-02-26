import { ImageResponse } from 'next/og';

import { readFileSync } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const fontBuffer = readFileSync(path.join(process.cwd(), 'public/fonts/Pretendard-Black.ttf'));

const font = fontBuffer.buffer.slice(
  fontBuffer.byteOffset,
  fontBuffer.byteOffset + fontBuffer.byteLength,
) as ArrayBuffer;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '';

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        fontFamily: 'Pretendard',
        fontWeight: 900,
        backgroundColor: 'black',
      }}
    >
      <div tw="flex w-full flex-1 flex-col items-center justify-center px-20">
        <span tw="text-center text-[7rem] leading-[1.4] tracking-tight text-white">{title}</span>
      </div>
    </div>,
    {
      width: 1280,
      height: 720,
      fonts: [{ name: 'Pretendard', data: font, weight: 900 }],
    },
  );
}
