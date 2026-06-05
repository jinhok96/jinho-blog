export const TRANSLATE_SCRIPT_CONFIG = {
  GEMINI_MODEL: 'gemini-2.5-flash-lite',
  MAX_RETRIES: 3,
  INITIAL_POST_COUNT: 3,
  SCRAPE_TIMEOUT_MS: 10_000,
  SCRAPE_USER_AGENT: 'Mozilla/5.0 (compatible; TranslateBot/1.0)',
} as const;

// CC 라이선스 소스용: 전문 번역
export function buildTranslatePrompt(content: string, originalTitle: string, sourceName: string): string {
  return `당신은 전문 기술 번역가입니다. 다음 영어 기술 블로그 글(${sourceName})을 한국어로 번역하세요.

원문 제목: ${originalTitle}

번역 규칙:
- 코드 블록(\`\`\`...\`\`\`)은 번역하지 말고 그대로 유지하세요
- 기술 용어(API, props, hook, component 등)는 원문 그대로 유지하세요
- 고유명사(React, Next.js, TypeScript 등)는 원문 그대로 유지하세요
- 마크다운 형식(#, **, >, - 등)을 그대로 유지하세요
- 헤딩(# 제목) 옆에 앵커 링크(예: [#](#section-id))를 추가하지 마세요 — 웹사이트가 자동으로 생성합니다
- 문서 내 특정 섹션을 참조하는 내부 링크(예: [섹션 이름](#section-id))는 [섹션 이름] 형태로만 쓰고 링크 부분은 생략하세요. 외부 링크(http/https URL)는 그대로 유지하세요
- __URL_N__ 형태의 URL 플레이스홀더 토큰은 절대 수정하지 마세요. 링크 텍스트/alt 텍스트만 번역하세요
- 자연스러운 한국어로 번역하되, 기술 문서 특유의 명확하고 간결한 어조를 유지하세요
- 문장 어미는 반드시 "~입니다/~합니다" 체로 통일하세요 ("~이다/~한다" 체 사용 금지)

반드시 아래 형식으로 출력하세요. 다른 설명은 추가하지 마세요:

TITLE: <원문 제목을 한국어로 번역한 제목. 마크다운 없이 순수 텍스트>
DESCRIPTION: <글의 핵심 내용을 한 문장으로 요약. 마크다운/링크 없이 순수 텍스트, 최대 100자>
BODY:
<번역된 본문. 날짜, 작성자, 업데이트 알림 등 아티클 상단 메타데이터는 제외하고 첫 번째 실질적인 내용(문단 또는 헤딩)부터 시작>

원문:
${content}`;
}

// All-rights-reserved 소스용: 핵심 내용 요약 (저작권법 제28조 인용 범위 내)
export function buildSummaryPrompt(content: string, originalTitle: string, sourceName: string): string {
  return `당신은 기술 블로그 에디터입니다. 다음 영어 기술 블로그 글(${sourceName})의 핵심 내용을 한국어로 요약하세요.

원문 제목: ${originalTitle}

요약 규칙:
- 전체 분량의 15% 이내로 압축하세요 (원문 3,000단어 기준 약 450자 이내)
- 핵심 발표·변경사항을 3~5개 bullet point(- 형식)로 정리하세요
- 원문의 단락 구조를 그대로 따라가지 마세요 — 독자적인 요약문을 작성하세요
- 코드 블록은 가장 핵심적인 것 1개만 포함하고, 없으면 생략하세요
- 기술 용어(API, props, hook 등)와 고유명사(React, Next.js, TypeScript 등)는 원문 그대로 유지하세요
- 헤딩(# 제목) 옆에 앵커 링크(예: [#](#section-id))를 추가하지 마세요 — 웹사이트가 자동으로 생성합니다
- 문서 내 특정 섹션을 참조하는 내부 링크(예: [섹션 이름](#section-id))는 [섹션 이름] 형태로만 쓰고 링크 부분은 생략하세요. 외부 링크(http/https URL)는 그대로 유지하세요
- __URL_N__ 형태의 URL 플레이스홀더 토큰은 절대 수정하지 마세요. 링크 텍스트/alt 텍스트만 번역하세요
- 문장 어미는 반드시 "~입니다/~합니다" 체로 통일하세요 ("~이다/~한다" 체 사용 금지)
- 마지막 문장은 "자세한 내용은 원문에서 확인하세요."로 마무리하세요

반드시 아래 형식으로 출력하세요. 다른 설명은 추가하지 마세요:

TITLE: <원문 제목을 한국어로 번역한 제목. 마크다운 없이 순수 텍스트>
DESCRIPTION: <글의 핵심 내용을 한 문장으로 요약. 마크다운/링크 없이 순수 텍스트, 최대 100자>
BODY:
<요약된 본문>

원문:
${content}`;
}
