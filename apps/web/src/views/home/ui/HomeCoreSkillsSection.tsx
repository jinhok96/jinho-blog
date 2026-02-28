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
      <HomeSection.Header label={label}>다양한 경험으로 깊이 있게 개발합니다</HomeSection.Header>

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
          <Article.Label>디자인을 이해하는 개발자</Article.Label>
          <Article.Description>
            시각디자인과 소프트웨어를 복수전공하고, 실무에서 두 역할을 함께 담당했습니다. 디자인 시스템을 직접
            설계·구현해 디자인-개발 간 정합성을 높였습니다.
          </Article.Description>
        </Article>

        <Article
          src={CoreSkill2Image}
          alt="core-skill-2"
        >
          <Article.Label>상황에 맞는 기술 선택</Article.Label>
          <Article.Description>
            React, Vue.js, Next.js 등 다양한 프레임워크를 실무에서 다뤘습니다. SSR로 초기 로딩을 개선하고, FSD
            아키텍처를 도입해 복잡한 도메인을 분리하는 등 상황에 맞는 기술을 선택해 적용합니다.
          </Article.Description>
        </Article>

        <Article
          src={CoreSkill3Image}
          alt="core-skill-3"
        >
          <Article.Label>성능 최적화</Article.Label>
          <Article.Description>
            번들 크기, 로드 속도, 빌드 용량, 메모리 등 성능을 측정하고 개선합니다. 웹에서 빌드를 최적화하여 로드 시간
            68% 단축을 달성한 경험이 있습니다.
          </Article.Description>
        </Article>
      </div>
    </HomeSection>
  );
}
