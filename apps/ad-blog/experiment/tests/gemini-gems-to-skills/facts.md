# 사실 확인표 — gemini-gems-to-skills

- 검증 유형 (가설 H3): **검증형** — 예시 Gem을 skill 폴더로 직접 변환하고 skills-ref 0.1.1로 검사(What we tested)

확인일: 2026-10-13 (UTC, 컨테이너에서 curl로 원문 확인)

## 기획

- 주 검색어: `gemini gems to skills`
- 하위 검색어 (`demand_check.py suggest "gemini skills"`, 2026-10-13, 25개): gemini skills vs gems (Google·Bing) · gemini skills list · gemini skills examples · gemini skills like claude · gemini skills install · gemini skills meaning · gemini skills reddit
- 채널: **피드형** (출시 직후 글: 10-13 Gemini 앱 스킬 배포 시작, 같은 날 Workspace 배포 연기 공지). 제목 67자, 주 검색어(Gemini Gems … Skills)는 앞 30자 안
- 차별점: (1) 계정 유형별 날짜를 Google 1차 출처 3곳으로 정리 (2) "유료 전용" 보도와 달리 Google 도움말은 구독 없이 사용 가능하다고 명시 (3) 예시 Gem을 SKILL.md로 직접 변환해 Agent Skills 검증 도구로 확인: .docx·.DS_Store 문제, 이름 규칙 8건, skills-ref 0.1.1은 악센트 문자(`résumé-coach`)를 통과시키지만 스펙은 a-z만 허용
- 적용한 노하우: 피드형 제목 `{바뀐 것}: What Changes and How to {동작}` (노하우 1·5), 이미지 3장 = 일정 그래프 1(대표, 1200×675)·직접 실행 결과 화면 2 (노하우 7, How-to 목표 3장), 요약 표 4개
- 내부 링크: 새 글 → `turn-off-ai-in-chrome`·`check-if-image-is-ai-generated` (관련 글 2편뿐), `turn-off-ai-in-chrome`에서 새 글로 역링크
- 직접 확인 못 한 것: Gemini 로그인 화면(컨테이너에서 계정 로그인 불가) → 업로드 화면 동작·메뉴는 Google 문서 기준으로 "Google says/guide says"로 표기

## 출처

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| Gemini 앱 스킬 배포 10-13 시작·11월 중순 완료, Workspace 스킬 배포 "Delayed until further notice" | workspaceupdates.googleblog.com/2026/10/an-update-on-launch-of-skills-in-gemini-app-and-workspace.html | 본문 |
| 개인 계정 Gems 종료 2026년 11월, 업무 2027-03, 교육 2027-06, 종료 시 자동으로 스킬 변환, Opal·Gems by Google Labs도 11월 종료 | support.google.com/gemini/answer/18560919 (FAQ) | 본문 |
| 11-17 Gems가 Settings로 이동(모든 사용자 계속 사용 가능), 업무 "no sooner than March 1, 2027"·교육 "no sooner than June 1, 2027", 남은 Gems는 draft skills로 자동 이전, Classroom·LTI에서 제거 | knowledge.workspace.google.com/admin/generative-ai/gemini-app/about-the-transition-to-skills, workspaceupdates.googleblog.com/2026/09/skills-gemini-app-workspace.html | 본문 |
| Gemini 앱 스킬과 Workspace 스킬은 동기화 안 됨 | 위 Workspace Updates 9월 글·관리자 문서 | 본문 |
| Gems by Google Labs는 스킬로 이전되지 않음 | blog.google/products-and-platforms/products/gemini/automate-tasks-with-skills/ (각주) | 본문 |
| 요구 조건: 18세 이상, 개인 계정, Keep Activity 켜짐, 모바일·Mac·웹, 업로드는 Mac·웹만 | support.google.com/gemini/answer/17094296, 18560919 | 본문 |
| 스킬은 Google AI 구독 없이 사용 가능 | support.google.com/gemini/answer/17094296 (Common questions Tip) | 본문. 반대 보도(aiweekly.co "Paywalled") 확인 → Google 문서 기준 |
| `/`(곧 `@`)로 호출, 자동 적용, 여러 개 조합, 최대 100개 활성, 스킬별 채팅 목록 없음 | 18560919 FAQ, 17094296 | 본문 |
| 스킬에서 안 되는 Gem 도구: Create video·Create music·Canvas·Deep research·Guided learning, GitHub 파일 미지원, Drive 파일·공유는 "coming weeks" | 18560919 FAQ | 본문 |
| 업로드 형식(텍스트·PDF·이미지 지원, .docx·.xlsx 미지원), SKILL.md는 최상위 폴더, 소문자-하이픈 이름, 합계 100MB, 인터넷 필요한 스크립트 불가, .DS_Store 같은 숨은 파일 주의 | 17094296 Upload requirements | 본문 |
| 수동 이전 3단계(Edit → Knowledge 파일 Download → Create manually → Download zip → Replace skill, 폴더명 = 스킬명) | 18560919 "Recreate your Gem as a skill" | 본문. 메뉴 경로가 문서마다 다름: 18560919 "Settings > Skills", 17094296 "Customize > Skills" → 글에 둘 다 표기 |
| 설명 1024자 제한 | support.google.com/gemini/answer/17102773 | 본문 |
| 이름 규칙: 64자, a-z·0-9·하이픈, 앞뒤·연속 하이픈 금지, 폴더명 일치 | agentskills.io/specification | 본문 |
| 교육용 대안: Gemini Notebook, Guided Learning (Classroom 곧 제공) | Workspace Updates 9월 글 | 본문 |

## 측정 (직접 실행)

- 환경: Linux, Python 3.11, skills-ref 0.1.1 (PyPI, `agentskills` CLI), python-docx 1.2.0
- `make_sample.py`: 예시 Gem(이름·설명·지시문, 직접 작성)과 지식 파일 4개(.docx·.csv·.md·.DS_Store) 생성
- `gem_to_skill.py`: Google 업로드 규칙으로 파일 분류 → 스킬 폴더·zip 생성 → 결과 `results/convert-report.json`, `results/SKILL.md`
  - 결과: .DS_Store 제거, .docx 변환 필요, .csv·.md 유지, 합계 794바이트, zip 최상위에 SKILL.md
  - `agentskills validate` → `Valid skill` (`results/validate.txt`)
- `name_tests.py`: 이름 8개를 그대로 SKILL.md에 넣어 검사 → `results/name-tests.json`
  - 대문자·공백·기호·연속/앞 하이픈·64자 초과는 오류. `résumé-coach`는 skills-ref 0.1.1 통과(유니코드 소문자 허용)지만 스펙 문서는 a-z만 허용
- 이미지: `charts.py`(일정 그래프), `shots.py`(결과 JSON·SKILL.md를 HTML로 렌더링 → Playwright + `/opt/pw-browsers/chromium-1194` 스크린샷). 출력 `img/` → `content/posts/images/gemini-gems-to-skills/`로 복사
- 재현: `python3 -m venv /tmp/sk && /tmp/sk/bin/pip install skills-ref python-docx matplotlib pillow playwright` 후 `make_sample.py` → `gem_to_skill.py sample/gem.json sample/knowledge out` → `agentskills validate out/weekly-newsletter-writer` → `name_tests.py` → `charts.py` → `shots.py`

## 2026-11-05 재확인 (세션 80, 개선 세션 · 사실 갱신)

확인일: 2026-11-05 KST (2026-11-04 UTC), curl로 원문을 받아 본문 텍스트를 `sources-2026-11-05/`에 저장. 10-13 원문 사본은 없어 위 '출처' 표의 10-13 기록과 비교.

**갱신 이유**: 색인된 상시 글(28일 웹 노출 49·클릭 1·평균 8.4위, 10-08~11-04), 검색어 `where did gems go in gemini` 3회·6.0위, `gems to skills`·`gemini gems tools capabilities limitations` 각 1회·10위. 11월에 개인 계정 Gems 종료가 다가와 검색이 늘 시점인데, Google FAQ가 바뀌어 글의 11-17 설명("모든 계정, 계속 사용 가능")과 .docx 미지원 설명이 틀리게 됨. 자동완성(11-04): `gemini gems going away`(Google), `migrating google gemini gems to skills`(Google), `gems to skills gemini`(Google), `gemini skills vs gems`(Bing), `gemini gems to skills`(YouTube)

**상위 결과 (WebSearch 11-05, `Gemini Gems going away November 17 read only December 17 skills`)**: Android Authority·PCWorld·Android Central·Notebookcheck·tbreak·TalkAndroid·Android Headlines 등 뉴스 기사와 개인 블로그(online-tech-tips, theaicareerlab). 검색 요약 기준 12-17 삭제일·11-05 파일 형식 목록을 다룬 결과 없음 → 빈틈(Uncovered)은 Google FAQ의 12-17 삭제일·읽기 전용 기간에 할 일·자동 이전에서 빠지는 파일 목록. 기사 내용은 인용하지 않음

| 바뀐 사실 | 10-13 글 | 11-05 출처 문장 | 출처 파일 |
| --- | --- | --- | --- |
| 개인 계정 11-17 | "All accounts: Gems move to Settings, still usable" | "November 17, 2026: Gems transition to skills and become read only. You can still access your Gems, but can't use or edit them, or create new ones." (개인 계정 18세 이상 항목의 하위 목록, HTML `<ul>` 중첩 확인) | `gemini-help-18560919-transition-faq.txt` |
| 개인 계정 12-17 (새 날짜) | 없음 | "December 17, 2026: Gems are removed from Gemini Apps." / "you can download your files from Gems before December 17, 2026" | 같은 파일 |
| 18세 미만 개인 계정 | 없음 | "your Gems will transition to skills at a later date" | 같은 파일 |
| 업무·학교 계정 11-17 | (위 'All accounts'에 포함) | "November 17, 2026 Gems move to Settings in the Gemini app. All users can continue to create, edit, and use them." (Workspace 관리자 문서, Last updated: September 30, 2026) | `workspace-admin-transition-to-skills.txt` |
| 자동 이전에서 빠지는 파일 | GitHub만 | GitHub files · Audio · Video · .doc/.xls/.ppt · .zip/.tar/.7z/.rar/.gz/.tgz, 100MB 넘으면 "remove the largest files first" | FAQ |
| 지원 파일 형식 | 텍스트·PDF·이미지만, .docx·.xlsx 미지원 | 지원 목록에 .docx·.odt·.xlsx·.ods·.pptx·.odp 등, 미지원 .doc·.xls·.ppt·.raw·오디오·영상·압축·일부 코드(.sql 포함) | `gemini-help-17094296-create-manage-skills.txt` |
| Drive 파일 | "coming weeks" | 도움말 17094296: Add → "Google Drive, Google Photos, or Notebooks" / FAQ: "In the coming weeks, skills will have ... add files from Google Drive and notebooks" → **출처끼리 다름**, 글에 둘 다 적음 | 두 파일 |
| 공유 | "coming weeks" | 그대로 (FAQ·Workspace Updates 10-13). 관리자 문서: 이전 시 "Drive permissions and sharing settings ... transfer" | FAQ·관리자 문서 |
| 스킬 페이지 경로 | FAQ "Settings > Skills" vs 도움말 "Customize > Skills" | 둘 다 "Customize > Skills", "Create > Create manually", Replace skill 뒤 "Upload" | FAQ·도움말 |
| 단축키 | "/ (soon to be @)" | 도움말 "/ (or @, if you have the updated shortcut)" | 도움말 |
| Workspace 앱 스킬 배포 | 10-13 보류 | Workspace Updates 피드 11-04까지 새 일정 글 없음, 10-13 글 "Delayed until further notice" 그대로 | `workspace-updates-2026-10-13.txt` + 피드 목록 |
| 유지 확인 | 구독 없이 사용, 18세 이상·Keep Activity, 업로드는 웹·Mac만, 100개 활성, Opal·Gems by Google Labs 11월 종료·Labs Gems는 이전 안 됨 | 모두 그대로 | 도움말·FAQ·블로그 각주 |

**측정 재실행** (`gem_to_skill.py --rules 2026-11-05`, 같은 예시 Gem·지식 파일 4개, skills-ref 0.1.1, `python3 -m venv` + `pip install skills-ref==0.1.1 python-docx matplotlib pillow playwright`)

- 10-13 규칙(`--rules 2026-10-13`)으로 다시 돌린 결과가 기존 `results/convert-report.json`과 같음을 확인한 뒤 파일 이름에 날짜를 붙임 (`convert-report-2026-10-13.json`·`validate-2026-10-13.txt`·`SKILL-2026-10-13.md`)
- 11-05 규칙: .docx 유지(지원 목록), .csv·.md 유지, .DS_Store 제거 → 3/4 유지, 폴더 37,495바이트(37 KB), zip 최상위 SKILL.md, `agentskills validate` → `Valid skill` (`results/convert-report-2026-11-05.json`·`validate-2026-11-05.txt`·`SKILL-2026-11-05.md`: Reference files에 `style-guide.docx` 추가)
- 그림: `charts_2026_11_05.py`(chart_style 토큰·Inter)로 `gems-to-skills-timeline.webp`(개인 계정 4개 날짜 + 업무·학교 계정 패널)·`gem-converted-to-skill.webp`(10-13 vs 11-05 규칙 표 + 결과 4줄) 다시 만듦. 이전 그림의 터미널 모양 패널은 뺌(writing-guide 터미널 화면 금지). `skill-name-check.webp`는 이름 규칙이 그대로라 유지
- 직접 확인 못 한 것: Gemini 로그인 화면(계정 로그인 불가) → Add 버튼·Drive 연결·11-17 뒤 화면은 Google 문서 기준으로 "Google's help page describes/says"로 표기
