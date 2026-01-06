import type { PropsWithChildren } from 'react';

import { HomeSection } from '@/views/home/ui/HomeSection';

type ArticleProps = PropsWithChildren<{
  imageSrc?: string;
}>;

function Article({ children }: ArticleProps) {
  return (
    <article className="flex-col-start size-full gap-5">
      {/* 이미지 */}
      <div className="aspect-4/3 h-auto w-full overflow-hidden rounded-2xl bg-foreground-2" />

      {/* 본문 */}
      <div className="flex-col-start w-full gap-2 px-1">{children}</div>
    </article>
  );
}

function Label({ children }: PropsWithChildren) {
  return <p className="font-subtitle-18">{children}</p>;
}

function Description({ children }: PropsWithChildren) {
  return <p className="font-body-16 leading-relaxed text-foreground-7">{children}</p>;
}

Article.Label = Label;
Article.Description = Description;

type Props = {
  id: string;
  label: string;
};

export function HomeCoreSkillsSection({ id, label }: Props) {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>핵심 역량입니다</HomeSection.Header>

      <div
        className={`
          grid size-full max-w-sm grid-cols-1 gap-10
          fold:max-w-5xl fold:grid-cols-2 fold:gap-x-6
          desktop:grid-cols-3
        `}
      >
        <Article>
          <Article.Label>빠른 학습과 발전</Article.Label>
          <Article.Description>상황에 따라 필요한 기술을 찾고 빠르게 습득 후 숙련도 향상</Article.Description>
        </Article>

        <Article>
          <Article.Label>높은 UI/UX 이해도</Article.Label>
          <Article.Description>시각디자인을 전공, 어플리케이션 리디자인 및 웹 페이지 디자인 경험</Article.Description>
        </Article>

        <Article>
          <Article.Label>효율적인 AI 활용</Article.Label>
          <Article.Description>
            AI 에이전트를 활용해 빠른 프로젝트 구현부터 MCP를 연결해 최적화 및 문서화한 경험
          </Article.Description>
        </Article>
      </div>
    </HomeSection>
  );
}
