# 운영 로그

최신 세션이 위에 오도록 기록합니다. 형식: 날짜 · 한 일 · 측정값(있으면) · 다음 할 일.

## 2026-10-15 · 세션 7 (정기 실행 6회차): 무료 오프라인 이미지→텍스트(OCR)

세션 시각: 2026-10-14 21:10 UTC (한국 10-15 06:10). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-16 ~ 10-14, 세션 6 이후 바뀐 값만)**

- **첫 클릭 1** (홈 `/`, 순위 3.0). 노출 23 → **33**, CTR 3.0%, 평균 순위 14.6
  - `turn-off-ai-in-chrome` 노출 15 → 21 (순위 5.2) / `transcribe-audio-offline-free` 6 (9.5) / `check-if-image-is-ai-generated` 5 (62.2)
  - 검색어 2개(`google ai gone` 3위, `synthid detector` 143.5위)는 같음
- URL 검사: `free-offline-ai-tools`(10-14 19:12 UTC 크롤링)·`gemini-gems-to-skills`(11:38 UTC) **`Submitted and indexed`** → 8편 중 7편 색인. `remove-background-from-image-free-offline`은 `Discovered - currently not indexed` → **`URL is unknown to Google`**로 바뀜 (세션 5에서 발견됐던 URL이 다시 미발견 상태로 표시, 원인 불명)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 판단 11-11) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                         | 카테고리   | 유형                      | 직접 검증                                                                                                   |
| ---------------------------- | ---------- | ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `image-to-text-offline-free` | `ai-tools` | 비교 (측정형, 검색형)     | OCR 4개 엔진 7개 설정(Tesseract 5.3.4 기본·`--psm 6`, RapidOCR 3.10 small·medium, EasyOCR 1.7.2, docTR 1.1.0 기본·mobile)을 직접 만든 50장(스크린샷·11px 글자·스캔·사진·영수증 각 10장)으로 측정 |

- 선정 근거: 백로그 32(허브 확장용 번역·OCR). Trends(미국 3개월, 기준 `remove background` 35.5): `ocr` 13.2 · `image to text` 9.8 · `offline translator` 0.0 · `extract text from image` 0.0 → OCR, 주 검색어 `image to text`. 자동완성: "image to text free" 26개(Google·Bing·YouTube: no sign up·unlimited·offline), "image to text offline" 19개, "ocr offline" 21개(windows·free·software)
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Google Trends 미국 급상승 10개: 정치·스포츠·날씨 → IT 주제 없음. 공식 피드 새 항목(Python 3.15 Windows on Arm, Apple TV·HomePod) → 일반 사용자 검색 수요 약해 보류
- 적용한 노하우: 검색형 제목 51자·설명 154자, 측정 규모 제목 표기, 이미지 5장(대표 표 그래프 1200×675 + 속도·메모리 + 테스트 이미지 예시 + 영수증·작은 글자 실제 출력 비교), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → 허브 + 측정 글 3편. **허브 `free-offline-ai-tools`에 OCR 섹션·요약 표 행 추가, `updatedAt` 2026-10-15** (검증 기록 V2). V1 대상 3편은 판정 전 추가 변경 금지 규칙 때문에 새 글 역링크를 넣지 않음 (허브가 역링크 역할)
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 9개, og:image 생성, 이미지 모두 width·height 지정. 허브 `dateModified` 2026-10-15

**측정값 (Xeon 2.8GHz 4코어, RAM 16GB, GPU 없음, 기본 설정)**

| 엔진                  | 거의 완벽(CER≤2%, /50) | 단어 재현율 | 영수증 숫자 | 초/장 | 최대 RAM |
| --------------------- | ---------------------- | ----------- | ----------- | ----- | -------- |
| Tesseract `--psm 6`   | **42**                 | 96.4%       | 86%         | 0.54  | 0.05GB   |
| Tesseract 기본        | 33                     | 93.1%       | 51%         | 0.55  | 0.05GB   |
| docTR 기본            | 33                     | 99.0%       | 97%         | 2.99  | 1.34GB   |
| docTR mobile          | 31                     | **99.1%**   | 98%         | 1.06  | 1.09GB   |
| RapidOCR small        | 34                     | 93.6%       | 95%         | 1.50  | 0.61GB   |
| RapidOCR medium       | 35                     | 97.3%       | 98%         | 26.4  | 0.89GB   |
| EasyOCR               | 1                      | 85.6%       | 47%         | 3.56  | 1.79GB   |

**알게 된 것**

- 정확도 지표를 하나만 쓰면 결론이 뒤집힘: docTR은 단어는 99% 읽지만 영수증 가격을 별도 블록으로 출력해 CER 기준 영수증 0/10 → "단어 재현율(순서 무시)"과 "거의 완벽(순서 포함)"을 함께 보고
- Tesseract 기본(`--psm 3`)은 영수증 10장 중 7장에서 가격 열 대부분을 누락, `--psm 6`으로 바꾸면 숫자 재현율 51% → 86%. 작은 글자에서는 "I"를 "|"로 읽음
- RapidOCR(PP-OCRv6 small)은 화면 폭 전체의 긴 줄을 흩어진 글자로 내놓는 경우가 있음 (스크린샷 20장 중 12장 단어 재현율 97% 미만). medium은 덜하지만 약 18배 느림
- 저작권 문제 없는 정답 텍스트 확보: Project Gutenberg(퍼블릭 도메인) 본문 + 직접 만든 영수증으로 이미지를 생성해 정답을 정확히 앎. gutenberg.org·modelscope.cn·doctr-static.mindee.com·EasyOCR 모델(GitHub Releases 고정 태그)·apt(archive.ubuntu.com) 모두 접속 가능
- 측정 중 실수: (1) 실행 중인 `run_all.sh`를 수정·폴더 이름 변경 → 스크립트 중단, 나머지 엔진은 같은 순서로 따로 실행 (결과 영향 없음). (2) RapidOCR medium 측정 중 `pnpm install`(약 15초)을 함께 실행 → 이미지 1~2장 시간이 늘었을 수 있음 (중앙값 사용, 18배 차이라 결론 영향 없음). (3) Python 파일 쓰기 버퍼 때문에 결과 줄 수로 진행률을 볼 수 없었음 → 다음엔 `flush`
- Apple Live Text 문서는 오프라인 동작 여부를 밝히지 않음 → 글에서 오프라인이라고 쓰지 않음. Microsoft는 Snipping Tool 텍스트 인식이 기기 안에서 처리된다고 명시

**다음 할 일**

- Claude: `remove-background-from-image-free-offline` `URL is unknown` 추적 (이번 세션 확인: 배포된 sitemap에 포함, HTTP 200, `index, follow`, canonical 자기 자신 → 사이트 쪽 문제는 없음). 다음 세션에도 같으면 사용자에게 Search Console URL 검사 → 색인 요청 제안
- Claude: 새 글 노출 검색어 확인 (`image to text offline`, `ocr offline` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 발행 9편 / AdSense 신청 기준 20편

## 2026-10-14 · 세션 6 (정기 실행 5회차): 허브 글 — 무료 오프라인 AI 도구

세션 시각: 2026-10-14 09:10 UTC (한국 18:10). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-16 ~ 10-14, 세션 5 이후 바뀐 값만)**

- 노출 21 → **23** (`turn-off-ai-in-chrome` 13 → 15, 순위 5.7), 클릭 0, 평균 순위 15.6. 검색어 2개는 같음
- URL 검사: `free-offline-text-to-speech` **`Submitted and indexed`** (10-14 00:02 UTC 크롤링). `remove-background-from-image-free-offline`은 `Discovered - currently not indexed` 유지, `gemini-gems-to-skills`(10-14 발행)는 `URL is unknown`
- 성과 검증: 판단 시점이 지난 행 없음 → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                    | 카테고리   | 유형                           | 직접 검증                                                                                                   |
| ----------------------- | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `free-offline-ai-tools` | `ai-tools` | 허브 + 비교 (측정형, 검색형) | 오프라인 챗봇 7개 모델(Qwen3.5 0.8B·2B·4B, Gemma 4 E2B·E4B, Llama 3.2 3B, Phi-4-mini)을 llama.cpp로 속도·RAM·20문항·이메일 요약 측정 + 기존 측정 글 3편 결과 정리 |

- 선정 근거: 백로그 28 (허브, traffic-playbook 3). 자동완성: "offline ai tools" Google·Bing·YouTube 14개(for pc·for mac·free·download), "free offline ai tools" 18개(Google·Bing: is there an offline ai, ai that works offline, offline ai for windows). 기존 3편은 받아쓰기·TTS·배경 제거뿐이라 검색 의도의 중심인 "오프라인 챗봇"을 새로 측정해 허브를 채움
- 반복 일정: Chrome 156은 10-20, Windows 다음 Patch Tuesday 11-10 → 이번 세션 해당 없음
- 다른 후보: passkey 설정(자동완성 27개, Google 블로그 10-08 글)은 수요가 크지만 Google·Apple 공식 문서 경쟁이 강하고 직접 검증이 어려워 백로그에 추가. Google Trends 미국 급상승 10개: 스포츠·연예·"spectrum outage"(통신 장애) → IT 도구 주제 없음
- 적용한 노하우: 첫 허브 글(노하우 3, 제목에 연도), 검색형 제목 53자, 이미지 5장(대표 그래프 1200×675 + 그래프 2 + 실제 출력 비교 1 + rembg 화면 재사용 1), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → 측정 글 3편 + `turn-off-ai-in-chrome`, 측정 글 3편에서 허브로 역링크 (검증 기록 V1)
- 빌드 HTML 확인: title·description(160자)·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 11개, og:image 생성, 본문 이미지 5장 모두 width·height 지정

**측정값 (Xeon 2.3GHz 4코어, RAM 16GB, GPU 없음, llama-cpp-python 0.3.36, Q4_K_M, 3회 중앙값)**

| 모델          | 20문항 | 이메일 요약(초) | 날짜 4개 | 단어/초 | 최대 RAM |
| ------------- | ------ | --------------- | -------- | ------- | -------- |
| Qwen3.5 0.8B  | 12     | 14 (13줄, 지시 무시) | 4   | 12.8    | 1.3GB    |
| Qwen3.5 2B    | 19     | 10              | 3        | 6.7     | 2.7GB    |
| Gemma 4 E2B   | 18     | 10              | 4        | 8.8     | 4.2GB    |
| Llama 3.2 3B  | 17     | 16              | 3        | 7.1     | 4.4GB    |
| Phi-4-mini    | 16     | 17              | 3        | 5.5     | 5.4GB    |
| Qwen3.5 4B    | 19     | 22              | 4        | 3.9     | 5.6GB    |
| Gemma 4 E4B   | 19     | 17              | 4        | 4.7     | 7.8GB    |

**알게 된 것**

- `github.com/.../releases/latest` 리다이렉트도 403 → llama.cpp 사전 빌드 바이너리 대신 PyPI `llama-cpp-python` 소스 빌드(약 5분, cmake·gcc 있음). Qwen3.5·Gemma 4 아키텍처 모두 0.3.36에서 동작
- huggingface.co GGUF 7개(약 17GB) 약 6분에 다운로드. 다운로드 중 측정한 첫 실행은 속도 편차가 커서 다운로드 완료 후 재측정 (세션 3 교훈 재확인)
- 자동 채점은 실행 후 오답을 직접 보고 고쳐야 함: "1 7/8"(=1.875), "225 minutes"가 처음엔 오답 처리됨 → 채점 함수 수정, 저장된 답으로 재채점 (`score_20_at_run`에 원래 점수 보존)
- 측정 서버 CPU가 세션마다 다를 수 있음 (이번 2.3GHz, 세션 3·4는 2.8GHz) → 글에 행 간 비교 금지 명시. 측정 글은 `lscpu` 결과를 항상 저장
- LM Studio 홈이 "Bionic"(에이전트 앱, 유료 클라우드 플랜)으로 바뀜. 무료 플랜은 로컬 모델 포함. Ollama도 클라우드 모델이 생겨 `OLLAMA_NO_CLOUD=1`로 로컬 전용 가능 → "오프라인" 글에서 앱의 클라우드 기능을 구분해야 함

**다음 할 일**

- Claude: 허브 글 노출 검색어 확인 (`offline ai tools for pc` 등), 새 측정 글(예: 오프라인 번역·OCR)이 생기면 허브 표에 추가하고 `updatedAt` 갱신
- Claude: 검증 기록 V1(허브 역링크) 2026-11-11 판정
- Claude: `remove-background-from-image-free-offline`·`gemini-gems-to-skills` 색인 여부 확인
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 발행 8편 / AdSense 신청 기준 20편

## 2026-10-14 · 세션 5 (정기 실행 4회차): Gemini Gems → 스킬 전환

세션 시각: 2026-10-13 22:10 UTC (한국 10-14 07:10). 열린 PR 없음.

**지표 (Search Console API, `gsc_report.py`, 2026-09-15 ~ 10-13, 미확정 데이터 포함)**

- 클릭 0 · **노출 21** (세션 4의 7에서 증가) · 평균 순위 16.4
  - `turn-off-ai-in-chrome`: 노출 13, 평균 순위 5.5 / `transcribe-audio-offline-free`: 노출 5, 순위 10.6 / `check-if-image-is-ai-generated`: 노출 3, 순위 73.3
  - 검색어(익명 처리 제외 2개): `google ai gone` 순위 3, `synthid detector` 순위 207 (세션 4와 같음)
- sitemap: 오류·경고 0, **10-13 08:11 UTC 재다운로드** (10-11 이후 처음)
- URL 검사: 4편 `Submitted and indexed`. `free-offline-text-to-speech`는 `URL is unknown` → **`Discovered - currently not indexed`**로 진전, `remove-background-from-image-free-offline`도 `Discovered - currently not indexed` (둘 다 크롤링 전)
- 성과 검증: 검증 기록에 판단 시점이 지난 행 없음 (기록 0건) → 판정·노하우 상태·writing-guide 변경 없음
- 해석(가설): 사이트맵 재다운로드 후 새 글 2편이 발견됨 → 다음 1~2일 내 크롤링 예상. 노출은 아직 글당 100회 미만이라 제목·설명 개선 판단 불가

**발행한 글**

| slug                    | 카테고리   | 유형                          | 직접 검증                                                                                                                                  |
| ----------------------- | ---------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `gemini-gems-to-skills` | `ai-tools` | How-to + Explainer (피드형) | 예시 Gem(지식 파일 4개)을 SKILL.md 폴더·zip으로 변환해 skills-ref 0.1.1로 검사, Gem 이름 8개 이름 규칙 검사. Gemini 로그인 화면은 확인 못 함 |

- 선정 근거: 백로그 7 (Gems → Skills). 10-13 Google이 Gemini 앱 스킬 배포 시작 + Workspace 배포 연기 공지 (Workspace Updates 피드, `discover`). 자동완성 "gemini skills" 25개(Google·Bing·YouTube), "gemini skills vs gems" Google·Bing 둘 다. 경쟁 글(Android Central·PCWorld 등)은 있으나 "유료 전용" 같은 틀린 보도가 있어 Google 도움말 기준 정리 + 직접 변환 검사로 차별화
- 반복 일정: 10월 Patch Tuesday(10-13) Windows 10 업데이트 `KB5126657`(19045.7807) 확인. 자동완성에 KB 번호·설치 오류 검색어가 없음(`KB5126657`은 Bing에 다른 KB만) → 세션 3 지침대로 새 글 대신 `windows-10-esu-extended` 빌드 표만 갱신(`updatedAt` 10-14). "windows 10 october 13 2026"·"windows 10 security updates october 2026"은 자동완성에 있음 → 기존 ESU 글이 받는 검색어인지 GSC로 관찰
- 다른 후보: Gemini 4 Argon(10-13 출시, 자동완성 16개: free·vs opus 5.5·pricing)은 뉴스·벤치마크 경쟁이 심하고 직접 검증 불가 → 보류. CISA에 Windows 명령 주입 취약점(CVE-2026-96951, 10-13) 추가 → 소비자 검색 수요 없음
- Google Trends 미국 급상승(10개): 스포츠·연예 → IT 주제 없음
- 적용한 노하우: **피드형 제목 67자**(노하우 1·5, ToolProof 첫 피드형), 이미지 3장(일정 그래프 대표 1200×675 + 직접 실행 결과 화면 2), 요약 표 4개 → 사실 확인표에 기록
- 내부 링크: 새 글 → `turn-off-ai-in-chrome`·`check-if-image-is-ai-generated` (관련 글 2편뿐이라 How-to 목표 4개 미달), `turn-off-ai-in-chrome`에서 새 글로 역링크
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 9개, og:image 생성, 본문 이미지 3장 모두 width·height 지정

**측정값 (Linux, Python 3.11, skills-ref 0.1.1)**

| 검사                            | 결과                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| 예시 Gem 지식 파일 4개          | .csv·.md 유지, .docx 변환 필요(미지원), .DS_Store 제거 → `agentskills validate` 통과  |
| 이름 8개 그대로 사용            | 7개 오류(대문자·공백·기호·연속/앞 하이픈·64자 초과), `résumé-coach`는 검사 통과       |
| `résumé-coach` (악센트 소문자)  | skills-ref 0.1.1은 유니코드 소문자 허용 → 통과, 스펙 문서(agentskills.io)는 a-z만 허용 |

**알게 된 것**

- (세션 후 추가, 사용자 질문으로 확인) Google Trends 상대 검색량 (`trends_compare.py`, 미국, 최근 3개월, 최고점 = 100): `remove background` 평균 35.5 · `gemini 4 argon` 1.1(최근 7일 8.1, 출시 직후 급증) · `gemini skills` 0.3(최근 7일 0.9) · `gemini gems` 0.2. 즉 **Gems → 스킬 주제는 배경 제거보다 검색량이 수십 분의 1 수준**. `gemini skills` 관련 검색어 급상승: "automate tasks using gemini skills"(Breakout), "gemini gems"(+250%), "gemini spark"(+70%)
- 반성: 주제 선정 때 수요를 자동완성(있다/없다)으로만 봐서 크기를 비교하지 못했고, 주 검색어 `gemini gems to skills`는 자동완성 조회도 안 했음 → 다음 세션부터 후보끼리 + 기존 글 주 검색어(기준)를 Trends로 비교해 backlog에 기록 (README 선정 기준 1번에 반영)
- Google 문서끼리 메뉴 경로가 다름: Gems 전환 FAQ는 **Settings > Skills**, 스킬 도움말은 **Customize > Skills** → 글에 둘 다 표기. Workspace 관리자 문서는 11-17에 "All users"의 Gems가 Settings로 이동한다고 함
- 스킬 유료 여부(backlog 미확인 항목): Google 도움말이 "Skills are available without a Google AI subscription"으로 명시 → 해결. 일부 언론의 "paywalled" 보도는 Google 문서와 다름
- 공식 참조 검사기(skills-ref 0.1.1)가 스펙 문서보다 느슨함(악센트 문자 허용) → 검사 도구 결과만 믿지 않고 스펙 원문도 대조해야 함
- support.google.com·knowledge.workspace.google.com·services.google.com(PDF)·agentskills.io·PyPI(skills-ref) 모두 curl로 접속 가능
- frontmatter 설명에 콜론(`:`)이 있으면 YAML 파싱 실패 → 따옴표로 감쌈

**다음 할 일**

- Claude: 첫 피드형 글(`gemini-gems-to-skills`)의 Discover 노출 확인 (`gsc_report.py --type discover`, 발행 2주 후). 피드형 3편 이상 쌓이면 검색형과 노하우 1 비교
- Claude: 11월 Gems 종료일(개인 계정)·Drive 파일·공유 기능 추가가 발표되면 새 글 갱신 (Workspace Updates·Gemini 도움말 확인)
- Claude: `free-offline-text-to-speech`·`remove-background-from-image-free-offline` 색인 여부 확인
- Claude: 허브 글 후보(backlog 28) 수요 확인, Chrome 156(10-20) 반영 여부 검토
- Claude: 이미지 적용 글(세션 4·5부터)과 미적용 글 5편의 발행 후 28~56일 지표 비교 → 노하우 7 판정

## 2026-10-13 · 세션 4 (정기 실행 3회차): 무료 오프라인 배경 제거

**지표 (Search Console API, `gsc_report.py`, 2026-09-15 ~ 10-13, 미확정 데이터 포함)**

- **첫 노출**: 클릭 0 · 노출 7 · 평균 순위 38.1
  - `turn-off-ai-in-chrome`: 노출 3, 평균 순위 7.0 / `transcribe-audio-offline-free`: 노출 3, 순위 13.0 / `check-if-image-is-ai-generated`: 노출 1, 순위 207
  - 검색어(익명 처리 제외 2개): `google ai gone` 순위 3 (Chrome AI 글로 추정), `synthid detector` 순위 207
- sitemap: 오류·경고 0 (마지막 다운로드 10-11 06:33 UTC, 이후 재다운로드 없음)
- URL 검사: 4편 `Submitted and indexed`, `free-offline-text-to-speech`는 **`URL is unknown to Google`** (10-12 발행, IndexNow 제출 후에도 Google 미발견)
- 성과 검증: 검증 기록에 판단 시점이 지난 행 없음 (기록 0건) → 판정·노하우 상태 변경 없음
- 해석(가설): 노출이 아직 한 자릿수라 제목·설명 개선 판단 불가. `google ai gone`은 Chrome AI 글 소제목·FAQ 보강 후보 (노출 100회 이상 쌓이면 판단)

**발행한 글**

| slug                                        | 카테고리   | 유형                       | 직접 검증                                                                                                                   |
| ------------------------------------------- | ---------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `remove-background-from-image-free-offline` | `ai-tools` | 비교 (측정형, 검색형 채널) | rembg 2.0.85 8개 모델을 AIM-500 50장(정답 알파 매트)으로 IoU·속도 측정, CLI 1장 메모리, 웹 UI 실행·스크린샷, EXIF 제거 확인 |

- 선정 근거: 백로그 10 (점수 37, 상시 수요, 직접 측정 가능). 자동완성: "remove background from image free" 28개(Google·Bing·YouTube), "remove background offline" 20개, "rembg" 18개, "birefnet" 19개. 일반 독자 각도는 "업로드·가입 없이 무료" + 내장 웹 UI 스크린샷 + Mac·Windows·Office 기본 기능
- 반복 일정: Windows 10월 Patch Tuesday는 10-13 17:00 UTC 배포라 세션 시점(02:00 UTC)에는 미배포 → 다음 세션으로 (backlog 29). Chrome 156은 10-20
- Google Trends 미국 급상승(10개): 정치·스포츠·연예 → IT 주제 없음. 공식 피드 새 항목: Google Health·Fitbit(10-12), Meet 양자내성 암호화 → 수요 미확인으로 보류
- 적용한 노하우: 검색형 제목 58자, 측정 규모 제목 표기, **이미지 5장(첫 이미지 사용 글)**, 대표 이미지 1200×675 측정 그래프 → 사실 확인표에 기록 (이미지 0장인 기존 5편과 비교용)
- 내부 링크: 새 글 → 3편, `check-if-image-is-ai-generated`·`transcribe-audio-offline-free`·`free-offline-text-to-speech`에서 새 글로 역링크
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개, og:image 생성, 본문 이미지 5장 모두 width·height 지정

**측정값 (4코어 Xeon 2.8GHz, GPU 없음, 투명 물체 6장 제외 44장 기준)**

| 모델                   | 깨끗(IoU≥0.95) | 실패(<0.8) | 초/장 | CLI 1장 RAM |
| ---------------------- | -------------- | ---------- | ----- | ----------- |
| bria-rmbg (rembg 기본) | 40             | 0          | 46    | 9.4GB       |
| birefnet-general       | 39             | 0          | 41    | 9.6GB       |
| birefnet-general-lite  | 38             | 0          | 30    | 7.8GB       |
| isnet-general-use      | 30             | 5          | 1.5   | 1.1GB       |
| u2netp                 | 28             | 4          | 0.3   | 0.5GB       |

(전체 8개는 `tests/remove-background-from-image-free-offline/summary.json`)

**알게 된 것**

- 측정 데이터 라이선스 확인 필요: DIS5K(배경 제거 벤치마크 표준)는 **비상업 전용** 약관 → 광고 사이트 측정에 쓰지 않음. AIM-500·P3M-10k는 MIT (이미지 저작권은 원저작자 → 글에는 데이터셋 이미지를 싣지 않고 scikit-image의 퍼블릭 도메인·CC0 사진으로 예시 그림 생성)
- rembg 2.0.85 기본 모델이 `bria-rmbg`(CC BY-NC 4.0)로 바뀌어 있음 → 가장 느리고 상업 이용 불가. 웹 UI(`rembg s`)는 Alpha matting·Post process mask가 기본으로 켜져 CLI와 결과가 다름
- 같은 프로세스에서 대형 ONNX 세션을 여러 개 열면 14GB를 넘어 OOM 종료 → 모델마다 새 프로세스로 측정. 처음엔 이를 "16GB에서 실행 불가"로 오해할 뻔했음 (단일 CLI는 9.6GB로 정상 동작)
- 네트워크: `huggingface.co` 데이터셋 parquet 다운로드 가능, Playwright(Python)로 `/opt/pw-browsers/chromium-1194` 실행해 로컬 웹 UI 스크린샷 가능 → How-to 글 스크린샷 수단으로 사용 가능
- 대형 모델 측정 50장에 약 1.5시간 소요 (모델당 25~40분) → 측정 글은 표본 크기를 미리 시간 예산에 맞춰 정함

**다음 할 일**

- Claude: 다음 세션에서 10월 Patch Tuesday(10-13) Windows 10 KB·설치 오류 검색어 확인 → Fix형 새 글 여부 판단, `windows-10-esu-extended` 빌드 표 갱신
- Claude: `free-offline-text-to-speech`가 계속 `URL is unknown`이면 원인 확인 (sitemap 재다운로드 여부)
- Claude: 허브 글 후보(backlog 28, 오프라인 AI 측정 글 3편) 수요 확인
- Claude: 이미지 적용 글(이번 글부터)과 미적용 글 5편의 발행 후 28~56일 지표 비교 → 노하우 7 판정 (최소 각 3편 필요)

## 2026-10-12 · 세션 3 (정기 실행 2회차): 무료 오프라인 TTS 비교

**지표 (Search Console API, `gsc_report.py`)**

- 2026-09-13 ~ 10-11: 클릭 0 · 노출 0
- sitemap: 오류·경고 0 (마지막 다운로드 2026-10-11 06:33 UTC)
- 글 4편 URL 검사: **모두 `Submitted and indexed`** (PASS, 마지막 크롤링 10-11 15:47~21:45 UTC). 세션 2의 `Discovered - currently not indexed`에서 하루 만에 색인

**발행한 글**

| slug                          | 카테고리   | 유형          | 직접 검증                                                                                                                                                                                 |
| ----------------------------- | ---------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `free-offline-text-to-speech` | `ai-tools` | 비교 (측정형) | sherpa-onnx 1.13.8로 TTS 11개 음성(Piper 5·Kokoro 2·KittenTTS 2·Supertonic·Matcha) 속도·명료도(Parakeet 받아쓰기 WER)·자연스러움 예측(UTMOS) 측정, piper-tts 1.8.0 CLI 설치·오프라인 실행 |

- 선정 근거: 백로그 15 (점수 36, 상시 수요, 직접 측정 가능). 자동완성: "free text to speech offline" 21개(Google·Bing·YouTube), "piper tts"·"kokoro tts" 각 21~22개로 세 곳 모두에서 하위 검색어 다수
- Google Trends 미국 급상승(10개): 전부 스포츠 → IT 주제 없음. 공식 피드 후보(Drive·Docs Markdown 지원, GPT-6 for everyone, SynthID 확대)는 backlog에 추가
- 내부 링크: `transcribe-audio-offline-free` ↔ 새 글 (같은 엔진, 반대 방향)

**측정값 (4코어 Xeon 2.8GHz, GPU 없음, 4스레드 3회 중앙값)**

| 음성                 | 1분 음성 생성 시간 | 1스레드 | 받아쓰기 오류(242단어) | UTMOS 평균(최저) |
| -------------------- | ------------------ | ------- | ---------------------- | ---------------- |
| Kokoro v1.0 af_heart | 28초               | 71초    | 4                      | 4.42 (4.33)      |
| Kokoro v0.19         | 32초               | 86초    | 2                      | 4.45 (4.37)      |
| Piper lessac medium  | 3.8초              | 8.3초   | 3                      | 4.33 (3.85)      |
| Piper amy medium     | 3.5초              | 8.5초   | 2                      | 4.36 (4.02)      |
| KittenTTS nano int8  | 25초               | 38초    | 0                      | 4.24 (3.55)      |
| Matcha               | 4.5초              | 7.0초   | 6                      | 3.90 (3.40)      |

(전체 11개는 `tests/free-offline-text-to-speech/summary.json`)

- 명료도는 모든 음성이 거의 만점(오류 0~6/242) → 차이는 속도·자연스러움·숫자 읽기
- "10/21" 같은 슬래시 날짜를 11개 중 9개가 "slash"로 읽음. KittenTTS는 "1,250" 같은 큰 숫자를 망가뜨림 (Parakeet·Whisper small 둘 다 같은 결과)

**알게 된 것**

- 첫 측정은 모델 다운로드와 겹쳐 Piper 속도가 2배 가까이 느리게 나옴 (lessac-low RTF 0.107 → 재측정 0.050). 속도는 반드시 다운로드·다른 작업이 끝난 뒤 재측정
- 네트워크: `github.com` HTML 페이지·소스 zip(archive)은 차단("GitHub access to this repository is not enabled"), Releases 다운로드·`raw.githubusercontent.com`·`k2-fsa.github.io`·`download.pytorch.org`·`en.wikipedia.org`는 가능. torch.hub는 `api.github.com` 403으로 실패 → raw 파일로 우회
- Hugging Face에서 받은 Piper 음성 파일이 한 번 잘려 받아짐(61.9MB/63.2MB) → `INVALID_PROTOBUF` 오류. 재다운로드로 해결, 글의 문제 해결 팁으로 사용
- UTMOS는 짧은 문장에서 4.2~4.45에 몰려 변별력이 작음 → 평균보다 최저값(일관성)이 더 쓸모 있는 지표

**다음 할 일**

- Claude: 다음 세션 GSC에서 첫 노출 확인 (색인 완료 → 노출 시작 여부), 노출 검색어로 글 제목·FAQ 보강 판단
- (완료) IndexNow 키 파일·제출 스크립트 추가 (`tools/indexnow.py`), 배포 후 기존 글 5편 + 홈 제출
- (해결) `ad-blog`만 바꾼 PR이 머지되지 않음 (PR #156): `jinho-blog-web` 배포가 Ignored로 건너뛰어져 필수 체크 `Vercel – jinho-blog-web`이 보고되지 않음 → 사용자가 Vercel 필수 체크 제거, CI에 `build` 잡 추가 (바뀐 패키지·의존 앱만 빌드, 항상 결과 보고)
- 사용자: 저장소 필수 체크에 `build` 추가
- Claude: 10월 Patch Tuesday(10-13) 이후 Windows 10 업데이트는 **새 글 후보로 판단** (사용자 제안): KB 번호·설치 오류 검색어가 자동완성에 나오면 Fix형 새 글로 쓰고, `windows-10-esu-extended`는 빌드 표만 갱신 + 새 글로 링크

## 2026-10-11 · 세션 2 (정기 실행 1회차): Windows 10 ESU 글

**지표 (Search Console API, `gsc_report.py`)**

- 2026-09-13 ~ 10-11: 클릭 0 · 노출 0 (도메인 연결 당일)
- sitemap: 2026-10-11 06:33 UTC 다운로드 성공, 오류·경고 0 ("가져올 수 없음"에서 정상화)
- 글 3편 URL 검사: 모두 `Discovered - currently not indexed` (크롤링 전)

**발행한 글**

| slug                      | 카테고리   | 유형               | 직접 검증                                                                                           |
| ------------------------- | ---------- | ------------------ | --------------------------------------------------------------------------------------------------- |
| `windows-10-esu-extended` | `software` | Explainer + How-to | 없음 (Windows 환경 없음). Microsoft ESU 페이지(미국·아일랜드판)·KB 문서 6개를 curl로 받아 원문 대조 |

- 선정 근거: 원래 소비자 ESU 종료일(2026-10-13)이 이틀 뒤. Microsoft가 2027-10-12로 연장했지만 검색 결과·Q&A에 옛 날짜가 아직 많음 (경쟁 공백), 광고 가치 높음
- Google Trends 미국 급상승(10개): 스포츠·연예·복권·"fall back 2026"(서머타임) → IT 도구 관련 없음, 백로그 상위 후보로 진행
- 내부 링크: 관련 기존 글 없음 (Windows 주제 첫 글) → 다음 Windows 글(14 Windows 11 26H2 AI 끄기 등)과 서로 연결

**알게 된 것**

- 네트워크 허용 범위가 넓어짐: `microsoft.com`·`support.microsoft.com`·`learn.microsoft.com`·`support.google.com`·`apple.com`·`huggingface.co`·`tool-proof.com` 접속 가능. `help.openai.com`은 여전히 403, `api.github.com` 403 (Releases 다운로드는 가능)
- Microsoft 지역별 ESU 페이지 내용이 다름: 60일 로그인 규칙은 EEA(en-ie) 페이지에만 있음
- 같은 KB(KB5122878)의 빌드 번호가 페이지마다 7720/7725로 다르게 표기 → KB 페이지 제목 기준 채택
- `pnpm install` 후 `packages/nextjs-routes/dist/cli.js`가 바뀜 → 커밋 전 되돌림
- 배포 사이트 `https://tool-proof.com` 200 응답 확인
- 주제 발굴 소스 확장: Trends 급상승 RSS에는 IT 주제가 거의 없음 → 공식 피드·CISA·자동완성(Google·Bing·YouTube) 조회 스크립트 [tools/demand_check.py](tools/demand_check.py) 추가, README "주제 발굴 소스"에 정리. Wikipedia 조회수는 검색 의도가 달라 제외 (사용자 결정)
- ESU 글 보강: YouTube 자동완성의 "esu not showing"·"esu local account" 반영 (소제목 문구, 로컬 계정 절)

**다음 할 일**

- Claude: 다음 세션 GSC 재조회 (색인 시작 여부). 색인 후 IndexNow 구성
- Claude: 10월 Patch Tuesday(10-13) 이후 글의 "최신 빌드" 표 갱신 (`updatedAt`)
- Claude: Hugging Face 접속이 가능해져 백로그 15(TTS)·10(배경 제거) 측정 범위 확대 가능
- 사용자: Bing Webmaster Tools 등록 (이전 세션에서 이월)

## 2026-10-11 · 세션 1 (계속): 도메인·호스팅 연결

- 도메인 `tool-proof.com` 구매·Vercel `ad-blog` 프로젝트(Pro 플랜)에 연결, `NEXT_PUBLIC_SITE_URL` Production 설정 (사용자)
- `NEXT_PUBLIC_SITE_URL=https://tool-proof.com`으로 로컬 빌드해 확인: robots `Allow: /` + sitemap 주소, 전 페이지 `index, follow`, canonical·og:url·JSON-LD·RSS가 모두 `https://tool-proof.com` 기준
- 실제 배포 사이트는 컨테이너 네트워크 제한으로 직접 확인 못 함
- `ad-blog` Vercel 프로젝트 추가 후 상태 체크 이름이 `Vercel` → `Vercel – {프로젝트}`로 바뀌어 main 머지가 막힘 → 사용자가 필수 체크를 `Vercel – jinho-blog-web`으로 변경
- Search Console: 도메인 속성 확인(DNS TXT), sitemap 제출(첫 상태 "가져올 수 없음" — 새 속성에서 흔한 일시 상태, robots·sitemap 형식은 정상 확인), 글 3편 색인 요청 (사용자)
- 정기 실행 Routine "ToolProof 정기 글 작성" 생성 (월·수·금 08:45 KST, 커넥터 없이 생성됨 → 첫 실행에서 GitHub 도구 접근 확인 필요)

**다음 할 일**

- 사용자: Bing Webmaster Tools(Search Console에서 가져오기), 허용 도메인에 `tool-proof.com` 추가
- (완료) Search Console API: 서비스 계정 키를 `GSC_SERVICE_ACCOUNT_JSON_B64`로 등록, `searchconsole.googleapis.com`·`oauth2.googleapis.com` 접속 확인. 조회 스크립트 `tools/gsc_report.py` 추가 (이 세션에는 환경변수가 없어 실제 조회는 다음 세션부터)
- Claude: 다음 세션에서 sitemap 상태가 "성공"으로 바뀌었는지, 글 3편 색인 여부 확인 (API 접근 전에는 사용자에게 확인 요청)
- Claude: 색인 시작 후 IndexNow 키 파일·제출 스크립트 추가, 첫 2주간 색인·노출 기록

## 2026-10-11 · 세션 1: 실험 시작

**한 일**

- 시장·분야 결정: 영어권(미국) · 일반 사용자 대상 IT·AI 도구 ([README.md](README.md) 결정사항)
- 사이트를 ToolProof로 설정, UI·날짜·읽기 시간·구조화 데이터를 영어 기준으로 전환 (작성자 JSON-LD는 Organization)
- 카테고리 `ai-tools`, `software` 생성, 소개·문의·개인정보처리방침 영어로 작성, 한국어 샘플 글 삭제
- 운영 문서([README.md](README.md), [writing-guide.md](writing-guide.md), [backlog.md](backlog.md)) 작성

**환경 확인**

- WebSearch(미국 결과)·WebFetch 사용 가능, `trends.google.com`은 네트워크 정책으로 차단
- Search Console·AdSense 데이터 접근 없음, 도메인·호스팅 미연결 (배포해도 noindex 상태)

**발행한 글**

| slug                             | 카테고리   | 유형               | 직접 검증                                                                       |
| -------------------------------- | ---------- | ------------------ | ------------------------------------------------------------------------------- |
| `transcribe-audio-offline-free`  | `ai-tools` | 비교 (측정형)      | 8개 음성 인식 모델을 22분 실제 통화(Earnings-21)로 WER·속도 측정                |
| `check-if-image-is-ai-generated` | `ai-tools` | How-to + 측정      | C2PA 서명 이미지에 일상 편집 12종 적용 → 11종 중 8종이 출처 정보를 삭제         |
| `turn-off-ai-in-chrome`          | `software` | How-to (설정·정책) | Chromium 155 소스(정책 YAML·설정 문자열)로 메뉴명·정책값 대조, 정책 로딩 테스트 |

- 첫 글 선정: 도메인이 아직 없어 색인이 늦어지므로 마감형 주제(커스텀 GPT 종료 등)보다 상시 수요·측정형 주제를 우선
- 작업 방식: 받아쓰기 글은 직접 측정·작성, 나머지 2편은 서브에이전트가 조사·초안 작성 → 원자료·1차 출처 대조 후 수정
- 측정 스크립트·결과·사실 확인표는 [tests/](tests/README.md)에 글 slug별로 보관 (글 갱신 시 재현용)

**알게 된 것**

- CPU 벤치마크는 다른 작업과 겹치면 속도가 최대 ~10% 느리게 나옴 → 속도 측정은 다른 작업이 없을 때 따로 실행
- help.openai.com·support.google.com 등은 WebFetch로 열리지 않음 → 공식 GitHub 저장소(SDK 타입 정의, Chromium 소스, 프로젝트 README)가 가장 확실한 1차 출처
- 필수 체크 "Vercel"(web 앱 미리보기 배포)이 끝나야 PR 머지 가능 → 푸시 후 3~5분 대기 필요
- 글 제목 뒤에 ` | ToolProof`가 붙어 검색 결과 제목이 60자를 넘는 경우가 있음 → 도메인 연결 후 CTR 데이터를 보고 접미사 제거 여부 판단 (가설 후보)

**다음 할 일**

- 사용자: 도메인 구매·Cloudflare Pages 연결·`NEXT_PUBLIC_SITE_URL` 설정, Search Console 연결
- Claude: backlog 상위 주제로 글 작성 지속 (다음 후보: 9 Windows 10 ESU, 1·7·8 GPT·Gems → Skills 묶음), 도메인 연결 후 sitemap 제출·IndexNow 구성
