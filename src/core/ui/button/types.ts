import type { buttonVariants } from '@/core/ui/button/const';
import type { VariantProps } from 'class-variance-authority';

export type ButtonProps = VariantProps<typeof buttonVariants> & {
  disableHover?: boolean;
};
