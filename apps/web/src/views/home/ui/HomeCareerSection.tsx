import { HOME_SECTION_ID_LABEL_MAP } from '@/views/home/model';
import { HomeSection } from '@/views/home/ui/HomeSection';

const { id, label } = HOME_SECTION_ID_LABEL_MAP.CAREER;

export function HomeCareerSection() {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>경력 사항입니다</HomeSection.Header>
    </HomeSection>
  );
}
