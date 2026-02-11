import { describe, expect, it } from 'vitest';

import { cn } from './cn';

// ---------------------------------------------------------------------------
// cn
// ---------------------------------------------------------------------------
describe('cn', () => {
  it('단일 클래스 반환', () => {
    expect(cn('flex')).toBe('flex');
  });

  it('여러 클래스 공백으로 병합', () => {
    expect(cn('flex', 'p-4')).toBe('flex p-4');
  });

  it('Tailwind 충돌 클래스 해결 (마지막 클래스 우선)', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });

  it('조건부 false 클래스는 제외', () => {
    expect(cn('flex', false && 'hidden', 'p-4')).toBe('flex p-4');
  });

  it('undefined/null은 무시', () => {
    expect(cn('flex', undefined, null, 'p-4')).toBe('flex p-4');
  });

  it('빈 입력이면 빈 문자열 반환', () => {
    expect(cn()).toBe('');
  });

  it('객체 형태 조건부 클래스', () => {
    expect(cn({ flex: true, hidden: false })).toBe('flex');
  });

  it('배열 형태 클래스', () => {
    expect(cn(['flex', 'p-4'])).toBe('flex p-4');
  });

  it('text-color 충돌 해결', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});
