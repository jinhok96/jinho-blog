import { HEADING_LEVELS, resolveHeadingLevel } from './heading';

/**
 * 플러그인이 다루는 hast 노드의 최소 구조
 * - `element`(tagName), `mdxJsxFlowElement`(name·attributes), 그 외 노드(text·mdxjsEsm 등)
 */
export type HastNode = {
  type: string;
  tagName?: string;
  name?: string | null;
  value?: string;
  attributes?: unknown[];
  children?: HastNode[];
};

export type HastRoot = {
  type: 'root';
  children: HastNode[];
};

/** 본문 광고 컴포넌트 이름 (renderMdx가 광고 옵션일 때만 주입하는 컴포넌트 키와 동일) */
export const CONTENT_AD_COMPONENTS = {
  /** 첫 섹션 앞 (도입부 뒤) */
  top: 'PostTopAd',
  /** 두 번째 섹션 앞 */
  middle: 'InArticleAd',
} as const;

/** 본문 중간 광고를 넣는 최소 섹션(최상위 h2) 수 — 짧은 글에는 넣지 않음 */
const IN_ARTICLE_AD_MIN_SECTIONS = 3;

/**
 * 렌더링 기준 h2 여부 (본문 `#`·`##` 모두 h2로 렌더링되므로 섹션 제목으로 취급)
 * - MDX에 직접 쓴 `<h2>`(JSX)는 세지 않음
 */
function isSectionHeading(node: HastNode): boolean {
  if (node.type !== 'element') return false;

  const level = HEADING_LEVELS.find(level => node.tagName === `h${level}`);
  return level !== undefined && resolveHeadingLevel(level) === 2;
}

/** 화면에 보이는 블록 (블록 사이 줄바꿈 텍스트·import/export 구문 제외) */
function isVisibleBlock(node: HastNode): boolean {
  if (node.type === 'text') return Boolean(node.value?.trim());
  return node.type === 'element' || node.type === 'mdxJsxFlowElement';
}

function isContentAd(node: HastNode): boolean {
  return (
    node.type === 'mdxJsxFlowElement' &&
    (node.name === CONTENT_AD_COMPONENTS.top || node.name === CONTENT_AD_COMPONENTS.middle)
  );
}

/** 트리 안에 본문 광고가 이미 있는지 (중복 삽입 방지) */
function containsContentAd(nodes: HastNode[]): boolean {
  return nodes.some(node => isContentAd(node) || (node.children ? containsContentAd(node.children) : false));
}

function adNode(name: string): HastNode {
  return { type: 'mdxJsxFlowElement', name, attributes: [], children: [] };
}

/**
 * 본문 광고 삽입 (rehype 플러그인, 글 상세 전용)
 * - 상단: 첫 번째 최상위 h2 바로 앞 — 도입부(첫 h2 앞 본문)가 있을 때만 (제목 바로 아래 첫 화면을 광고가 차지하지 않도록)
 * - 중간: 두 번째 최상위 h2 바로 앞 — 최상위 h2가 3개 이상일 때만 (상단 광고와 첫 섹션만큼 떨어짐)
 * - 최상위(root 직속)만 셈: 인용문·목록 안 제목, 각주 영역(`<section>` 안 h2)은 제외
 * - 이미 광고가 있으면(중복 실행) 삽입하지 않음
 * - 제목 노드는 건드리지 않으므로 목차(remark-flexible-toc)·제목 id(rehype-slug)에 영향 없음
 */
export function rehypeContentAds() {
  return (tree: HastRoot) => {
    if (containsContentAd(tree.children)) return;

    const headingIndexes = tree.children.flatMap((node, index) => (isSectionHeading(node) ? [index] : []));
    if (headingIndexes.length === 0) return;

    const [firstHeading, secondHeading] = headingIndexes;
    const hasIntro = tree.children.slice(0, firstHeading).some(isVisibleBlock);

    // 뒤쪽 위치부터 삽입해 앞쪽 인덱스가 밀리지 않도록 함
    if (headingIndexes.length >= IN_ARTICLE_AD_MIN_SECTIONS) {
      tree.children.splice(secondHeading, 0, adNode(CONTENT_AD_COMPONENTS.middle));
    }
    if (hasIntro) {
      tree.children.splice(firstHeading, 0, adNode(CONTENT_AD_COMPONENTS.top));
    }
  };
}
