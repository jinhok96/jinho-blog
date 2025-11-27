import type { BlogMetadata } from '@/core/types/metadata';

export const metadata: BlogMetadata = {
  title: '두번째 블로그 포스트',
  description: '블로그를 시작합니다',
  category: ['react', 'nextjs'],
  createdAt: '2025-01-16',
  updatedAt: '2025-01-16',
};

export default function SecondPost() {
  return (
    <div>
      <h2>블로그를 시작하며</h2>
      <p>안녕하세요! 새로운 블로그를 시작합니다.</p>

      <h2>앞으로의 계획</h2>
      <p>다양한 개발 관련 글을 작성할 예정입니다.</p>

      <ul>
        <li>React 개발 팁</li>
        <li>TypeScript 활용법</li>
        <li>프로젝트 회고</li>
      </ul>

      <h2>마치며</h2>
      <p>많은 관심 부탁드립니다!</p>
    </div>
  );
}
