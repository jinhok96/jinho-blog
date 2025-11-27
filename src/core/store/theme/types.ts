export type Theme = 'light' | 'dark' | 'system';

export type ThemeStoreState = {
  theme: Theme;
  themeClass: Theme | null;
};
