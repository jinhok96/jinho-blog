import type { ReactNode } from 'react';

import { Resvg } from '@resvg/resvg-js';
import * as fs from 'fs';
import * as path from 'path';
import satori from 'satori';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONT_PATH = path.join(__dirname, '../../../assets/Pretendard-Black.ttf');

export function loadFont(): ArrayBuffer {
  const buffer = fs.readFileSync(FONT_PATH);
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
}

type GenerateThumbnailParams = {
  title: string;
  outputPath?: string;
};

export async function generateThumbnail({ title, outputPath }: GenerateThumbnailParams): Promise<Buffer> {
  const fontBuffer = loadFont();

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          fontFamily: 'Pretendard',
          fontWeight: 900,
          backgroundColor: 'black',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '100%',
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 80,
                paddingRight: 80,
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      textAlign: 'center',
                      fontSize: 112,
                      lineHeight: 1.4,
                      letterSpacing: '-0.03em',
                      color: 'white',
                    },
                    children: title,
                  },
                },
              ],
            },
          },
        ],
      },
    } as unknown as ReactNode,
    {
      width: 1280,
      height: 720,
      fonts: [{ name: 'Pretendard', data: fontBuffer, weight: 900, style: 'normal' }],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1280 } });
  const pngBuffer = resvg.render().asPng();
  const webpBuffer = await sharp(pngBuffer).webp({ quality: 90 }).toBuffer();

  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, webpBuffer);
  }

  return webpBuffer;
}
