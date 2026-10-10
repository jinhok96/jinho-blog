import type { ContentSection } from '../../../types';
import type { MDX_ROUTES } from '../../config';

import * as fs from 'fs';
import * as path from 'path';

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
    // 빌드된 registry.json 경로 (apps/web 루트 기준 — 런타임 process.cwd())
    // Turbopack 파일 트레이싱이 정적 분석할 수 있도록 경로 세그먼트를 리터럴로 지정
    // (상수 참조 시 프로젝트 전체가 서버 출력에 트레이싱됨)
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
