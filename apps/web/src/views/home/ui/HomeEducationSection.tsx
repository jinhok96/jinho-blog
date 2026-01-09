import { EDUCATION_LIST, HOME_SECTION_ID_LABEL_MAP } from '@/views/home/model';
import { HomeSection } from '@/views/home/ui/HomeSection';
import { Timelines } from '@/views/home/ui/Timelines';

const { id, label } = HOME_SECTION_ID_LABEL_MAP.EDUCATION;

export function HomeEducationSection() {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label} />

      <Timelines list={EDUCATION_LIST} />
    </HomeSection>
  );
}
