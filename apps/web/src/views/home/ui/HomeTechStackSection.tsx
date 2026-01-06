import { HomeSection } from '@/views/home/ui/HomeSection';

type Props = {
  id: string;
  label: string;
};

export function HomeTechStackSection({ id, label }: Props) {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>기술 스택입니다</HomeSection.Header>
    </HomeSection>
  );
}
