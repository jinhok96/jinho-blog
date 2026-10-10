import type { Thing, WithContext } from 'schema-dts';

type Props = {
  jsonLd: WithContext<Thing>;
};

/**
 * JSON-LD 구조화 데이터 스크립트
 * - `<` 이스케이프로 문자열 내 `</script>` 주입 방지
 */
export function JsonLd({ jsonLd }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}
