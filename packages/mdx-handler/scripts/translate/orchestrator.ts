import * as fs from 'fs';
import * as path from 'path';

import { GoogleGenAI } from '@google/genai';
import { config as dotenvConfig } from 'dotenv';

import { TRANSLATE_SCRIPT_CONFIG, TRANSLATE_SOURCES } from '../../src/core/config';

import { type FeedItem, fetchFeedItems } from './feed';
import { FatalGeminiError, translateWithGemini } from './gemini';
import { buildMdxContent, generateSlug, normalizeHeadings } from './mdx-builder';
import { scrapeArticle } from './scraper';
import { findMonorepoRoot, getMdxDir, getTranslatedInfo } from './state';

export async function translateNewPosts(): Promise<void> {
  const monorepoRoot = findMonorepoRoot();
  dotenvConfig({ path: path.join(monorepoRoot, '.env.local') });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.');
  }

  const genAI = new GoogleGenAI({ apiKey });
  const mdxDir = getMdxDir(monorepoRoot);
  const { urls: translatedUrls, byCategory: translatedByCategory } = getTranslatedInfo(mdxDir);

  console.log(`📚 기존 번역 글: ${translatedUrls.size}개`);

  fs.mkdirSync(mdxDir, { recursive: true });

  let totalNew = 0;

  for (const source of TRANSLATE_SOURCES) {
    console.log(`\n🔍 [${source.name}] RSS 탐색 중...`);

    const feedItems = await fetchFeedItems(source.rssUrl);
    const isFirstTime = !translatedByCategory.has(source.category);

    let newItems: FeedItem[];

    if (isFirstTime) {
      const untranslated = feedItems.filter(item => !translatedUrls.has(item.link));
      newItems = untranslated.slice(0, TRANSLATE_SCRIPT_CONFIG.INITIAL_POST_COUNT);
      console.log(`   첫 수집 — 최근 ${newItems.length}개 가져옴 (전체: ${feedItems.length}개)`);
    } else {
      const lastTranslatedIdx = feedItems.findIndex(item => translatedUrls.has(item.link));
      if (lastTranslatedIdx === -1) {
        newItems = feedItems.filter(item => !translatedUrls.has(item.link));
      } else {
        newItems = feedItems.slice(0, lastTranslatedIdx).filter(item => !translatedUrls.has(item.link));
      }
      console.log(`   전체: ${feedItems.length}개, 새 글: ${newItems.length}개`);
    }

    const scrapeResults = await Promise.allSettled(
      newItems.map(async item => ({ item, scraped: await scrapeArticle(item.link) })),
    );

    for (const result of scrapeResults) {
      if (result.status === 'rejected') {
        console.warn(`  ⚠️  스크래핑 예외, 건너뜀:`, result.reason);
        continue;
      }

      const { item, scraped } = result.value;
      console.log(`\n  📄 번역 중: ${item.title}`);
      console.log(`     URL: ${item.link}`);

      if (!scraped) {
        console.warn(`  ⚠️  스크래핑 실패, 건너뜀`);
        continue;
      }

      let translation;
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

      const outputPath = path.join(mdxDir, `${slug}.mdx`);
      fs.writeFileSync(outputPath, mdxContent, 'utf-8');

      console.log(`  ✅ 저장 완료: ${slug}.mdx`);
      totalNew++;
    }
  }

  console.log(`\n✨ 번역 완료: ${totalNew}개 새 글 추가`);
}
