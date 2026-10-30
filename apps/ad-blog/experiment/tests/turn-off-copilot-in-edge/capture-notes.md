# Edge 156 Copilot 스위치 실험 기록 (2026-10-30 16:2x~17:0x UTC)

- Edge: `Microsoft Edge 156.0.4314.56` (packages.microsoft.com 안정판 deb를 `dpkg-deb -x`로 `/tmp/edge/root`에 풂, 설치 없음)
- 실행: `/tmp/pw/bin/python run.py {프로필} scenarios/{시나리오}.py` (이 폴더에서) — Xvfb `:99` 1280×900, `--no-first-run --no-sandbox --test-type --lang=en-US`, CDP 9334에 Playwright 1.63.0(Python) 연결. 브라우저 메뉴·미니 메뉴·단축키는 페이지 밖이라 xdotool(apt). 캡처는 ImageMagick `import`
- 설정 화면 스위치는 shadow DOM 안 `FLUENT-SWITCH` 요소(`checked`·`disabled` 속성) → `common.py`의 `toggles()`가 이름·상태·좌표를 읽고 `click_toggle()`이 화면 좌표로 클릭
- 시험 페이지: `test-site/index.html` (문단 2개 + 글 입력 칸), `python3 -m http.server 8766 --bind 127.0.0.1`
- 진입점 확인 순서(`probe.py`): ① 문단 위 오른쪽 클릭 ② 문단 드래그 선택 → 미니 메뉴 ③ Ctrl+Shift+. ④ 글 입력 칸에 문장 입력·전체 선택 후 오른쪽 클릭 ⑤ 입력 칸에서 Alt+I

## 진행 순서와 결과

| 순서 | 시나리오 (프로필) | 결과 | 캡처 |
| --- | --- | --- | --- |
| 1 | `s_survey.py`·`s_survey2.py`·`s_dump.py`·`s_toggles.py` (p1~p4) | 설정 묶음 `Copilot and AI`(`edge://settings/ai`)·Languages > Writing assistance·Appearance > Toolbar·Context menus 글자와 스위치 기본값 → `source-edge-156-settings-text.txt`. Toolbar 목록에는 Copilot 항목 없음, Context menus에는 미니 메뉴 전체 스위치만 | `10-copilot-ai`, `40-*` |
| 2 | `s_ui.py`·`s_explore.py` (p5·p6) | 기본 상태: 오른쪽 클릭 "Summarize with Copilot", 미니 메뉴 Copilot 아이콘, 글 입력 칸 "Help me rewrite (NEW, Alt+I)", Chat 버튼 → 사이드 창 "Let's get you signed in / Sign-in is required to access Copilot in Edge", 주소창 제안에 Copilot 줄 없음 | `41-addressbar` |
| 3 | `s_probe.py`·`s_set.py` (q0~q3, 설정 후 Edge를 닫고 다시 실행) | q0 기본, q1 버튼 끔 → Chat·Summarize·미니 메뉴 아이콘·단축키 사라짐, 문맥 단서 스위치 회색. q2 Use writing assistance만 끔 → Help me rewrite·Alt+I 그대로. q3 둘 다 끔 → Help me rewrite·Alt+I 그대로 (모두 재시작 뒤에도 유지) | `60-*`~`63-*` (재시작이라 Restore pages 말풍선이 보임) |
| 4 | `s_ntp.py` (q5) | Manage settings → Copilot 사이드 창(로그인 요청). Copilot new tab page 켬 → 새 탭 "Hey there, nice to meet you! / Type a link or ask anything", Journeys 스위치는 나타나지 않음 | `80-*`~`82-*` (82는 사이트 아이콘이 있어 글에 쓰지 않음) |
| 5 | `s_final.py` (r1, 한 번 실행) | 글 이미지용: 기본(a) → 버튼 끔(b) → Use writing assistance도 끔(c) 순서로 같은 조작. b·c에서 단축키 무반응, c에서도 Help me rewrite·로그인 요청 창. 버튼을 끄면 Manage settings 버튼도 회색 | `f-*` |
| 6 | `s_revert.py` (r2) | 버튼 끔 → 다시 켬 → Chat·Summarize·미니 메뉴 아이콘·단축키 모두 돌아옴 | (캡처 `90-*`는 저장하지 않음) |

## 실행 중 문제와 해석

- 처음 `s_switch.py`(p7)는 한 세션에서 단축키로 연 Copilot 사이드 창이 다음 단계까지 열린 채 남아 단축키 결과를 판단할 수 없었음 → 3번(단계마다 새 프로필 + 재시작)과 5번(단축키를 두 번 눌러 닫음)으로 다시 확인
- 처음 `s_ui.py`의 주소창 시험은 키보드 초점이 페이지에 남아 Alt+I 창이 뜸 → `s_explore.py`에서 주소창을 클릭해 다시 시험
- 설정 검색(`edge://settings/search?search=…`)은 주소로 열면 검색되지 않아 쓰지 않음
- Edge 언어 파일(`locales/en-US.pak`)은 Chromium pak v5와 달리 머리 16바이트·항목 8바이트(uint32 id + uint32 offset)로 읽어야 문구가 맞음
