import type { BlogCategory, LibraryCategory, ProjectCategory } from './category';

// 기술 스택 타입 (Project, Library에서 공통 사용)
export type TechStack =
  // 프론트엔드
  | 'html'
  | 'javascript'
  | 'typescript'
  | 'react'
  | 'vue'
  | 'nextjs'
  | 'react-native'
  // 스타일
  | 'css'
  | 'sass'
  | 'styled-component'
  | 'tailwindcss'
  // 라이브러리
  | 'tanstack-query'
  | 'swr'
  | 'zustand'
  | 'react-hook-form'
  | 'jest'
  | 'motion'
  // 번들러, 배포
  | 'webpack'
  | 'babel'
  | 'electron'
  | 'turbopack'
  | 'vercel'
  // 디자인
  | 'figma'
  | 'illustrator'
  | 'photoshop'
  | 'in-design'
  | 'after-effects'
  // 협업
  | 'git'
  | 'github'
  | 'slack'
  | 'trello'
  | 'jira'
  | 'notion';

// 모든 메타데이터에 공통 필드
export interface BaseMetadata {
  title: string; // 제목
  description: string; // 요약 설명
  category: string; // 각 섹션에서 타입 오버라이드
  createdAt: string; // YYYY-MM-DD 형식
  updatedAt: string; // YYYY-MM-DD 형식
}

export interface BlogMetadata extends BaseMetadata {
  category: BlogCategory;
}

export interface ProjectMetadata extends BaseMetadata {
  category: ProjectCategory;
  tech: TechStack[];
}

export interface LibraryMetadata extends BaseMetadata {
  category: LibraryCategory;
  tech: TechStack[];
}

// Union type for all metadata
export type ContentMetadata = BlogMetadata | ProjectMetadata | LibraryMetadata;

export type MdxInfo = {
  slug: string; // 슬러그
  filePath: string; // MDX 파일 경로
  path: string; // 자동 생성된 경로 (예: /blog/slug)
};
