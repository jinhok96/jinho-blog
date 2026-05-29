export const TRANSLATE_SCRIPT_CONFIG = {
  GEMINI_MODEL: 'gemini-2.5-flash-lite',
  MAX_RETRIES: 3,
  INITIAL_POST_COUNT: 3,
  SCRAPE_TIMEOUT_MS: 10_000,
  SCRAPE_USER_AGENT: 'Mozilla/5.0 (compatible; TranslateBot/1.0)',
} as const;

export function buildTranslatePrompt(content: string, originalTitle: string, sourceName: string): string {
  return `당신은 전문 기술 번역가입니다. 다음 영어 기술 블로그 글(${sourceName})을 한국어로 번역하세요.

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
}
