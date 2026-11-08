import type { Page } from '@/entities/page';
import type { Post } from '@/entities/post';

import { CATEGORIES, CATEGORY_MAP, SITE_DESCRIPTION, SITE_NAME } from '@/core/config';
import { absoluteUrl } from '@/core/seo';

export type LlmsPost = Pick<Post, 'title' | 'description' | 'path' | 'category' | 'updatedAt' | 'hub'>;
export type LlmsPage = Pick<Page, 'slug' | 'title' | 'description' | 'path'>;

/** 본문 'About' 절에 넣는 정적 페이지 (나머지 정적 페이지는 'Optional' 절) */
export const PRIMARY_PAGE_SLUGS = ['about', 'editorial-policy'] as const;

/** 사이트 소개 다음에 붙는 설명 (llms.txt 형식의 blockquote 뒤 자유 문단) */
const SITE_DETAILS = [
  'Every guide is written for everyday, non-developer users and is based on our own hands-on test of the tool or setting it describes, using built-in settings, free apps or websites (no command line or code).',
  'Each guide states the app versions and the date we tested, and is updated when the product changes.',
].join(' ');

/** 링크 텍스트의 대괄호 이스케이프 (Markdown 링크 깨짐 방지) */
export function escapeLinkText(value: string): string {
  return value.replace(/[[\]]/g, char => `\\${char}`);
}

/** 한 줄로 정리 (설명의 줄바꿈·연속 공백 제거) */
function oneLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function linkItem({ title, path, description }: { title: string; path: string; description: string }): string {
  return `- [${escapeLinkText(oneLine(title))}](${absoluteUrl(path)}): ${oneLine(description)}`;
}

/** 최근 변경 순 (updatedAt 내림차순, 같으면 입력 순서 유지) */
function byRecentChange<T extends { updatedAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

function section(heading: string, lines: string[]): string[] {
  return lines.length > 0 ? ['', `## ${heading}`, '', ...lines] : [];
}

/**
 * llms.txt 생성 (https://llmstxt.org 형식)
 * - H1 사이트 이름 → blockquote 사이트 설명 → 설명 문단 → H2 절마다 링크 목록
 * - 허브 글은 'Start here', 나머지 글은 카테고리별(최근 변경 순), 글이 없는 카테고리 절은 생략
 * - 소개·편집 원칙 페이지는 'About', 그 밖의 정적 페이지는 'Optional'(llms.txt 규약상 생략 가능한 링크)
 */
export function buildLlmsTxt(posts: LlmsPost[], pages: LlmsPage[]): string {
  const isPrimary = (page: LlmsPage) => (PRIMARY_PAGE_SLUGS as readonly string[]).includes(page.slug);
  const hubs = byRecentChange(posts.filter(post => post.hub));
  const guides = posts.filter(post => !post.hub);

  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    SITE_DETAILS,
    ...section('Start here', hubs.map(linkItem)),
    ...CATEGORIES.flatMap(category =>
      section(
        CATEGORY_MAP[category].name,
        byRecentChange(guides.filter(post => post.category === category)).map(linkItem),
      ),
    ),
    ...section('About', pages.filter(isPrimary).map(linkItem)),
    ...section('Optional', pages.filter(page => !isPrimary(page)).map(linkItem)),
  ];

  return `${lines.join('\n')}\n`;
}
