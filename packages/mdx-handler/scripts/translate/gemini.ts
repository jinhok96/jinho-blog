import type { GoogleGenAI } from '@google/genai';

import { TRANSLATE_SCRIPT_CONFIG, buildSummaryPrompt, buildTranslatePrompt } from '../../src/core/config';

export class FatalGeminiError extends Error {}

export function extractRetryDelay(error: unknown): number {
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

export async function callGeminiWithRetry(genAI: GoogleGenAI, prompt: string): Promise<string | null> {
  const { GEMINI_MODEL, MAX_RETRIES } = TRANSLATE_SCRIPT_CONFIG;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await genAI.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });
      return result.text ?? null;
    } catch (error) {
      const status = error && typeof error === 'object' && 'status' in error ? (error as { status: number }).status : 0;
      const message = (error as Error).message.split('\n')[0] ?? '';

      if (status === 401 || status === 403 || status === 404 || status === 429) {
        throw new FatalGeminiError(message);
      }

      console.warn(`⚠️  Gemini 오류 (시도 ${attempt}/${MAX_RETRIES}):`, message);
      return null;
    }
  }
  return null;
}

export interface TranslationResult {
  title: string;
  description: string;
  body: string;
}

const LINK_URL_REGEX = /(!?\[[^\]]*\])\((https?:\/\/[^)]+)\)/g;
const URL_PLACEHOLDER_REGEX = /__URL_(\d+)__/g;

export function extractAndReplaceLinkUrls(markdown: string): { processed: string; urls: string[] } {
  const urls: string[] = [];
  const processed = markdown.replace(LINK_URL_REGEX, (_, bracket, url) => {
    const index = urls.length;
    urls.push(url);
    return `${bracket}(__URL_${index}__)`;
  });
  return { processed, urls };
}

export function restoreLinkUrls(translated: string, urls: string[]): string {
  return translated.replace(URL_PLACEHOLDER_REGEX, (match, indexStr) => {
    const index = parseInt(indexStr, 10);
    return urls[index] ?? match;
  });
}

export async function translateWithGemini(
  genAI: GoogleGenAI,
  content: string,
  originalTitle: string,
  sourceName: string,
  mode: 'full' | 'summary' = 'full',
): Promise<TranslationResult | null> {
  const { processed, urls } = extractAndReplaceLinkUrls(content);
  const prompt =
    mode === 'full'
      ? buildTranslatePrompt(processed, originalTitle, sourceName)
      : buildSummaryPrompt(processed, originalTitle, sourceName);
  const raw = await callGeminiWithRetry(genAI, prompt);
  if (!raw) return null;

  const titleMatch = raw.match(/^TITLE:\s*(.+)$/m);
  const descMatch = raw.match(/^DESCRIPTION:\s*(.+)$/m);
  const bodyMatch = raw.match(/^BODY:\s*\n([\s\S]+)$/m);

  if (!titleMatch || !bodyMatch) return null;

  return {
    title: titleMatch[1].trim(),
    description: descMatch?.[1].trim() ?? '',
    body: restoreLinkUrls(bodyMatch[1].trim(), urls),
  };
}
