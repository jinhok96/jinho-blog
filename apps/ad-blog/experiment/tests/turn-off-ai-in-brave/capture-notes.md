# Brave 1.98.63 Leo 스위치 실험 기록 (2026-11-03 15:20~16:10 UTC)

- Brave: `1.98.63` (Chromium 156.0.8078.80). Brave 공식 apt 저장소의 `pool/main/b/brave-browser/brave-browser_1.98.63_amd64.deb`를 받아 SHA-256을 저장소 `Packages` 값과 대조(`24227cd5…cddd55`) 뒤 `dpkg-deb -x`로 `/tmp/brave-dl/ex`에 풂 (설치 없음, 큰 파일이라 저장소에 넣지 않음)
- 실행: `common.py`의 `run_brave()` — Xvfb `:99` 1280×900, `--user-data-dir=/tmp/brave-prof/{프로필} --no-first-run --no-sandbox --test-type --lang=en-US --remote-debugging-port=9340`. Playwright 1.64.1(Python)을 CDP로 연결, 브라우저 메뉴·주소창 입력은 xdotool, 캡처는 ImageMagick `import`
- 시험 페이지: `test-site/index.html`, `python3 -m http.server 8767 --bind 127.0.0.1`
- 진입점 확인(`probe.py`): ① 창 전체(툴바 버튼·사이드바) ② 선택 없는 문단 오른쪽 클릭 ③ 문단 세 번 클릭 선택 후 오른쪽 클릭 + 4번째 항목 하위 메뉴 ④ 글 입력 칸 전체 선택 후 오른쪽 클릭 ⑤ 주소창 `how do solar panels work` 입력 ⑥ Ctrl+Shift+A 탭 검색 → Organize 탭. 좌표는 페이지 안 mousemove 이벤트로 화면 → 페이지 오프셋을 잼 (Xvfb에서는 `screenY`가 맞지 않음)
- 캡처는 저장소 크기 때문에 글 그래픽에 쓴 12장만 원본 크기 무손실 WebP, 나머지는 50% 축소 WebP. 남의 사진·광고가 보이는 검색 결과·새 탭 캡처는 지움(글자 저장본만 남김)

## 진행 순서와 결과

| 순서 | 스크립트 (프로필) | 결과 | 기록 |
| --- | --- | --- | --- |
| 1 | `survey.py`·`click_text.py` (p0) | Settings > Leo·Appearance·Search engine·Shortcuts·flags 글자와 기본값. Leo 스위치 3개 켜짐, 주소창 체크박스 5개 체크, 기본 검색 일반 창 Google·비공개 창 Brave, Leo 단축키 기본 없음, flags `brave-ai-chat` Default (Enabled) | `screens/01~06-*` |
| 2 | `probe.py` (a0) | 기본 상태 진입점. 실수로 사이드바 Leo 아이콘을 눌러 패널이 열린 화면도 남음(패널 안내 문구 확인용) | `screens/a0-*` |
| 3 | `chain.py c` | s0 기본 → s1 툴바 오른쪽 클릭 Hide Leo AI icon → s2 사이드바 끔 → s3 문맥 메뉴 끔 → s4 Leo AI Assistant 해제 → s5 Tab Focus 끔. 단계마다 Brave를 닫고 다시 열어 Preferences 값 기록 후 probe | `chain-c.json`, `screens/c-s*` |
| 4 | `after.py c left` | 5개 다 끈 뒤: 메인 메뉴 Leo AI 남음, brave://leo-ai 채팅 화면 열림, Settings Leo 섹션 남음 | `after-c-left.json` |
| 5 | `after.py c flagoff` → `after.py c flagback` | flags Disabled 뒤 Leo 전부 없음. Default로 되돌리면 Leo 돌아오고 스위치 4개는 꺼진 채 | `after-c-*.json` |
| 6 | `after.py d flagoff` | 새 프로필에서 flags만 Disabled → 진입점 전부·설정 섹션·brave://leo-ai 없음, Preferences의 Leo 값은 그대로, `Local State`에 `brave-ai-chat@2` | `after-d-flagoff.json`, `screens/d-flagoff-*` |
| 7 | `search_settings.py` (e), `search_ai.py` (f) | search.brave.com/settings가 Brave에서 열림(curl은 429). Answer with AI 기본 켜짐, 끄면 쿠키 `summarizer=0` 180일. 켜짐 검색 1회는 AI 답변, 꺼짐 검색은 429 + 봇 확인 화면 → 우회하지 않음 | `search-ai-f.json`, `screens/e-*`·`f-*` |
| 8 | `leo_extra.py` (g) | brave://policy 목록에 `BraveAIChatEnabled`·`ThirdPartyAiChatSettings`. Clear Leo data 누르기는 창을 띄우지 못함(쓰지 않음) | `leo-extra-g.json` |
| 9 | `policy_test.py h` | `/etc/brave/policies/managed/toolproof-test.json`에 `{"BraveAIChatEnabled": false}` → Leo 설정 섹션 없음·brave://leo-ai 잘못된 주소. 시험 뒤 파일 삭제 | `screens/h-policy-*` |
| 10 | `shot_autocomplete.py` (k), `toolbar_panel.py m` | 주소창 체크박스 캡처. Customize your toolbar 패널의 Leo AI 스위치를 끄면 툴바 버튼이 사라지고 같은 값 `show_toolbar_button: false`, 재시작 뒤에도 없음 | `screens/k-*`·`m-*` |

## 실행 중 문제와 해석

- 처음 `probe.py`는 `window.screenY`로 오프셋을 계산해 클릭이 제목에 떨어짐 → 알려진 화면 좌표로 마우스를 옮기고 페이지 `clientY`를 읽어 보정
- 분석 안내 막대(P3A)의 닫기(X)를 막대가 없을 때 누르면 그 자리의 사이드바 Leo 아이콘이 눌림 → 막대의 파란 Got it 버튼 픽셀을 보고 있을 때만 누름. Got it·Disable은 누르지 않음
- 선택 메뉴의 Leo AI tools는 선택한 글이 있을 때만 나옴. 선택 없는 오른쪽 클릭에는 기본 상태에서도 Leo 없음
- Brave 도움말 센터(support.brave.app)는 Cloudflare 확인 화면 → 열지 않음
