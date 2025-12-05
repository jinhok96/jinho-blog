'use client';

import type { ThemeStoreState } from '@/core/store/theme/types';

import { type PropsWithChildren, useEffect } from 'react';

import { useMountEffect } from '@/core/hooks/internal';
import { useThemeStore } from '@/core/store/theme/store';

type Props = PropsWithChildren<Pick<ThemeStoreState, 'theme'>>;

export function ThemeStoreProvider({ children, theme: initTheme }: Props) {
  const theme = useThemeStore.use.theme();
  const setTheme = useThemeStore.use.setTheme();
  const setThemeClass = useThemeStore.use.setThemeClass();

  // 초기 테마 설정
  useMountEffect(() => {
    console.log('ThemeStoreProvider', theme);
    setTheme(theme || initTheme);
  });

  // 시스템 테마일 때 테마 동적 감지
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 변경 감지 핸들러
    const handleChange = () => {
      setThemeClass(mediaQuery.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  return <>{children}</>;
}
