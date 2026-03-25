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
        width={400}
        height={300}
        className="aspect-4/3 h-auto w-full overflow-hidden rounded-2xl bg-foreground-2"
        priority
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
      <HomeSection.Header label={label}>사용자 경험을 개선하고 안정적으로 개발합니다</HomeSection.Header>

      <div
        className={`
          grid size-full max-w-sm grid-cols-1 gap-12
          tablet:max-w-5xl tablet:grid-cols-2 tablet:gap-x-6
          desktop:grid-cols-3
        `}
      >
        <Article
          src={CoreSkill2Image}
          alt="core-skill-2"
        >
          <Article.Label>상황에 맞는 기술 선택</Article.Label>
          <Article.Description>
            React, Vue.js, Next.js 등 다양한 프레임워크를 실무에서 다뤘습니다. 성능, 구조, 유지보수성 등 프로젝트
            요구사항에 적합한 기술을 적용하고 활용합니다.
          </Article.Description>
        </Article>

        <Article
          src={CoreSkill3Image}
          alt="core-skill-3"
        >
          <Article.Label>성능 최적화</Article.Label>
          <Article.Description>
            번들 크기, 로드 속도, 빌드 용량, 메모리 등 성능을 측정하고 개선합니다. 웹에서 빌드를 분석하고 최적화하여
            로드 시간을 32% 단축한 경험이 있습니다.
          </Article.Description>
        </Article>

        <Article
          src={CoreSkill1Image}
          alt="core-skill-1"
        >
          <Article.Label>사용자 경험 개선</Article.Label>
          <Article.Description>
            실무에서 개발과 UX/UI 디자인을 함께 담당했습니다. 사용자 시선에서 문제를 포착해 스플래시 화면을 직접
            기획·구현했고, 주간 거래 건수 50.8% 상승으로 이어졌습니다.
          </Article.Description>
        </Article>
      </div>
    </HomeSection>
  );
}
