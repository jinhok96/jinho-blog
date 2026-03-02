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
  | 'styled-components'
  | 'tailwindcss'
  // 라이브러리
  | 'tanstack-query'
  | 'axios'
  | 'swr'
  | 'zustand'
  | 'pinia'
  | 'react-hook-form'
  | 'jest'
  | 'vitest'
  | 'motion'
  // 번들러, 배포
  | 'webpack'
  | 'babel'
  | 'electron'
  | 'turbopack'
  | 'vercel'
  | 'vite'
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

// 카테고리 타입 정의 (각 섹션별)
export type ProjectCategory = 'tripmoney' | 'personal';
export type BlogCategory = 'frontend' | 'algorithm' | 'cs' | 'uiux' | 'review';
export type LibraryCategory = TechStack;
