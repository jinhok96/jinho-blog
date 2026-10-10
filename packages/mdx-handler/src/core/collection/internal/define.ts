import type { z } from 'zod';

/**
 * 모든 컬렉션 스키마의 출력이 만족해야 하는 최소 필드 (빌드 파이프라인에서 사용)
 */
export type BaseFrontmatter = {
  title: string;
  createdAt?: string;
  updatedAt?: string;
  thumbnail?: string;
};

export type CollectionDefinition<
  TSchema extends z.ZodType<BaseFrontmatter> = z.ZodType<BaseFrontmatter>,
  TGenerateThumbnail extends boolean = boolean,
> = {
  /** 상세 페이지 URL prefix (예: '/blog') */
  route: string;
  /** frontmatter 스키마 */
  schema: TSchema;
  /** frontmatter·본문에 이미지가 없으면 제목으로 썸네일 생성 (기본값: false) */
  generateThumbnail?: TGenerateThumbnail;
  /** 컬렉션 디렉토리의 이미지·비디오를 정적 디렉토리로 복사 (기본값: true) */
  copyMedia?: boolean;
};

export type CollectionMap = Record<string, CollectionDefinition>;

export type ContentConfig<TCollections extends CollectionMap = CollectionMap> = {
  /** MDX 콘텐츠 루트 (앱 루트 기준). 컬렉션별 `{contentDir}/{name}/*.mdx` */
  contentDir: string;
  /** 레지스트리·미디어 출력 디렉토리 (앱 루트 기준, 예: 'public/_static') */
  staticDir: string;
  /** staticDir의 공개 URL (예: '/_static') */
  staticUrl: string;
  /**
   * 레지스트리 JSON 경로 (앱 루트 기준, 기본값: `{staticDir}/registry.json`)
   * - 정적 export처럼 public 디렉토리가 그대로 배포되는 경우 public 밖으로 지정해 원문 노출 방지
   */
  registryFile?: string;
  /** Vercel 빌드에서 GitHub API로 커밋 날짜를 조회할 저장소 */
  github?: { owner: string; repo: string };
  collections: TCollections;
};

/**
 * 빌드 파이프라인이 생성·보장하는 필드
 */
export type GeneratedFields = {
  slug: string;
  /** MDX 파일 절대 경로 */
  filePath: string;
  /** 상세 페이지 경로 (예: '/blog/slug') */
  path: string;
  /** ISO 8601 (frontmatter → Git 첫 커밋 → 빌드 시각 순) */
  createdAt: string;
  /** ISO 8601 (frontmatter → Git 마지막 커밋 → 빌드 시각 순) */
  updatedAt: string;
  thumbnail?: string;
  /** 링크 미리보기용 OG 이미지 (JPEG 1200x630, 로컬 썸네일에서 생성) */
  ogImage?: string;
  /** 이미지 경로가 변환된 MDX 본문 */
  content: string;
};

/**
 * 레지스트리에 저장된 컬렉션 항목 타입
 * - `generateThumbnail: true`인 컬렉션은 thumbnail 필수
 */
export type CollectionEntry<TDefinition extends CollectionDefinition> = Omit<
  z.output<TDefinition['schema']>,
  keyof GeneratedFields
> &
  GeneratedFields &
  (Exclude<TDefinition['generateThumbnail'], undefined> extends true ? { thumbnail: string } : unknown);

export type CollectionName<TConfig extends ContentConfig> = keyof TConfig['collections'] & string;

export type ContentEntry<TConfig extends ContentConfig, TName extends CollectionName<TConfig>> = CollectionEntry<
  TConfig['collections'][TName]
>;

/**
 * 컬렉션 정의 (타입 추론용 헬퍼)
 */
export function defineCollection<
  TSchema extends z.ZodType<BaseFrontmatter>,
  TGenerateThumbnail extends boolean = false,
>(definition: CollectionDefinition<TSchema, TGenerateThumbnail>): CollectionDefinition<TSchema, TGenerateThumbnail> {
  return definition;
}

/**
 * 콘텐츠 설정 정의 (타입 추론용 헬퍼)
 */
export function defineContentConfig<TCollections extends CollectionMap>(
  config: ContentConfig<TCollections>,
): ContentConfig<TCollections> {
  return config;
}
