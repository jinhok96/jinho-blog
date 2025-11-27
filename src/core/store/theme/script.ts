export const INIT_THEME_SCRIPT = `
(function () {

  try {
    const storage = localStorage.getItem('theme-storage');
    const theme = storage ? JSON.parse(storage).state.theme : null;

    console.log('INIT_THEME_SCRIPT', theme);

    // 시스템 테마 가져오는 함수
    const getSystemTheme = () => {
      if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    };

    // 로컬스토리지에 테마를 저장하는 함수
    const setStorageTheme = thisTheme => {
      localStorage.setItem(
        'theme-storage',
        JSON.stringify({ ...storage, state: { ...storage?.state, theme: thisTheme } }),
      );
    };

    // 전역 테마 클래스를 삽입하는 함수
    const setThemeClass = thisTheme => {
      document.documentElement.classList.add(thisTheme);
    }

    // 1순위: localStorage 테마가 있고 system이 아닌 경우 클래스 추가
    if(theme === 'light' || theme === 'dark') {
      setThemeClass(theme);
    }

    // 2순위: localStorage가 system이면 미디어 쿼리 감지해서 클래스 추가
    else if(theme === 'system') {
      const systemTheme = getSystemTheme();
      setThemeClass(systemTheme);
    }

    // 3순위: localStorage가 없으면 미디어 쿼리 감지해서 클래스 추가하고 로컬스토리지에 저장
    else {
      const systemTheme = getSystemTheme();
      setStorageTheme('system');
      setThemeClass(systemTheme);
    }
  } catch (e) {
    console.error('INIT_THEME_SCRIPT', e);
  }
})();
`;
