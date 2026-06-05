import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';

import { TRANSLATE_SCRIPT_CONFIG } from '../../src/core/config';

export async function scrapeArticle(url: string): Promise<{ title: string; markdown: string } | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TRANSLATE_SCRIPT_CONFIG.SCRAPE_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': TRANSLATE_SCRIPT_CONFIG.SCRAPE_USER_AGENT },
    });
    clearTimeout(timer);

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

    turndown.addRule('codeBlock', {
      filter: ['pre'],
      replacement: (content, node) => {
        const codeNode = (node as Element).querySelector('code');
        const lang = codeNode?.className?.match(/language-(\S+)/)?.[1] || '';
        const code = codeNode?.textContent || content;
        return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
      },
    });

    turndown.addRule('video', {
      filter: 'video',
      replacement: (_content, node) => {
        const el = node as Element;
        const src =
          el.getAttribute('src') ||
          el.querySelector('source[type="video/mp4"]')?.getAttribute('src') ||
          el.querySelector('source')?.getAttribute('src');
        if (!src) return '';
        const alt = el.getAttribute('alt') || '';
        return `\n![${alt}](${src})\n`;
      },
    });

    const markdown = turndown.turndown(article.content ?? '');
    return { title: article.title || '', markdown };
  } catch (error) {
    clearTimeout(timer);
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`⚠️  스크래핑 타임아웃: ${url}`);
    } else {
      console.warn(`⚠️  스크래핑 오류: ${url}`, error);
    }
    return null;
  }
}
