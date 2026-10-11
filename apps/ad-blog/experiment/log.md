# 운영 로그

최신 세션이 위에 오도록 기록합니다. 형식: 날짜 · 한 일 · 측정값(있으면) · 다음 할 일.

## 2026-10-11 · 세션 2 (정기 실행 1회차): Windows 10 ESU 글

**지표 (Search Console API, `gsc_report.py`)**

- 2026-09-13 ~ 10-11: 클릭 0 · 노출 0 (도메인 연결 당일)
- sitemap: 2026-10-11 06:33 UTC 다운로드 성공, 오류·경고 0 ("가져올 수 없음"에서 정상화)
- 글 3편 URL 검사: 모두 `Discovered - currently not indexed` (크롤링 전)

**발행한 글**

| slug | 카테고리 | 유형 | 직접 검증 |
| --- | --- | --- | --- |
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

| slug                             | 카테고리   | 유형                    | 직접 검증                                                                 |
| -------------------------------- | ---------- | ----------------------- | ------------------------------------------------------------------------- |
| `transcribe-audio-offline-free`  | `ai-tools` | 비교 (측정형)           | 8개 음성 인식 모델을 22분 실제 통화(Earnings-21)로 WER·속도 측정          |
| `check-if-image-is-ai-generated` | `ai-tools` | How-to + 측정           | C2PA 서명 이미지에 일상 편집 12종 적용 → 11종 중 8종이 출처 정보를 삭제     |
| `turn-off-ai-in-chrome`          | `software` | How-to (설정·정책)      | Chromium 155 소스(정책 YAML·설정 문자열)로 메뉴명·정책값 대조, 정책 로딩 테스트 |

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
