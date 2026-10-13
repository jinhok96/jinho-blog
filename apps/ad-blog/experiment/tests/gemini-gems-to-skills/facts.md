# 사실 확인표 — gemini-gems-to-skills

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
