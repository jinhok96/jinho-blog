import type { LibraryMetadata } from '@/core/types/metadata';

import { Markdown } from '@/core/ui';

export const metadata: LibraryMetadata = {
  title: 'Example Library',
  description: 'React 라이브러리 예제',
  category: ['hooks'],
  tech: ['react', 'typescript'],
  createdAt: '2025-01-15',
  updatedAt: '2025-01-15',
};

const code = `import { Example } from 'example';

function App() {
  return <Example />;
}`;

export default function ExampleLibrary() {
  return (
    <Markdown>
      <Markdown.H1>라이브러리 소개</Markdown.H1>
      <p>이것은 예제 라이브러리입니다.</p>
      <Markdown.Parser />
      <Markdown.H2>설치</Markdown.H2>
      <div>
        이렇게 <Markdown.Code>{`useThisCase()`}</Markdown.Code> 사용합니다.
      </div>
      <p>안녕하세요.</p>
      <p>반갑습니다.</p>
      <Markdown.Parser />
      <h2>사용법</h2>
      <Markdown.CodeBlock className="tracking-normal whitespace-pre">{code}</Markdown.CodeBlock>
      <h2>API</h2>
      <Markdown.Callout>라이브러리 API 문서를 작성합니다.</Markdown.Callout>
      <h2>라이선스</h2>
      <p>MIT</p>
    </Markdown>
  );
}
