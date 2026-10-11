import type { HastNode, HastRoot } from './contentAds';

import { describe, expect, it } from 'vitest';

import { CONTENT_AD_COMPONENTS, rehypeContentAds } from './contentAds';

/** 테스트용 hast 노드 (rehype-slug가 부여한 id 포함) */
type TestNode = HastNode & {
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
  rehypeContentAds()(tree);
  return tree;
}

function adNames(nodes: HastNode[]): string[] {
  return nodes.flatMap(node => [
    ...(node.type === 'mdxJsxFlowElement' ? [node.name ?? ''] : []),
    ...adNames(node.children ?? []),
  ]);
}

function nextAfter(tree: HastRoot, name: string): HastNode | undefined {
  const index = tree.children.findIndex(node => node.type === 'mdxJsxFlowElement' && node.name === name);
  return index === -1 ? undefined : tree.children[index + 1];
}

describe('rehypeContentAds', () => {
  it('도입부 + 최상위 h2 3개 이상 → 첫 h2 앞에 상단, 두 번째 h2 앞에 중간 광고', () => {
    const first = heading('h2', 'A');
    const second = heading('h2', 'B');
    const tree = transform(root(paragraph(), first, paragraph(), second, paragraph(), heading('h2', 'C')));

    expect(adNames(tree.children)).toEqual([CONTENT_AD_COMPONENTS.top, CONTENT_AD_COMPONENTS.middle]);
    expect(nextAfter(tree, CONTENT_AD_COMPONENTS.top)).toBe(first);
    expect(nextAfter(tree, CONTENT_AD_COMPONENTS.middle)).toBe(second);
  });

  it('삽입 노드는 속성·자식 없는 MDX JSX 요소', () => {
    const tree = transform(root(paragraph(), heading('h2', 'A')));

    expect(tree.children.find(node => node.type === 'mdxJsxFlowElement')).toEqual({
      type: 'mdxJsxFlowElement',
      name: CONTENT_AD_COMPONENTS.top,
      attributes: [],
      children: [],
    });
  });

  it('도입부가 없으면(첫 블록이 h2) 상단 광고 생략 — 제목 바로 아래 첫 화면 보호', () => {
    const tree = transform(root(heading('h2', 'A'), paragraph(), heading('h2', 'B'), paragraph(), heading('h2', 'C')));

    expect(adNames(tree.children)).toEqual([CONTENT_AD_COMPONENTS.middle]);
  });

  it('줄바꿈 텍스트·import/export 구문만 있으면 도입부로 보지 않음', () => {
    const tree = transform({
      type: 'root',
      children: [{ type: 'mdxjsEsm' }, text('\n'), heading('h2', 'A'), text('\n'), paragraph()],
    });

    expect(adNames(tree.children)).toEqual([]);
  });

  it.each([1, 2])('최상위 h2 %i개 → 상단 광고만 (중간 광고는 3개 이상)', count => {
    const headings = Array.from({ length: count }, (_, index) => heading('h2', `${index}`));
    const tree = transform(root(paragraph(), ...headings, paragraph()));

    expect(adNames(tree.children)).toEqual([CONTENT_AD_COMPONENTS.top]);
  });

  it('최상위 h2가 없으면 삽입하지 않음', () => {
    const tree = root(paragraph(), heading('h3', 'A'), paragraph());
    const before = structuredClone(tree);

    expect(transform(tree)).toEqual(before);
  });

  it('본문 `#`(hast h1)도 h2로 렌더링되므로 섹션 제목으로 셈', () => {
    const second = heading('h1', 'B');
    const tree = transform(root(paragraph(), heading('h1', 'A'), paragraph(), second, paragraph(), heading('h2', 'C')));

    expect(nextAfter(tree, CONTENT_AD_COMPONENTS.middle)).toBe(second);
  });

  it('h3 이하·인용문 안 h2·각주 영역 h2는 세지 않음 (최상위만)', () => {
    const quote: TestNode = { type: 'element', tagName: 'blockquote', children: [heading('h2', 'Q')] };
    const footnotes: TestNode = { type: 'element', tagName: 'section', children: [heading('h2', '각주')] };
    const tree = transform(
      root(paragraph(), heading('h2', 'A'), heading('h3', 'A-1'), quote, heading('h2', 'B'), footnotes),
    );

    expect(adNames(tree.children)).toEqual([CONTENT_AD_COMPONENTS.top]);
  });

  it.each(Object.values(CONTENT_AD_COMPONENTS))('본문에 직접 쓴 <%s />가 있으면 자동 삽입 생략', name => {
    const manual: TestNode = { type: 'mdxJsxFlowElement', name, attributes: [], children: [] };
    const tree = transform(
      root(paragraph(), heading('h2', 'A'), paragraph(), manual, heading('h2', 'B'), heading('h2', 'C')),
    );

    expect(adNames(tree.children)).toEqual([name]);
  });

  it('이미 광고가 있으면 다시 삽입하지 않음 (중복 실행 방지)', () => {
    const tree = root(paragraph(), heading('h2', 'A'), paragraph(), heading('h2', 'B'), heading('h2', 'C'));

    transform(tree);
    transform(tree);

    expect(adNames(tree.children)).toEqual([CONTENT_AD_COMPONENTS.top, CONTENT_AD_COMPONENTS.middle]);
  });
});
