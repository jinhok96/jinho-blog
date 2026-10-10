import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import { JsonLd } from './JsonLd';

describe('JsonLd', () => {
  it('application/ld+json 스크립트로 직렬화', () => {
    const html = renderToStaticMarkup(
      <JsonLd jsonLd={{ '@context': 'https://schema.org', '@type': 'Thing', name: 'A' }} />,
    );

    expect(html).toBe(
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Thing","name":"A"}</script>',
    );
  });

  it('문자열 안의 </script>로 스크립트를 닫을 수 없도록 < 이스케이프', () => {
    const html = renderToStaticMarkup(
      <JsonLd
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Thing', name: '</script><script>alert(1)</script>' }}
      />,
    );

    expect(html.match(/<\/script>/g)).toHaveLength(1);
    expect(html).toContain('\\u003c/script>\\u003cscript>alert(1)\\u003c/script>');
  });
});
