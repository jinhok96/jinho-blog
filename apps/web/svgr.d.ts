import type { ComponentType, SVGProps } from 'react';

declare module '*.svg' {
  const SVG: ComponentType<SVGProps<SVGSVGElement>>;
  export default SVG;
}
