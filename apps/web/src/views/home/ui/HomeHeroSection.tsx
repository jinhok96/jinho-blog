import { LinkButton } from '@/core/ui';

import { HomeSection } from '@/views/home/ui/HomeSection';

import DoubleChevronDownIcon from 'public/icons/double_chevron_down.svg';
import DownloadIcon from 'public/icons/download.svg';

export function HomeHeroSection() {
  return (
    <HomeSection
      className="flex-col-center size-full min-h-screen bg-background"
      innerClassName={`
        my-12! flex-1 gap-14
        tablet:gap-20
      `}
    >
      {/* 바디 */}
      <div
        className={`
          flex-col-center h-full w-fit flex-1 justify-center gap-12 pt-header
          tablet:gap-14
        `}
      >
        {/* 본문 */}
        <div
          className={`
            flex-col-center w-fit gap-6
            tablet:gap-8
          `}
        >
          {/* 타이틀 */}
          <h1
            className={`
              font-title-56 text-gray-4
              tablet:font-title-64
            `}
          >
            안녕하세요,
            <br />
            <span className="text-foreground"> 프론트엔드</span>
            <br />
            개발자
            <br />
            <span className="text-blue-7">강진호</span>
            입니다.
          </h1>

          {/* 텍스트 */}
          <p
            className={`
              w-full pl-1 font-body-18 leading-relaxed text-gray-5
              tablet:font-body-20
            `}
          >
            사용자 중심 UI/UX를 고민합니다.
            <br />
            지속 가능한 서비스를 만들고 싶습니다.
          </p>
        </div>

        {/* 이력서 다운로드 버튼 */}
        <LinkButton
          href="#"
          size="md"
          color="background"
          className={`
            flex-row-center gap-2 bg-gray-1 text-gray-6
            hover:bg-gray-2
          `}
        >
          이력서 다운로드
          <div className="size-4">
            <DownloadIcon strokeWidth={1.5} />
          </div>
        </LinkButton>
      </div>

      {/* 아래로 아이콘 */}
      <div className="size-6 animate-bounce text-gray-4">
        <DoubleChevronDownIcon strokeWidth={1.5} />
      </div>
    </HomeSection>
  );
}
