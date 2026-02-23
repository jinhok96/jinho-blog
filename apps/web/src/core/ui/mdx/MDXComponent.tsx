import { Toc } from '@/core/ui/mdx/Toc';
import { Show } from '@/core/ui/wrapper';
import { getMDXContent } from '@/core/utils';

type Props = {
  fileContent: string;
  hideTableOfContents?: boolean;
};

export async function MDXComponent({ fileContent, hideTableOfContents }: Props) {
  const { content, toc } = await getMDXContent(fileContent);

  return (
    <section className="flex-row-start size-full justify-between">
      {/* 본문 */}
      <article className="flex-col-start size-full max-w-180 gap-3">{content}</article>

      {/* 목차 사이드바 */}
      <div
        className={`
          sticky top-(--height-header) max-w-48 min-w-32 shrink-0 overflow-y-visible pt-0.5
          not-wide:hidden
        `}
      >
        <Show when={!hideTableOfContents}>
          <Toc toc={toc} />
        </Show>
      </div>
    </section>
  );
}
