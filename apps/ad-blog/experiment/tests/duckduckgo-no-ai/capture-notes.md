# 캡처·실행 기록 (duckduckgo-no-ai)

- 날짜: 2026-11-01 15:30~16:10 UTC (2026-11-02 00~01시 KST 일반 세션)
- 브라우저: Playwright(Node) 기본 headless Chromium 153.0.8010.12, 매번 새 컨텍스트(쿠키 없음)·로그인 없음·locale en-US·1280×900. Chrome 설정 화면은 같은 버전의 전체 Chromium(`channel: 'chromium'`, 영구 프로필 `/tmp/claude-0/chrome-profile`)
- 캡처 원본은 실행 때 PNG로 저장한 뒤 `screens/*.webp`(무손실)로 바꾸고 PNG는 지움. 글 그래픽은 `charts.py`

## 순서

1. `probe.cjs`: `https://duckduckgo.com/?q=why is the sky blue` → `static-pages/home-error/418.html`("Unexpected error"), 쿠키 없음. 검색 결과 페이지는 자동화 브라우저에 막혀 있어 **측정하지 않기로 함** (차단을 우회하는 설정은 쓰지 않음)
2. `fetch.cjs`: DuckDuckGo 도움말 13쪽·Chrome Web Store·Firefox Add-ons·Google Chrome 도움말·Apple Safari 설명서를 렌더링해 `source-*.txt`로 저장. `links.cjs`·`extlinks.cjs`로 도움말 사이드바·확장 링크 수집
3. `explore.cjs`: `/settings` AI Features 탭의 컨트롤 → `setting_kbg`(체크, On)·`setting_kbe`(Never 0 / On demand 1 / Sometimes 2* / Often 3)·`setting_kbl`(Never 0 / Sometimes 2* / Often 3)·`setting_kbj`(체크 해제). 화면 글자는 `source-ddg-settings-ai-features-tab.txt`
4. `page.cjs`·`noai-gen.cjs`: noai 홈·noai 설정 → 설정 탭 General·Appearance·Privacy만, `setting_kbj` 체크(On). 같은 컨텍스트의 duckduckgo.com 설정은 체크 해제(Off)
5. `run.cjs` (`run-log.json`): ① 기본 홈 진입점(Ask AI 토글·Duck.ai 버튼·AI Settings 버튼·OPTIONAL 안내) ② AI Features 기본값 ③ 홈 AI Settings 버튼 → Homepage AI Settings 창 ④ Duck.ai 끄기 → Save and Exit → 홈(토글·버튼·안내 사라짐, 쿠키 `bg=-1`) ⑤ Search Assist Never → 쿠키 경고 창(Install Now = Chrome Web Store 확장), Escape로 닫음 → Explore More Never(창 다시 안 뜸) → Hide AI-Generated Images On → 저장(쿠키 `bg=-1; be=0; bl=0; bj=1`) ⑥ Show Bookmarklet and Settings Data(JSON·쿠키 표시, Bookmarklet URL 칸 비어 있음) ⑦ 같은 프로필 새 탭: 설정 유지 ⑧ 새 프로필: 진입점·설정 모두 기본값 ⑪ noai 홈: 진입점 없음
   - 스위치는 `<input>` 위를 덮는 `div.frm__switch`를 눌러야 바뀜(사람이 누르는 위치와 같음)
6. `cookies.cjs`·`cookies-all.cjs` (`cookie-attributes.txt`): 쿠키 4개 모두 duckduckgo.com·httpOnly 아님·만료 365일, 저장 요청에 서버 Set-Cookie 없음
7. `homepage-panel.cjs` (`homepage-panel-log.json`): Homepage AI Settings → Search Only → Apply → Ask AI 토글만 사라짐, Duck.ai 버튼·AI Settings 버튼 남음, 쿠키 없음, 설정 페이지 값 그대로
8. `chrome-se.cjs`·`chrome-se2.cjs` (`chrome-site-search-log.json`): `chrome://settings/searchEngines` → Site search Add(칸 Name·Shortcut·URL with %s in place of query) → `DuckDuckGo No AI` / `noai` / `https://noai.duckduckgo.com/?q=%s` → Add → 행 More > Make default → 목록 맨 위 표에 "DuckDuckGo No AI (Default)", `chrome://settings/search`에 기본 엔진으로 표시. 이 Chromium 빌드는 자동화 정책 때문에 "Your browser is managed" 띠가 보임(글 그래픽에서는 잘라 냄)
9. 확장 패키지: `https://addons.mozilla.org/firefox/downloads/latest/duckduckgo-no-ai-search/latest.xpi`(22,982바이트, 2026.9.25)를 스크래치패드에 받아 `manifest.json`만 읽음(설치·실행하지 않음). `chrome_settings_overrides.search_provider` = 이름 "DuckDuckGo (No AI)", `is_default: true`, 검색 주소 `https://noai.duckduckgo.com/?t=noaiext&q={searchTerms}&bext=noai`
10. noai 홈 HTML에는 검색 설명 파일(`rel="search"`) 링크가 없고, `noai.duckduckgo.com/opensearch.xml`의 검색 주소는 `https://duckduckgo.com/?q={searchTerms}` → 브라우저가 noai를 자동으로 검색 엔진 목록에 넣지 않으므로 글에서는 확장·직접 추가만 안내
