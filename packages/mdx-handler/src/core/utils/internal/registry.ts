import type { CollectionEntry, CollectionMap, ContentConfig } from '../../collection';

export type ContentReader<TCollections extends CollectionMap> = {
  /** 컬렉션 전체 항목 조회 (레지스트리에 없으면 빈 배열) */
  getEntries: <TName extends keyof TCollections & string>(name: TName) => CollectionEntry<TCollections[TName]>[];
};

function isFileNotFoundError(error: unknown): boolean {
  return error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT';
}

/**
 * 레지스트리 리더 생성
 * - 호출 시마다 readRegistry로 registry.json을 읽음 (dev 서버 재시작 없이 갱신 반영)
 * - 파일 읽기는 앱이 담당: 번들러 파일 트레이싱이 경로를 정적 분석할 수 있도록
 *   앱 코드에서 리터럴 경로로 읽어야 함 (동적 경로는 앱 전체가 서버 출력에 트레이싱됨)
 *
 * @param _config 컬렉션 타입 추론용 콘텐츠 설정
 * @param readRegistry registry.json 원문을 반환하는 함수
 *
 * @example
 * createContentReader(contentConfig, () =>
 *   fs.readFileSync(path.join(process.cwd(), 'public', '_static', 'registry.json'), 'utf-8'),
 * );
 */
export function createContentReader<TCollections extends CollectionMap>(
  _config: ContentConfig<TCollections>,
  readRegistry: () => string,
): ContentReader<TCollections> {
  return {
    getEntries: name => {
      try {
        const registry = JSON.parse(readRegistry()) as Partial<Record<string, unknown>>;
        const entries = registry[name];

        return Array.isArray(entries) ? (entries as CollectionEntry<TCollections[typeof name]>[]) : [];
      } catch (error) {
        console.error('Failed to read registry from JSON:', error);

        if (isFileNotFoundError(error)) {
          throw new Error(`Registry JSON not found. Run 'pnpm registry' to generate the registry.`, { cause: error });
        }
        throw error;
      }
    },
  };
}
