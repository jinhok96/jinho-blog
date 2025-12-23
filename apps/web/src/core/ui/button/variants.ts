import { cva } from 'class-variance-authority';

export const buttonVariants = cva('animated-100', {
  variants: {
    variant: {
      solid: '',
      outline: '',
    },

    color: {
      background: '',
      foreground: '',
      blue: '',
    },

    size: {
      sm: 'px-2.5 py-2 rounded-xl font-button-14',
      md: 'px-3.5 py-3 rounded-xl font-button-16',
      lg: 'px-4.5 py-3.5 rounded-2xl font-button-20',
    },

    rounded: {
      true: 'rounded-full',
    },

    disableHover: {
      true: '',
      false: '',
    },

    disabled: {
      true: 'opacity-40 cursor-not-allowed pointer-events-none',
      false: 'pointer-events-auto cursor-pointer',
    },
  },

  compoundVariants: [
    // Solid variants - base styles
    {
      variant: 'solid',
      color: 'background',
      className: 'text-foreground',
    },
    {
      variant: 'solid',
      color: 'foreground',
      className: 'text-background bg-foreground border border-foreground',
    },
    {
      variant: 'solid',
      color: 'blue',
      className: 'text-background dark:text-foreground bg-blue-6 border border-blue-6',
    },

    // Solid variants - hover styles (disabled가 아니고 disableHover가 아닐 때만)
    {
      variant: 'solid',
      color: 'background',
      disableHover: false,
      disabled: false,
      className: 'hover:bg-foreground-2',
    },
    {
      variant: 'solid',
      color: 'foreground',
      disableHover: false,
      disabled: false,
      className: 'hover:bg-foreground-9 hover:border-foreground-9',
    },
    {
      variant: 'solid',
      color: 'blue',
      disableHover: false,
      disabled: false,
      className: 'hover:bg-blue-5 hover:border-blue-5',
    },

    // Outline variants - base styles
    {
      variant: 'outline',
      color: 'background',
      className: 'border text-foreground border-foreground-3',
    },
    {
      variant: 'outline',
      color: 'foreground',
      className: 'border text-foreground border-foreground',
    },
    {
      variant: 'outline',
      color: 'blue',
      className: 'border text-blue-7 dark:text-blue-7 border-blue-7',
    },

    // Outline variants - hover styles (disabled가 아니고 disableHover가 아닐 때만)
    {
      variant: 'outline',
      color: 'background',
      disableHover: false,
      disabled: false,
      className: 'hover:bg-foreground-2',
    },
    {
      variant: 'outline',
      color: 'foreground',
      disableHover: false,
      disabled: false,
      className: 'hover:bg-foreground-2',
    },
    {
      variant: 'outline',
      color: 'blue',
      disableHover: false,
      disabled: false,
      className: 'hover:bg-blue-1',
    },
  ],

  defaultVariants: {
    variant: 'solid',
    disabled: false,
    disableHover: false,
  },
});
