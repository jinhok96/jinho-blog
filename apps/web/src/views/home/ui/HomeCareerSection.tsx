import { CAREER_LIST, HOME_SECTION_ID_LABEL_MAP } from '@/views/home/model';
import { HomeSection } from '@/views/home/ui/HomeSection';
import { Timelines } from '@/views/home/ui/Timelines';

const { id, label } = HOME_SECTION_ID_LABEL_MAP.CAREER;

export function HomeCareerSection() {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>디자인부터 개발까지 폭넓은 업무를 경험했습니다</HomeSection.Header>

      <Timelines list={CAREER_LIST} />
    </HomeSection>
  );
}
