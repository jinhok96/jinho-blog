# turn-off-ai-in-brave 브리프 · 사실 확인표

- 검증 유형 (가설 H3): **검증형** — Brave 1.98.63(Linux) 새 프로필로 AI 설정 직접 확인(How we tested)
- 주 검색어 (가설 H6): `turn off ai in brave` — 브리프 주 검색어

## 작성 전 브리프 (2026-11-04 KST 세션 77, 일반 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` (우선순위 1) 상시 글, 카테고리 `software` |
| 주 검색어 | `turn off ai in brave` — `demand_check.py suggest` 2026-11-03: Google·Bing. 같은 의도 YouTube `how to turn off brave ai`·`turn off brave ai`. 하위 `turn off ai in brave browser`·`can you turn off ai in brave browser`·`turn off ai search brave`·`turn off ai overview in brave`·`turn off leo ai in brave`(Google), `how to turn off ai in brave browser`·`brave browser no ai`(Bing). `brave leo ai` Google·Bing·YouTube 3곳(하위 `close`·`shortcut`·`free`). `disable leo brave` 계열 10개(`brave disable leo completely`·`remove leo ai from brave`·`disable ask leo brave`, Google). Trends 12개월(미국) 후보끼리 `brave leo` 5.8 · `duckduckgo ai` 43.5 (세션 71, 2026-11-01) |
| 하위 검색어 | turn off leo ai in brave · brave disable leo completely · remove leo from brave search bar (Ask Leo) · turn off ai search brave (Answer with AI) · turn off google ai overview in brave · how to turn off leo ai in brave shortcut · brave browser no ai |
| 검색 의도 | 정보형 How-to (가리기 → 완전히 끄기, 브라우저 AI vs 검색 AI) |
| 채널 | 검색형 |
| 상위 결과 (WebSearch 2026-11-03) | `turn off ai in brave browser leo`: Brave 도움말 "How do I disable Brave Leo?"(공식, 컨테이너에서 Cloudflare 확인 화면으로 막힘), community.brave.app 질문 글 다수("How do I KILL Leo? Not Resolved", "I deactivated Leo in settings but it's still working", "Can I or can't I permanently remove AI from Brave?"), AlternativeTo·Neowin(2024년 관리 정책 추가 뉴스). 공통: brave://settings/leo-ai의 사이드바·오른쪽 클릭 스위치, Clear Leo data, 그룹 정책. **빠진 것**: 스위치별로 실제 사라지는 진입점 대응(툴바 버튼은 Leo 설정 페이지 밖, 주소창 Ask Leo는 Appearance의 체크박스, Tab Focus의 Organize 탭), 다 꺼도 남는 것(메인 메뉴 Leo AI·brave://leo-ai 채팅 화면·설정 섹션), 무료 판에서 flags 하나로 모두 없애는 결과와 Brave Origin($59.99) 비교, Brave Search Answer with AI가 쿠키(`summarizer`, 180일)라는 점 |
| 차별점 | Brave 1.98.63(2026-10-30 출시 최신 안정판) Linux판을 새 프로필로 실행해 진입점 7곳을 스위치 하나씩 끄며 재시작 전후 비교, flags Disabled 단독(새 프로필) 결과, 관리 정책 `BraveAIChatEnabled=false` 결과, Brave Search 설정 쿠키 직접 확인 |
| 내부 링크 계획 | 나가는 링크: 허브 `turn-off-ai-features`, `turn-off-ai-in-chrome`(같은 Chromium 기반), `turn-off-copilot-in-edge`, `turn-off-ai-in-firefox`, `duckduckgo-no-ai`(AI 없는 검색). 받는 링크: 색인된 `gemini-gems-to-skills`(다른 앱 AI 문단의 Edge 문장 뒤 1문장), 허브(제품 표 행 + 새 절 "How to turn off Leo AI in Brave", `updatedAt`). `turn-off-ai-in-chrome`(V3)·`check-if-image-is-ai-generated`(V6)는 판정 전이라 손대지 않음 |
| 개요 | 도입(답: 툴바 버튼 숨기기 + Settings > Leo 스위치 2개 + 주소창 체크 + Tab Focus, 완전히 없애려면 brave://flags) → 요약 표 · How to hide Leo AI in Brave settings · What each Leo switch removes · What stays after you turn every switch off · How to remove Leo completely with brave://flags · Do you need Brave Origin to remove Leo? · How to turn off AI answers in Brave Search · Can you delete your Leo chat history? · FAQ · Which option should you use? · How we tested |
| 이미지 | 대표: 빈 둥근 브라우저 창 + 꺼진 토글 5개가 있는 작은 제어판 + 유리 돔 아래 빛나는 반짝이 구슬, 연한 아쿠아 배경 + 번트 오렌지·남색, 위에서 내려다본 가파른 시점. 본문 7장: Leo 설정 화면(스위치 3개), 툴바 버튼(오른쪽 클릭 메뉴·Customize toolbar), 오른쪽 클릭 전후, 주소창 Ask Leo 전후 + 체크박스, 스위치 5개 vs flags 결과 표, flags 화면, Brave Search Answer with AI |

## 직접 확인 환경

- Brave 1.98.63 (Chromium 156.0.8078.80) Linux x64: Brave 공식 apt 저장소 `brave-browser-apt-release.s3.brave.com`의 `brave-browser_1.98.63_amd64.deb`(SHA-256 `24227cd5…cddd55`, 저장소 Packages 목록 값과 일치)를 `dpkg-deb -x`로 풀어 실행 (설치 없음). 최신 버전 확인 `versions.brave.com/latest/release-linux-x64.version` = 1.98.63
- 실행: Xvfb `:99` 1280×900, `--no-first-run --no-sandbox --test-type --lang=en-US`, CDP 9340에 Playwright 1.64.1(Python) 연결. 브라우저 메뉴는 xdotool, 캡처는 ImageMagick `import`. 새 프로필·로그인 없음, 2026-11-03 15:20~16:00 UTC
- 시험 페이지 `test-site/index.html` (제목 + 문단 2개 + 글 입력 칸, `python3 -m http.server 8767`)
- 실행 순서·결과는 `capture-notes.md`, 단계별 결과 `chain-c.json`·`after-*.json`·`search-ai-f.json`·`leo-extra-g.json`
- 모바일(Android·iPhone) Brave는 실행하지 않음. Brave 도움말 센터(support.brave.app)는 curl·Chromium·WebFetch 모두 Cloudflare 확인 화면·403 → 우회하지 않고 인용하지 않음

## 사실 확인표

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| Brave 1.98.63은 2026-10-30 출시, Chromium 156.0.8078.80 | brave.com/latest (`source-latest.txt`), CDP `/json/version` | 릴리스 노트 문장 + 실행 사본 |
| Settings > Leo(brave://settings/leo-ai)에 Show Leo icon in the sidebar · Show Leo in the context menu on websites · Tab Focus Mode 스위치, 새 프로필 기본값 모두 켜짐. 문맥 메뉴 설명 "Leo will appear in the context menu when you right-click on a website. This will send context from the current web page to Leo." Tab Focus 설명 "When opened, this will automatically send the titles and origins of all non-private tabs to Leo to classify them." + Adjust autocomplete suggestions · Clear Leo data · Store my conversation history(켜짐) | 직접 확인 (`screens/01-settings-leo.txt`·`.webp`) | 설정 화면 글자·토글 상태 |
| 툴바 Leo AI 버튼 오른쪽 클릭 메뉴: Open Leo AI in the sidebar(체크) · Open Leo AI in a new tab · About Leo AI · Manage Leo AI settings · Hide Leo AI icon | 직접 확인 (`screens/c-toolbar-menu.webp`·`c-toolbar-menu-hide.webp`) | 캡처 |
| Settings > Appearance > Customize your toolbar 패널(Toolbar)에 Leo AI 스위치(켜짐) | 직접 확인 (`screens/04-customize-toolbar.webp`) | 캡처 |
| Settings > Appearance > Show autocomplete suggestions in address bar 아래 체크박스 On-device suggestions · Browsing History · Bookmarks · Quick commands · Leo AI Assistant(모두 체크) | 직접 확인 (`screens/02-settings-appearance.txt`, `k-appearance-autocomplete.webp`) | CR-CHECKBOX 상태 |
| 기본 상태 진입점: 툴바 Leo AI 버튼, 사이드바 맨 위 Leo 아이콘, 선택한 글·글 입력 칸 오른쪽 클릭의 Leo AI tools 하위 메뉴(Quick actions: Summarize·Explain / Rewrite: Paraphrase·Improve·Change tone·Change length / Create: Tagline·Social media), 주소창 "how do solar panels work - Ask Leo" 줄, 탭 검색(Ctrl+Shift+A) Search·Organize 탭 중 Organize = Tab focus(Enable 버튼). 선택 없는 문단 오른쪽 클릭에는 Leo 없음 | 직접 확인 (`chain-c.json` s0, `screens/c-s0-default-*`) | 캡처 |
| Hide Leo AI icon → 툴바 버튼만 사라짐 (`brave.ai_chat.show_toolbar_button: false`) | 직접 확인 (s1) | 재시작 후 캡처 + Preferences |
| Show Leo icon in the sidebar 끔 → 사이드바 Leo 아이콘 사라짐 (`brave.sidebar.hidden_built_in_items: [7]`), 오른쪽 클릭 Leo AI tools는 그대로 | 직접 확인 (s2) | 재시작 후 캡처 + Preferences |
| Show Leo in the context menu 끔 → 선택한 글·글 입력 칸의 Leo AI tools 사라짐 (`context_menu_enabled: false`) | 직접 확인 (s3) | 재시작 후 캡처 |
| Leo AI Assistant 체크 해제 → 주소창 Ask Leo 줄 사라짐 (`autocomplete_provider_enabled: false`) | 직접 확인 (s4) | 재시작 후 캡처 |
| Tab Focus Mode 끔 → 탭 검색 창에 Organize 탭 없음 (`tab_organization_enabled: false`) | 직접 확인 (s5) | 재시작 후 캡처 |
| 5개를 모두 끈 뒤에도 메인 메뉴(≡)의 Leo AI 항목, brave://leo-ai 전체 화면 채팅("How can I help you today?" 입력 칸), Settings의 Leo 섹션이 남음 | 직접 확인 (`after-c-left.json`, `screens/c-left-*`) | 캡처·글자 |
| 기본 키보드 단축키 없음: System > Shortcuts의 Toggle Leo AI·Open AI Chat은 키 없이 Add만 | 직접 확인 (`screens/05-shortcuts.txt`) | 글자 |
| brave://flags "Brave AI Chat — Summarize articles and engage in conversation with AI – Mac, Windows, Linux, Android #brave-ai-chat" 기본 Default (Enabled). 페이지 경고 "Warning: Experimental features ahead! By enabling these features, you could lose browser data or compromise your security or privacy. Enabled features apply to all users of this browser." 바꾸면 "Your changes will take effect the next time you relaunch Brave." + Relaunch | 직접 확인 (`screens/06-flags.txt`, `c-flag-brave-ai-chat-Disabled.webp`) | 글자·캡처 |
| 새 프로필에서 flags만 Disabled → 재실행 뒤 툴바 버튼·사이드바 아이콘·오른쪽 클릭 Leo AI tools·Ask Leo·Organize 탭·메인 메뉴 Leo AI·Settings Leo 섹션 모두 없음, brave://settings/leo-ai는 설정 첫 화면으로, brave://leo-ai는 ERR_INVALID_URL. 프로필 Preferences의 Leo 스위치 값은 바뀌지 않음, 값은 브라우저 전체 `Local State`(`brave-ai-chat@2`)에 저장 | 직접 확인 (`after-d-flagoff.json`, `screens/d-flagoff-*`, `Local State`) | 캡처·주소·파일 |
| flags를 Default로 되돌리면 Leo가 돌아오고, 앞서 끈 스위치 4개는 꺼진 상태 그대로 | 직접 확인 (`after-c-flagback.json`) | 설정 토글 상태 + Preferences |
| 관리 정책 `BraveAIChatEnabled`가 brave://policy 목록에 있음. false로 두면(`/etc/brave/policies/managed`) flags Disabled와 같이 Leo 설정 섹션 없음·brave://leo-ai 잘못된 주소 | 직접 확인 (`screens/g-policy.txt`, `h-policy-*`) | 시험 뒤 정책 파일 삭제 |
| Brave Origin: 기능 관리·제거(Leo 포함), 1회 구매 $59.99(US), Linux는 무료, "On other platforms, Brave users are still able to hide or disable unwanted features for free in the non-Origin version of Brave." 업그레이드 Origin은 brave://flags/#brave-origin으로 끔 | brave.com/origin (`source-origin.txt`) | 렌더링 저장본 문장 |
| Leo 개인정보: 일반 채팅은 프롬프트·대화 맥락, 요약은 보고 있는 페이지 내용(강조한 글 포함), 탭 관리는 비공개가 아닌 탭의 제목·URL을 Leo 서버로 보냄. 서버에 프롬프트·응답 보관 안 함, 대화 기록은 기기에 저장(Sync 켜면 포함), brave://settings/leo-ai에서 기록 끄기·대화 삭제, 방문 기록을 지우면 대화의 페이지 내용도 지워짐, 비공개 창 대화는 저장 안 함, 무료 Leo는 계정 불필요 | Brave Browser Privacy Notice, Brave Leo 절 (`source-browser-privacy.txt`) | 렌더링 저장본 문장 |
| Leo 패널 안내 "Leo doesn't retain or share chats, or use them for model training. No account or login is required." | 직접 확인 (`screens/a0-3-context-selection.webp` 패널) | 캡처 (Brave 주장으로 인용) |
| search.brave.com/settings의 Answer with AI "Make AI-powered answers appear automatically for some searches." 새 프로필 기본 켜짐. 끄면 쿠키 `summarizer=0`(search.brave.com, 만료 2027-05-02 = 180일), 켜진 기본 상태에서는 쿠키 없음 | 직접 확인 (`search-ai-f.json`, `screens/e-search-settings.*`·`f-settings-after.webp`) | 쿠키 목록·스위치 상태 |
| 켜짐 상태 검색 결과 맨 위 AI 답변 + "AI-generated answer. Please verify critical facts." | 직접 확인 (`screens/f-search-on.txt`) | 글자 (결과 화면 캡처는 남의 이미지·광고가 있어 글에 쓰지 않음) |
| 꺼짐 상태 검색 결과는 확인 못 함: 두 번째 검색에서 429 + "Verifying you're not a bot" | 직접 확인 (`screens/f-search-off.txt`) | 우회하지 않음 |
| Brave Search AI 기능: AI Answers(질문에 요약 답 + 출처), Ask Brave(긴 답·후속 채팅·Deep Research) | Brave Search Help "AI in Brave Search" (`source-search-help-ai.txt`) | 렌더링 저장본 문장 |
| Brave Search는 설정을 익명 쿠키로 기억 (도움말의 쿠키 목록에 `summarizer`는 없음) | Brave Search Help "Anonymous cookies" (`source-search-help-cookies.txt`) | 렌더링 저장본 문장 |
| Answer with AI 발표 2024-04-17, 질문형 검색은 기본으로 답, 그 밖은 Answer with AI 버튼으로 요청 | brave.com/blog/answer-with-ai (`source-blog-answer-with-ai.txt`) | 렌더링 저장본 문장 |
| 우리 사본의 기본 검색 엔진: 일반 창 Google, 비공개 창 Brave | 직접 확인 (`screens/03-settings-search.txt`) | 설정 글자 (지역에 따라 다를 수 있어 "our copy"로) |
| Brave Search는 어떤 브라우저에서도 search.brave.com으로 쓸 수 있음 | brave.com/search (`source-search-page.txt`) | 렌더링 저장본 문장 |

## 쓰지 않은 것

- Brave 도움말 센터 문서 내용(접근 불가)
- Android·iPhone 앱의 Leo 설정 화면 (실행하지 않음, 1차 출처 접근 불가). flags 페이지의 플랫폼 표기(Mac·Windows·Linux·Android)만 인용
- Clear Leo data 확인 창 (누르기가 우리 시험에서 창을 띄우지 못함 → 버튼 위치만 씀)
- Leo Premium 요금 (이번 세션에 1차 출처로 확인하지 않음)
- Brave Origin 구매·활성화 (구매하지 않음)
