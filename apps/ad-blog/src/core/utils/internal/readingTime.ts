/** 영어 기준 분당 읽기 단어 수 */
const WORDS_PER_MINUTE = 230;

/**
 * MDX 본문 → 예상 읽기 시간(분, 최소 1분)
 * - 코드 블록·이미지·링크 URL·마크다운 기호·HTML 태그는 제외
 */
export function getReadingMinutes(content: string): number {
  const words = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[#>*_`~|-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  return Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));
}
