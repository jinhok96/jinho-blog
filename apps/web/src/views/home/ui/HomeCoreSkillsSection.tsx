import type { ComponentProps, PropsWithChildren } from 'react';

import Image from 'next/image';

import { HOME_SECTION_ID_LABEL_MAP } from '@/views/home/model';
import { HomeSection } from '@/views/home/ui/HomeSection';

import CoreSkill1Image from 'public/images/home_core_skill-1.webp';
import CoreSkill2Image from 'public/images/home_core_skill-2.webp';
import CoreSkill3Image from 'public/images/home_core_skill-3.webp';

type ArticleProps = PropsWithChildren<Pick<ComponentProps<typeof Image>, 'src' | 'alt'>>;

function Article({ children, src, alt }: ArticleProps) {
  return (
    <article className="flex-col-start size-full gap-5">
      {/* 이미지 */}
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        className="aspect-4/3 h-auto w-full overflow-hidden rounded-2xl bg-foreground-2"
      />

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

const { id, label } = HOME_SECTION_ID_LABEL_MAP.CORE_SKILLS;

export function HomeCoreSkillsSection() {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>다양한 경험과 시도로 빠르게 성장합니다</HomeSection.Header>

      <div
        className={`
          grid size-full max-w-sm grid-cols-1 gap-12
          tablet:max-w-5xl tablet:grid-cols-2 tablet:gap-x-6
          desktop:grid-cols-3
        `}
      >
        <Article
          src={CoreSkill1Image}
          alt="core-skill-1"
        >
          <Article.Label>오래된 기술부터 새로운 기술까지</Article.Label>
          <Article.Description>
            2019년 출시한 Vue 2부터 최근 업데이트한 React 19, Next.js 16에 이르기까지 다양한 시기의 기술을 다뤄본 경험
          </Article.Description>
        </Article>

        <Article
          src={CoreSkill2Image}
          alt="core-skill-2"
        >
          <Article.Label>높은 UI/UX 이해도</Article.Label>
          <Article.Description>
            시각디자인 전공, 필요한 아이콘 제작, 어플리케이션 리디자인 및 웹 페이지 디자인 경험
          </Article.Description>
        </Article>

        <Article
          src={CoreSkill3Image}
          alt="core-skill-3"
        >
          <Article.Label>효율적인 AI 활용</Article.Label>
          <Article.Description>
            AI 에이전트를 활용해 빠른 프로토타입 구현부터 MCP를 연결해 최적화 및 문서화한 경험
          </Article.Description>
        </Article>
      </div>
    </HomeSection>
  );
}
