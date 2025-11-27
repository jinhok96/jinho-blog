export const metadata = {
  title: 'Example Library',
  description: 'React 라이브러리 예제',
  npm: 'https://www.npmjs.com/package/example',
  github: 'https://github.com/example/example',
};

const code = `import { Example } from 'example';

function App() {
  return <Example />;
}`;

export default function ExampleLibrary() {
  return (
    <div>
      <h2>라이브러리 소개</h2>
      <p>이것은 예제 라이브러리입니다.</p>

      <h2>설치</h2>
      <code>npm install example</code>

      <h2>사용법</h2>
      <pre className="bg-gray-1 p-5">
        <code className="tracking-normal whitespace-pre">{code}</code>
      </pre>

      <h2>API</h2>
      <p>라이브러리 API 문서를 작성합니다.</p>

      <h2>라이선스</h2>
      <p>MIT</p>
    </div>
  );
}
