import type { ComponentType } from 'react';

import dynamic from 'next/dynamic';

/**
 * MDX Demo 레지스트리
 *
 * 새 데모 추가 방법:
 * 1. demos/ 폴더에 데모 컴포넌트 파일 생성 (export default, 'use client' 선언)
 * 2. dynamic()으로 아래 레지스트리에 등록
 *
 * @example
 * export const demoRegistry: Record<string, ComponentType> = {
 *   'route-modal': dynamic(() => import('./RouteModalDemo')),
 * };
 */
export const demoRegistry: Record<string, ComponentType> = {
  'use-animated-value': dynamic(() => import('./UseAnimatedValueDemo')),
};
