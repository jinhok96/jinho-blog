# TripMoney 프로젝트 컨벤션

이 문서는 TripMoney 프로젝트의 코딩 컨벤션과 구조를 정의합니다. 모든 코드는 이 컨벤션을 따라야 합니다.

## 프로젝트 구조

커스텀 FSD 구조
app <- views(=page) <- modules(=widgets) <- features <- entities <- core(=shared)

## TypeScript 설정

### 경로 별칭

- `@/*` → `./src/*` (절대 경로 - **항상 사용**)
- `public/*` → `./public/*`

### 컴파일러 옵션

- Target: ES2017
- Strict mode 활성화
- JSX: preserve
- Module: esnext
- ModuleResolution: bundler

## 코딩 컨벤션

### 1. Import 순서 (ESLint 규칙)

**반드시 아래 순서를 따라야 합니다:**

```typescript
// 1. Type-only imports
import type { ComponentType } from 'react';

// 2. React & Next.js
import { useState } from 'react';
import Link from 'next/link';

// 3. External packages
import { create } from 'zustand';

// 4. Absolute imports (@/)
import { Button } from '@/components/button/Button';

// 5. Public imports
import Logo from 'public/logo.svg';

// 6. Relative imports
import { localHelper } from './helper';

// 7. Style imports
import './styles.css';
```

### 2. TypeScript 규칙

**타입 임포트는 항상 `import type` 사용:**

```typescript
// ✅ Good
import type { NextRequest } from 'next/server';
import type { PropsWithChildren } from 'react';

// ❌ Bad
import { NextRequest } from 'next/server';
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

### 3. 컴포넌트 작성 규칙

**파일 구조:**

```typescript
// 1. Type imports
import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

// 2. 일반 imports (순서 준수)
import { BUTTON_SIZE } from '@/components/button/Button.const';

// 3. Type 정의
type Props = DetailedHTMLProps<...> & CustomProps;

// 4. 컴포넌트 (default export)
export default function ComponentName({ prop1, prop2 }: Props) {
  return (
    <div>...</div>
  );
}
```

**Zustand Store 패턴:**

```typescript
// store.ts
import type { StoreType, StoreState } from './type';
import { createStore } from 'zustand/vanilla';

export const defaultInitState: StoreState = {
  value: null,
};

export const createCustomStore = (initState: StoreState = defaultInitState) => {
  return createStore<StoreType>()(set => ({
    ...initState,
    setValue: value => set({ value }),
  }));
};
```

### 4. 스타일링 규칙

**Tailwind CSS + CSS 변수 조합:**

```typescript
// className 배열로 조합
<button
  className={[
    'animated-100',
    size && BUTTON_SIZE[size],
    color && BUTTON_COLOR[color],
    className,
  ].join(' ')}
>
```

**CSS 변수 사용:**

```css
/* color.css에 정의된 변수 활용 */
:root {
  --black: #171719;
  --white: #ffffff;
  --background: var(--white);
  --foreground: var(--black);
  --background-1: color-mix(in srgb, var(--background) 4%, transparent);
}
```

### 5. Prettier 설정 준수

```json
{
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 120,
  "singleAttributePerLine": true
}
```

**핵심:**

- 탭 대신 스페이스 2칸
- 싱글 쿼트 사용
- 한 줄에 하나의 속성 (JSX)
- 최대 120자

## 기술 스택

### 주요 프레임워크 & 라이브러리

- **Next.js**: 15.5.2 (App Router)
- **React**: 19.1.0
- **TypeScript**: 5.x
- **Tailwind CSS**: 4.x
- **Zustand**: 5.0.8 (상태 관리)
- **SWR**: 2.3.6 (데이터 페칭)
- **react-kakao-maps-sdk**: 1.2.0 (카카오맵)

### 개발 도구

- **ESLint**: 9.x + Next.js config + Prettier
- **Prettier**: 3.6.2 + Tailwind plugin
- **SVGR**: 8.1.0 (SVG를 React 컴포넌트로)

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

### 다국어 (i18n)

- 미들웨어로 언어 감지 및 리다이렉트
- URL: `/[lang]/...` 패턴
- 지원 언어: ko, en
- 기본 언어: ko

### 환경변수

- `.env.development` - 개발 환경
- `NEXT_PUBLIC_*` - 클라이언트에서 접근 가능
- `NEXT_PUBLIC_KAKAO_MAP_KEY` - 카카오맵 API 키
- `NEXT_PUBLIC_IMAGE_BASE_URL` - 이미지 베이스 URL

## Git 커밋 컨벤션

브랜치: `jinho` (현재 작업 브랜치)

최근 커밋 메시지 스타일:

```
[YYYY-MM-DD-N] 변경 내용 한글 설명
```

예시:

- `[2025-10-15-10] 공통 로직을 헬퍼 함수로 공통화`
- `[2025-10-15-9] currentChatId, currentChat을 currentChat으로 통합`

## 타입스크립트 컨벤션

- `any` 사용 금지
- 필요한 경우 Type annotation을 assertion보다 먼저 시도
- `interface`보다 `type` 선호

## 필수 체크리스트

코드 작성 시 반드시 확인:

- [ ] Import 순서가 ESLint 규칙을 따르는가?
- [ ] Type import는 `import type`을 사용했는가?
- [ ] 경로는 `@/*` 절대 경로를 사용했는가?
- [ ] Prettier 규칙(싱글 쿼트, 120자, 2칸 들여쓰기)을 준수했는가?
- [ ] 컴포넌트는 default export인가?
- [ ] Props 타입이 명확히 정의되었는가?
- [ ] CSS는 Tailwind + CSS 변수 조합인가?
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

- [src/app/[lang]/layout.tsx](../../src/app/[lang]/layout.tsx) - 레이아웃 패턴
- [src/components/button/Button.tsx](../../src/components/button/Button.tsx) - 컴포넌트 패턴
- [src/store/dictStore/store.ts](../../src/store/dictStore/store.ts) - Zustand 패턴
- [src/middleware.ts](../../src/middleware.ts) - 미들웨어 패턴

### 스타일 참고

- [src/styles/globals.css](../../src/styles/globals.css) - 전역 스타일
- [src/styles/color.css](../../src/styles/color.css) - 색상 시스템
