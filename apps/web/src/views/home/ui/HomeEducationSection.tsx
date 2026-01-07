import { HOME_SECTION_ID_LABEL_MAP } from '@/views/home/model';
import { HomeSection } from '@/views/home/ui/HomeSection';

const { id, label } = HOME_SECTION_ID_LABEL_MAP.EDUCATION;

export function HomeEducationSection() {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>교육입니다</HomeSection.Header>
    </HomeSection>
  );
}
