import { LinkButton } from '@/core/ui';

import { HOME_SECTION_ID_LABEL_MAP } from '@/views/home/model';
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
        <div className="grid w-full grid-cols-3 gap-1">
          <p className="font-subtitle-16">전화번호</p>
          <p className="col-span-2 font-body-16 leading-subtitle">010-8975-9268</p>
        </div>
        <div className="grid w-full grid-cols-3 gap-1">
          <p className="font-subtitle-16">이메일</p>
          <p className="col-span-2 font-body-16 leading-subtitle">jinhok96a@gmail.com</p>
        </div>
        <div className="grid w-full grid-cols-3 gap-2">
          <p className="font-subtitle-16">Github</p>
          <LinkButton
            href="https://github.com/jinhok96"
            target="_blank"
            className="col-span-2 font-body-16 leading-subtitle underline underline-offset-2"
          >
            <span>@jinhok96</span>
          </LinkButton>
        </div>
      </div>
      전화, 이메일 링크 추가? 아니면 복사 기능?
      <br /> <br /> <br /> <br /> <br /> <br /> <br />
      푸터 추가
    </HomeSection>
  );
}
