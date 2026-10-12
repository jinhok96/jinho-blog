# 운영 로그

최신 세션이 위에 오도록 기록합니다. 형식: 날짜 · 한 일 · 측정값(있으면) · 다음 할 일.

## 2026-10-12 · 세션 3 (정기 실행 2회차): 무료 오프라인 TTS 비교

**지표 (Search Console API, `gsc_report.py`)**

- 2026-09-13 ~ 10-11: 클릭 0 · 노출 0
- sitemap: 오류·경고 0 (마지막 다운로드 2026-10-11 06:33 UTC)
- 글 4편 URL 검사: **모두 `Submitted and indexed`** (PASS, 마지막 크롤링 10-11 15:47~21:45 UTC). 세션 2의 `Discovered - currently not indexed`에서 하루 만에 색인

**발행한 글**

| slug | 카테고리 | 유형 | 직접 검증 |
| --- | --- | --- | --- |
| `free-offline-text-to-speech` | `ai-tools` | 비교 (측정형) | sherpa-onnx 1.13.8로 TTS 11개 음성(Piper 5·Kokoro 2·KittenTTS 2·Supertonic·Matcha) 속도·명료도(Parakeet 받아쓰기 WER)·자연스러움 예측(UTMOS) 측정, piper-tts 1.8.0 CLI 설치·오프라인 실행 |

- 선정 근거: 백로그 15 (점수 36, 상시 수요, 직접 측정 가능). 자동완성: "free text to speech offline" 21개(Google·Bing·YouTube), "piper tts"·"kokoro tts" 각 21~22개로 세 곳 모두에서 하위 검색어 다수
- Google Trends 미국 급상승(10개): 전부 스포츠 → IT 주제 없음. 공식 피드 후보(Drive·Docs Markdown 지원, GPT-6 for everyone, SynthID 확대)는 backlog에 추가
- 내부 링크: `transcribe-audio-offline-free` ↔ 새 글 (같은 엔진, 반대 방향)

**측정값 (4코어 Xeon 2.8GHz, GPU 없음, 4스레드 3회 중앙값)**

| 음성 | 1분 음성 생성 시간 | 1스레드 | 받아쓰기 오류(242단어) | UTMOS 평균(최저) |
| --- | --- | --- | --- | --- |
| Kokoro v1.0 af_heart | 28초 | 71초 | 4 | 4.42 (4.33) |
| Kokoro v0.19 | 32초 | 86초 | 2 | 4.45 (4.37) |
| Piper lessac medium | 3.8초 | 8.3초 | 3 | 4.33 (3.85) |
| Piper amy medium | 3.5초 | 8.5초 | 2 | 4.36 (4.02) |
| KittenTTS nano int8 | 25초 | 38초 | 0 | 4.24 (3.55) |
| Matcha | 4.5초 | 7.0초 | 6 | 3.90 (3.40) |

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
