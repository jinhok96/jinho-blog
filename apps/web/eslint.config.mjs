import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import boundaries from 'eslint-plugin-boundaries';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const simpleImportSort = (await import('eslint-plugin-simple-import-sort')).default;

// Boundaries configuration (defined outside defineConfig to allow functions)
const boundariesConfig = {
  plugins: {
    boundaries: boundaries,
  },
  settings: {
    'boundaries/elements': [
      // App layer
      {
        type: 'app',
        pattern: 'src/app/**',
        mode: 'folder',
      },

      // Views: segments (child elements - private) - 먼저 매칭
      {
        type: 'views-segment',
        pattern: 'src/views/*/*/**',
        mode: 'file',
        capture: ['slice', 'segment'],
      },
      // Views: slices (parent elements)
      {
        type: 'views',
        pattern: 'src/views/*',
        mode: 'folder',
        capture: ['slice'],
      },

      // Modules: segments (child elements - private) - 먼저 매칭
      {
        type: 'modules-segment',
        pattern: 'src/modules/*/*/**',
        mode: 'file',
        capture: ['slice', 'segment'],
      },
      // Modules: slices (parent elements)
      {
        type: 'modules',
        pattern: 'src/modules/*',
        mode: 'folder',
        capture: ['slice'],
      },

      // Features: segments (child elements - private) - 먼저 매칭
      {
        type: 'features-segment',
        pattern: 'src/features/*/*/**',
        mode: 'file',
        capture: ['slice', 'segment'],
      },
      // Features: slices (parent elements)
      {
        type: 'features',
        pattern: 'src/features/*',
        mode: 'folder',
        capture: ['slice'],
      },

      // Entities: segments (child elements - private) - 먼저 매칭
      {
        type: 'entities-segment',
        pattern: 'src/entities/*/*/**',
        mode: 'file',
        capture: ['slice', 'segment'],
      },
      // Entities: slices (parent elements)
      {
        type: 'entities',
        pattern: 'src/entities/*',
        mode: 'folder',
        capture: ['slice'],
      },

      // Core: child elements (internal, theme, button 등 - private) - 먼저 매칭
      {
        type: 'core-internal',
        pattern: 'src/core/*/*/**',
        mode: 'file',
        capture: ['segment', 'internal'],
      },
      // Core: segments (parent elements)
      {
        type: 'core',
        pattern: 'src/core/*',
        mode: 'folder',
        capture: ['segment'],
      },
    ],
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    // Layer hierarchy and slice isolation
    'boundaries/element-types': [
      2,
      {
        default: 'disallow',
        message: '${file.type} 레이어는 ${dependency.type} 레이어를 가져올 수 없습니다.',
        rules: [
          // Core: 같은 레이어 내에서만 import 가능, internal은 같은 세그먼트만
          {
            from: ['core'],
            allow: ['core', ['core-internal', { segment: '${segment}' }]],
          },
          {
            from: ['core-internal'],
            allow: ['core', ['core-internal', { segment: '${segment}' }]],
          },

          // Entities: core와 같은 슬라이스 내에서만 import 가능
          {
            from: ['entities', 'entities-segment'],
            allow: ['core', ['entities', { slice: '${slice}' }], ['entities-segment', { slice: '${slice}' }]],
          },

          // Features: core, entities, 같은 슬라이스 내에서만 import 가능
          {
            from: ['features', 'features-segment'],
            allow: [
              'core',
              'entities',
              ['features', { slice: '${slice}' }],
              ['features-segment', { slice: '${slice}' }],
            ],
          },

          // Modules: core, entities, features, 같은 슬라이스 내에서만 import 가능
          {
            from: ['modules', 'modules-segment'],
            allow: [
              'core',
              'entities',
              'features',
              ['modules', { slice: '${slice}' }],
              ['modules-segment', { slice: '${slice}' }],
            ],
          },

          // Views: app 제외한 모든 레이어, 같은 슬라이스 내에서만 import 가능
          {
            from: ['views', 'views-segment'],
            allow: [
              'core',
              'entities',
              'features',
              'modules',
              ['views', { slice: '${slice}' }],
              ['views-segment', { slice: '${slice}' }],
            ],
          },

          // App: 모든 레이어 import 가능 (child segments 포함)
          {
            from: ['app'],
            allow: ['core', 'entities', 'features', 'modules', 'views'],
          },
        ],
      },
    ],
  },
};

const baseConfig = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  ...compat.extends('prettier'),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
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
            // Internal packages
            ['^@jinho-blog/'],
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
]);

// Export config with boundaries (functions not cloned by defineConfig)
const config = [
  ...baseConfig,
  boundariesConfig,
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'src/styles/**', 'src/mdx/**'],
  },
];

export default config;
