import { HomeSection } from '@/views/home/ui/HomeSection';

type Props = {
  id: string;
  label: string;
};

export function HomeEducationSection({ id, label }: Props) {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>교육입니다</HomeSection.Header>
    </HomeSection>
  );
}
