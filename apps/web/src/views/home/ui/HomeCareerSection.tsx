import { HOME_SECTION_ID_LABEL_MAP } from '@/views/home/model';
import { HomeSection } from '@/views/home/ui/HomeSection';

export function HomeCareerSection() {
  const { id, label } = HOME_SECTION_ID_LABEL_MAP.CAREER;

  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>경력 사항입니다</HomeSection.Header>
    </HomeSection>
  );
}
