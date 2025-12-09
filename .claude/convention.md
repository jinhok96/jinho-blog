# 프로젝트 컨벤션

이 문서는 프로젝트의 코딩 컨벤션과 구조를 정의합니다. 모든 코드는 이 컨벤션을 따라야 합니다.

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router (페이지 라우팅)
│   ├── layout.tsx    # 루트 레이아웃
│   ├── not-found.tsx # 404 페이지
│   ├── (home)/       # 홈 페이지
│   ├── blog/         # 블로그 페이지
│   ├── projects/     # 프로젝트 페이지
│   └── libraries/    # 라이브러리 페이지
├── core/             # 공통 코드 (UI, hooks, utils 등)
│   ├── ui/           # 재사용 가능한 UI 컴포넌트
│   ├── hooks/        # 커스텀 React 훅
│   ├── utils/        # 유틸리티 함수
│   ├── config/       # 설정 파일
│   ├── store/        # Zustand 스토어
│   ├── mdx/          # MDX 관련 컴포넌트
│   ├── types/        # 공통 타입 정의
│   └── map/          # 매핑 데이터
├── entities/         # 엔티티 타입 정의
│   ├── blog/         # 블로그 관련 타입
│   ├── library/      # 라이브러리 관련 타입
│   └── project/      # 프로젝트 관련 타입
├── modules/          # 페이지 단위 모듈
│   └── header/       # 헤더 모듈
├── views/            # MDX 컨텐츠 (실제 블로그 글, 프로젝트 등)
│   ├── blog/         # 블로그 포스트 (MDX)
│   ├── projects/     # 프로젝트 상세 (MDX)
│   └── libraries/    # 라이브러리 상세 (MDX)
└── styles/           # 전역 스타일 시트
```

## TypeScript 설정

### 경로 별칭

- 절대 경로 **항상 사용** (index.ts 제외)
- `@/*` → `./src/*`
- `public/*` → `./public/*`

### 컴파일러 옵션

- Target: ES2017
- Strict mode 활성화
- JSX: react-jsx
- Module: esnext
- ModuleResolution: bundler

## 코딩 컨벤션

### 1. Import 순서 (ESLint 규칙)

`npm run lint`를 실행하여 자동 정렬합니다.

Import 그룹 순서:

1. Type-only imports (`import type { ... }`)
2. React & Next.js (`react`, `next`)
3. External packages (npm 패키지)
4. Absolute imports (내부 모듈)
   - `@/core`
   - `@/entities`
   - `@/features`
   - `@/widgets`
   - `@/` (기타)
5. Public imports (`public/`)
6. Relative imports (`./`, `../`)
7. Style imports (`.css`)

### 2. FSD 아키텍처 Import 규칙

#### Slice vs Segment 패턴

FSD(Feature Sliced Design) 아키텍처에서 각 레이어의 폴더는 두 가지 수준으로 나뉩니다:

- **Slice**: 레이어의 최상위 폴더 (예: `src/entities/blog`, `src/features/selectCategory`)
  - Public API로 취급됨
  - 반드시 `index.ts`를 통해 노출할 내용을 명시
  - 다른 레이어에서 import 가능

- **Segment**: Slice 내부의 폴더들 (예: `model`, `ui`, `types`)
  - Private 구현으로 취급됨
  - **절대 직접 import 금지** (같은 slice 내에서는 가능하지만 Public API 권장)
  - 항상 Slice의 Public API(`index.ts`)를 통해 접근 권장

#### 레이어 계층 및 Import 규칙

**레이어 계층 (하단이 하위):**

```
App (모든 것 import 가능)
  ↓
Views (뷰/페이지)
  ↓
Modules (페이지 단위 모듈)
  ↓
Features (기능 컴포넌트)
  ↓
Entities (타입/모델)
  ↓
Core (공통 코드)
```

**각 레이어의 import 규칙:**

| 레이어 | 할 수 있는 것 | 할 수 없는 것 |
|--------|-------------|------------|
| **App** | 모든 레이어의 모든 slice | 제한 없음 |
| **Views** | Core, Entities, Features, Modules, 같은 slice 내 segment | 다른 Views slice, App |
| **Modules** | Core, Entities, Features, 같은 slice 내 segment | Views, App |
| **Features** | Core, Entities, 같은 slice 내 segment | Modules, Views, App |
| **Entities** | Core, 같은 slice 내 segment | Features, Modules, Views, App |
| **Core** | 다른 Core segment, 같은 segment의 internal | 다른 모든 레이어 |
| **Core-internal** | Core, 같은 segment의 internal만 | 다른 segment의 internal |

**핵심 규칙:**
- ✅ 하위 레이어만 import 가능 (상위 레이어 import 금지)
- ✅ 같은 slice 내 segment끼리는 import 가능 (단, Public API 권장)
- ❌ 같은 레이어의 다른 slice는 import 불가

#### Public API 패턴

각 Slice는 반드시 `index.ts`를 통해 Public API를 명시적으로 노출해야 합니다:

**✅ Entities (타입/모델) 예시:**
```typescript
// src/entities/blog/index.ts
export * from './model';
export * from './types';

// src/entities/blog/model/index.ts
export { getBlogPost, getBlogPosts } from './model';

// src/entities/blog/types/index.ts
export type { Blog } from './types';
```

**✅ Features/Modules (UI 컴포넌트) 예시:**
```typescript
// src/features/selectCategory/index.ts
export * from './ui';

// src/features/selectCategory/ui/index.ts
export { SelectCategory } from './SelectCategory';
```

#### 경로 규칙

**절대 경로 사용 원칙:**
- **index.ts 제외** 모든 파일에서 절대 경로 `@/*` 사용
- 상대 경로 사용 금지 (index.ts만 예외)

**✅ Good - index.ts에서만 상대 경로 허용:**
```typescript
// src/views/blog/index.ts
export { BlogContentSection } from './ui';  // ✅ index.ts는 상대경로 가능
export { BlogHeader } from './header';      // ✅
```

**❌ Bad - 일반 파일에서 상대 경로:**
```typescript
// src/views/blog/ui/BlogContentSection.tsx
import { BlogHeader } from '../header/BlogHeader';  // ❌ 절대경로 사용 필수
```

#### Import 규칙 (Good vs Bad)

**✅ Good - Public API 사용 (가장 권장):**
```typescript
import { getBlogPosts } from '@/entities/blog';
import { SelectCategory } from '@/features/selectCategory';
import { BlogHeader } from '@/views/blog';
```

**✅ Good - 같은 Slice 내 다른 Segment import:**
```typescript
// src/views/blog/ui/BlogContentSection.tsx
import { BlogHeader } from '@/views/blog/header/BlogHeader';  // ✅ 가능
import { blogUtils } from '@/views/blog/utils/blogUtils';     // ✅ 가능

// 하지만 Public API를 통하는 것이 더 권장됨:
import { BlogHeader, blogUtils } from '@/views/blog';  // ✅✅ 더 좋음
```

**❌ Bad - 같은 레이어의 다른 Slice import:**
```typescript
// Views에서 다른 Views slice 접근
import { ProjectDetail } from '@/views/projects';  // ❌ 같은 레이어 다른 slice

// Entities에서 다른 Entities slice 접근
import { ProjectType } from '@/entities/project';  // ❌ blog slice에서
```

**❌ Bad - 하위 레이어에서 상위 레이어 접근:**
```typescript
// Entities에서 Features 접근
import { SelectCategory } from '@/features/selectCategory';  // ❌

// Features에서 Modules 접근
import { Header } from '@/modules/header';  // ❌
```

#### ESLint 경고 안내

`npm run lint` 실행 시 규칙 위반 시:
```
${레이어} 레이어는 ${레이어} 레이어를 가져올 수 없습니다.
```

이 메시지가 나오면:
1. 레이어 계층 확인 (상위 레이어를 import하고 있는지)
2. 같은 레이어의 다른 slice를 import하고 있는지 확인
3. Segment 직접 import 대신 Slice의 Public API 사용
4. `index.ts`에 필요한 export 추가

### 3. TypeScript 규칙

**타입 임포트는 항상 `import type` 사용:**

```typescript
// ✅ Good
import type { PropsWithChildren } from 'react';
import type { ButtonProps } from '@/core/ui/button/types';

// ❌ Bad
import { PropsWithChildren } from 'react';
import { ButtonProps } from '@/core/ui/button/types';
```

**Props 타입 정의 패턴:**

```typescript
// 기본 HTML 속성 확장 패턴
type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & ButtonProps;

// 또는 기본 패턴
type Props = {
  title: string;
  onClick: () => void;
};
```

**타입 우선순위:**

- `any` 사용 금지
- `interface`보다 `type` 선호
- Type annotation을 assertion보다 우선

### 3. 컴포넌트 작성 규칙

**파일 구조:**

```typescript
// 1. 'use client' 지시어 (필요한 경우)
'use client';

// 2. Type imports
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import type { ButtonProps } from '@/core/ui/button/types';

// 3. 일반 imports (순서 준수)
import { buttonVariants } from '@/core/ui/button/variants';
import { cn } from '@/core/utils';

// 4. Type 정의
type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & ButtonProps;

// 5. 컴포넌트 (named export)
export function ComponentName({ prop1, prop2 }: Props) {
  return (
    <div>...</div>
  );
}
```

**컴포넌트 Export:**

- Named export 사용 (default export 아님)

### 4. 스타일링 규칙

**Tailwind CSS + CSS 변수 + CVA 조합:**

```typescript
// CVA를 사용한 variants 정의
import { cva } from 'class-variance-authority';

export const buttonVariants = cva('animated-100', {
  variants: {
    variant: {
      solid: '',
      outline: '',
    },
    size: {
      sm: 'px-2.5 py-2 rounded-xl font-button-14',
      md: 'px-3.5 py-2.5 rounded-xl font-button-16',
      lg: 'px-4.5 py-3 rounded-2xl font-button-20',
    },
  },
  defaultVariants: {
    variant: 'solid',
  },
});

// 컴포넌트에서 사용
import { cn } from '@/core/utils';

<button
  className={cn(
    buttonVariants({
      variant,
      size,
    }),
    className,
  )}
>
```

**CSS 변수 시스템:**

```css
/* color.css에 정의된 변수 활용 */
:root {
  --foreground: var(--color-zinc-900);
  --background: var(--color-white);

  /* color-mix를 활용한 투명도 조절 */
  --background-1: color-mix(in srgb, var(--background) 4%, transparent);
  --background-2: color-mix(in srgb, var(--background) 10%, transparent);
}

/* 다크모드 */
:root:where(.dark):not(.system) {
  --foreground: var(--color-white);
  --background: var(--color-zinc-900);
}
```

**Tailwind 사용 예시:**

```typescript
// cn 유틸리티로 클래스 병합
<div className={cn('flex items-center gap-2', className)}>
```

### 5. Prettier 설정 준수

```json
{
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "bracketSpacing": true,
  "singleQuote": true,
  "trailingComma": "all",
  "endOfLine": "lf",
  "printWidth": 120,
  "singleAttributePerLine": true
}
```

**핵심:**

- 탭 대신 스페이스 2칸
- 싱글 쿼트 사용
- 한 줄에 하나의 속성 (JSX)
- 최대 120자
- 줄바꿈: LF (Unix)

## 기술 스택

### 주요 프레임워크 & 라이브러리

- **Next.js**: 16.0.7 (App Router)
- **React**: 19.2.1
- **TypeScript**: 5.x
- **Tailwind CSS**: 4.1.17
- **Zustand**: 5.0.8 (상태 관리)

### 스타일링

- **class-variance-authority**: 0.7.1 (variants)
- **clsx**: 2.1.1 (조건부 클래스)
- **tailwind-merge**: 3.4.0 (클래스 병합)
- **motion**: 12.23.24 (애니메이션)

### MDX & Markdown

- **next-mdx-remote-client**: 2.1.7 (MDX 렌더링)
- **gray-matter**: 4.0.3 (front matter 파싱)
- **remark-gfm**: 4.0.1 (GitHub Flavored Markdown)
- **rehype-slug**: 6.0.0 (헤딩 ID 자동 생성)
- **rehype-autolink-headings**: 7.1.0 (헤딩 링크 자동 생성)
- **react-syntax-highlighter**: 16.1.0 (코드 하이라이팅)

### 개발 도구

- **ESLint**: 9.x
  - eslint-config-next
  - eslint-config-prettier
  - eslint-plugin-simple-import-sort
  - eslint-plugin-better-tailwindcss
- **Prettier**: 3.6.2
- **SVGR**: 8.1.0 (SVG를 React 컴포넌트로)
- **tsx**: 4.20.6 (TypeScript 실행)
- **concurrently**: 9.2.1 (병렬 스크립트 실행)

## 특수 설정

### SVG 처리

```typescript
// SVG는 React 컴포넌트로 import
import Logo from 'public/logo.svg';

// svgr.d.ts에 타입 정의됨
declare module '*.svg' {
  const SVG: ComponentType<SVGProps<SVGSVGElement>>;
  export default SVG;
}
```

### MDX 처리

- `src/views/` 디렉토리의 MDX 파일들은 블로그 포스트/프로젝트/라이브러리 컨텐츠로 렌더링됨
- `next-mdx-remote-client`를 사용하여 서버 사이드에서 MDX 컴파일
- `gray-matter`로 front matter 파싱
- 커스텀 MDX 컴포넌트는 `src/core/mdx/createMDXComponents.tsx`에 정의

### 빌드 & 개발 스크립트

```json
{
  "lf": "prettier --write -l --end-of-line lf src scripts",
  "eslint": "eslint src scripts --ext .ts,.tsx,.js,.jsx",
  "tsc": "npx tsc --noEmit",
  "gcr": "tsx scripts/generate-content-registry.ts",
  "lint": "concurrently \"npm run lf\" \"npm run eslint\" \"npm run tsc\"",
  "predev": "concurrently \"npm run lint\" \"npm run gcr\"",
  "dev": "next dev",
  "prebuild": "concurrently \"npm run lint\" \"npm run gcr\"",
  "build": "next build"
}
```

## Git 커밋 컨벤션

브랜치: `main` (메인 브랜치)

커밋 메시지 형식:

```
[YY.MM.DD] 변경 내용 한글 설명
```

예시:

- `[25.12.04] concurrently 패키지 설치 및 스크립트 개선`
- `[25.12.04] 정적 페이지 생성할 때 path도 포함시키도록 변경`
- `[25.12.04] useIsMountedRef 훅 추가, 나머지 린팅`

## 필수 체크리스트

코드 작성 시 반드시 확인:

- [ ] Import 순서가 ESLint 규칙을 따르는가?
- [ ] Type import는 `import type`을 사용했는가?
- [ ] 경로는 `@/*` 절대 경로를 사용했는가? (index.ts 제외)
- [ ] FSD 레이어 계층을 준수하는가? (하위 레이어만 import)
- [ ] 같은 레이어의 다른 slice를 import하지 않는가?
- [ ] Segment 직접 import보다 Slice의 Public API를 우선 사용하는가?
- [ ] 필요한 export가 `index.ts`에 추가되었는가?
- [ ] Prettier 규칙(싱글 쿼트, 120자, 2칸 들여쓰기, LF)을 준수했는가?
- [ ] 컴포넌트는 named export인가?
- [ ] Props 타입이 명확히 정의되었는가?
- [ ] 스타일은 CVA + cn 유틸리티를 사용했는가?
- [ ] 파일 위치가 디렉토리 구조에 맞는가?
- [ ] `npm run lint`를 실행해 오류가 검출되지 않았는가?

## 참고 파일

새로운 코드 작성 전 반드시 참고:

### 필수 설정 파일

- [package.json](../../package.json) - 패키지 및 스크립트
- [tsconfig.json](../../tsconfig.json) - TypeScript 설정
- [eslint.config.mjs](../../eslint.config.mjs) - ESLint 규칙
- [.prettierrc](../../.prettierrc) - Prettier 설정
- [next.config.ts](../../next.config.ts) - Next.js 설정

### 코드 패턴 참고

**레이아웃 & 페이지:**

- [src/app/layout.tsx](../../src/app/layout.tsx) - 루트 레이아웃 패턴
- [src/app/(home)/page.tsx](<../../src/app/(home)/page.tsx>) - 홈 페이지 패턴
- [src/app/blog/[slug]/page.tsx](../../src/app/blog/[slug]/page.tsx) - 동적 라우트 패턴

**컴포넌트:**

- [src/core/ui/button/Button.tsx](../../src/core/ui/button/Button.tsx) - 컴포넌트 패턴
- [src/core/ui/button/variants.ts](../../src/core/ui/button/variants.ts) - CVA variants 패턴
- [src/modules/header/Header.tsx](../../src/modules/header/Header.tsx) - 모듈 컴포넌트 패턴

**Zustand Store:**

- [src/core/store/theme/store.ts](../../src/core/store/theme/store.ts) - Zustand 패턴
- [src/core/store/theme/provider.tsx](../../src/core/store/theme/provider.tsx) - Provider 패턴
- [src/core/store/utils/createSelectors.ts](../../src/core/store/utils/createSelectors.ts) - Selectors 유틸리티

**Hooks:**

- [src/core/hooks/useIntersectionObserver.ts](../../src/core/hooks/useIntersectionObserver.ts) - 커스텀 훅 패턴

**Utils:**

- [src/core/utils/cn.ts](../../src/core/utils/cn.ts) - 클래스 병합 유틸리티

**MDX:**

- [src/core/mdx/createMDXComponents.tsx](../../src/core/mdx/createMDXComponents.tsx) - MDX 컴포넌트 정의
- [src/core/mdx/MDXComponent.tsx](../../src/core/mdx/MDXComponent.tsx) - MDX 렌더러

### 스타일 참고

- [src/styles/globals.css](../../src/styles/globals.css) - 전역 스타일
- [src/styles/color.css](../../src/styles/color.css) - 색상 시스템
- [src/styles/font.css](../../src/styles/font.css) - 폰트 설정
- [src/styles/utility.css](../../src/styles/utility.css) - 유틸리티 클래스

### 타입 참고

- [src/core/types/params.ts](../../src/core/types/params.ts) - 공통 타입
- [src/entities/blog/types.ts](../../src/entities/blog/types.ts) - 블로그 타입
- [src/entities/project/types.ts](../../src/entities/project/types.ts) - 프로젝트 타입
- [src/entities/library/types.ts](../../src/entities/library/types.ts) - 라이브러리 타입
