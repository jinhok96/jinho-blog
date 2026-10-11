import * as fs from 'fs';
import * as path from 'path';

import { type CollectionName, type ContentEntry, createContentReader } from '@jinho-blog/mdx-handler';

import { contentConfig } from './config';

/** 콘텐츠 컬렉션 이름 ('posts' | 'pages') */
export type ContentCollection = CollectionName<typeof contentConfig>;

/** 컬렉션별 레지스트리 항목 타입 (frontmatter + 빌드 생성 필드) */
export type ContentEntryOf<K extends ContentCollection> = ContentEntry<typeof contentConfig, K>;

/**
 * 레지스트리 리더
 * - registry.json 경로 (apps/ad-blog 루트 기준 — 빌드 시 process.cwd())
 * - 번들러 파일 트레이싱이 정적 분석할 수 있도록 경로 세그먼트를 리터럴로 지정
 * - contentConfig.registryFile과 일치해야 함 (reader.test.ts에서 검증)
 */
export const contentReader = createContentReader(contentConfig, () =>
  fs.readFileSync(path.join(process.cwd(), '.content', 'registry.json'), 'utf-8'),
);
