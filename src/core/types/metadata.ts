// 카테고리 타입 정의 (각 섹션별)
export type BlogCategory = 'react' | 'nextjs' | 'typescript' | 'architecture' | 'tutorial';

export type PortfolioCategory = 'web' | 'mobile' | 'design' | 'ui-ux' | 'react';

export type ProjectCategory = 'open-source' | 'personal' | 'client' | 'react';

export type LibraryCategory = 'ui' | 'hooks' | 'utils' | 'state-management' | 'react';

// 기술 스택 타입 (Project, Library에서 공통 사용)
export type TechStack =
  | 'react'
  | 'nextjs'
  | 'typescript'
  | 'javascript'
  | 'tailwindcss'
  | 'css'
  | 'html'
  | 'zustand'
  | 'swr'
  | 'motion';

// 모든 메타데이터에 공통 필드
interface BaseMetadata {
  title: string; // 제목
  description: string; // 요약 설명
  category: string; // 각 섹션에서 타입 오버라이드
  createdAt: string; // YYYY-MM-DD 형식
  updatedAt: string; // YYYY-MM-DD 형식
}

export interface BlogMetadata extends BaseMetadata {
  category: BlogCategory;
}

export interface PortfolioMetadata extends BaseMetadata {
  category: PortfolioCategory;
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
export type ContentMetadata = BlogMetadata | PortfolioMetadata | ProjectMetadata | LibraryMetadata;

export type MdxInfo = {
  slug: string; // 슬러그
  filePath: string; // MDX 파일 경로
};
