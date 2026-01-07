import { HOME_SECTION_ID_LABEL_MAP } from '@/views/home/model';
import { HomeSection } from '@/views/home/ui/HomeSection';

export function HomeEducationSection() {
  const { id, label } = HOME_SECTION_ID_LABEL_MAP.EDUCATION;

  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>교육입니다</HomeSection.Header>
    </HomeSection>
  );
}
