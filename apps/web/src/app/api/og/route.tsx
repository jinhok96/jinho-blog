import { generateThumbnail } from '@jinho-blog/thumbnail-generator';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '';

  const buffer = await generateThumbnail({ title });

  return new Response(new Uint8Array(buffer), {
    headers: { 'Content-Type': 'image/webp' },
  });
}
