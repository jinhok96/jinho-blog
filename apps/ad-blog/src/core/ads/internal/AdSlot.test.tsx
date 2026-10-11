import { renderToStaticMarkup } from 'react-dom/server';

import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/posts/hello' }));

const CLIENT = 'ca-pub-1234567890123456';

type Slots = Record<string, { slotId: string; layout: 'display' | 'in-article' | 'in-feed' }>;

/** 광고 설정은 모듈 로드 시 읽으므로 조합마다 모듈을 새로 불러온다 (NODE_ENV는 렌더 시 읽음) */
async function loadAdSlot({ client, slots, nodeEnv }: { client: string; slots: Slots; nodeEnv: string }) {
  vi.resetModules();
  vi.stubEnv('NODE_ENV', nodeEnv);
  vi.doMock('../../config', () => ({ ADSENSE_CLIENT: client, AD_SLOTS: slots }));
  return (await import('./AdSlot')).AdSlot;
}

const SLOTS: Slots = {
  postTop: { slotId: '1111111111', layout: 'display' },
  postMiddle: { slotId: '', layout: 'in-article' },
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.doUnmock('../../config');
});

describe('AdSlot', () => {
  it('게재: 광고 라벨 + AdSense 광고 단위(<ins>), 최소 높이·미게재 숨김 클래스', async () => {
    const AdSlot = await loadAdSlot({ client: CLIENT, slots: SLOTS, nodeEnv: 'production' });
    const html = renderToStaticMarkup(<AdSlot placement="postTop" />);

    expect(html).toContain('aria-label="Advertisement"');
    expect(html).toContain('data-ad-placement="postTop"');
    expect(html).toContain('min-h-70');
    expect(html).toContain('has-[ins[data-ad-status=unfilled]]:hidden');
    expect(html).toMatch(
      /<ins class="adsbygoogle[^"]*" data-ad-client="ca-pub-1234567890123456" data-ad-slot="1111111111" data-ad-format="auto" data-full-width-responsive="true"><\/ins>/,
    );
  });

  it('광고 단위 ID 미설정 슬롯은 렌더링 안 함', async () => {
    const AdSlot = await loadAdSlot({ client: CLIENT, slots: SLOTS, nodeEnv: 'production' });

    expect(renderToStaticMarkup(<AdSlot placement="postMiddle" />)).toBe('');
  });

  it('게시자 ID 미설정이면 렌더링 안 함', async () => {
    const AdSlot = await loadAdSlot({ client: '', slots: SLOTS, nodeEnv: 'production' });

    expect(renderToStaticMarkup(<AdSlot placement="postTop" />)).toBe('');
  });

  it('개발 서버: ID와 무관하게 자리표시 상자 (실제 광고 단위 없음)', async () => {
    const AdSlot = await loadAdSlot({ client: '', slots: SLOTS, nodeEnv: 'development' });
    const html = renderToStaticMarkup(<AdSlot placement="postMiddle" />);

    expect(html).toContain('광고 자리 · postMiddle');
    expect(html).toContain('광고 단위 ID 미설정');
    expect(html).not.toContain('adsbygoogle');
  });
});
