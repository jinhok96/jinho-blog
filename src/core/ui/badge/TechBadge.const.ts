import type { TechBadgeProps } from '@/core/ui/badge/types';

const reactClassName = 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300';
const nextjsClassName = 'bg-gray-900 text-gray-100 dark:bg-gray-100 dark:text-gray-900';
const typescriptClassName = 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
const javascriptClassName = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
const tailwindcssClassName = 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300';
const cssClassName = 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400';
const htmlClassName = 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
const zustandClassName = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
const swrClassName = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
const motionClassName = 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300';

export const TECH_CLASSNAME_MAP: Record<TechBadgeProps['tech'], string> = {
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

export const TECH_NAME_MAP: Record<TechBadgeProps['tech'], string> = {
  react: 'React',
  nextjs: 'Next.js',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  tailwindcss: 'TailwindCSS',
  css: 'CSS',
  html: 'HTML',
  zustand: 'Zustand',
  swr: 'SWR',
  motion: 'Framer Motion',
};
