/**
 * 기술 블로그 자동 번역 스크립트
 * RSS 피드에서 새 글을 탐색하고 Gemini API로 번역해 MDX 파일로 저장
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { config as dotenvConfig } from 'dotenv';

import { GoogleGenAI } from '@google/genai';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import matter from 'gray-matter';
import RssParser from 'rss-parser';
import TurndownService from 'turndown';

import { TRANSLATE_SOURCES } from '../src/core/config';
import { PATHS } from '../src/core/config';

// ────────────────────────────────────────────────────────────────
// 환경 설정
// ────────────────────────────────────────────────────────────────

function findMonorepoRoot(): string {
  let currentDir = process.cwd();
  while (currentDir !== path.parse(currentDir).root) {
    const pkgPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (pkg.workspaces) return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  return path.join(fileURLToPath(new URL('../../..', import.meta.url)));
}

const MONOREPO_ROOT = findMonorepoRoot();
const TRANSLATE_MDX_DIR = path.join(MONOREPO_ROOT, PATHS.MDX_CONTENT_DIR, 'translate');

// 모노레포 루트의 .env.local 로드
dotenvConfig({ path: path.join(MONOREPO_ROOT, '.env.local') });

// ────────────────────────────────────────────────────────────────
// 기존 번역 목록 수집
// ────────────────────────────────────────────────────────────────

interface TranslatedInfo {
  urls: Set<string>;
  /** 소스별로 번역된 URL Set (소스 카테고리 → URL Set) */
  byCategory: Map<string, Set<string>>;
}

function getTranslatedInfo(): TranslatedInfo {
  const urls = new Set<string>();
  const byCategory = new Map<string, Set<string>>();

  if (!fs.existsSync(TRANSLATE_MDX_DIR)) return { urls, byCategory };

  const files = fs.readdirSync(TRANSLATE_MDX_DIR).filter(f => f.endsWith('.mdx'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(TRANSLATE_MDX_DIR, file), 'utf-8');
    const { data } = matter(content);
    if (data.sourceUrl && typeof data.sourceUrl === 'string') {
      urls.add(data.sourceUrl);

      if (data.category && typeof data.category === 'string') {
        if (!byCategory.has(data.category)) {
          byCategory.set(data.category, new Set());
        }
        byCategory.get(data.category)!.add(data.sourceUrl);
      }
    }
  }

  return { urls, byCategory };
}

const INITIAL_POST_COUNT = 3;

// ────────────────────────────────────────────────────────────────
// RSS 파싱
// ────────────────────────────────────────────────────────────────

interface FeedItem {
  title: string;
  link: string;
  summary?: string;
  pubDate?: string; // YYYY-MM-DD 포맷으로 정규화됨
}

async function fetchFeedItems(rssUrl: string): Promise<FeedItem[]> {
  const parser = new RssParser();
  try {
    const feed = await parser.parseURL(rssUrl);
    return (feed.items || [])
      .filter(item => item.link && item.title)
      .map(item => {
        const rawDate = item.isoDate || item.pubDate;
        const pubDate = rawDate ? new Date(rawDate).toISOString().slice(0, 10) : undefined;
        return {
          title: item.title!,
          link: item.link!,
          summary: item.contentSnippet || item.summary,
          pubDate,
        };
      });
  } catch (error) {
    console.warn(`⚠️  RSS 파싱 실패: ${rssUrl}`, error);
    return [];
  }
}

// ────────────────────────────────────────────────────────────────
// 웹 스크래핑
// ────────────────────────────────────────────────────────────────

async function scrapeArticle(url: string): Promise<{ title: string; markdown: string } | null> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TranslateBot/1.0)' },
    });

    if (!response.ok) {
      console.warn(`⚠️  fetch 실패: ${url} (${response.status})`);
      return null;
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      console.warn(`⚠️  본문 추출 실패: ${url}`);
      return null;
    }

    const turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });

    // 코드 블록 보존
    turndown.addRule('codeBlock', {
      filter: ['pre'],
      replacement: (content, node) => {
        const codeNode = (node as Element).querySelector('code');
        const lang = codeNode?.className?.match(/language-(\S+)/)?.[1] || '';
        const code = codeNode?.textContent || content;
        return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
      },
    });

    const markdown = turndown.turndown(article.content ?? '');

    return { title: article.title || '', markdown };
  } catch (error) {
    console.warn(`⚠️  스크래핑 오류: ${url}`, error);
    return null;
  }
}

// ────────────────────────────────────────────────────────────────
// Gemini 번역
// ────────────────────────────────────────────────────────────────

const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const MAX_RETRIES = 3;

function extractRetryDelay(error: unknown): number {
  if (
    error &&
    typeof error === 'object' &&
    'errorDetails' in error &&
    Array.isArray((error as { errorDetails: unknown[] }).errorDetails)
  ) {
    const details = (error as { errorDetails: Array<{ '@type'?: string; retryDelay?: string }> }).errorDetails;
    const retryInfo = details.find(d => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo');
    if (retryInfo?.retryDelay) {
      const seconds = parseFloat(retryInfo.retryDelay.replace('s', ''));
      return isNaN(seconds) ? 15000 : Math.ceil(seconds) * 1000 + 1000;
    }
  }
  return 15000;
}

class FatalGeminiError extends Error {}

async function callGeminiWithRetry(genAI: GoogleGenAI, prompt: string): Promise<string | null> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await genAI.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });
      return result.text ?? null;
    } catch (error) {
      const status = error && typeof error === 'object' && 'status' in error ? (error as { status: number }).status : 0;

      // 재시도해도 소용없는 에러 — 즉시 전체 중단
      const message = (error as Error).message ?? '';
      if (status === 404 || status === 401 || status === 403) {
        throw new FatalGeminiError(message.split('\n')[0]);
      }
      if (status === 429 && message.includes('spending cap')) {
        throw new FatalGeminiError('월 지출 한도 초과 — https://ai.studio/spend 에서 한도를 올려주세요.');
      }

      if (status === 429 && attempt < MAX_RETRIES) {
        const delay = extractRetryDelay(error);
        console.log(`   ⏳ Rate limit — ${delay / 1000}초 후 재시도 (${attempt}/${MAX_RETRIES - 1})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      console.warn(`⚠️  Gemini 오류 (시도 ${attempt}/${MAX_RETRIES}):`, (error as Error).message?.split('\n')[0]);
      return null;
    }
  }
  return null;
}

interface TranslationResult {
  title: string;
  description: string;
  body: string;
}

async function translateWithGemini(
  genAI: GoogleGenAI,
  content: string,
  originalTitle: string,
  sourceName: string,
): Promise<TranslationResult | null> {
  const prompt = `당신은 전문 기술 번역가입니다. 다음 영어 기술 블로그 글(${sourceName})을 한국어로 번역하세요.

원문 제목: ${originalTitle}

번역 규칙:
- 코드 블록(\`\`\`...\`\`\`)은 번역하지 말고 그대로 유지하세요
- 기술 용어(API, props, hook, component 등)는 원문 그대로 유지하세요
- 고유명사(React, Next.js, TypeScript 등)는 원문 그대로 유지하세요
- 마크다운 형식(#, **, >, - 등)을 그대로 유지하세요
- 자연스러운 한국어로 번역하되, 기술 문서 특유의 명확하고 간결한 어조를 유지하세요

반드시 아래 형식으로 출력하세요. 다른 설명은 추가하지 마세요:

TITLE: <원문 제목을 한국어로 번역한 제목. 마크다운 없이 순수 텍스트>
DESCRIPTION: <글의 핵심 내용을 한 문장으로 요약. 마크다운/링크 없이 순수 텍스트, 최대 100자>
BODY:
<번역된 본문. 날짜, 작성자, 업데이트 알림 등 아티클 상단 메타데이터는 제외하고 첫 번째 실질적인 내용(문단 또는 헤딩)부터 시작>

원문:
${content}`;

  const raw = await callGeminiWithRetry(genAI, prompt);
  if (!raw) return null;

  const titleMatch = raw.match(/^TITLE:\s*(.+)$/m);
  const descMatch = raw.match(/^DESCRIPTION:\s*(.+)$/m);
  const bodyMatch = raw.match(/^BODY:\s*\n([\s\S]+)$/m);

  if (!titleMatch || !bodyMatch) return null;

  return {
    title: titleMatch[1].trim(),
    description: descMatch?.[1].trim() ?? '',
    body: bodyMatch[1].trim(),
  };
}

// ────────────────────────────────────────────────────────────────
// MDX 파일 생성
// ────────────────────────────────────────────────────────────────

function normalizeHeadings(markdown: string): string {
  const hasH1 = /^# /m.test(markdown);
  if (hasH1) return markdown;
  // # 없이 ## 이상 헤딩만 있으면 전체를 한 레벨 올림
  return markdown.replace(/^(#{2,}) /gm, (_, hashes) => '#'.repeat(hashes.length - 1) + ' ');
}

export function generateSlug(category: string, url: string): string {
  const urlObj = new URL(url);
  const lastSegment = urlObj.pathname.replace(/\/$/, '').split('/').pop() || 'post';
  const sanitized = lastSegment.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  return `${category}-${sanitized}`;
}

export function buildMdxContent(meta: {
  title: string;
  description: string;
  category: string;
  sourceUrl: string;
  sourceName: string;
  originalTitle: string;
  translatedBody: string;
  createdAt?: string;
}): string {
  const yamlStr = (v: string) => {
    const needsQuote = /[:#\[\]{},|>&*!'"@%`]/.test(v) || v.startsWith(' ') || v.endsWith(' ');
    if (!needsQuote) return v;
    return `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  };

  const frontmatter = [
    '---',
    `title: ${yamlStr(meta.title)}`,
    `description: ${yamlStr(meta.description)}`,
    `category: ${meta.category}`,
    `sourceUrl: ${meta.sourceUrl}`,
    ...(meta.createdAt ? [`createdAt: ${meta.createdAt}`] : []),
    '---',
  ].join('\n');

  const originLine = `> 원문: [${meta.originalTitle}](${meta.sourceUrl}) — ${meta.sourceName}`;

  return `${frontmatter}\n\n${originLine}\n\n${meta.translatedBody}\n`;
}

// ────────────────────────────────────────────────────────────────
// 메인 실행
// ────────────────────────────────────────────────────────────────

export async function translateNewPosts(): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.');
  }

  const genAI = new GoogleGenAI({ apiKey });
  const { urls: translatedUrls, byCategory: translatedByCategory } = getTranslatedInfo();

  console.log(`📚 기존 번역 글: ${translatedUrls.size}개`);

  fs.mkdirSync(TRANSLATE_MDX_DIR, { recursive: true });

  let totalNew = 0;

  for (const source of TRANSLATE_SOURCES) {
    console.log(`\n🔍 [${source.name}] RSS 탐색 중...`);

    const feedItems = await fetchFeedItems(source.rssUrl);
    const isFirstTime = !translatedByCategory.has(source.category);

    let newItems: FeedItem[];

    if (isFirstTime) {
      // 최초 수집: 최신 3개
      const untranslated = feedItems.filter(item => !translatedUrls.has(item.link));
      newItems = untranslated.slice(0, INITIAL_POST_COUNT);
      console.log(`   첫 수집 — 최근 ${newItems.length}개 가져옴 (전체: ${feedItems.length}개)`);
    } else {
      // 이후 수집: 피드에서 마지막으로 번역된 글보다 최신 글 전부
      // 피드는 최신순이므로, 첫 번째로 나타나는 번역된 글 앞의 항목들이 새 글
      const lastTranslatedIdx = feedItems.findIndex(item => translatedUrls.has(item.link));
      if (lastTranslatedIdx === -1) {
        // 번역된 글이 피드에 없음 (너무 오래된 글이 피드에서 사라진 경우)
        newItems = feedItems.filter(item => !translatedUrls.has(item.link));
      } else {
        newItems = feedItems.slice(0, lastTranslatedIdx).filter(item => !translatedUrls.has(item.link));
      }
      console.log(`   전체: ${feedItems.length}개, 새 글: ${newItems.length}개`);
    }

    for (const item of newItems) {
      console.log(`\n  📄 번역 중: ${item.title}`);
      console.log(`     URL: ${item.link}`);

      // 원문 스크래핑
      const scraped = await scrapeArticle(item.link);
      if (!scraped) {
        console.warn(`  ⚠️  스크래핑 실패, 건너뜀`);
        continue;
      }

      // 번역
      let translation: TranslationResult | null;
      try {
        translation = await translateWithGemini(genAI, scraped.markdown, item.title, source.name);
      } catch (error) {
        if (error instanceof FatalGeminiError) {
          console.error(`\n❌ 치명적 오류 — 스크립트 중단: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
      if (!translation) {
        console.warn(`  ⚠️  번역 실패, 건너뜀`);
        continue;
      }



      // MDX 파일 생성
      const slug = generateSlug(source.category, item.link);
      const mdxContent = buildMdxContent({
        title: translation.title || item.title,
        description: translation.description || item.summary || '',
        category: source.category,
        sourceUrl: item.link,
        sourceName: source.name,
        originalTitle: item.title,
        translatedBody: normalizeHeadings(translation.body),
        createdAt: item.pubDate,
      });

      const outputPath = path.join(TRANSLATE_MDX_DIR, `${slug}.mdx`);
      fs.writeFileSync(outputPath, mdxContent, 'utf-8');

      console.log(`  ✅ 저장 완료: ${slug}.mdx`);
      totalNew++;


    }
  }

  console.log(`\n✨ 번역 완료: ${totalNew}개 새 글 추가`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  translateNewPosts().catch(error => {
    console.error('❌ 번역 스크립트 실패:', error);
    process.exit(1);
  });
}
