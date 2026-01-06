import { HomeSection } from '@/views/home/ui/HomeSection';

type Props = {
  id: string;
  label: string;
};

export function HomeContactSection({ id, label }: Props) {
  return (
    <HomeSection id={id}>
      <HomeSection.Header label={label}>연락처입니다</HomeSection.Header>
    </HomeSection>
  );
}
