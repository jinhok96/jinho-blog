import type { Timeline } from '@/views/home/types';
import type { PropsWithChildren } from 'react';

import { Show } from '@/core/ui';

type TimelinesProps = PropsWithChildren<{
  list: Timeline[];
}>;

export function Timelines({ list }: TimelinesProps) {
  return (
    <div className="grid w-fit max-w-3xl gap-10">
      {list.map(({ name, date, info, job, works }) => (
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

              <div className="flex-col-start gap-0.5">
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
                  <span>{info}</span>
                  <Show when={job}>
                    <span className="text-foreground-6">|</span>
                    <span>{job}</span>
                  </Show>
                </p>
              </div>
            </div>

            {/* 업무 */}
            <Show when={works}>
              {works => (
                <ul
                  className={`
                    flex-col-start gap-1.5 rounded-xl bg-foreground-1 p-4 font-body-14 leading-snug text-foreground-8
                  `}
                >
                  {works.map(workText => (
                    <li
                      key={workText}
                      className="flex-row-start gap-2"
                    >
                      {/* 닷 */}
                      <div className="flex-col-start h-[calc(0.875rem*1.375)] justify-center">
                        <div className="size-1 shrink-0 rounded-full bg-foreground-4" />
                      </div>

                      {/* 텍스트 */}
                      <span>{workText}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Show>
          </div>
        </div>
      ))}
    </div>
  );
}
