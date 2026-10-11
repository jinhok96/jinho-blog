# 운영 로그

최신 세션이 위에 오도록 기록합니다. 형식: 날짜 · 한 일 · 측정값(있으면) · 다음 할 일.

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
