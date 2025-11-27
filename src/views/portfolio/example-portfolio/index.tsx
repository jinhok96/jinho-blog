import type { PortfolioMetadata } from '@/core/types/metadata';

export const metadata: PortfolioMetadata = {
  title: '예제 포트폴리오',
  description: '포트폴리오 예제입니다',
  category: ['web', 'ui-ux'],
  createdAt: '2025-01-15',
  updatedAt: '2025-01-15',
};

export default function ExamplePortfolio() {
  return (
    <div>
      <h2>프로젝트 개요</h2>
      <p>이것은 포트폴리오 예제 콘텐츠입니다.</p>

      <h2>주요 기능</h2>
      <ul>
        <li>기능 1</li>
        <li>기능 2</li>
        <li>기능 3</li>
      </ul>

      <h2>사용 기술</h2>
      <p>React, TypeScript, Tailwind CSS</p>
    </div>
  );
}
