import { HEADING_LEVELS, resolveHeadingLevel } from './heading';

/**
 * 플러그인이 다루는 hast 노드의 최소 구조
 * - `element`(tagName), `mdxJsxFlowElement`(name·attributes), 그 외 노드(text·mdxjsEsm 등)
 */
export type HastNode = {
  type: string;
  tagName?: string;
  name?: string | null;
  attributes?: unknown[];
  children?: HastNode[];
};

export type HastRoot = {
  type: 'root';
  children: HastNode[];
};

/** 본문 중간 광고 컴포넌트 이름 (`mdxComponents`의 키와 동일) */
export const IN_ARTICLE_AD_COMPONENT = 'InArticleAd';

/** 본문 중간 광고를 넣는 최소 섹션(최상위 h2) 수 — 짧은 글에는 넣지 않음 */
export const IN_ARTICLE_AD_MIN_SECTIONS = 3;

/**
 * 렌더링 기준 h2 여부 (본문 `#`도 h2로 렌더링되므로 섹션 제목으로 취급)
 */
function isSectionHeading(node: HastNode): boolean {
  if (node.type !== 'element') return false;

  const level = HEADING_LEVELS.find(level => node.tagName === `h${level}`);
  return level !== undefined && resolveHeadingLevel(level) === 2;
}

function isInArticleAd(node: HastNode): boolean {
  return node.type === 'mdxJsxFlowElement' && node.name === IN_ARTICLE_AD_COMPONENT;
}

/** 트리 안에 본문 중간 광고가 이미 있는지 (중복 삽입 방지) */
function containsInArticleAd(nodes: HastNode[]): boolean {
  return nodes.some(node => isInArticleAd(node) || (node.children ? containsInArticleAd(node.children) : false));
}

/**
 * 본문 중간 광고 삽입 (rehype 플러그인)
 * - 최상위 h2가 3개 이상인 글에만 두 번째 h2 바로 앞에 `<InArticleAd />` 삽입
 * - 최상위(root 직속)만 셈: 인용문·목록 안 제목, 각주 영역(`<section>` 안 h2)은 제외
 * - 이미 광고가 있으면(직접 작성·중복 실행) 삽입하지 않음
 * - 제목 노드는 건드리지 않으므로 목차(remark-flexible-toc)·제목 id(rehype-slug)에 영향 없음
 */
export function rehypeInArticleAd() {
  return (tree: HastRoot) => {
    if (containsInArticleAd(tree.children)) return;

    const headingIndexes = tree.children.flatMap((node, index) => (isSectionHeading(node) ? [index] : []));
    if (headingIndexes.length < IN_ARTICLE_AD_MIN_SECTIONS) return;

    const ad: HastNode = {
      type: 'mdxJsxFlowElement',
      name: IN_ARTICLE_AD_COMPONENT,
      attributes: [],
      children: [],
    };
    tree.children.splice(headingIndexes[1], 0, ad);
  };
}
