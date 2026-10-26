# 클러스터 맵

모든 글은 주제 클러스터 1개에 속합니다. 같은 클러스터 글끼리 허브 ↔ 상시 글로 묶어 주제 권위(topical authority)를 쌓고, 새로 발행한 글이 이미 색인된 글에서 링크를 받아 빨리 발견되게 합니다 (2026-10-22 전략 개편, 근거는 [README.md](README.md#전략)). 글을 발행·삭제하거나 허브를 만들면 이 표를 같은 PR에서 고칩니다. 점검은 [tools/link_audit.py](tools/link_audit.py).

- **허브**: 클러스터의 상위 검색어를 노리는 모음 글 (`Best Free {분야} Tools` 등). 같은 클러스터의 상시 글을 모두 링크
- **상시 글**: 검색형 How-to·비교·측정 글 (`ai-tools`·`software`)
- **뉴스 칼럼**: `news` 카테고리. 제품·서비스 영역이 같은 클러스터에 넣고, 같은 클러스터의 상시 글이나 허브로 1개 이상 링크
- 표의 slug는 백틱으로 감싸고 공백으로 구분. 없으면 `-` (`link_audit.py`가 이 표를 읽음)

## 클러스터 맵

| ID | 클러스터 | 우선순위 | 허브 | 상시 글 | 뉴스 칼럼 |
| --- | --- | --- | --- | --- | --- |
| `ai-settings` | AI 기능 설정·개인정보 (끄기·옵트아웃·AI 이미지 판별) | 1 | `turn-off-ai-features` | `turn-off-ai-in-chrome` `check-if-image-is-ai-generated` `gemini-gems-to-skills` `turn-off-gemini-in-gmail` `turn-off-copilot-in-word` `turn-off-apple-intelligence-iphone` `turn-off-ai-in-windows-11` `turn-off-meta-ai-instagram` `remove-phone-number-from-google-account` `turn-off-gemini-apps-activity` | `gemini-free-flash-lite` `gemini-android-auto-personal-intelligence` `chrome-http-warning-default` `gemini-connected-apps` `google-gmail-photos-ads` `google-phone-number-verification` `arc-browser-shutting-down` |
| `photo-video` | 무료 사진·영상 도구 (변환·압축·배경·메타데이터) | 2 | `free-image-converter-photo-tools` | `convert-heic-to-jpg-free` `convert-webp-to-jpg-free` `compress-image-to-100kb` `remove-bg-alternative-free` `remove-metadata-from-photos` `compress-video-for-discord-email` | - |
| `pdf` | 무료 PDF 도구 | 3 | `best-free-pdf-tools` | `split-pdf-free` `merge-pdf-files-free` `jpg-to-pdf-free` `pdf-to-jpg-free` `pdf-to-word-free` `compress-pdf-free` | - |
| `offline-ai` | 무료 오프라인 AI 도구 | 4 | `free-offline-ai-tools` | `transcribe-audio-offline-free` `image-to-text-offline-free` | - |
| `windows-microsoft` | Windows·Microsoft 365 변경 대응 | 5 | - | `windows-10-esu-extended` | `windows-11-24h2-end-of-support` `office-2021-end-of-support` `microsoft-365-family-storage-2tb` `apple-mail-exchange-not-syncing` |
| `phones-subscriptions` | 휴대폰·구독 서비스 변경 대응 | 6 | - | - | `iphone-duo-sold-out` `iphone-handoff-verizon-cost` `pixel-watch-safety-signal-ending` `apple-siri-settlement-claim` `spotify-family-qr-code-verification` |

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

- **새 글**: 발행 전 클러스터를 정함. 일반 세션(00시)은 우선순위 1·2 클러스터의 [backlog.md](backlog.md#클러스터-공백-후보) 공백 후보를 먼저 씀. 어느 클러스터에도 속하지 않는 주제는 같은 클러스터로 이어질 상시 글 3편을 backlog에 함께 적을 수 있을 때만 새 클러스터로 시작
- **허브**: 상시 글이 3편 모이면 개선 세션에서 허브를 씀 ([traffic-playbook.md](traffic-playbook.md) 3번). 허브를 만들면 이 표의 `허브` 칸을 채우고, 허브 글 frontmatter에 `hub: true`(홈 상단 고정, 2026-10-24)를 넣고, 상시 글마다 허브로 링크 1개 추가
- **내부 링크** (internal-linking 허브·스포크 모델)
  - 허브 → 클러스터의 모든 상시 글
  - 상시 글 → 허브(있으면) + 같은 클러스터의 다른 글 1개 이상
  - 뉴스 칼럼 → 같은 클러스터의 상시 글이나 허브 1개 이상 (상시 글 → 칼럼은 내용이 이어질 때만)
  - 모든 글은 다른 글에서 링크 2개 이상을 받음. 새 글은 이미 색인된 같은 클러스터 글에서 1개 이상 받음 (색인 상태는 `gsc_report.py` URL 검사)
- **점검**: 매 세션 지표 확인 뒤 `python3 -I apps/ad-blog/experiment/tools/link_audit.py`. 새 글을 쓴 세션은 그 글의 문제를 발행 전에 고치고, 기존 글 문제는 개선 세션에서 고침
- **삭제·통합**: 글을 지우면 같은 주제의 글로 301 리디렉트를 [vercel.json](../vercel.json)에 추가하고 이 표에서 뺌. 대체 글이 없으면 같은 클러스터 허브로, 허브도 없으면 404로 둠 (주제가 다른 글로 보내면 Google이 soft 404로 봄)
