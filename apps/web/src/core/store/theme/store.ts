import type { Theme, ThemeStoreState } from '@/core/store/theme/types';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createSelectors } from '@/core/store/utils';

// Types
type ThemeStoreActions = {
  setTheme: (theme: Theme) => void;
  setThemeClass: (theme: Theme) => void;
  getSystemTheme: () => Theme;
};

type ThemeStore = ThemeStoreState & ThemeStoreActions;
type ThemeStorage = Pick<ThemeStoreState, 'theme'>;

const THEME_CLASS_LIST: Readonly<Theme[]> = Object.freeze(['light', 'dark']);

// utils
function getSystemTheme(): Theme {
  const theme = THEME_CLASS_LIST.find(theme => window.matchMedia(`(prefers-color-scheme: ${theme})`).matches);
  return theme || 'light';
}

function setThemeClass(theme: Theme) {
  const html = document.documentElement;

  // 이미 올바른 테마가 적용되어 있으면 아무것도 하지 않음
  if (html.classList.contains(theme)) {
    return;
  }

  const removeList = THEME_CLASS_LIST.filter(item => item !== theme);
  html.classList.add(theme);
  html.classList.remove(...removeList);
}

// store
const initState: ThemeStoreState = {
  theme:
    JSON.parse((typeof window !== 'undefined' && localStorage.getItem('theme-storage')) || '{}')?.state?.theme ||
    'system',
  themeClass: null,
};

const store = create<ThemeStore>()(
  persist<ThemeStore, [], [], ThemeStorage>(
    set => ({
      ...initState,

      setTheme: theme => {
        if (theme === 'system') {
          const systemTheme = getSystemTheme();
          setThemeClass(systemTheme);
          return set({ theme, themeClass: systemTheme });
        }

        setThemeClass(theme);
        set({ theme, themeClass: theme });
      },

      setThemeClass: themeClass => {
        setThemeClass(themeClass);
        set({ themeClass });
      },

      getSystemTheme: () => {
        return getSystemTheme();
      },
    }),

    // 로컬스토리지 저장
    {
      name: 'theme-storage',
      partialize: state => ({
        theme: state.theme,
      }),
    },
  ),
);

export const useThemeStore = createSelectors(store);
