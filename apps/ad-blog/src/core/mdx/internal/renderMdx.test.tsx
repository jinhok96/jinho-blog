import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it, vi } from 'vitest';

vi.mock('../../ads', () => ({
  AdSlot: ({ placement }: { placement: string }) => <div data-ad-placement={placement} />,
}));

import { renderMdx } from './renderMdx';

const ARTICLE = ['도입부입니다.', '## 첫 섹션', '내용', '## 두 번째 섹션', '내용', '## 세 번째 섹션', '내용'].join(
  '\n\n',
);

async function render(source: string, options?: Parameters<typeof renderMdx>[2]) {
  const { content, toc } = await renderMdx(source, 'test', options);
  return { html: renderToStaticMarkup(content), toc };
}

function placements(html: string): string[] {
  return [...html.matchAll(/data-ad-placement="([^"]+)"/g)].map(match => match[1]);
}

describe('renderMdx 본문 광고', () => {
  it('ads 옵션: 첫 섹션 앞 postTop, 두 번째 섹션 앞 postMiddle', async () => {
    const { html } = await render(ARTICLE, { ads: true });

    expect(placements(html)).toEqual(['postTop', 'postMiddle']);
    expect(html.indexOf('postTop')).toBeLessThan(html.indexOf('id="첫-섹션"'));
    expect(html.indexOf('postMiddle')).toBeLessThan(html.indexOf('id="두-번째-섹션"'));
    expect(html.indexOf('postMiddle')).toBeGreaterThan(html.indexOf('id="첫-섹션"'));
  });

  it('기본값(정적 페이지): 광고 없음', async () => {
    const { html } = await render(ARTICLE);

    expect(placements(html)).toEqual([]);
  });

  it('광고 삽입이 목차에 영향 없음', async () => {
    const { toc: withAds } = await render(ARTICLE, { ads: true });
    const { toc: withoutAds } = await render(ARTICLE);

    expect(withAds).toEqual(withoutAds);
    expect(withAds.map(item => item.value)).toEqual(['첫 섹션', '두 번째 섹션', '세 번째 섹션']);
  });

  it.each(['PostTopAd', 'InArticleAd'])(
    '광고 옵션 없이 MDX에 <%s />를 직접 쓰면 렌더링 실패 (광고 금지 페이지 보호)',
    async name => {
      const { content } = await renderMdx(`본문\n\n<${name} />`, 'static-page');

      expect(() => renderToStaticMarkup(content)).toThrow(new RegExp(name));
    },
  );
});
