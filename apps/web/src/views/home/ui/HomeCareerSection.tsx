import { HomeSection } from '@/views/home/ui/HomeSection';

type Props = {
  id: string;
  label: string;
};

export function HomeCareerSection({ id, label }: Props) {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>경력 사항입니다</HomeSection.Header>
    </HomeSection>
  );
}
