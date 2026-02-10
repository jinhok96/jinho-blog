import fs from 'fs';
import path from 'path';

import { PATHS, type MDX_ROUTES } from '../../config';
import type { ContentSection } from '../../../types';

export interface RegistryEntry {
  slug: string;
  filePath: string;
  path: string;
  [key: string]: unknown; // metadata fields
}

/**
 * 레지스트리 조회
 * - 빌드된 JSON 파일에서 읽기 (개발/프로덕션 공통)
 * - 빌드 타임에 생성된 registry.json 필수
 */
export function getRegistry<T extends RegistryEntry = RegistryEntry>(
  section: ContentSection,
  _router: typeof MDX_ROUTES,
): T[] {
  try {
    // 빌드된 registry.json 경로
    const registryPath = path.join(process.cwd(), 'public', '_static', 'registry.json');

    if (!fs.existsSync(registryPath)) {
      throw new Error(
        `Registry JSON not found at ${registryPath}. Run 'npm run build-registry' to generate the registry.`,
      );
    }

    const registryData = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
    return registryData[section] || [];
  } catch (error) {
    console.error('Failed to read registry from JSON:', error);
    throw error;
  }
}
