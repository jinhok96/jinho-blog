import { LinkButton, Show } from '@/core/ui';

import { CONTACT_LIST, HOME_SECTION_ID_LABEL_MAP } from '@/views/home/model';
import { HomeSection } from '@/views/home/ui/HomeSection';

const { id, label } = HOME_SECTION_ID_LABEL_MAP.CONTACT;

export function HomeContactSection() {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>
        <p>궁금하신 점이 있다면</p>
        <p>편하게 연락주세요</p>
      </HomeSection.Header>

      <div className="flex-col-center w-fit max-w-lg gap-4 rounded-2xl bg-foreground-2 px-7 py-6">
        {CONTACT_LIST.map(({ label, value, href }) => (
          <div
            key={label}
            className="grid w-full grid-cols-3 gap-1"
          >
            {/* 라벨 */}
            <p className="font-subtitle-16">{label}</p>

            {/* 정보 */}
            <p className="col-span-2 font-body-16 leading-subtitle">
              <Show
                when={href}
                fallback={<span>{value}</span>}
              >
                {href => (
                  <LinkButton
                    href={href}
                    target="_blank"
                    className="underline underline-offset-2"
                  >
                    {value}
                  </LinkButton>
                )}
              </Show>
            </p>
          </div>
        ))}
      </div>
    </HomeSection>
  );
}
