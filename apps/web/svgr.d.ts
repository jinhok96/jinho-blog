// 최상위 import가 있으면 이 파일이 모듈이 되어 '*.svg' 선언이 전역에 적용되지 않으므로 블록 안에서 import
declare module '*.svg' {
  import type { ComponentType, SVGProps } from 'react';

  const SVG: ComponentType<SVGProps<SVGSVGElement>>;
  export default SVG;
}
