# 클러스터 맵

모든 글은 주제 클러스터 1개에 속합니다. 같은 클러스터 글끼리 허브 ↔ 상시 글로 묶어 주제 권위(topical authority)를 쌓고, 새로 발행한 글이 이미 색인된 글에서 링크를 받아 빨리 발견되게 합니다 (2026-10-22 전략 개편, 근거는 [README.md](README.md#전략)). 글을 발행·삭제하거나 허브를 만들면 이 표를 같은 PR에서 고칩니다. 점검은 [tools/link_audit.py](tools/link_audit.py).

- **허브**: 클러스터의 상위 검색어를 노리는 모음 글 (`Best Free {분야} Tools` 등). 같은 클러스터의 상시 글을 모두 링크
- **상시 글**: 검색형 How-to·비교·측정 글 (`ai-tools`·`software`)
- **뉴스 칼럼**: `news` 카테고리. 제품·서비스 영역이 같은 클러스터에 넣고, 같은 클러스터의 상시 글이나 허브로 1개 이상 링크
- 표의 slug는 백틱으로 감싸고 공백으로 구분. 없으면 `-` (`link_audit.py`가 이 표를 읽음)

## 클러스터 맵

| ID | 클러스터 | 우선순위 | 허브 | 상시 글 | 뉴스 칼럼 |
| --- | --- | --- | --- | --- | --- |
| `ai-settings` | AI 기능 설정·개인정보 (끄기·옵트아웃·AI 이미지 판별) | 1 | `turn-off-ai-features` | `turn-off-ai-in-chrome` `check-if-image-is-ai-generated` `gemini-gems-to-skills` `turn-off-gemini-in-gmail` `turn-off-copilot-in-word` `turn-off-apple-intelligence-iphone` `turn-off-ai-in-windows-11` `turn-off-meta-ai-instagram` `remove-phone-number-from-google-account` `turn-off-gemini-apps-activity` `siri-history-on-iphone` `turn-off-ai-in-firefox` `chrome-autofill-settings` `turn-off-copilot-in-edge` `duckduckgo-no-ai` `turn-off-ai-in-brave` `turn-off-gemini-on-android-phone` | `gemini-free-flash-lite` `gemini-android-auto-personal-intelligence` `chrome-http-warning-default` `gemini-connected-apps` `google-gmail-photos-ads` `arc-browser-shutting-down` `ios-27-2-siri-ai-memory` |
| `photo-video` | 무료 사진·영상 도구 (변환·압축·배경·메타데이터) | 2 | `free-image-converter-photo-tools` | `convert-heic-to-jpg-free` `convert-webp-to-jpg-free` `compress-image-to-100kb` `remove-bg-alternative-free` `remove-metadata-from-photos` `compress-video-for-discord-email` `trim-video-without-losing-quality` `convert-iphone-video-to-mp4` | - |
| `pdf` | 무료 PDF 도구 | 3 | `best-free-pdf-tools` | `split-pdf-free` `merge-pdf-files-free` `jpg-to-pdf-free` `pdf-to-jpg-free` `pdf-to-word-free` `compress-pdf-free` `make-pdf-searchable-free` | - |
| `offline-ai` | 무료 오프라인 AI 도구 | 4 | `free-offline-ai-tools` | `transcribe-audio-offline-free` `image-to-text-offline-free` | - |
| `windows-microsoft` | Windows·Microsoft 365 변경 대응 | 5 | - | `windows-10-esu-extended` `windows-11-24h2-end-of-support` `office-2021-end-of-support` | `microsoft-365-family-storage-2tb` `apple-mail-exchange-not-syncing` `customize-right-click-menu-windows-11` |
| `phones-subscriptions` | 휴대폰·구독 서비스 변경 대응 | 6 | - | - | `iphone-duo-sold-out` `iphone-handoff-verizon-cost` `pixel-watch-safety-signal-ending` `apple-siri-settlement-claim` `spotify-family-qr-code-verification` `iphone-duo-cracked-screen` |

## 우선순위 (2026-10-22)

content-strategy 우선순위 매트릭스(경쟁 × 사업 가치)에 우리 Search Console 데이터(2026-09-24 ~ 10-22)를 넣어 정했습니다. 새 데이터가 쌓이면 개선 세션에서 다시 정합니다.

| 순위 | 클러스터 | 분류 | 근거 | 할 일 |
| --- | --- | --- | --- | --- |
| 1 | `ai-settings` | 빠른 성과 | 사이트 노출 1위 `turn-off-ai-in-chrome`(103회, 평균 13위)과 `gemini-gems-to-skills`(7.6위)가 여기 있음. 검색어 `turn off ai`(57위)·`google ai gone`(3위)·`chrome disable ai`(7위)처럼 "제품 + AI 기능 + 끄기" 롱테일에서 순위가 남. 자동완성 3곳(Google·Bing·YouTube)에서 `turn off gemini in gmail/chrome/docs`, `turn off copilot in word/outlook/excel/windows 11`, `turn off meta ai instagram/whatsapp/facebook`, `turn off apple intelligence iphone`이 나옴 | 허브 `turn-off-ai-features` 발행(2026-10-23, 주 검색어 `turn off ai`). 공백 상시 글(Meta AI·Apple Intelligence·Windows 11 등)을 채우고 허브 갱신. `turn-off-ai-in-chrome` → 허브 링크는 V3 판정(11-18) 뒤 |
| 2 | `photo-video` | 빠른 성과 | 상시 글 6편인데 허브 없음 (허브 기준 3편 초과). 이미지 검색 노출(`compress-image-to-100kb` 9회)이 이 클러스터에서 나옴. 기존 측정 재사용 가능 | 허브 `free-image-converter-photo-tools` 발행(2026-10-26, 주 검색어 `free image converter`). 새 측정 글이 생기면 허브 갱신 |
| 3 | `pdf` | 큰 승부 | 상위 검색어(`pdf to word` Trends 23.2 등)는 iLovePDF·Smallpdf 같은 도구 사이트가 차지. 7편 중 4편이 아직 `URL is unknown`, 색인된 `merge-pdf-files-free`는 99위 | 새 글보다 색인·세부 각도 보강 우선. 색인 후 4주 데이터로 재평가 |
| 4 | `offline-ai` | 채우기 | `image-to-text-offline-free`가 `offline ocr tools` 5위·`free offline ocr` 8위. 받아쓰기는 47위 | 8~20위 검색어 보강, GUI로 측정 가능한 새 도구가 생길 때만 글 추가 |
| 5 | `windows-microsoft` | 뉴스 의존 | 뉴스 칼럼 4편, 상시 글 1편. 칼럼 노출은 아직 거의 없음 (Discover 0) | 칼럼에서 생긴 상시 수요(버전 확인·업그레이드 방법 등)를 상시 글 후보로 backlog에 올림 |
| 6 | `phones-subscriptions` | 피함 (뉴스만) | 상시 글이 없어 클러스터로 묶이지 않음. 칼럼 5편의 웹 노출 합계 45회 | 새 칼럼은 상시 글로 이어질 때만. 상시 글이 3편 모이기 전에는 허브 만들지 않음 |

## 규칙

- **새 글**: 발행 전 클러스터를 정함. 일반 세션(월·수·금, 2026-11-01. 2026-11-11부터 02시 실행)은 우선순위 1·2 클러스터의 [backlog.md](backlog.md#클러스터-공백-후보) 공백 후보를 먼저 씀. 어느 클러스터에도 속하지 않는 주제는 같은 클러스터로 이어질 상시 글 3편을 backlog에 함께 적을 수 있을 때만 새 클러스터로 시작
- **허브**: 상시 글이 3편 모이면 개선 세션에서 허브를 씀 ([traffic-playbook.md](traffic-playbook.md) 3번). 허브를 만들면 이 표의 `허브` 칸을 채우고, 허브 글 frontmatter에 `hub: true`(홈 상단 고정, 2026-10-24)를 넣고, 상시 글마다 허브로 링크 1개 추가
- **내부 링크** (internal-linking 허브·스포크 모델)
  - 허브 → 클러스터의 모든 상시 글
  - 상시 글 → 허브(있으면) + 같은 클러스터의 다른 글 1개 이상
  - 뉴스 칼럼 → 같은 클러스터의 상시 글이나 허브 1개 이상 (상시 글 → 칼럼은 내용이 이어질 때만)
  - 모든 글은 다른 글에서 링크 2개 이상을 받음. 새 글은 이미 색인된 같은 클러스터 글에서 1개 이상 받음 (색인 상태는 `gsc_report.py` URL 검사)
- **점검**: 매 세션 지표 확인 뒤 `python3 -I apps/ad-blog/experiment/tools/link_audit.py`. 새 글을 쓴 세션은 그 글의 문제를 발행 전에 고치고, 기존 글 문제는 개선 세션에서 고침
- **삭제·통합**: 글을 지우면 같은 주제의 글로 301 리디렉트를 [vercel.json](../vercel.json)에 추가하고 이 표에서 뺌. 대체 글이 없으면 같은 클러스터 허브로, 허브도 없으면 404로 둠 (주제가 다른 글로 보내면 Google이 soft 404로 봄)

## 콘텐츠 정리 (2026-11-01)

AdSense "가치가 별로 없는 콘텐츠" 거절 대응([README](README.md#adsense-거절-분석-2026-11-01), 사용자 결정). 겹치는 글과 날짜가 지난 칼럼이 사이트를 대량 생산처럼 보이게 하므로, 개선 세션이 아래 목록을 위에서부터 **세션당 최대 2건** 처리합니다 (통합은 1건만, 통합이 없으면 전환 2편까지. 2026-11-08 정기 실행 하루 1회로 1건 → 최대 2건). 끝낸 항목은 `~~취소선~~` + 처리 날짜·세션 번호, 이 표·[vercel.json](../vercel.json)·`link_audit.py` 결과를 함께 갱신합니다.

**규칙**

- **통합**: 같은 질문에 답하는 글 2편 → 남길 글 1편에 다른 글의 고유한 내용(측정값·단계·1차 출처)만 옮기고 다시 확인한 뒤 `updatedAt` 갱신. 남길 글은 Search Console 28일 노출·색인 상태가 나은 쪽, 비슷하면 상시 글(`ai-tools`·`software`). 지운 글은 `vercel.json` 308 리디렉트(`scripts/lib/vercel-redirects.test.ts` 통과)와 이 맵·다른 글의 링크를 남긴 글로 바꿈
- **전환**: 날짜가 지난 칼럼 → 같은 주소에서 '지금 할 일' 중심 상시 글로 고침. 1차 출처를 다시 열어 현재 상태로 첫 단락·`What to do now`를 쓰고, 지난 일정은 배경으로 줄임. 카테고리를 `news`에서 상시 카테고리로 바꾸면 이 맵의 칸도 옮김. 제목·설명도 현재 기준으로(제목 틀 반복 금지). 사실 확인표의 '뉴스 유형' 줄은 지우지 않음 (가설 H5는 발행 때 유형으로 셈, 대시보드 `newsType`. 2026-11-05). '검증 유형' 줄도 남기고, 전환·통합하며 직접 실행 결과를 더하면 값과 `YYYY-MM-DD부터`를 고침 (가설 H3, 대시보드 `verifyType`. 2026-11-06)
- 판정 중인 검증 기록(traffic-playbook V1~V7) 대상 글은 판정 날짜 뒤에 처리. 노출이 있는 글을 지울 때는 지우기 전 28일 검색어를 log.md에 남김
- 새 칼럼은 같은 클러스터의 상시 글로 이어질 때만 쓰고, 이 목록에 있는 글과 겹치면 새로 쓰지 않고 기존 글을 고침

**목록** (위에서부터. 각 세션이 처리 전 Search Console 값으로 남길 글을 다시 판단)

1. ~~통합: `chrome-enhanced-autofill-gmail`(news) → `chrome-autofill-settings` (같은 Chrome 156 자동 완성 스위치)~~ — 2026-11-04 세션 78 완료 (두 글 28일 노출 0·둘 다 `Discovered` → 상시 글을 남김. Gmail 기능 절(조건·검토 안내 문구·출처 보기·제안 숨기기·Connected Apps)·표 행·FAQ 1개·조건 그래픽을 옮기고 1차 출처 5쪽 재확인, Chrome 157(Chrome for Testing 157.0.8103.38) 설정 화면·문구 확인, 308 리디렉트, 링크 3곳 교체)
2. ~~통합: `google-phone-number-verification`(news) → `remove-phone-number-from-google-account` (같은 Google 계정 전화번호)~~ — 2026-11-02 세션 72 완료 (두 글 28일 노출 0·둘 다 `Discovered` → 상시 글을 남김. 모든 계정에 붙는 이유·영향 표·도움말 3쪽 비교·새 휴대폰 계정 식별·Better sharing을 옮기고 1차 출처 4쪽 재확인, 308 리디렉트, 링크 2곳 교체. 1번은 Chrome 157(11-03) 뒤로 미룸)
3. 통합 + 전환: `google-gmail-photos-ads` + `gemini-android-auto-personal-intelligence`(둘 다 news, Personal Intelligence의 Gmail·Photos 사용) → 상시 글 1편 (backlog `google personal intelligence settings` 후보와 합침). 2026-11-08 세션 90: Gemini 도움말이 바뀜 — 웹 메뉴 'Settings & help' → 'Settings', 웹 Connected Apps 끊기 스위치 → 'More options > Disconnect'(앱은 스위치 그대로), Contacts의 'US only·English only·AI Ultra' 조건 삭제, Maps '(excluding Timeline)' 추가 (사본 `tests/turn-off-gemini-apps-activity/source-gemini-16598406-*-2026-11-08.txt`) → 통합 글은 새 단계로 (`gemini-android-auto-personal-intelligence` 46·64·67행이 옛 문구)
4. ~~전환: `office-2021-end-of-support` (10-13 지원 종료 지남). 2026-11-11 세션 94: RSS 피드 20편 밖(39번째)이라 `updatedAt`을 바꾸면 피드 구성이 바뀜 → V7 판정(11-13) 뒤 11-14(토) 세션으로~~ — 2026-11-14 세션 96 완료 (V7 판정 뒤. '지금 할 일' 상시 글로: 카테고리 `news` → `software`, 제목 `Office 2021 End of Support on Home PCs and Macs`, **11-10 Office 보안 릴리스 노트에 Office 2021 Retail·LTSC 2021 빌드가 있고 MSRC 11월 데이터에 Office LTSC 2021(Windows·Mac) 수정이 있음**을 1차 출처로 확인해 '아직 업데이트되나' 절 + 달별 그림(Office 2019 소매판은 종료 직후 빠짐), 버전 확인·마지막 업데이트 설치·Mac 'Office 2021 비활성화' 수정판(16.114.3·16.114.4)·대체 비용·상황별 추천. 1차 출처 18쪽 Chromium 재확인, AI 대표 이미지 + 그림 3장. 이 전환으로 `windows-microsoft` 상시 글 3편 → 허브 필요)
5. ~~전환: `windows-11-24h2-end-of-support` (10-13 Home·Pro 업데이트 종료 지남, 11-10 Patch Tuesday 뒤 첫 누락 업데이트 확인과 함께)~~ — 2026-11-11 세션 94 완료 (11-10 KB5132061 Applies To에 24H2 Home·Pro 없음을 확인하고 '지금 할 일' 상시 글로: 카테고리 `news` → `software`, 제목 `Windows 11 24H2 End of Support and the Free Update to 26H2`, 결론·버전별 표·확인·26H2 단계·안 보일 때·24H2에 남으면(USB 오디오 수정·인증서 2027-06-19)·26H2 vs 25H2·기억할 날짜. 1차 출처 10쪽 Chromium 재확인, 그림 2장 11-11 기준으로 다시 + 새 그림 1장. 피드 안 글이라 V7 구성 영향 없음)
6. 검토: `iphone-duo-sold-out` + `iphone-duo-cracked-screen` (같은 기기 칼럼 2편, 상시 글 없는 `phones-subscriptions`) → 구매·수리 비용 상시 글 1편으로 합칠지
7. 전환(일정 뒤): `pixel-watch-safety-signal-ending`(12-12 뒤, V7 판정 뒤) · `apple-siri-settlement-claim`(12-21 마감 뒤) · `arc-browser-shutting-down`(12-22 종료 뒤) · `remove-bg-alternative-free`(상시 글, 12-01 remove.bg 웹사이트 종료 뒤 — 제목 'Tested Before It Shuts Down'·설명·첫 문단·'What happens to remove.bg on December 1' 절을 종료 뒤 기준으로. 2026-11-08 세션 89 추가)
8. ~~제목 정리 (2026-11-02 세션 72 추가, 한 세션에 묶어 1건): 괄호 꼬리표 `(N … Tested)` 제목이 14편 중 13편 남음(`compress-pdf-free`는 세션 72 대표 이미지 때 정리) — 11-01 정리한 `: What It Means for You`와 같은 반복 틀. `title`만 바꾸고 `updatedAt`·설명·본문 그대로(RSS 순서·V7 영향 없음). 노출이 있는 색인 글은 바꾸기 전 28일 검색어를 log.md에 남기고, 판정 중인 `transcribe-audio-offline-free`(V1 11-11)·`free-offline-ai-tools`(V2 11-12)는 판정 뒤. 대상: `best-free-pdf-tools` `compress-video-for-discord-email` `convert-heic-to-jpg-free` `compress-image-to-100kb` `jpg-to-pdf-free` `pdf-to-jpg-free` `pdf-to-word-free` `convert-webp-to-jpg-free` `merge-pdf-files-free` `remove-metadata-from-photos` `split-pdf-free` + 판정 뒤 2편. 새 제목끼리도 같은 틀이 반복되지 않게(writing-guide 제목 규칙)~~ — 2026-11-02 세션 73 11편 완료 + 대시 부제 `windows-10-esu-extended`(`— What to Check`)도 함께 (꼬리표만 떼면 `How to … for Free`가 반복돼 글마다 첫 문단 결론·범위로 끝을 다르게, 전후 표와 바꾸기 전 검색어는 log.md). **남은 2편**: `transcribe-audio-offline-free`(V1 11-11 뒤)·`free-offline-ai-tools`(V2 11-12 뒤, `(2026, Tested)`) — 판정 뒤 개선 세션이 다른 정리 항목과 별개로 처리

