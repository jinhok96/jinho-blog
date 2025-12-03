import type { TechBadgeProps } from '@/core/ui/badge/types';

const reactClassName = 'bg-cyan-2 text-cyan-8';
const nextjsClassName = 'bg-gray-8 text-gray-1';
const typescriptClassName = 'bg-blue-2 text-blue-8';
const javascriptClassName = 'bg-yellow-2 text-yellow-8';
const tailwindcssClassName = 'bg-sky-2 text-sky-8';
const cssClassName = 'bg-indigo-2 text-indigo-8';
const htmlClassName = 'bg-orange-2 text-orange-8';
const zustandClassName = 'bg-amber-2 text-amber-8';
const swrClassName = 'bg-gray-2 text-gray-8';
const motionClassName = 'bg-pink-2 text-pink-8';

export const TECH_BADGE_CLASSNAME_MAP: Record<TechBadgeProps['tech'], string> = {
  react: reactClassName,
  nextjs: nextjsClassName,
  typescript: typescriptClassName,
  javascript: javascriptClassName,
  tailwindcss: tailwindcssClassName,
  css: cssClassName,
  html: htmlClassName,
  zustand: zustandClassName,
  swr: swrClassName,
  motion: motionClassName,
};
