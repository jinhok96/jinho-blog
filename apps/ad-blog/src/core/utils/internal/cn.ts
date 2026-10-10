import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 조건부 클래스 결합 + Tailwind 충돌 클래스 병합
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
