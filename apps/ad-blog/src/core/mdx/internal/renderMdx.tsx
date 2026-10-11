import type { JSX } from 'react';
import type { TocItem } from 'remark-flexible-toc';

import { evaluate } from 'next-mdx-remote-client/rsc';

import rehypeSlug from 'rehype-slug';
import remarkFlexibleToc from 'remark-flexible-toc';
import remarkGfm from 'remark-gfm';

import { mdxComponents } from './components';
import { rehypeInArticleAd } from './inArticleAd';

type Scope = {
  toc?: TocItem[];
};

export type RenderMdxOptions = {
  /** 본문 중간 광고 삽입 (글 상세 전용, 정적 페이지 제외) */
  inArticleAd?: boolean;
};

export type MdxResult = {
  content: JSX.Element;
  /** 본문 제목 목록 (`#`~`###`, href는 rehype-slug id와 동일) */
  toc: TocItem[];
};

/**
 * MDX 본문 렌더링 (서버 컴포넌트, 빌드 시 실행)
 * - GFM(표·각주·체크리스트), 제목 id(rehype-slug), 목차 추출(remark-flexible-toc)
 * - 문법 오류가 있으면 빈 본문으로 배포되지 않도록 예외를 던져 빌드를 실패시킴
 *
 * @param source 이미지 경로가 변환된 MDX 본문 (frontmatter 제외)
 * @param name 오류 메시지에 표시할 콘텐츠 식별자 (예: 글 경로)
 * @param options.inArticleAd 최상위 h2가 3개 이상이면 두 번째 h2 앞에 본문 중간 광고 삽입
 */
export async function renderMdx(
  source: string,
  name: string = 'MDX',
  { inArticleAd = false }: RenderMdxOptions = {},
): Promise<MdxResult> {
  const { content, scope, error } = await evaluate<Record<string, unknown>, Scope>({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, [remarkFlexibleToc, { skipLevels: [], maxDepth: 3 }]],
        // 광고 삽입은 제목 id 부여 이후 (제목 노드는 변경하지 않음)
        rehypePlugins: inArticleAd ? [rehypeSlug, rehypeInArticleAd] : [rehypeSlug],
        remarkRehypeOptions: {
          footnoteLabel: '각주',
          footnoteBackLabel: '본문으로 돌아가기',
        },
      },
      vfileDataIntoScope: 'toc',
    },
  });

  if (error) throw new Error(`[mdx] ${name} 렌더링 실패: ${error.message}`, { cause: error });

  return { content, toc: scope.toc ?? [] };
}
