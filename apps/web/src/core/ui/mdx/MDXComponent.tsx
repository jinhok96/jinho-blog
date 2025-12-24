import { Toc } from '@/core/ui/mdx/Toc';
import { getMDXContent } from '@/core/utils';

type Props = {
  fileContent: string;
  modalView?: boolean;
};

export async function MDXComponent({ fileContent, modalView }: Props) {
  const { content, toc } = await getMDXContent(fileContent, { modalView });

  return (
    <section className="flex-row-start size-full">
      <article className="flex-col-start size-full gap-2">{content}</article>
      <div
        className={`
          sticky top-(--height-header) shrink-0 overflow-y-visible
          not-tablet:hidden
        `}
      >
        <Toc toc={toc} />
      </div>
    </section>
  );
}
