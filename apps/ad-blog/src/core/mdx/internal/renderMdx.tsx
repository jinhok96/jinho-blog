import type { JSX } from 'react';
import type { TocItem } from 'remark-flexible-toc';

import { evaluate } from 'next-mdx-remote-client/rsc';

import rehypeSlug from 'rehype-slug';
import remarkFlexibleToc from 'remark-flexible-toc';
import remarkGfm from 'remark-gfm';

import { mdxComponents } from './components';

type Scope = {
  toc?: TocItem[];
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
 */
export async function renderMdx(source: string, name: string = 'MDX'): Promise<MdxResult> {
  const { content, scope, error } = await evaluate<Record<string, unknown>, Scope>({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, [remarkFlexibleToc, { skipLevels: [], maxDepth: 3 }]],
        rehypePlugins: [rehypeSlug],
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
