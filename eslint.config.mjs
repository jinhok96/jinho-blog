import { FlatCompat } from '@eslint/eslintrc';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const simpleImportSort = (await import('eslint-plugin-simple-import-sort')).default;

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'better-tailwindcss': betterTailwindcss,
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: './src/styles/globals.css',
        callees: ['clsx', 'cn', 'cva', 'twJoin', 'twMerge'],
        attributes: ['.*classname', '.*classnames', '.*className', '.*classNames', '.*CLASSNAME', '.*CLASSNAMES'],
      },
    },
    rules: {
      // Better Tailwindcss
      ...betterTailwindcss.configs['recommended-error'].rules,
      'better-tailwindcss/enforce-consistent-line-wrapping': [
        'error',
        {
          group: 'newLine',
          printWidth: 120,
          lineBreakStyle: 'unix',
        },
      ],
      'better-tailwindcss/enforce-consistent-variable-syntax': 'error',
      'better-tailwindcss/enforce-consistent-important-position': 'error',
      'better-tailwindcss/enforce-shorthand-classes': 'error',
      'better-tailwindcss/no-deprecated-classes': 'warn',
      'better-tailwindcss/no-unregistered-classes': [
        'error',
        {
          ignore: ['light', 'dark', 'system'],
        },
      ],

      // Simple import sort
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Type-only imports
            ['^.*\\u0000$'],
            // React & Next.js
            ['^react', '^react/', '^next', '^next/'],
            // External packages
            ['^@?\\w'],
            // Absolute imports (like @/components)
            ['^@/core'],
            ['^@/entities'],
            ['^@/features'],
            ['^@/widgets'],
            ['^@/'],
            // Public imports
            ['^public/'],
            // Relative imports
            ['^\\.'],
            // Style imports
            ['^\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // TypeScript
      '@typescript-eslint/consistent-type-imports': 'error',

      // Eslint
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
];

export default eslintConfig;
