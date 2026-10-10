import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

/** OG 이미지 권장 규격 (페이스북/카카오톡/링크드인 공통 1.91:1) */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

type GenerateOgImageParams = {
  inputPath: string;
  outputPath: string;
};

/**
 * 썸네일 이미지를 OG 이미지 규격의 JPEG로 변환합니다.
 * WebP를 지원하지 않는 링크 미리보기 크롤러를 위해 1200x630 JPEG를 별도로 생성합니다 (사진 썸네일도 용량이 작도록 JPEG 사용).
 */
export async function generateOgImage({ inputPath, outputPath }: GenerateOgImageParams): Promise<void> {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  await sharp(inputPath)
    .resize(OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, { fit: 'cover' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(outputPath);
}
