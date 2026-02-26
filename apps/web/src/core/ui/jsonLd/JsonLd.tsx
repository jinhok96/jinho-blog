import type { Thing, WithContext } from 'schema-dts';

type Props = {
  jsonLd: WithContext<Thing>;
};

export function JsonLd({ jsonLd }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}
