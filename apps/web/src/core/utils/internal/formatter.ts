/**
 * 숫자에 쉼표를 추가하는 함수
 */
export function formatNumberToLocaleString(value: number | string, maxDigits: number): string {
  // number로 변환
  const num: number = Number(value.toString().replace(/,/g, ''));

  // 유효하지 않은 숫자 처리
  if (isNaN(num)) return value.toString();

  // -0 또는 0일 경우 0으로 반환
  if (num === 0) return '0';

  // 천 단위 구분자 추가 (소수점 제한)
  return num.toLocaleString('ko-KR', { maximumFractionDigits: maxDigits });
}

/**
 * 쉼표가 포함된 숫자를 수로 변환하는 함수
 */
export function formatLocaleStringToNumber(value: string): number {
  if (!value) return 0;
  return Number(value.replace(/,/g, ''));
}

/**
 * 날짜를 포맷팅하는 함수
 */
export function formatDateToString(date: Date | string): string {
  if (!date) return '';

  try {
    const newDate = new Date(date);
    return newDate.toLocaleDateString('ko-KR');
  } catch (error) {
    console.error('formatDate', error);
    return date.toString();
  }
}
