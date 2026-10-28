# Chrome 156 직접 실행 기록 (2026-10-28 21:30~21:50 UTC)

- 설치: `https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb`(145.6 MB)를 `dpkg-deb -x`로 풀어 실행 (설치 없이). `chrome --version` → `Google Chrome 156.0.8078.73`
- 실행: Xvfb `:99` 1280×900, 새 프로필(`--user-data-dir`), `--no-first-run --no-sandbox --test-type --lang=en-US`, Google 계정 로그인 없음. Playwright(Python)로 CDP 연결해 이동·클릭, `import`로 화면 캡처 (`capture.py`, 시나리오는 파일 아래 주석)
- 첫 실행 때 왼쪽 메뉴는 **AI innovations**, 두 번째 실행부터 **AI in Chrome** (Chrome이 첫 실행 뒤 받는 서버 실험 설정 때문으로 보임, 확인 못 함). 글에는 메뉴 이름을 쓰지 않음
- 컨테이너 환경의 정책 파일(`/etc/chromium/policies/managed`: 인증서·ECH 설정)을 Chrome이 읽어 설정 위에 "Your browser is managed by your organization"이 표시됨. chrome://policy에 자동 완성·AI 관련 정책은 없음 → 글 이미지에서는 그 줄이 보이지 않게 스크롤한 캡처를 씀

## chrome://settings/autofill (Autofill settings 펼침) 토글 상태

`cr-toggle`의 `checked`·`disabled` 값 (s5.py 출력, 로그아웃 상태)

| 설정 | checked | disabled |
| --- | --- | --- |
| Smarter form understanding | false | **true** |
| Save and fill addresses | true | false |
| Autofill verification codes from Gmail | false | false (화면에는 숨김) |
| Automatically verify your email | true | false |
| Save and fill identity docs | false | **true** |
| Save and fill payment methods | true | false |
| Save security codes | true | false |
| Card benefits | true | false |
| Allow sites to check if you have payment methods saved | true | false |
| Save and fill travel info | false | **true** |

- Autofill settings 펼친 화면 문구: "Smarter form understanding / Chrome understands forms better and can autofill them faster for you / When on: Chrome can autofill difficult fields that standard autofill might miss / Things to consider: To offer suggestions and improve this feature, the page’s URL and content are shared with Google"
- **Enhanced autofill** 행·**Find and fill with Gemini** 스위치는 로그아웃 상태 화면에 없음 (Chrome 도움말: 대상은 미국·18세 이상·Personal Intelligence를 켠 Gemini in Chrome 사용자)
- `chrome://settings/enhancedAutofill`·`/autofill/ai`·`/autofillAi`·`/autofillSettings`는 모두 `chrome://settings/`로 돌아감 (경로 없음 또는 로그아웃 상태에서 숨김)
- `chrome://settings/contactInfo`: Save and fill addresses·Addresses·Verified email만 보이고 "Autofill verification codes from Gmail"은 DOM에만 있고 화면에 없음 (`screens/chrome-156-contact-info.webp`). 이 설정의 Learn more 링크는 `https://support.google.com/chrome?p=one_time_password`(curl로는 도움말 홈으로만 열림)
- chrome://settings/ai(AI in Chrome) 목록: Automated Password Change, History search powered by AI, Help me write, Suggestions powered by AI, Select text to ask Gemini, Skills in Chrome, Talk to type, Try it on, Google Search AI Mode and connected apps, On-device AI. 자동 완성 항목 없음

## 언어 파일

`locales/en-US.pak`를 `pak_strings.py`로 풀어 14,439개 문자열 중 관련 문자열을 `source-chrome-156-strings.txt`에 저장 (형식: 리소스 ID, 탭, 문구)
