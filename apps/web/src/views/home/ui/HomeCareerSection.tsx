import { CAREER_LIST, HOME_SECTION_ID_LABEL_MAP } from '@/views/home/model';
import { HomeSection } from '@/views/home/ui/HomeSection';

const { id, label } = HOME_SECTION_ID_LABEL_MAP.CAREER;

export function HomeCareerSection() {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>디자인부터 개발까지 폭넓은 업무를 경험했습니다</HomeSection.Header>

      <div className="flex-col-center w-fit max-w-3xl gap-8">
        {CAREER_LIST.map(({ name, date, info, job, works }) => (
          <div
            key={name}
            className={`
              grid grid-cols-1 gap-3
              tablet:grid-cols-3 tablet:gap-8
            `}
          >
            {/* 기간 (태블릿) */}
            <div
              className={`
                mt-0.75 text-right font-caption-16 text-foreground-6
                not-tablet:hidden
              `}
            >
              {date.start} - {date.end}
            </div>

            {/* 정보 */}
            <div
              className={`
                flex-col-start gap-4
                tablet:col-span-2
              `}
            >
              <div className="flex-col-start gap-2">
                <p className="font-subtitle-20">{name}</p>

                <div className="flex-col-start gap-1">
                  {/* 기간 (모바일) */}
                  <p
                    className={`
                      font-caption-14 text-foreground-6
                      tablet:hidden
                    `}
                  >
                    {date.start} - {date.end}
                  </p>

                  {/* 기업 정보, 직무 */}
                  <p className="flex-row-center gap-1.5 font-caption-14 text-foreground-6">
                    {info} <span className="text-foreground-6">|</span> {job}
                  </p>
                </div>
              </div>

              {/* 업무 */}
              <ul
                className={`
                  flex-col-start gap-2 rounded-xl bg-foreground-1 p-4 font-body-14 leading-snug text-foreground-8
                `}
              >
                {works.map(workText => (
                  <li
                    key={workText}
                    className="flex-row-start gap-2"
                  >
                    <div className="mt-1.75 size-1 rounded-full bg-foreground-4" />
                    <span>{workText}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </HomeSection>
  );
}
