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
          <Article.Label>팀 개발 환경 개선</Article.Label>
          <Article.Description>
            재사용 가능한 코드의 비중을 높여 개발 속도와 확장성을 높이고, 빌드 배포 절차를 정비해 프로덕션 안정성을
            개선했습니다.
          </Article.Description>
        </Article>

        <Article
          src={CoreSkill2Image}
          alt="core-skill-2"
        >
          <Article.Label>UI/UX 디자인 경험 및 소통</Article.Label>
          <Article.Description>
            시각디자인 전공한 경험을 바탕으로 에셋을 제작하고 웹 앱 UI/UX를 디자인했습니다. 이 경험을 바탕으로
            디자이너와 원활하게 소통할 수 있습니다.
          </Article.Description>
        </Article>

        <Article
          src={CoreSkill3Image}
          alt="core-skill-3"
        >
          <Article.Label>적극적인 AI 활용</Article.Label>
          <Article.Description>
            AI 에이전트를 활용해 빠르게 기능 프로토타입을 구현하였으며, 브라우저 MCP를 통해 성능을 검사하고 최적화해
            로드 시간을 최대 68% 감소시켰습니다.
          </Article.Description>
        </Article>
      </div>
    </HomeSection>
  );
}
