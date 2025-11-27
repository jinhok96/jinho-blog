import type { ProjectMetadata } from '@/core/types/metadata';

export const metadata: ProjectMetadata = {
  title: '예제 프로젝트',
  description: '프로젝트 예제입니다',
  category: ['personal'],
  tech: ['nextjs', 'react', 'typescript', 'tailwindcss'],
  createdAt: '2025-01-15T00:00:00.000Z',
  updatedAt: '2025-01-15T00:00:00.000Z',
};

export default function ExampleProject() {
  return (
    <div>
      <h2>프로젝트 소개</h2>
      <p>이것은 예제 프로젝트입니다.</p>

      <h2>개발 배경</h2>
      <p>프로젝트를 시작하게 된 배경을 설명합니다.</p>

      <h2>주요 기능</h2>
      <ul>
        <li>사용자 인증</li>
        <li>데이터 관리</li>
        <li>실시간 업데이트</li>
      </ul>

      <h2>기술 스택</h2>
      <p>Next.js, React, TypeScript, Tailwind CSS를 사용했습니다.</p>

      <h2>향후 계획</h2>
      <p>추가 기능 개발 예정입니다.</p>
    </div>
  );
}
