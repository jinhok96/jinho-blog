// 카테고리 타입 정의 (각 섹션별)
export type BlogCategory =
  | 'react'
  | 'nextjs'
  | 'typescript'
  | 'architecture'
  | 'tutorial';

export type PortfolioCategory =
  | 'web'
  | 'mobile'
  | 'design'
  | 'ui-ux';

export type ProjectCategory =
  | 'open-source'
  | 'personal'
  | 'client';

export type LibraryCategory =
  | 'ui'
  | 'hooks'
  | 'utils'
  | 'state-management';

// 기술 스택 타입 (Project, Library에서 공통 사용)
export type TechStack =
  | 'react'
  | 'nextjs'
  | 'typescript'
  | 'javascript'
  | 'tailwindcss'
  | 'css'
  | 'html'
  | 'nodejs'
  | 'express'
  | 'zustand'
  | 'redux'
  | 'graphql'
  | 'rest-api'
  | 'mongodb'
  | 'postgresql'
  | 'mysql';

// 모든 메타데이터에 공통 필드
export interface BaseMetadata {
  title: string;
  description: string;
  category: string[]; // 각 섹션에서 타입 오버라이드
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export interface BlogMetadata extends BaseMetadata {
  category: BlogCategory[];
  date: string; // 발행일 (블로그 특화)
}

export interface PortfolioMetadata extends BaseMetadata {
  category: PortfolioCategory[];
}

export interface ProjectMetadata extends BaseMetadata {
  category: ProjectCategory[];
  tech: TechStack[];
}

export interface LibraryMetadata extends BaseMetadata {
  category: LibraryCategory[];
  tech: TechStack[];
}

// Union type for all metadata
export type ContentMetadata =
  | BlogMetadata
  | PortfolioMetadata
  | ProjectMetadata
  | LibraryMetadata;
