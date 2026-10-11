import type { HastNode, HastRoot } from './inArticleAd';

import { describe, expect, it } from 'vitest';

import { IN_ARTICLE_AD_COMPONENT, rehypeInArticleAd } from './inArticleAd';

/** 테스트용 hast 노드 (텍스트 값·rehype-slug가 부여한 id 포함) */
type TestNode = HastNode & {
  value?: string;
  properties?: { id?: string };
};

function text(value: string): TestNode {
  return { type: 'text', value };
}

function heading(tagName: string, value: string): TestNode {
  return { type: 'element', tagName, properties: { id: value.toLowerCase() }, children: [text(value)] };
}

function paragraph(): TestNode {
  return { type: 'element', tagName: 'p', properties: {}, children: [text('본문')] };
}

/** MDX hast처럼 블록 사이에 줄바꿈 텍스트 노드를 끼운 root */
function root(...blocks: HastNode[]): HastRoot {
  return {
    type: 'root',
    children: blocks.flatMap((block, index) => (index === 0 ? [block] : [text('\n'), block])),
  };
}

function transform(tree: HastRoot): HastRoot {
  rehypeInArticleAd()(tree);
  return tree;
}

function isAd(node: HastNode): boolean {
  return node.type === 'mdxJsxFlowElement' && node.name === IN_ARTICLE_AD_COMPONENT;
}

function countAds(nodes: HastNode[]): number {
  return nodes.reduce((count, node) => count + (isAd(node) ? 1 : 0) + countAds(node.children ?? []), 0);
}

describe('rehypeInArticleAd', () => {
  it('최상위 h2 3개 이상 → 두 번째 h2 바로 앞에 광고 삽입', () => {
    const second = heading('h2', 'B');
    const tree = transform(root(paragraph(), heading('h2', 'A'), paragraph(), second, paragraph(), heading('h2', 'C')));

    const adIndex = tree.children.findIndex(isAd);
    expect(tree.children[adIndex]).toEqual({
      type: 'mdxJsxFlowElement',
      name: IN_ARTICLE_AD_COMPONENT,
      attributes: [],
      children: [],
    });
    expect(tree.children[adIndex + 1]).toBe(second);
    expect(countAds(tree.children)).toBe(1);
  });

  it('본문 `#`(hast h1)도 h2로 렌더링되므로 섹션 제목으로 셈', () => {
    const second = heading('h1', 'B');
    const tree = transform(root(heading('h1', 'A'), paragraph(), second, paragraph(), heading('h2', 'C')));

    expect(tree.children[tree.children.findIndex(isAd) + 1]).toBe(second);
  });

  it.each([0, 1, 2])('최상위 h2 %i개 → 삽입하지 않음', count => {
    const headings = Array.from({ length: count }, (_, index) => heading('h2', `${index}`));
    const tree = root(paragraph(), ...headings, paragraph());
    const before = structuredClone(tree);

    expect(transform(tree)).toEqual(before);
  });

  it('h3 이하는 섹션 제목으로 세지 않음', () => {
    const tree = transform(root(heading('h2', 'A'), heading('h3', 'A-1'), heading('h2', 'B'), heading('h3', 'B-1')));

    expect(countAds(tree.children)).toBe(0);
  });

  it('최상위만 셈: 인용문·목록·각주 영역 안 h2는 제외', () => {
    const nested = (tagName: string): HastNode => ({
      type: 'element',
      tagName,
      children: [heading('h2', `${tagName} 안 제목`)],
    });
    const tree = transform(
      root(heading('h2', 'A'), nested('blockquote'), nested('ul'), heading('h2', 'B'), nested('section')),
    );

    expect(countAds(tree.children)).toBe(0);
  });

  it('중첩 h2가 섞여도 최상위 기준 두 번째 h2 앞에 삽입', () => {
    const second = heading('h2', 'B');
    const tree = transform(
      root(
        heading('h2', 'A'),
        { type: 'element', tagName: 'blockquote', children: [heading('h2', '인용')] },
        second,
        heading('h2', 'C'),
      ),
    );

    expect(tree.children[tree.children.findIndex(isAd) + 1]).toBe(second);
    expect(countAds(tree.children)).toBe(1);
  });

  it('여러 번 실행해도 광고는 하나 (멱등)', () => {
    const tree = root(heading('h2', 'A'), heading('h2', 'B'), heading('h2', 'C'), heading('h2', 'D'));

    transform(tree);
    const once = structuredClone(tree);
    transform(tree);

    expect(tree).toEqual(once);
    expect(countAds(tree.children)).toBe(1);
  });

  it('직접 작성한 `<InArticleAd />`가 있으면 추가 삽입하지 않음', () => {
    const manual: HastNode = { type: 'mdxJsxFlowElement', name: IN_ARTICLE_AD_COMPONENT, attributes: [], children: [] };
    const tree = transform(
      root(
        heading('h2', 'A'),
        { type: 'element', tagName: 'div', children: [manual] },
        heading('h2', 'B'),
        heading('h2', 'C'),
      ),
    );

    expect(countAds(tree.children)).toBe(1);
  });

  it('다른 JSX 요소는 광고로 취급하지 않음', () => {
    const tree = transform(
      root(
        { type: 'mdxJsxFlowElement', name: 'Callout', attributes: [], children: [] },
        heading('h2', 'A'),
        heading('h2', 'B'),
        heading('h2', 'C'),
      ),
    );

    expect(countAds(tree.children)).toBe(1);
  });

  it('제목 노드 자체는 변경하지 않음 (제목 id·목차 영향 없음)', () => {
    const headings = [heading('h2', 'A'), heading('h2', 'B'), heading('h2', 'C')];
    const snapshot = structuredClone(headings);
    const tree = transform(root(...headings));

    expect(tree.children.filter(node => node.tagName === 'h2')).toEqual(snapshot);
  });
});
