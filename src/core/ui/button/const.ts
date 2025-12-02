import { cva } from 'class-variance-authority';

export const buttonVariants = cva('animated-100', {
  variants: {
    size: {
      sm: 'px-4 py-2.5 rounded-xl font-button-12 tablet:font-button-14',
      md: 'px-5 py-3.5 rounded-xl font-button-14 tablet:font-button-16',
      lg: 'px-6 py-4 rounded-2xl font-button-16 tablet:font-button-20',
    },
    color: {
      background: 'text-foreground',
      backgroundOutline: 'border text-foreground border-foreground-3',
      foreground: 'text-background bg-foreground border border-foreground',
      foregroundOutline: 'border text-foreground border-foreground',
      blue: 'text-background dark:text-foreground bg-blue-6 border border-blue-6',
      blueOutline: 'border text-blue-7 dark:text-blue-7 border-blue-7',
    },
    colorHover: {
      background: 'hover:bg-foreground-2',
      backgroundOutline: 'hover:bg-foreground-2 hover:border-foreground-2',
      foreground: 'hover:bg-foreground-9 hover:border-foreground-9',
      foregroundOutline: 'hover:bg-foreground-2',
      blue: 'hover:bg-blue-5 hover:border-blue-5',
      blueOutline: 'hover:bg-blue-2',
    },
    rounded: {
      true: 'rounded-full',
    },
  },
});
