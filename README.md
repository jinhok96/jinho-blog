# jinho-blog

개인 블로그 및 포트폴리오 사이트

## Coverage

| Package | Coverage |
|---------|----------|
| nextjs-routes | [![nextjs-routes coverage](https://codecov.io/gh/jinhok96/jinho-blog/flags/nextjs-routes/badge.svg)](https://codecov.io/gh/jinhok96/jinho-blog/flags/nextjs-routes) |
| mdx-handler | [![mdx-handler coverage](https://codecov.io/gh/jinhok96/jinho-blog/flags/mdx-handler/badge.svg)](https://codecov.io/gh/jinhok96/jinho-blog/flags/mdx-handler) |

## Tech Stack

- Next.js 15.5.2
- React 19.1.0
- TypeScript
- Tailwind CSS 4
- FSD Architecture

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

- FSD (Feature-Sliced Design) 기반 아키텍처
- `/src/views` 폴더 기반 파일 시스템 라우팅
- SSR/SSG 지원

## Routes

- `/` - 홈페이지
- `/portfolio` - 포트폴리오 목록 및 상세
- `/blog` - 블로그 목록 및 상세
- `/projects` - 프로젝트 목록 및 상세
- `/libraries` - 라이브러리 목록 및 상세
