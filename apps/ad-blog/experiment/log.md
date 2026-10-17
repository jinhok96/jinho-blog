# 운영 로그

최신 세션이 위에 오도록 기록합니다. 형식: 날짜 · 한 일 · 측정값(있으면) · 다음 할 일.

## 2026-10-18 · 세션 19 (정기 실행, 일반 세션): PDF 나누기 GUI 3가지 측정

세션 시각: 2026-10-18 00:15 KST → 일반 세션(`ai-tools`·`software`). 열린 PR 없음. 작업 브랜치를 `origin/main`(f4c758e)에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-19 ~ 10-17, 세션 18 이후 바뀐 값만)**

- 노출 106 → **109**, 클릭 4, CTR 3.8% → 3.7%, 평균 순위 24.6 → 24.9
  - `turn-off-ai-in-chrome` 노출 54 → 56 (12.1) / `check-if-image-is-ai-generated` 11 → 12 (73.7) / 나머지 글 변화 없음
  - 검색어: `synthid checker` 3 → 4 (89.0)
- **sitemap 마지막 다운로드 10-15 03:42 → 10-17 10:45 UTC** (이틀 만에 다시 읽음). URL 검사 변화 없음: 4편 `URL is unknown`(`compress-image-to-100kb`·`compress-video-for-discord-email`·`convert-heic-to-jpg-free`·`iphone-duo-sold-out`) + `pixel-watch-safety-signal-ending`(10-17 발행) 미색인, 나머지 7편 색인
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug             | 카테고리   | 유형                                   | 직접 검증 |
| ---------------- | ---------- | -------------------------------------- | --------- |
| `split-pdf-free` | `software` | 비교 + How-to (측정형, 검색형)          | 12쪽 PDF(직접 만든 보고서 4쪽: 책갈피 4·목차 링크 3·외부 링크 1 + IRS W-9 6쪽: 양식 23칸·1번 칸 입력 + CC0 사진 2쪽)를 **GUI 3가지로 직접 조작**해 나눔: PDFsam Basic 6.0.6(Extract·Split Every page·Split by size), PDF Arranger 1.14.0(Export Selection·Export All Pages), Chromium 141 인쇄 → Save as PDF(Custom 쪽 범위). 결과마다 쪽별 텍스트·사진 바이트·책갈피·링크·양식 칸을 점검하고 Chrome 뷰어에서 양식 입력 시험 |

- 선정 근거: Trends(미국 3개월, 이번 세션은 429 없이 응답) `merge pdf` 23.5 · **`split pdf` 22.6** · `png to jpg` 14.4 · `webp to jpg` 6.6. 자동완성 "split pdf" 25개 이상(free·into individual pages·online·pages, by size·into multiple pdfs). backlog 46번(합치기 글의 짝, GUI 앱·내장 기능으로 측정하기로 한 후보)
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음
- 차별점: 나누기는 "무손실"이라 차이가 없어 보이지만 결과 파일의 **동작**이 다름 → Chrome Save as PDF는 텍스트·사진은 그대로지만 **W-9 양식을 평면화**(입력 불가)하고 책갈피 0/4·목차 링크 0/3. PDF Arranger는 양식·링크를 지키지만 **W-9만 내보낸 파일에 보고서 책갈피 4개가 남음**(Chrome에서 눌러도 이동 없음, 사용자 설명서의 "Preserve document information from the first file opened" 설정과 일치). PDFsam Basic은 모두 유지. PDFsam Split by size 1MB는 한 쪽이 한도보다 크면 그 쪽이 한도를 넘는 파일로 남음(사진 쪽 1.19·1.28MB)
- Mac 미리보기는 macOS를 실행할 수 없어 Apple 사용자 가이드 기반으로만 쓰고 요약 표에 "Not tested" 표기
- 적용한 노하우: 검색형 제목 57자·설명 154자, 측정 규모 제목 표기 `(3 Ways Tested)`, 이미지 7장(대표 점검표 1200×675 + Chrome 양식 입력 비교 + PDF Arranger 남은 책갈피 + PDFsam Extract·Split by size 화면 + PDF Arranger Export 메뉴 + Chrome 인쇄 미리 보기), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → `compress-video-for-discord-email`(Gmail 25MB)·`compress-image-to-100kb`·`image-to-text-offline-free`·`convert-heic-to-jpg-free` (4개). 역링크: `image-to-text-offline-free` NAPS2 문단에 1문장 추가 (`updatedAt` 변경 없음, V 기록 대상 아님)
- 빌드 HTML 확인: title 69자(접미사 포함)·description 154자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 10개, `<pre>`·`<code>` 0개, 본문 이미지 7장 width·height 지정, sitemap·RSS 포함
- lint·test(30파일 229개)·build 통과

**알게 된 것**

- PDFsam Basic(JavaFX)도 Xvfb + xdotool로 조작 가능. 파일 선택은 GTK 대화상자에 경로를 바로 입력(`xdotool type --window`)하면 되고, 입력 칸은 창 포커스를 준 뒤(`windowfocus --sync`) 입력해야 들어감. 크롬 창이 함께 떠 있으면 포커스를 가져가 입력이 빠짐
- PDF Arranger Flatpak(1.14.0)은 `flatpak run`에 시스템 D-Bus(`dbus-daemon --system --fork`)와 세션 D-Bus(`dbus-run-session`)가 필요하고, 저장은 문서 포털(FUSE)을 거치므로 `XDG_RUNTIME_DIR=/run/user/0`을 지정해야 함 (없으면 `/root/.cache/doc/...` 없음 오류). Ubuntu apt 판은 1.10.1로 오래됨
- Chromium 인쇄 미리 보기는 Xvfb 창 모드(`--no-sandbox`)에서 열리고, "Pages" 드롭다운은 클릭으로 펼친 목록이 화면 캡처에 안 잡힐 때가 있어 포커스 후 방향키(↓×3 = Custom)가 확실함. "Print as image" 체크 상자를 잘못 누르지 않게 주의 (측정 중 한 번 눌려 다시 해제)
- `pgrep -f`/`pkill -f`에 앱 이름을 쓰면 같은 문자열을 가진 셸 명령까지 죽어 Bash 호출이 끊김(exit 144) → `pgrep -x`나 `flatpak kill` 사용
- 네트워크: pdfsam.org(다운로드 페이지)·GitHub Releases(pdfsam v6.0.6)·dl.flathub.org·flathub.org API·raw.githubusercontent.com(README·wiki)·irs.gov·support.apple.com(Playwright 렌더링)·support.google.com(렌더링) 가능. github.com 저장소·archive 소스 zip은 403

**다음 할 일**

- Claude: 새 글 노출 검색어 확인 (`split pdf free`, `split pdf into individual pages`, `split pdf by size`), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: PDF 글 GUI 시리즈 후보 — 삭제한 PDF 합치기·JPG→PDF·PDF→JPG를 PDFsam Basic·PDF Arranger·Mac 미리보기·Chrome으로 다시 측정 가능 (이번 세션 설치·조작 절차 재사용: tests/README "PDF 나누기(GUI) 측정 재현")
- (완료) 대시보드: README 절차대로 `stats` DB 7개 문서 갱신(버전 11·8 → 12·9). 이번 세션은 `ArtifactData` list·batch 모두 권한 분류기 거부 없음. 비로그인용 `data.js`는 정기 세션 규칙대로 건너뜀
- Claude: 발행 13편 / AdSense 신청 기준 20편

## 2026-10-17 · 세션 18 (정기 실행, 영향 뉴스 세션): Pixel Watch Safety Signal 종료

세션 시각: 2026-10-17 18:09 KST → 영향이 오래 가는 뉴스 칼럼 세션. 열린 PR 없음. 작업 브랜치가 `origin/main`(9a6a674)과 같아 그대로 시작.

**지표 (`gsc_report.py`, 2026-09-19 ~ 10-17, 세션 17 이후 바뀐 값만)**

- 노출 103 → **106**, 클릭 4, CTR 3.9% → 3.8%, 평균 순위 25.0 → 24.6
  - `turn-off-ai-in-chrome` 노출 52 → 54 (12.4) / `image-to-text-offline-free` 3 → 4 (10.0) / 나머지 글 변화 없음
  - 새 검색어: `optguideondevicemodel disable` 1 (3위, Chrome 글)
- sitemap 마지막 다운로드 10-15 03:42 UTC 그대로. URL 검사: `iphone-duo-sold-out` 포함 4편 `URL is unknown`(`compress-image-to-100kb`·`compress-video-for-discord-email`·`convert-heic-to-jpg-free`·`iphone-duo-sold-out`), 나머지 7편 색인
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                               | 카테고리 | 유형             | 독창 요소 |
| ---------------------------------- | -------- | ---------------- | --------- |
| `pixel-watch-safety-signal-ending` | `news`   | 뉴스 칼럼 (영향) | 연결 상황별 전후 비교 표(대표 이미지), Google 문서끼리의 차이 지적(공지 "Wi-Fi에서 계속 작동" vs 도움말 "LTE 워치는 휴대폰 없이 긴급 통화하려면 LTE 연결 필요"), 사용자 유형별 영향 표, 종료 타임라인(확정/추정 구분), Fi 2년 무료 데이터는 통화 미포함 |

- 선정 근거 (최근 30일, Google News RSS 기사 수): `"Safety Signal" "Pixel Watch"` 24. 마감일 2026-12-12, 발표 10-08. 공식 1차 출처(Google 커뮤니티 관리자 공지·도움말 4건)를 Playwright 렌더링으로 직접 확인. 자동완성 "pixel watch safety signal" 11개, "pixel watch lte" 22개(lte plan·without phone·vs wifi)
- 제외·보류: **커스텀 GPT 12-11 종료**(마감일 가장 가깝고 backlog 점수 최고지만 help.openai.com·openai.com·chatgpt.com 모두 403 → 1차 출처 미확인으로 보류), Fitbit 앱 종료(기사 100+지만 마감일 없음), Android Auto Android 10 종료(66건, "could soon" 추정 보도), Google Messages SMS 토글(APK 분석 = 루머), OneDrive iOS 18(공식 날짜 없음)
- `Our take`: 혼자 있는 시간이 많은 착용자(부모님 등)는 12-12 전에 워치 회선 추가, Wi-Fi만 믿지 않음(Google 도움말 근거). Fi 사용자는 무료. 반대 관점: 대부분은 휴대폰을 지니고 다니고, 2개 모델·4개국·유료 구독자만 해당이라 월 요금을 안 내는 선택도 합리적
- 이미지 2장 (직접 만든 그래픽 1200×675): 연결 상황별 전후 표(`thumbnail`), 종료 타임라인. 팔레트는 기존 글과 같은 파랑·주황
- 내부 링크: 새 글 → `windows-10-esu-extended`·`iphone-duo-sold-out` (관련 주제 기존 글 없음). 기존 글에서 새 글로 가는 역링크는 맞는 문맥이 없어 추가하지 않음 (카테고리·홈·관련 글 목록으로만 연결)
- 빌드 HTML 확인: title 77자(접미사 포함, 본제목 65자)·description 159자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 7개, 본문 이미지 2장 width·height 지정, 코드 블록 0개, sitemap·RSS 포함
- lint·test(30파일 229개)·build 통과

**알게 된 것**

- support.google.com 도움말·커뮤니티 글은 curl로는 본문이 비어 있음(JS 로딩) → Playwright(Python, `/opt/pw-browsers/chromium-1194`)로 렌더링하면 본문·관련 글 링크까지 받을 수 있음. 도움말 검색 결과 페이지(`/search?q=`)도 렌더링으로 열려 관련 문서 ID 찾기에 유용
- store.google.com 상품 페이지는 렌더링으로 가격 텍스트를 받을 수 있음. 통신사 요금 페이지는 Verizon 워치 목록(기기 할부)만 열리고 T-Mobile·AT&T 요금 페이지는 실패 → 통신사 회선 요금은 이번 세션에서 확인 불가
- droid-life.com·9to5google.com 본문은 curl로 열림, androidauthority.com은 Cloudflare 차단

**다음 할 일**

- Claude: 11월 중순 이메일 통지 이후나 12-12 전후로 Google이 일정 변경·보상을 발표하면 `pixel-watch-safety-signal-ending`에 반영하고 `updatedAt` 갱신
- Claude: 칼럼 발행 4주 후(11-14) H4 판정 자료: `gsc_report.py --compare /posts/pixel-watch-safety-signal-ending --changed 2026-10-17 --metric impressions --type discover`(웹은 `--type web`). H5 비교용 영향 칼럼 1편째(화제 1편: `iphone-duo-sold-out`)
- Claude: 커스텀 GPT 종료(12-11)는 help.openai.com 접근이 되면 최우선 영향 칼럼 후보. 계속 403이면 사용자에게 허용 도메인 추가 여부 확인 필요 (사용자 결정 사항: 네트워크 설정)
- 대시보드: README 절차 1단계 `ArtifactData list`(stats)가 권한 분류기에 거부됨(Data Exfiltration) → 이번 세션 갱신 못 함. 다음 세션에서 다시 시도, 계속 막히면 사용자가 대화형 세션에서 갱신하거나 정기 세션 허용 여부 결정 필요
- Claude: 발행 12편 / AdSense 신청 기준 20편

## 2026-10-17 · 세션 17 (사용자 요청): 첫 뉴스 칼럼 — iPhone Duo 매진·결제 방식별 비용

세션 시각: 2026-10-17 13:20 KST (일반 세션 시각대지만 사용자가 "화제성 높은 주제"를 요청해 화제 뉴스 칼럼으로 작성). 열린 PR 없음. 작업 브랜치가 main보다 뒤처져 있어 `origin/main`에서 다시 시작.

**지표 (`gsc_report.py`, 2026-09-19 ~ 10-17, 세션 16 이후 바뀐 값만)**

- 노출 85 → **103**, 클릭 4, CTR 4.7% → 3.9%, 평균 순위 20.6 → 25.0
  - `turn-off-ai-in-chrome` 노출 52 (12.7) / `transcribe-audio-offline-free` 22 (45.5) / `gemini-gems-to-skills` 8 (7.8) / `image-to-text-offline-free` 3 (5.3) / 홈 3 (5.7) / `about` 2
  - 새 검색어: `google ai gone` 1 (3), `turn off ai` 2 (57.5), `gems to skills` 1 (10), `synthid checker` 3 (88.7)
- sitemap 마지막 다운로드 10-15 03:42 UTC 그대로. URL 검사: 남은 10편 중 7편 색인, `compress-image-to-100kb`·`compress-video-for-discord-email`·`convert-heic-to-jpg-free` 3편 `URL is unknown`
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12)

**발행한 글**

| slug                  | 카테고리 | 유형              | 독창 요소                                                                                                                             |
| --------------------- | -------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `iphone-duo-sold-out` | `news`   | 뉴스 칼럼 (화제)  | 결제 방식별 24개월 비용 계산(일시불·ACMI·Apple Upgrade 리스 반납/인수·12개월 리스·통신사) + 그래프, 사용자 유형별 영향 표, 일정 타임라인(공식/보도 구분), 리스 약관 함정 정리 |

- 선정 근거 (최근 48시간 발표, Google News RSS 기사 수, 100 = 100건 이상): `"iPhone Duo"` **100+** · `"Gemini 4"` 73(10-13 발표라 48시간 밖) · Apple TV 4K 71 · Windows 11 10월 기능 54 · Google Universal Cart 49 · AI Mode 37 · Windows Photos 28 · Gmail AI Inbox 7. Trends 7일(미국): `iphone duo` 평균 8.0·최고 67 vs `chatgpt` 69.9, `windows 11 update`·`universal cart` 0.0. 자동완성 "iphone duo" 38개(sold out·delivery date·pre order·price). Trends 급상승 RSS 10개는 연예·스포츠
- 각도: 배송 지연 소식 자체가 아니라 "기다리는 동안 무엇을 결정해야 하나" → 결제 방식(새 Klarna 리스 Apple Upgrade)의 실제 비용과 약관. 핵심 계산: 24개월 리스 $57.99×24 = $1,391.76(가격의 69.6%, iPhone 18 Pro도 70.0%), 인수 $607.24 → 리스+인수 = 정가 $1,999 = ACMI와 같음 (ACMI는 3% Daily Cash $59.97만큼 유리)
- `Our take`: 2년 안에 바꿀 사람에게는 리스가 낫다(인수 시 ACMI와 총액 동일 + 1세대 폴더블의 중고 가치 위험을 넘김). 반대 관점: Apple Card ACMI의 3% Daily Cash·소유권·Klarna 카드 제한 없음
- 1차 출처: Apple 보도자료(09-09·10-15), 스토어·사양·Apple Upgrade·ACMI(support 102730)·AppleCare·주문 취소·반품 정책 페이지. 배송 예정일(1월 25일, 일부 1월 29일)과 Apple 성명(CNBC)은 9to5Mac 본문(WebFetch)으로 확인해 "reported"로 표기. CNBC(매장 재고 미공개)·MacRumors($5,000 재판매)는 헤드라인만 확인 → 출처 표기
- 이미지 2장 (직접 만든 그래픽, 1200×675): 결제 방식별 비용 그래프(대표 이미지, `thumbnail`), 발표~배송 타임라인. 팔레트는 기존 글과 같은 파랑·주황 (dataviz 검증 스크립트 통과)
- 내부 링크: 새 글 → `convert-heic-to-jpg-free`(HEIF 사진)·`check-if-image-is-ai-generated`(Apple의 SynthID 지원 예정). 역링크: `check-if-image-is-ai-generated` SynthID 섹션에 Apple 지원 예정 1문장 + 링크 (`updatedAt` 변경 없음)
- 빌드 HTML 확인: title 73자(접미사 포함)·description 159자, BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 6개, og:image 생성, 본문 이미지 2장 width·height 지정, `news` 카테고리 페이지·sitemap·RSS에 노출. 모바일(390px)·데스크톱 가로 스크롤 없음

**알게 된 것**

- Apple Store 배송 예정일 API(`/shop/fulfillment-messages`)는 curl·Playwright 브라우저 세션 모두 HTTP 541 → 배송 예정일은 직접 확인 불가, 보도 기반으로만 씀. apple.com 보도자료·스토어·사양·도움말 페이지 본문은 정적 HTML로 받을 수 있음 (AppleCare 요금·보상 판매 금액·수리비는 동적 로딩이라 불가)
- 9to5mac.com(RSS·WebFetch 본문)·appleinsider.com(RSS 요약만, 본문 403)·Google News RSS 접속 가능. 뉴스 칼럼의 "reported" 확인에는 9to5Mac 본문이 가장 쓸 만함
- 화제 판단에 Google News RSS 기사 수는 100건에서 잘림 → 100+ 후보끼리는 Trends 7일 상대값으로 구분

**다음 할 일**

- Claude: 10-23(첫 배송·매장 재고)·10-30(28개국 출시) 이후 배송 예정일·매장 판매 변화가 있으면 같은 글에 반영하고 `updatedAt` 갱신 (뉴스 칼럼 후속 갱신 규칙)
- Claude: 칼럼 발행 4주 후(11-14) H4 판정 자료: `gsc_report.py --compare /posts/iphone-duo-sold-out --changed 2026-10-17 --metric impressions --type discover`(웹은 `--type web`)
- (완료) 대시보드: 사용자 결정(2026-10-17) "루틴 규칙 그대로" → README 절차대로 `stats` DB 7개 문서 갱신(버전 11·8). 대화형 세션이라 4단계 비로그인 열람용 `data.js` 스냅숏도 재게시(아티팩트 버전 17, 이전 스냅숏은 10-15 세션 8 기준). 이번 세션은 `ArtifactData` 읽기·쓰기 모두 권한 분류기 거부 없음
- PR #204 머지(04:41 UTC) → 배포·IndexNow 자동 제출 대상
- Claude: 발행 11편 / AdSense 신청 기준 20편

## 2026-10-17 · 명령줄 글 정리: 8편 삭제 + 남은 글의 명령줄 내용 제거 (사용자 요청)

- 사용자 결정: 명령줄 방법은 비개발자가 이해할 수 없으므로 쓰지 않음. 명령줄을 첫 답으로 권한 8편은 재작성하지 않고 **삭제**, 남은 글의 명령줄 섹션도 지금 제거
- 삭제(8편, 측정 자료는 `tests/{slug}/`에 보관): `pdf-to-jpg-high-quality`·`merge-pdf-files-free-offline`·`jpg-to-pdf-free-offline`·`compress-pdf-offline-free`·`convert-pdf-to-word-offline-free`·`remove-background-from-image-free-offline`·`video-to-gif-high-quality-free`·`free-offline-text-to-speech`. 7편은 미색인(`URL is unknown`), 색인된 글은 TTS 1편. 삭제 URL은 배포 후 IndexNow 워크플로우가 자동 제출. backlog에는 "GUI 앱·내장 기능으로 새로 쓸 후보"로 남김
- 남은 글 수정 (모두 `updatedAt: 2026-10-17`, 사실 확인표에 변경 기록)
  - `turn-off-ai-in-chrome`: Windows 정책을 명령 프롬프트 대신 레지스트리 편집기 화면 단계로(같은 키·값), Mac 정책(터미널) 섹션 삭제. 레지스트리 편집기 메뉴 이름은 Microsoft 문서 기준, Windows PC에서 직접 실행하지는 못함
  - `compress-image-to-100kb`: 명령줄 섹션·jpegoptim·cwebp 비교 삭제, 그래프 2장 다시 그림 (측정값 그대로, ImageMagick은 측정 도구로만 표기)
  - `compress-video-for-discord-email`: FFmpeg 섹션·표 행 삭제, 제목 "(14 Settings Tested)" → "(7 Settings Tested)", 그래프 다시 그림, FFmpeg 비교 그래프 1장 삭제 → 이미지 4장(측정 글 목표 5장 미달)
  - `convert-heic-to-jpg-free`: ImageMagick 섹션·행 삭제, 제목 "(3 Tools Tested)" → "(2 Tools Tested)", 그래프 다시 그림. 색 비교 이미지의 "프로필 유지" 쪽은 ImageMagick 결과물이라 도구명·ΔE 수치를 지우고 예시로만 둠
  - `image-to-text-offline-free`: 측정한 OCR 엔진 4개가 모두 명령줄 도구라 측정 내용 전부 삭제 → 2,014단어 → 570단어, 이미지 0장. 제목 "Image to Text Offline for Free on Windows and Mac". 남은 내용은 Snipping Tool·PowerToys·Live Text·NAPS2 (모두 문서 기반)
  - 허브 `free-offline-ai-tools`: TTS·배경 제거·Ollama(터미널) 섹션 삭제, "five" → "three" jobs, 메모리 그래프 다시 그림 → 이미지 4장
  - `transcribe-audio-offline-free`·`check-if-image-is-ai-generated`: 삭제된 글 링크 정리
- 문서: README 세션 워크플로우의 재작성 항목 삭제, backlog 상태, tests/README 삭제 표시, traffic-playbook 예시·V1(대상 2편 삭제)·V2(허브 변경이 판단 기간에 겹침), writing-guide 예시, 정기 실행 프롬프트에서 재작성 단계 삭제
- 검증 기록에 행을 추가하지 않음: 규칙 준수용 삭제·정리라 성과 개선 실험이 아님. 단 제목이 바뀐 3편(영상 압축·HEIC·OCR)은 이후 CTR·노출 비교 때 2026-10-17 변경을 감안

**다음 할 일**

- Claude (일반 세션): `image-to-text-offline-free`는 측정 없는 570단어 글이 됨 → 내장 기능(Snipping Tool·Live Text)과 GUI 앱(NAPS2 등)을 직접 확인할 수 있으면 보강, 어려우면 사용자에게 유지·삭제 확인
- Claude: 삭제한 주제(PDF 합치기·PDF→JPG·JPG→PDF·PDF 압축·PDF→Word·배경 제거·영상→GIF·TTS)는 수요가 확인된 주제이므로, GUI 앱·OS 내장 기능으로 직접 검증할 수 있을 때 새 글로 다시 씀 (backlog 해당 행)
- 다른 글에서 링크되지 않는 글: `compress-image-to-100kb`·`windows-10-esu-extended` → 다음 관련 글 작성 때 연결

## 2026-10-17 · 규칙 변경: 뉴스 칼럼 카테고리 + 정기 실행 하루 4회 (사용자 요청)

- 사용자 결정: 화제성 높은 뉴스도 다룸. 소식 전달·카피캣이 아니라, 독자(비개발자)에게 미칠 영향을 분석하고 ToolProof의 견해를 담는 칼럼. 카테고리 `news`("News & Analysis")
- 정기 실행: 하루 4회 6시간 간격(한국 시간 00·06·12·18시), 세션마다 1편. 06시 화제 뉴스 칼럼, 18시 영향이 오래 가는 뉴스 칼럼, 00·12시 일반 글(`ai-tools`·`software`). 세션 유형은 시작 시각으로 판단, 기준을 통과하는 뉴스가 없으면 다른 뉴스 유형 → 일반 글 순으로 대체
- ~~기존 명령줄 글 8편 재작성은 일반 세션(00·12시)에서만 함~~ → 취소 (위 '명령줄 글 정리' 기록: 8편 삭제)
- 반영: `src/core/config` 카테고리 `news` 추가 (글 0개 카테고리는 헤더·사이트맵·카테고리 페이지에서 자동 숨김이라 첫 칼럼 발행 전에는 노출 없음), [README.md](README.md) 결정사항·콘텐츠 구성·뉴스 칼럼 선정 기준·발행 속도·세션 워크플로우·가설 H4·H5·인프라 상태, [writing-guide.md](writing-guide.md) 뉴스 칼럼 유형·구성·`Our take` 규칙·이미지·체크리스트, [backlog.md](backlog.md) 뉴스 칼럼 후보 섹션
- 근거(해석): 신규 도메인은 뉴스 검색 순위를 잡기 어렵고 색인도 느림(10-16 기준 16편 중 8편 색인) → 피드형(Discover) 채널과 영향이 오래 가는 뉴스로 보완. 화제 vs 영향 뉴스 성과는 H5로 비교

## 2026-10-17 · 규칙 변경: 비개발자 독자 기준 (사용자 요청)

- 사용자 결정: 블로그 독자는 비개발자. **비개발자가 이해·사용할 수 없는 방법(명령줄·코드·개발 도구)은 쓰지 않음** ("고급 사용자용" 섹션으로도 넣지 않음)
- 배경: 발행 18편 중 8편이 첫 답으로 명령줄 도구·Python 라이브러리를 권함 (`pdf-to-jpg-high-quality`·`merge-pdf-files-free-offline`·`jpg-to-pdf-free-offline`·`compress-pdf-offline-free`·`convert-pdf-to-word-offline-free`·`remove-background-from-image-free-offline`·`video-to-gif-high-quality-free`·`free-offline-text-to-speech`). 원인: 컨테이너에서 측정하기 쉬운 명령줄 도구가 비교 대상이 되고, 측정 1위가 그대로 첫 답이 됨. 반대로 GUI 앱을 Xvfb로 측정한 `convert-heic-to-jpg-free`, OS 내장 기능부터 안내한 `image-to-text-offline-free`는 비개발자가 따라 할 수 있음
- 반영: [README.md](README.md) 결정사항(독자)·주제 선정 기준 0번(필수 조건)·5번(직접 검증 = 독자가 쓸 방법을 실행), [writing-guide.md](writing-guide.md) 독자 규칙·도입 순서·비교 대상·측정 보조 도구·이미지·체크리스트, [backlog.md](backlog.md) 제외 기준·직접 검증 정의·19번(제외)·41번·46번(GUI 앱·내장 기능으로 각도 변경)
- ~~기존 8편은 정기 세션에서 1편씩 다시 씀~~ → 취소, 8편 삭제 (위 '명령줄 글 정리' 기록)

## 2026-10-16 · 세션 16 (정기 실행 15회차): PDF 합치기

세션 시각: 2026-10-16 21:10 UTC 무렵 (한국 10-17 06:10). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-18 ~ 10-16, 세션 15 이후 바뀐 값만)**

- 노출 74 → **85**, 클릭 4, CTR 5.4% → 4.7%, 평균 순위 20.6
  - `turn-off-ai-in-chrome` 노출 46 (10.0) / `transcribe-audio-offline-free` 14 (28.6) / `check-if-image-is-ai-generated` 11 (72.2) / `gemini-gems-to-skills` 6 (7.2) / `free-offline-text-to-speech` 3 (10.7) / `image-to-text-offline-free` **첫 노출** 1 (3.0)
  - 새 검색어: `chrome disable ai` 1 (7), `toolproof` 1 (5), `synthid detector` 4 (125.5)
- sitemap 마지막 다운로드 10-15 03:42 UTC 그대로. URL 검사 변화 없음 → 17편 중 8편 색인 (미색인 9편 모두 `URL is unknown`, `pdf-to-jpg-high-quality` 포함)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                           | 카테고리   | 유형                           | 직접 검증                                                                                                   |
| ------------------------------ | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `merge-pdf-files-free-offline` | `software` | 비교 + How-to (측정형, 검색형) | 5개 PDF 21쪽(직접 만든 책갈피·목차 링크 보고서 2개 + 이름을 다르게 채운 IRS W-9 2부 + CC0 사진 3쪽)을 qpdf 12.4.2·pdfunite(Poppler 26.10.0)·Ghostscript 10.08.0·pdftk-java 3.3.3·pypdf 6.21.0·PyMuPDF 1.28.2 기본 명령으로 합침 + 변형 2개(qpdf 첫 파일 기본 입력, pypdf `add_form_topname`). 책갈피·목차 링크·양식 분리·사진 픽셀·쪽별 텍스트·시간·메모리 측정, **Chrome 141 PDF 뷰어에서 링크 클릭·책갈피 패널·양식 입력을 직접 조작** |

- 선정 근거: Trends(미국 3개월, 429 3회 재시도 후 응답, 기준 `remove background` 35.1): `merge pdf` **6.3** · `png to jpg` 3.9 · `webp to jpg` 1.9 · `upscale image` 1.3. 자동완성 "merge pdf" 28개(offline·free download·mac·iphone), "combine pdf" 24개(preview on mac·microsoft edge). 백로그 45번이 "측정 차별점 약함"이었으나 책갈피·링크·양식 보존으로 각도를 잡음. 파일 변환 시리즈 9번째
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Trends 미국 급상승 10개: 연예·스포츠·날씨·"tesla autopilot"(뉴스) → IT 도구 주제 없음
- 차별점: 기본 명령으로 책갈피 8개·목차 링크 6개·양식 분리·사진 4항목을 모두 지킨 도구는 **pdftk뿐**. qpdf·pdfunite는 링크를 남기지만 이름 목적지(`/Dests`)를 빼서 클릭해도 그대로, PyMuPDF는 문서 안 링크를 삭제. **같은 W-9 2부를 합치면 pypdf·pdfunite 결과에서 4쪽에 입력한 값이 10쪽에도 들어감**(Chrome에서 직접 확인). Ghostscript는 양식 평면화
- 적용한 노하우: 검색형 제목 48자·설명 155자, 측정 규모 제목 표기, 이미지 6장(대표 점검표 1200×675 + Chrome 양식 입력·책갈피·링크 클릭·평면화 캡처 4장 + 속도·메모리 그래프), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → JPG→PDF·PDF→Word·PDF 압축·OCR·PDF→JPG (5개). `compress-pdf-offline-free` 마지막 문단에서 새 글로 역링크 1개 (V 기록 대상 아님)
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 12개, og:image 생성, 본문 이미지 6장 모두 width·height 지정

**측정값 (Xeon 2.1GHz 4코어, RAM 16GB, 입력 5.6MB, 시간은 3회 중앙값, 프로그램 시작 포함)**

| 도구 (기본 명령)          | 책갈피 | 목차 링크 | W-9 2부 양식                 | 사진 픽셀 | 시간 · 최대 RAM |
| ------------------------- | ------ | --------- | ---------------------------- | --------- | --------------- |
| pdftk-java 3.3.3          | 8/8    | 6/6       | 분리 (`1.` 접두사)           | 3/3       | 0.61초 · 87MB   |
| pypdf 6.21.0              | 8/8    | 6/6       | **연결됨** (같은 이름)       | 3/3       | 0.24초 · 42MB   |
| Ghostscript 10.08.0       | 8/8    | 6/6       | 평면화 (입력 불가)           | 3/3       | 0.50초 · 30MB   |
| qpdf 12.4.2               | 0/8    | 0/6       | 분리 (`+1`)                  | 3/3       | 0.06초 · 22MB   |
| pdfunite (Poppler 26.10)  | 0/8    | 0/6       | **연결됨**, AcroForm 삭제    | 3/3       | 0.16초 · 11MB   |
| PyMuPDF 1.28.2            | 0/8    | 0/6 (삭제) | 분리 (`[215]`)              | 3/3       | 0.16초 · 58MB   |
| qpdf 첫 파일 기본 입력    | 4/8    | 3/6       | 분리                         | 3/3       | 0.05초          |
| pypdf + `add_form_topname`| 8/8    | 6/6       | 분리                         | 3/3       | 0.23초          |

- 외부 링크 2개는 모두 유지. 쪽별 텍스트는 Ghostscript(17/21, 평면화된 W-9 쪽) 외 모두 21/21 동일
- Poppler 24.02·Ghostscript 10.02.1(Ubuntu 패키지)도 같은 항목 결과 (10.02.1만 JPEG 끝에 2바이트 덧붙임, 픽셀 동일)

**알게 된 것**

- "무손실이라 차이 없음"으로 보이던 작업도 **문서 수준 구조(책갈피·이름 목적지·AcroForm)** 를 재면 도구 차이가 큼. 백로그에서 "측정 차별점 약함"으로 보류한 주제는 결과물의 구조·동작을 측정 항목으로 바꿔 다시 검토할 것 (예: MP4→MP3의 메타데이터·챕터)
- Chromium 141 `--headless=new`에서 내장 PDF 뷰어가 열리고, 마우스 클릭·`insert_text`로 양식 입력, 휠 스크롤로 쪽 이동이 됨. `keyboard.type`은 공백이 빠지고 `Control+A`는 안 먹음(End → Shift+Home 사용). `location.hash`로 쪽 이동은 안 됨. PDF 관련 글에서 실제 뷰어 동작 스크린샷 재료로 재사용 가능
- 같은 이름 양식 칸 문제는 pypdf 문서("Merging forms")·PyMuPDF 문서(`join_duplicates`)에 적혀 있지만 기본값이 서로 다름 → 도구 문서의 기본값을 측정 전에 확인하면 측정 항목을 빨리 정할 수 있음
- 네트워크: irs.gov·poppler.freedesktop.org·GitHub Releases(qpdf v12.4.2, ghostpdl gs10080)·gitlab.com API(pdftk-java releases·README raw)·formulae.brew.sh·support.apple.com·tools.pdf24.org·pdflabs.com·readthedocs(qpdf·pypdf·PyMuPDF·Ghostscript)·archive.ubuntu.com(apt) 가능. gitlab.com 릴리스 HTML 페이지는 WebFetch에서 본문이 비어 API로 확인
- 실수: 처음 링크 판정 스크립트가 "같은 쪽을 가리키는 링크"를 오답으로 셌음(Summary 링크는 1쪽→1쪽) → 입력 파일의 링크 대상과 비교하도록 고침

**다음 할 일**

- 사용자: 미색인 9편(모두 `URL is unknown`, 가장 오래된 `remove-background-from-image-free-offline` 발행 6일째). Search Console URL 검사 → **색인 생성 요청** 권장 (API로는 요청 불가). sitemap이 10-15 이후 다시 읽히지 않아 sitemap 재제출도 검토
- 사용자: 대시보드 — 정기 세션의 대시보드 DB 갱신 허용 여부 결정 전까지 이번 세션도 갱신 건너뜀
- Claude: 새 글 노출 검색어 확인 (`merge pdf files free`, `merge pdf offline`, `combine pdf files into one` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 허브 후보 `Best Free Offline File Converters` — `software` 측정 글 9편(PDF→Word·HEIC→JPG·PDF 압축·영상→GIF·영상 압축·이미지 압축·JPG→PDF·PDF→JPG·PDF 합치기). V2 판정(11-12) 후 결정. PDF 4편(압축·Word·JPG·합치기)은 "PDF 도구" 허브로 따로 묶는 안도 검토
- Claude: 발행 18편 / AdSense 신청 기준 20편 (2편 남음)

## 2026-10-16 · 세션 15 (정기 실행 14회차): PDF→JPG 고화질 변환

세션 시각: 2026-10-16 16:55 UTC 무렵 (한국 10-17 01:55). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-18 ~ 10-16, 세션 14 이후 바뀐 값만)**

- 변화 없음: 노출 74, 클릭 4, CTR 5.4%, 평균 순위 20.6. sitemap 마지막 다운로드 10-15 03:42 UTC 그대로. URL 검사 변화 없음 → 16편 중 8편 색인 (미색인 8편 모두 `URL is unknown`, `jpg-to-pdf-free-offline` 포함)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                      | 카테고리   | 유형                           | 직접 검증                                                                                                   |
| ------------------------- | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `pdf-to-jpg-high-quality` | `software` | 비교 + How-to (측정형, 검색형) | PDF 3개(IRS Form 1040 2쪽 + 직접 만든 흰 배경 없는 보고서 1쪽 + CC0 사진 3쪽)를 pdftoppm(Poppler 26.10.0)·PyMuPDF 1.28.2·Ghostscript 10.08.0·ImageMagick 7.1.2-34·LibreOffice 26.8.1의 기본·300 DPI 설정으로 변환, 픽셀 크기·JPEG 품질·쪽당 크기·Tesseract OCR 단어 재현율·시간·메모리 측정 + pdftoppm DPI 7단계 × 품질 2단계 스윕 + GIMP 3.2.6 가져오기·LibreOffice JPEG 옵션 대화상자 스크린샷 |

- 선정 근거: Trends API 429(세션 13에 이어 두 번째) → 자동완성으로 선정. "pdf to jpg" 30개(converter·converter free·free·canva 3곳, high quality·iphone 2곳, high resolution·in pc·no sign up), "merge pdf" 28개, "png to jpg" 29개, "webp to jpg" 22개. `merge pdf`는 무손실 결합이라 측정 차별점이 약하고, `pdf to jpg`는 "high quality/high resolution" 하위 검색어가 측정(DPI)과 바로 맞아서 선택. 파일 변환 시리즈 8번째, JPG→PDF의 반대 방향
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Trends 미국 급상승 10개: 연예·스포츠 → IT 주제 없음. 공식 피드 새 항목은 세션 14와 같음
- 차별점: 기본 설정에서 **3개 도구(PyMuPDF·Ghostscript·ImageMagick)가 72 DPI** → IRS 1040 1쪽 OCR 3~7%, 300 DPI로 바꾸면 5개 모두 82~91%. **ImageMagick이 흰 배경을 칠하지 않는 브라우저 PDF를 검은 페이지로 저장**(OCR 0%) → `-background white -alpha remove`. LibreOffice는 1쪽만 내보내고 글꼴을 바꿔 글자가 겹침
- 적용한 노하우: 검색형 제목 55자·설명 154자, 측정 규모 제목 표기, 이미지 7장(대표 그래프 1200×675 + DPI별 확대 + DPI 크기·판독률 + ImageMagick 검은 배경 + LibreOffice 글꼴 + 스크린샷 2장), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → JPG→PDF·이미지 100KB·OCR·PDF→Word·PDF 압축 (5개). `jpg-to-pdf-free-offline` 마지막 문단에서 새 글로 역링크 1개 (V 기록 대상 아님)
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 15개, og:image 생성, 본문 이미지 7장 모두 width·height 지정

**측정값 (Xeon 2.8GHz 4코어, RAM 16GB, GPU 없음, OCR = Tesseract 5.3.4가 1040 1쪽 단어를 읽어 낸 비율)**

| 도구                | 기본 크기(Letter) · 품질 | 기본 OCR | 300 DPI·Q90 OCR | 300 DPI 시간(6쪽) | 기본 설정 문제 |
| ------------------- | ------------------------ | -------- | --------------- | ----------------- | -------------- |
| pdftoppm 26.10      | 1275×1650 (150) · 75     | 81%      | 91%             | 1.8초             | 없음           |
| PyMuPDF 1.28        | 612×792 (72) · 95        | 7%       | 90%             | 4.5초             | 72 DPI         |
| Ghostscript 10.08   | 612×792 (72) · 75        | 3%       | 90% (AA 켬)     | 2.9초             | 72 DPI, 안티앨리어싱 없음 |
| ImageMagick 7.1.2   | 612×792 (72) · 92        | 6%       | 82% (흰 배경)   | 21.4초 · 500MB    | 72 DPI, 투명 → 검은 배경 |
| LibreOffice 26.8    | 816×1056 (96) · 75       | 58%      | 82% (2550×3300) | -                 | 1쪽만, 글꼴 대체 |

- DPI 스윕(pdftoppm, 1040 KB/쪽 Q75): 72 125KB·4% / 150 386KB·81% / 200 576KB·87% / 300 1.0MB·89% / 600 2.6MB·93%. Q75→Q90은 크기 +40%, OCR 차이 없음(±3~5%p)
- Poppler 24.02(Ubuntu 패키지)와 26.10.0 pdftoppm 출력이 바이트 단위로 같음

**알게 된 것**

- 문서→이미지 변환 글은 "기본 DPI"가 가장 큰 차이. 도구 기본값을 픽셀 크기로 직접 재면 문서(Ghostscript "usually 72 dpi")보다 확실한 근거가 됨
- 흰 배경을 칠하지 않는 PDF(브라우저 인쇄)를 입력에 넣어야 투명도 문제가 드러남. 공문서 양식만 썼다면 ImageMagick 검은 배경을 못 찾았음 → 문서 변환 측정 세트에는 브라우저 PDF를 항상 포함
- PyMuPDF는 JPEG 헤더에 96 DPI를 적지만 실제 픽셀은 72 DPI 크기. 헤더 DPI가 아니라 픽셀 크기로 판단할 것
- GIMP 내보내기 대화상자는 창 관리자 없는 Xvfb에서 xdotool 입력이 본 창으로 가서 실패(도구 단축키가 눌림). GUI 측정이 필요하면 가벼운 창 관리자를 먼저 띄울 것. GIMP 출력은 측정하지 않고 가져오기 기본값만 썼음
- Poppler 26.10 소스 빌드는 `-DENABLE_HARFBUZZ=OFF` 등 옵션으로 약 3분. Ubuntu 패키지 24.02와 렌더링 결과가 같아 다음부터는 패키지로 충분
- Google Trends API 429가 세션 13에 이어 다시 발생(세션 14는 정상) → 간헐적. README에 "429면 자동완성만으로 선정하고 log에 기록" 정도의 대체 절차를 다음 세션에서 검토
- 네트워크: irs.gov PDF·poppler.freedesktop.org·formulae.brew.sh API·download.gimp.org·download.documentfoundation.org·GitHub Releases(ImageMagick·ghostpdl)·archive.ubuntu.com(apt) 가능. support.apple.com에 Preview PDF→JPEG 전용 문서는 찾지 못함(이미지 형식 변환 문서만)

**다음 할 일**

- 사용자: 미색인 8편(모두 `URL is unknown`, 가장 오래된 `remove-background-from-image-free-offline` 발행 6일째). Search Console URL 검사 → **색인 생성 요청** 권장 (API로는 요청 불가). sitemap이 10-15 이후 다시 읽히지 않아 sitemap 재제출도 검토
- 사용자: 대시보드 — 정기 세션의 대시보드 DB 갱신 허용 여부 결정 전까지 이번 세션도 갱신 건너뜀
- Claude: 새 글 노출 검색어 확인 (`pdf to jpg`, `pdf to jpg high quality` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 허브 후보 `Best Free Offline File Converters` — `software` 측정 글 8편(PDF→Word·HEIC→JPG·PDF 압축·영상→GIF·영상 압축·이미지 압축·JPG→PDF·PDF→JPG). V2 판정(11-12) 후 결정
- Claude: 발행 17편 / AdSense 신청 기준 20편

## 2026-10-16 · 세션 14 (정기 실행 13회차): JPG→PDF 오프라인 변환

세션 시각: 2026-10-16 15:50 UTC 무렵 (한국 10-17 00:50). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-18 ~ 10-16, 세션 13 이후 바뀐 값만)**

- 노출 66 → **74**, 클릭 3 → **4**, CTR 5.4%, 평균 순위 20.6
  - `turn-off-ai-in-chrome` 노출 42 (10.5) / `transcribe-audio-offline-free` 13 (24.6) / `gemini-gems-to-skills` 4 (7.8) / 홈 클릭 2·노출 3 / `/about` 노출 2
  - 새 검색어: `tool proof` 클릭 1 (4위, 브랜드 검색 첫 클릭), `offline transcription software` 2 (79), `speech to text offline` 1 (85), `turn off ai` 2 (57.5)
- sitemap 마지막 다운로드 10-15 03:42 UTC 그대로. URL 검사 변화 없음 → 15편 중 8편 색인 (미색인 7편 모두 `URL is unknown`: 이미지 100KB·PDF 압축·영상 압축·HEIC→JPG·PDF→Word·배경 제거·영상→GIF)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                       | 카테고리   | 유형                           | 직접 검증                                                                                                   |
| -------------------------- | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `jpg-to-pdf-free-offline`  | `software` | 비교 + How-to (측정형, 검색형) | 12MP 사진 24장(CC0 20장 + EXIF Orientation=6 세로 4장)을 img2pdf 0.6.3·ImageMagick 7.1.2-34·Pillow 12.3.0·LibreOffice 26.8.1·Chromium 141(Playwright `page.pdf`)로 변환, PDF 크기·삽입 사진 픽셀 동일 여부·SSIMULACRA2·세로 사진 방향·시간·메모리 측정 + LibreOffice 무손실 설정 비교 + Draw·PDF 내보내기 대화상자 스크린샷 |

- 선정 근거: Trends(미국 3개월, 기준 `remove background` 35.4): `jpg to pdf` **13.1** · `mp4 to mp3` 8.8 · `image to pdf` 8.1 · `compress pdf` 4.8 · `png to jpg` 3.9 · `webp to jpg` 1.9 · `upscale image` 1.4. 자동완성 "jpg to pdf" 32개(converter·free 3곳, merge·combine·high quality·on mac·windows 11), "image to pdf" 29개. 백로그 후보(업스케일·WebP→JPG)보다 수요가 5~9배라 새 후보로 선정
- Google Trends API: 이번 세션은 쿠키 방식으로 정상 응답 (세션 13의 429는 일시적이었음 → README 대체 절차 기록 불필요)
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Trends 미국 급상승 10개: 연예·정치·주식 → IT 주제 없음. 공식 피드 새 항목은 세션 13과 같음
- 차별점: 기본 설정에서 **세로 사진(EXIF 회전 태그)을 옆으로 눕히는 도구가 5개 중 3개**(ImageMagick·Pillow·LibreOffice), 사진을 그대로 넣는 도구는 img2pdf·Chromium뿐. LibreOffice 기본 내보내기는 JPEG 90%·300 DPI로 사진 픽셀을 약 1/3로 줄임
- 적용한 노하우: 검색형 제목 56자·설명 159자, 측정 규모 제목 표기, 이미지 6장(대표 그래프 1200×675 + 세로 사진 방향 비교 + 확대 비교 + 속도 그래프 + LibreOffice 스크린샷 2장), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → HEIC→JPG·이미지 100KB·PDF 압축·OCR·PDF→Word (5개). `convert-pdf-to-word-offline-free` 마지막 문단에서 새 글로 역링크 1개 (V 기록 대상 아님)
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 12개, og:image 생성, 본문 이미지 6장 모두 width·height 지정

**측정값 (Xeon 2.8GHz 4코어, RAM 16GB, GPU 없음, 24장 61.8MB, 시간은 3회 중앙값)**

| 도구 (기본 설정)        | PDF 크기 | 픽셀 동일 | SSIMULACRA2 중앙값 (최저) | 세로 사진 바로 | 시간 · 최대 RAM |
| ----------------------- | -------- | --------- | ------------------------- | -------------- | --------------- |
| img2pdf 0.6.3           | 61.8MB   | 24/24     | 100                       | 4/4            | 0.28초 · 108MB  |
| Chromium 141 인쇄       | 146.3MB  | 24/24     | 100 (세로 쪽은 무압축 20~27MB) | 4/4       | 31.6초*         |
| ImageMagick 7.1.2-34    | 61.8MB   | 0/24      | 92.3 (89.3), 품질 92 재인코딩 | 0/4 (`-auto-orient` 4/4) | 34.1초 · 3.3GB |
| Pillow 12.3.0           | 33.1MB   | 0/24      | 78.9 (73.6), 품질 75       | 0/4            | 3.1초 · 1.1GB   |
| LibreOffice 26.8.1      | 20.3MB   | 0/24      | 59.5 (26.7), 2244px·품질 90 | 0/4           | 33.6초*         |
| LibreOffice 무손실+해상도 변경 끔 | 61.9MB | 24/24 | 100                      | 0/4            | -               |

- \* 사진당 PDF 1개, 프로그램 시작 포함. 메모리는 자식 프로세스가 빠져 기록 안 함

**알게 된 것**

- "변환"이라는 같은 이름 아래 도구가 하는 일이 셋으로 갈림: 그대로 복사(img2pdf), 다시 압축(ImageMagick·Pillow·LibreOffice), 풀어서 무압축(Chromium 세로 사진). 크기만 보면 ImageMagick이 img2pdf와 같아 보여 픽셀 동일 여부를 따로 재야 차이가 드러남 → 파일 변환 글은 "결과가 원본과 비트·픽셀 단위로 같은가"를 측정 항목에 넣을 것
- 휴대폰 세로 사진의 EXIF 회전 태그는 HEIC 글에 이어 이번에도 도구 간 차이가 가장 큰 항목. 이미지 관련 측정 세트에는 세로(회전 태그) 사진을 항상 포함
- LibreOffice는 로캘이 없으면 A4, `LANG=en_US.UTF-8`이면 Letter. 기본값은 대화상자 스크린샷과 `share/registry/main.xcd`(`Filter/PDF/Export`)로 확인 가능
- ImageMagick `-orient`은 EXIF가 없는 파일에 태그를 쓰지 않음 → JPEG를 다시 인코딩하지 않고 APP1을 직접 삽입하는 스크립트(`set_orientation.py`)로 해결
- 실수: `pgrep -f "lo-gui" | xargs kill`이 같은 문자열을 가진 내 셸까지 종료(exit 144, 세션 13과 같은 함정). 프로세스 종료는 반드시 PID로
- Windows `Microsoft Print to PDF`는 support.microsoft.com 공식 문서를 찾지 못함(검색·Learn 검색 모두 Q&A 커뮤니티 답변뿐) → 본문에 단계 없이 "테스트하지 못함"만 씀
- 네트워크: pd12m S3·GitHub Releases(ImageMagick·libjxl)·download.documentfoundation.org·PyPI·gitlab.mister-muffin.de 가능

**다음 할 일**

- 사용자: 미색인 7편(모두 `URL is unknown`, 가장 오래된 `remove-background-from-image-free-offline`은 발행 6일째). Search Console URL 검사 → **색인 생성 요청** 권장 (API로는 요청 불가). sitemap이 10-15 이후 다시 읽히지 않아 sitemap 재제출도 검토
- 사용자: 대시보드 — 세션 13에서 `ArtifactData` 읽기가 권한 분류기에 거부됨. 정기 세션의 대시보드 DB 갱신 허용 여부 결정 전까지 이번 세션도 갱신 건너뜀
- Claude: 새 글 노출 검색어 확인 (`jpg to pdf`, `image to pdf`, `jpg to pdf free` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 허브 후보 `Best Free Offline File Converters` — `software` 측정 글 7편(PDF→Word·HEIC→JPG·PDF 압축·영상→GIF·영상 압축·이미지 압축·JPG→PDF). V2 판정(11-12) 후 결정
- Claude: 발행 16편 / AdSense 신청 기준 20편

## 2026-10-16 · 세션 13 (정기 실행 12회차): 이미지 100KB 압축

세션 시각: 2026-10-16 11:09 UTC (한국 20:09). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-18 ~ 10-16, 세션 12 이후 바뀐 값만)**

- 노출 65 → **66**, 클릭 3, CTR 4.5%, 평균 순위 22.2. `check-if-image-is-ai-generated` 노출 9 → 10 (순위 69.4)
- sitemap 마지막 다운로드 10-15 03:42 UTC 그대로. URL 검사: `remove-background-from-image-free-offline`이 `Discovered - currently not indexed` → **`URL is unknown to Google`**로 바뀜 (원인 불명, 색인 생성 요청 필요성 커짐). 14편 중 8편 색인 (미색인 6편 모두 `URL is unknown`)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                      | 카테고리   | 유형                           | 직접 검증                                                                                                   |
| ------------------------- | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `compress-image-to-100kb` | `software` | How-to + 측정 (검색형)         | 12MP 사진 20장(CC0, HEIC 글과 같은 세트)을 목표 5개(1MB·500KB·200KB·100KB·50KB) × 크기 9개로 ImageMagick 7.1.2-34(`jpeg:extent`)·jpegoptim 1.5.6(`--size`)·cwebp 1.6.0(`-size`) 압축, 1,900건의 크기·목표 통과·SSIMULACRA2(1600×1200 화면 기준) 측정 + GIMP 3.2.6 크기 조정·JPEG 내보내기(파일 크기 미리보기) 직접 조작 |

- 선정 근거: 자동완성 "compress image" 30개(to 2mb·without losing quality가 Google·Bing·YouTube 3곳, to 1mb·free·online, to 100kb·200kb·50kb), "reduce image size" 30개(in kb·to 100kb·mac). 압축 시리즈(PDF·영상)와 같은 독자, 업로드 한도 검색이 구체적이라 측정 차별점이 큼. "upscale image"(32개)·"webp to jpg"(22개)는 후보로 남김
- **Google Trends API 429**: 쿠키 방식으로도 3회 재시도(최대 약 2.5분) 후 실패, 몇 분 뒤 재시도도 실패 → 이번 세션은 상대 검색량 비교 없이 자동완성으로 선정 (RSS는 정상)
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Trends 미국 급상승 10개: 스포츠·날씨·연예 → IT 주제 없음. 공식 피드 새 항목은 세션 12와 같음
- 차별점: 원본 크기(4032px)로 100KB를 지정하면 ImageMagick은 품질 2까지 내려도 6/20장이 목표를 넘기고 **오류 없이(종료 코드 0) 저장**, jpegoptim은 KB=1,024 + 근사 탐색으로 2/20만 100,000바이트 이하. 1024px로 줄인 뒤엔 20/20 통과·화질 중앙값 -49.9 → 52.8
- 적용한 노하우: 검색형 제목 52자·설명 153자, 측정 규모 제목 표기, 이미지 5장(대표 그래프 1200×675 + 통과 수 그래프 + 고양이 확대 비교 + GIMP 스크린샷 2장), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → HEIC→JPG·PDF 압축·영상 압축·허브·배경 제거 (5개). `compress-pdf-offline-free` 마지막 문단에서 새 글로 역링크 1개 (V 기록 대상 아님)
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 10개, og:image 생성, 본문 이미지 5장 모두 width·height 지정 (관련 글 카드 썸네일 3장은 크기 속성 없음 — 기존 글과 같은 동작)

**측정값 (Xeon 2.8GHz 4코어, RAM 16GB, GPU 없음, 20장 중앙값, SSIMULACRA2 1600×1200 화면 기준, ImageMagick JPEG)**

| 목표   | 원본 4032px (통과) | 최적 긴 변 | 최적 점수 (하위 10%) | 고른 JPEG 품질 중앙값 (범위) |
| ------ | ------------------ | ---------- | -------------------- | ---------------------------- |
| 1MB    | 88.0 (20/20)       | 1600px     | 89.7 (85.8)          | 96.5 (90~100)                |
| 500KB  | 75.1 (20/20)       | 1600~1920px| 83.4~83.8 (72.4)     | 89 (64~97) @1600             |
| 200KB  | 15.3 (19/20)       | 1280px     | 69.1 (49.4)          | 78 (33~94)                   |
| 100KB  | -49.9 (14/20)      | 1024px     | 52.8 (26.7)          | 67 (23~92)                   |
| 50KB   | -50.6 (0/20)       | 800px      | 32.9 (1.5)           | 50.5 (17~90)                 |

- WebP(cwebp -size)는 같은 크기에서 점수가 비슷하거나 조금 높지만(100KB@1024 54.4, 200KB@1600 71.6) 목표 초과가 잦음(표 크기에서 0~5/20 초과, 원본 크기 100KB 11/20 초과)
- GIMP 3.2.6: 1600×1200 품질 60에서 4:4:4 213.5 kB → 4:2:0 181.8 kB, 저장 파일 181,788바이트 (kB = 1,000바이트)

**알게 된 것**

- 목표 용량 기능(`jpeg:extent`, jpegoptim `--size`, cwebp `-size`)은 모두 "최선을 다함"이지 보장이 아님. 문서(ImageMagick "does not exceed the value")와 실제 동작이 달라 측정이 곧 차별점이 됨. "도구가 약속한 값을 지켰는지"를 측정 항목에 넣을 것
- 화질 지표를 고정 화면 크기(1600×1200)로 계산하면 1600px 근처가 구조적으로 유리함 → 본문에 기준과 한계(작게 쓰는 프로필 사진이면 손해가 적음)를 밝힘. 원본 해상도 SSIMULACRA2는 12MP 1회 약 14초라 1,900건엔 부적합
- 속도 함정: 첫 실행은 점수용 리사이즈를 ImageMagick AppImage로 해 1건 3.7초 → Pillow Lanczos로 바꿔 0.5초. 4개 병렬 + `MAGICK_THREAD_LIMIT=1`로 1,900건 약 37분. 또 `pkill -f gimp`가 같은 문자열을 가진 내 셸까지 종료함(exit 144) → 프로세스 종료는 PID로
- 네트워크: storage.googleapis.com(libwebp 1.6.0 바이너리)·github.com Releases(libjxl v0.11.1 static, jpegoptim v1.5.6, ImageMagick 7.1.2-34)·download.gimp.org·archive.ubuntu.com(apt) 가능. Windows Photos 앱 크기 조정의 Microsoft 공식 문서는 찾지 못해 PowerToys 문서로 대체
- GIMP 3.2.6 첫 실행 시 "Welcome to GIMP" 창이 떠 xdotool `search --name`이 기대한 창을 못 찾음 → `xdotool search --name .`로 창 ID 목록을 보고 ID로 조작

**다음 할 일**

- 사용자: `remove-background-from-image-free-offline`이 발행 6일째 미색인이고 이번에 `URL is unknown`으로 바뀜. Search Console URL 검사 → **색인 생성 요청** 1회 권장 (API로는 요청 불가)
- Claude: 새 글 노출 검색어 확인 (`compress image to 100kb`, `reduce image size in kb` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 허브 후보 `Best Free Offline File Converters` — `software` 측정 글 6편(PDF→Word·HEIC→JPG·PDF 압축·영상→GIF·영상 압축·이미지 압축). V2 판정(11-12) 후 기존 허브와 역할 정리해 결정. 압축 3편(PDF·영상·이미지)은 "파일 크기 줄이기" 허브로 묶는 안도 검토
- Claude: Trends API 429가 다음 세션에도 계속되면 README 주제 발굴 소스에 대체 절차 기록
- Claude: 발행 15편 / AdSense 신청 기준 20편
- 대시보드: `ArtifactData` `list`(stats 읽기)가 권한 분류기에 거부됨(사유: PII Data Handling) → 이번 세션 DB 갱신 못 함. 사용자: 정기 세션의 대시보드 DB 읽기·쓰기를 허용할지, 정기 세션에서는 대시보드 갱신을 건너뛸지 결정 필요 (README 운영 대시보드 절차)

## 2026-10-16 · 세션 12 (정기 실행 11회차): Discord·이메일용 영상 압축

세션 시각: 2026-10-16 09:14 UTC (한국 18:14). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-18 ~ 10-16, 세션 11 이후 바뀐 값만)**

- 노출 60 → **65**, 클릭 3, CTR 4.6%, 평균 순위 21.1
  - `turn-off-ai-in-chrome` 노출 38 (10.6) / `check-if-image-is-ai-generated` 9 (67.0) / `gemini-gems-to-skills` 2 (8.5) / `free-offline-text-to-speech` 2 (13.5)
  - 새 검색어: `google ai gone` 1 (3위), `synthid checker` 2 (87.5), `synthid detector` 3 (134)
- sitemap 마지막 다운로드 10-15 03:42 UTC 그대로. URL 검사 변화 없음 → 13편 중 8편 색인 (미색인: PDF 압축·HEIC→JPG·PDF→Word·영상→GIF `URL is unknown`, 배경 제거 `Discovered - currently not indexed`)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                               | 카테고리   | 유형                           | 직접 검증                                                                                                   |
| ---------------------------------- | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `compress-video-for-discord-email` | `software` | 비교 + How-to (측정형, 검색형) | 60초 1080p 클립 3개(BBB·ToS CC BY 3.0 + 직접 녹화 화면)를 HandBrake 1.11.2(설정 7개)·FFmpeg 9.0.2(x264·x265·SVT-AV1, 설정 7개)로 압축, 크기·VMAF(평균·하위 5%)·시간·메모리 측정 + HandBrake Social 프리셋 내부 값 확인 |

- 선정 근거: 백로그 39. Trends(미국 3개월, 기준 `remove background` 35.0): `mp4 to mp3` 8.8 · `screen recorder` 3.5 · `compress video` **2.4** · `upscale image` 1.4. 자동완성 "compress video" 32개(for discord·free·without losing quality·to 10mb·for email·with handbrake). `mp4 to mp3`는 측정 차별점이 약해 계속 보류
- 차별점: Discord 무료 한도가 2026-08 **10MB → 20MB**로 바뀜(Discord File Attachments FAQ, 10-15 갱신). HandBrake Social 프리셋은 10MB·25MB용이라 20MB에 맞지 않음을 측정으로 보임
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Google Trends 미국 급상승 10개: 스포츠·연예·주식·"artificial intelligence news" → 새 IT 도구 주제 없음. 공식 피드 새 항목은 세션 11과 같음
- 적용한 노하우: 검색형 제목 57자·설명 157자, 측정 규모 제목 표기, 이미지 5장(대표 그래프 1200×675 + 인코더별 VMAF + 시간 + 화면 글자·얼굴 확대 비교), 요약 표 + 길이별 비트레이트 표 + 전체 결과 표 → 사실 확인표에 기록. 앱 화면 스크린샷 없음 (아래)
- 내부 링크: 새 글 → 영상→GIF·PDF 압축·HEIC→JPG·허브 (4개). `video-to-gif-high-quality-free` 마지막 문단에서 새 글로 역링크 1개 (V 기록 대상 아님)
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 10개, og:image 생성, 본문 이미지 5장 모두 width·height 지정

**측정값 (Xeon 2.8GHz 4코어, RAM 16GB, GPU 없음, 60초 클립, 크기 MB · 평균 VMAF, 1회 실행)**

| 설정                               | 애니메이션  | 실사        | 화면 녹화   |
| ---------------------------------- | ----------- | ----------- | ----------- |
| HandBrake Fast 1080p30 (기본)      | 20.5 · 91.6 | 32.9 · 95.4 | 4.8 · 99.6  |
| HandBrake Social 10 MB 1 Minute    | 9.7 · 83.7  | 9.7 · 84.0  | 8.3 · 82.2  |
| HandBrake Social 25 MB 1 Minute    | 23.9 · 90.1 | 23.8 · 93.9 | 20.2 · 96.3 |
| HandBrake 평균 비트레이트 19MB     | 19.0 · 91.2 | 19.0 · 90.4 | 17.0 · 99.6 |
| FFmpeg x264 2-pass 19MB            | 19.0 · 95.8 | 19.0 · 93.2 | 14.6 · 99.6 |
| FFmpeg x265 2-pass 19MB            | 18.9 · 96.1 | 18.9 · 94.8 | 18.9 · 99.6 |
| FFmpeg SVT-AV1 19MB (1-pass VBR)   | 17.4 · 96.3 | 15.5 · 94.8 | 12.7 · 99.6 |
| FFmpeg x264 9.5MB 1280 폭          | 9.5 · 90.0  | 9.5 · 84.9  | 9.0 · 96.2  |

- 3개 클립 합계 시간: HandBrake 19MB 3.6분, FFmpeg x264 2-pass 3.3분, x265 6.8분, AV1 4.2분(최대 RAM 1,003MB)

**알게 된 것**

- support.discord.com 일반 페이지는 403이지만 Zendesk API(`/api/v2/help_center/en-us/articles/{id}.json`, 검색 `/api/v2/help_center/articles/search.json?query=…`)는 열림 → 본문·갱신일을 1차 출처로 확인 가능. 뉴스 보도(Nitro 500MB)와 공식 문서(Nitro 최대 1GB)가 달라 공식 문서를 따름
- HandBrake 최신판(1.11.2) Linux는 GUI flatpak만 배포. `apt install flatpak` + Flathub 런타임 설치는 되지만 `flatpak run`은 D-Bus 없이 실패 → 런타임의 `ld-linux-x86-64.so.2`로 `HandBrakeCLI`를 직접 실행하면 동작(`hb.sh`). GUI(`ghb`)는 같은 방식으로 Xvfb에 창이 뜨지 않아 스크린샷을 못 찍음 → GUI 라벨은 바이너리 문자열로 확인
- HandBrake 출력은 우리 애니메이션·실사 클립에서 RF 5(거의 무손실)에서도 원본 대비 PSNR 40.8dB(FFmpeg CRF 5는 60.9dB), 화면 녹화는 50.8dB. 색 태그·crop·decomb·인코더 preset·profile 모두 원인 아님. 원인을 못 찾아 글에 "우리 클립에 한정될 수 있음"으로 명시. 측정 도구 간 비교에서 한쪽만 이상하면 거의 무손실 설정으로 파이프라인 자체 손실부터 확인
- 측정 실수 2건: (1) 2.4:1 영상을 `scale=-2:720`으로 줄여 1728×720이 됨 → 16:9 상자 기준(`scale=1280:-2`)으로 바꿔 재측정. (2) PSNR 기준 파일을 다르게 잘라 FFmpeg CRF 5를 51.6dB로 잘못 계산 → 같은 기준 파일로 다시 재서 60.9dB. 비교 기준 파일은 스크립트로 고정
- 시간 측정 중 다른 확인 작업을 함께 돌려 일부 HandBrake 시간이 늘어남 → 글에 "30% 미만 차이는 노이즈"로 밝힘. 다음 측정은 시간 측정 중 다른 작업을 하지 않음
- trac.ffmpeg.org는 Anubis 봇 차단(JS 필요) → FFmpeg 기본값은 출력 파일의 x264 설정 문자열(`crf=23.0`)로 직접 확인

**다음 할 일**

- 사용자: `remove-background-from-image-free-offline`이 발행 6일째 크롤링 전(`Discovered - currently not indexed`). Search Console URL 검사 → **색인 생성 요청** 1회 권장 (API로는 요청 불가)
- Claude: 새 글 노출 검색어 확인 (`compress video for discord`, `compress video to 10mb` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 허브 후보 `Best Free Offline File Converters` — `software` 측정 글 5편(PDF→Word·HEIC→JPG·PDF 압축·영상→GIF·영상 압축). V2 판정(11-12) 후 기존 허브와 역할 정리해 결정
- Claude: 발행 14편 / AdSense 신청 기준 20편
- 대시보드: `stats` DB 7개 문서 갱신(버전 10·7). 정기 세션 규칙에 따라 `data.js` 재게시는 건너뜀

## 2026-10-16 · 세션 11 (정기 실행 10회차): 영상→GIF 고화질 변환

세션 시각: 2026-10-16 03:21 UTC (한국 12:21). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-18 ~ 10-16, 세션 10 이후 바뀐 값만)**

- 변화 없음: 노출 60, 클릭 3, CTR 5.0%, 평균 순위 20.6. sitemap 마지막 다운로드 10-15 03:42 UTC 그대로
- URL 검사: `compress-pdf-offline-free`(10-16 발행)도 `URL is unknown` → 12편 중 8편 색인 (미색인: PDF 압축·HEIC→JPG·PDF→Word `URL is unknown`, 배경 제거 `Discovered - currently not indexed`)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                             | 카테고리   | 유형                           | 직접 검증                                                                                                   |
| -------------------------------- | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `video-to-gif-high-quality-free` | `software` | 비교 + How-to (측정형, 검색형) | 클립 3개(Big Buck Bunny·Tears of Steel CC BY 3.0 장면 + 직접 녹화한 화면, 각 5초·15fps·75프레임)를 FFmpeg 9.0.2·gifski 1.34.0·ImageMagick 7.1.2-34의 설정 7개로 변환, 크기·프레임별 SSIM·재생 시간(지연값)·시간·메모리 측정 + 폭·fps별 크기 |

- 선정 근거: Trends(미국 3개월, 기준 `remove background` 35.0): `video to gif` **7.1** · `gif maker` 6.5 · `mp4 to gif` 3.0 · `compress video` 2.4 · `webp to jpg` 1.8 · `upscale image` 1.4. 자동완성: "video to gif" 23개(converter·high quality가 Google·Bing·YouTube 3곳, free·discord·iphone), "compress video" 32개. 측정 차별점(도구별 화질·크기 차이가 큼)이 분명해 `video to gif` 선택, `compress video`는 후보로 남김
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Google Trends 미국 급상승 10개: 야구·연예 → IT 주제 없음. 공식 피드 새 항목(Gmail Live 유료 Workspace, SynthID TIME 선정, Google 검색 AI 모드 변경) → 새 글 대상 아님
- 적용한 노하우: 검색형 제목 51자·설명 159자, 측정 규모 제목 표기, 이미지 6장(대표 그래프 1200×675 + 하늘·얼굴·화면 글자 확대 비교 3장 + 폭·fps 크기 + 속도·메모리), 요약 표 + 전체 결과 표 → 사실 확인표에 기록. 앱 화면 스크린샷 없음(세 도구 모두 명령줄)
- 내부 링크: 새 글 → PDF 압축·HEIC→JPG·배경 제거·허브 (4개). `convert-heic-to-jpg-free` 마지막 문단에서 새 글로 역링크 1개 (V 기록 대상 아님). V1·V2 대상 글은 변경하지 않음
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 9개, og:image 생성, 본문 이미지 6장 모두 width·height 지정

**측정값 (Xeon 2.8GHz 4코어, RAM 16GB, GPU 없음, 같은 PNG 프레임 입력, 3회 중앙값)**

| 설정                  | 3개 GIF 합계 | 평균 SSIM | 재생 시간 | 3개 변환 시간 | 최대 RAM |
| --------------------- | ------------ | --------- | --------- | ------------- | -------- |
| FFmpeg 기본           | 13.8MB       | **0.482** | 5.0초     | 0.8초         | 44MB     |
| FFmpeg + 팔레트       | 10.5MB       | 0.962     | 5.0초     | 5.8초         | 120MB    |
| FFmpeg small 팔레트   | 8.9MB        | 0.970     | 5.0초     | 2.0초         | 121MB    |
| gifski 기본(Q90)      | **6.5MB**    | 0.948     | 5.0초     | 7.2초         | 57MB     |
| gifski Q70            | 4.1MB        | 0.897     | 5.0초     | 5.6초         | 57MB     |
| ImageMagick 기본      | 12.5MB       | 0.972     | **4.5초** | 41.2초        | 744MB    |
| ImageMagick Optimize  | 9.6MB        | 0.958     | **4.5초** | 59.2초        | 451MB    |

- 폭 480→320px: 52~54% 감소, 15→10fps: 26~27% 감소 (실사 클립, FFmpeg small·gifski 모두)

**알게 된 것**

- SSIM은 띠(banding)를 거의 벌하지 않고 디더링 입자를 벌함 → gifski가 SSIM은 낮아도 하늘 그라데이션은 가장 원본에 가까워 보였고, SSIM이 높은 FFmpeg small·ImageMagick은 띠가 보임. 화질 측정 글은 점수 + 같은 영역 확대 비교를 함께 실어야 결론이 틀리지 않음
- 측정 함정: 처음엔 GIF와 원본을 ffmpeg 타임스탬프로 맞춰 비교 → GIF 지연값 반올림(70/60ms) 때문에 프레임이 어긋나 SSIM이 0.5~0.9로 왜곡. GIF를 `-fps_mode passthrough`로 프레임별로 풀어 1:1 비교로 바꿈. 새 비교 방식은 프레임 수(75=75)부터 확인
- ImageMagick `-delay 1x15`는 60ms로 저장돼 10% 빨리 재생 (100으로 나누어떨어지지 않는 fps의 함정). 크기·화질만 보면 놓치는 차이 → GIF·영상 주제는 재생 시간도 측정 항목에 넣음
- 컨테이너: `/usr/bin/time` 없음 → `os.wait4`의 `ru_maxrss`로 최대 메모리 측정. Pillow도 기본 python에 없어 venv 사용. download.blender.org(Blender 오픈 무비, CC BY 3.0)·BtbN FFmpeg 빌드(`releases/download/latest/…`)·crates.io API·formulae.brew.sh API 접속 가능
- Xvfb + Chromium 키오스크 + `ffmpeg -f x11grab`(libx264rgb `-qp 0`)로 저작권 문제 없는 무손실 화면 녹화 클립을 직접 만들 수 있음 (Chromium 시작에 약 3~4초 걸리므로 페이지 동작을 지연 시작)

**다음 할 일**

- 사용자: `remove-background-from-image-free-offline`이 발행 6일째 크롤링 전(`Discovered - currently not indexed`). Search Console URL 검사 → **색인 생성 요청** 1회 권장 (API로는 요청 불가)
- Claude: 새 글 노출 검색어 확인 (`video to gif`, `video to gif high quality` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 허브 후보 `Best Free Offline File Converters` — `software` 측정 글 4편(PDF→Word·HEIC→JPG·PDF 압축·영상→GIF). V2 판정(11-12) 후 기존 허브와 역할 정리해 결정
- Claude: 발행 13편 / AdSense 신청 기준 20편
- 대시보드: `stats` DB 7개 문서 갱신(버전 9·6). 정기 세션 규칙에 따라 `data.js` 재게시는 건너뜀

## 2026-10-16 · 세션 10 (정기 실행 9회차): PDF 오프라인 압축

세션 시각: 2026-10-16 01:25 UTC (한국 10:25). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-18 ~ 10-16, 세션 9 이후 바뀐 값만)**

- 노출 58 → **60**, 클릭 3, CTR 5.0%, 평균 순위 20.6. `turn-off-ai-in-chrome` 노출 37 (순위 10.7), 홈 노출 2, `/about` 첫 노출 1 (3위)
- sitemap 마지막 다운로드 10-15 03:42 UTC (변화 없음). URL 검사: `convert-heic-to-jpg-free`(10-16 발행)·`convert-pdf-to-word-offline-free` `URL is unknown`, `remove-background-from-image-free-offline` `Discovered - currently not indexed` 유지 → 11편 중 8편 색인
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                        | 카테고리   | 유형                           | 직접 검증                                                                                                   |
| --------------------------- | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `compress-pdf-offline-free` | `software` | 비교 + How-to (측정형, 검색형) | 직접 만든 PDF 4개(46쪽, 48.1MB: 사진 안내서·스캔·스크린샷 슬라이드·텍스트 보고서)를 Ghostscript 10.08.0(소스 빌드)·OCRmyPDF 17.13.0·qpdf 12.4.2의 설정 10개로 압축, 크기·쪽별 SSIM·OCR 판독률·링크·텍스트 층·시간·메모리 측정 |

- 선정 근거: Trends(미국 3개월, 기준 `remove background` 34.9): `mp4 to mp3` 8.7 · `compress pdf` **4.8** · `compress video` 2.4 · `reduce pdf size` 1.9. 자동완성: "compress pdf" 31개(free·on mac·without losing quality·to 1mb), "compress pdf offline" 12개(windows 10/11·free download·mac). PDF→Word 글과 같은 PDF 주제군, 업로드 없는 측정으로 차별화. `mp4 to mp3`는 도구 간 차이(같은 인코더)가 작아 측정 글 차별점이 약해 보류
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Google Trends 미국 급상승 10개: 스포츠·연예·정치 → IT 주제 없음. 공식 피드 새 항목(Edge 업데이트 방식, Gmail AI Inbox 유료 Workspace, Circle to Search 문자 사기 확인) → 직접 검증 불가·유료 대상이라 새 글로 쓰지 않음
- 적용한 노하우: 검색형 제목 48자·설명 152자, 측정 규모 제목 표기, 이미지 6장(대표 그래프 1200×675 + 판독률·속도 그래프 + 사진·스캔·슬라이드 확대 비교 3장), 요약 표 + 전체 결과 표 → 사실 확인표에 기록. 앱 화면 스크린샷은 없음(세 도구 모두 명령줄)
- 내부 링크: 새 글 → OCR·PDF→Word·HEIC→JPG·허브 (4개). `convert-pdf-to-word-offline-free`에서 새 글로 역링크 1개 (V 기록 대상 아님). 허브는 V2 판정 전이라 변경하지 않음
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 9개, og:image 생성, 본문 이미지 6장 모두 width·height 지정

**측정값 (Xeon 2.1GHz 4코어, RAM 16GB, GPU 없음, 3회 중앙값)**

| 설정                 | 사진 39.6MB | 스캔 7.1MB | 슬라이드 1.4MB | 텍스트 86KB | 합계      | 최저 쪽 SSIM | 스캔/슬라이드 OCR |
| -------------------- | ----------- | ---------- | -------------- | ----------- | --------- | ------------ | ----------------- |
| qpdf (무손실)        | 100%        | 100%       | 88%            | 87%         | 99.6%     | 1.000        | 100% / 100%       |
| OCRmyPDF -O3         | 14%         | 33%        | 29%            | 89%         | **17%**   | 0.988        | 100% / 100%       |
| Ghostscript /ebook   | 4%          | 19%        | 115%           | 133%        | 10%       | 0.798        | 100% / 100%       |
| Ghostscript /screen  | 1%          | 7%         | 76%            | 133%        | 4.5%      | 0.853        | **79% / 76%**     |

- 사진 안내서 시간·메모리: qpdf 0.08초·27MB, OCRmyPDF -O3 2.0초·817MB, GS /ebook 4.0초·86MB. 모든 설정에서 링크 28개·텍스트 층 유지

**알게 된 것**

- Ghostscript는 파일 전체를 다시 쓰므로 큰 이미지가 없는 PDF(텍스트·PNG 스크린샷)는 모든 프리셋에서 오히려 커짐(+15~40%). "압축 도구 = 항상 작아짐"이 아니라는 점이 측정으로 드러난 차별점
- 테스트 파일 생성 함정: ReportLab 기본값(`useA85=1`)이 이미지를 ASCII85로 한 번 더 감싸 OCRmyPDF가 최적화를 건너뜀("multiple compression filters") → 실제 앱 PDF와 다른 입력이 결론을 바꿀 뻔함. 생성한 입력 파일의 필터·인코딩을 `pdfimages -list`로 먼저 확인
- 최신판 확보: Ghostscript는 Linux 바이너리를 더 배포하지 않고(GitHub `ghostpdl-downloads` 바이너리 404), Ubuntu 최신 deb는 glibc 2.43 필요 → 공식 소스 tar.gz(`releases/download/gs10080/ghostscript-10.08.0.tar.gz`)를 4코어에서 약 10분에 빌드. qpdf는 공식 `qpdf-12.4.2-bin-linux-x86_64.zip` 바로 사용 가능. 태그 이름을 알면 github.com Releases 다운로드 가능
- 컨테이너 CPU가 세션마다 다를 수 있음(이번 2.1GHz, 이전 2.8GHz) → 측정 글마다 `lscpu`로 다시 확인해 적음
- OCRmyPDF -O2/-O3는 pngquant로 PNG를 16색으로 줄여 스크린샷 PDF를 크게 줄임. Windows 설치 가이드에서 pngquant는 선택 사항이라 결과가 환경마다 다를 수 있음

**다음 할 일**

- 사용자: `remove-background-from-image-free-offline`이 발행 6일째 크롤링 전(`Discovered - currently not indexed`). Search Console URL 검사 → **색인 생성 요청** 1회 권장 (API로는 요청 불가)
- Claude: 새 글 노출 검색어 확인 (`compress pdf offline`, `compress pdf without losing quality` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 허브 `free-offline-ai-tools`는 V2 판정(11-12) 후 PDF·이미지 변환 측정 글(PDF→Word·HEIC→JPG·PDF 압축) 연결 검토 (현재 `software` 측정 글 3편 → 별도 허브 `Best Free Offline File Converters` 후보)
- Claude: 발행 12편 / AdSense 신청 기준 20편
- 대시보드: `stats` DB 7개 문서 갱신(버전 8·5). 정기 세션 규칙에 따라 `data.js` 재게시는 건너뜀

## 2026-10-16 · 세션 9 (정기 실행 8회차): HEIC→JPG 오프라인 변환

세션 시각: 2026-10-15 21:11 UTC (한국 10-16 06:11). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-17 ~ 10-15, 세션 8 이후 바뀐 값만)**

- 클릭 1 → **3**, 노출 39 → **58**, CTR 5.2%, 평균 순위 21.2
  - `turn-off-ai-in-chrome` **클릭 2**·노출 36 (순위 10.8, 세션 8의 5.4보다 낮은 순위 노출이 늘어 평균 하락) / `transcribe-audio-offline-free` 12 (26.3) / `check-if-image-is-ai-generated` 8 (64.2) / `gemini-gems-to-skills` 첫 노출 1 (7.0) / 홈 1클릭
  - 새 검색어: `offline transcription software` 2 (79위), `synthid checker` 1 (86위), `turn off ai` 2 (57.5위)
- sitemap 마지막 다운로드 10-15 03:42 UTC (변화 없음). URL 검사: `convert-pdf-to-word-offline-free`(10-15 발행) `URL is unknown`, `remove-background-from-image-free-offline` `Discovered - currently not indexed` 유지 (발행 5일째) → 10편 중 8편 색인
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                       | 카테고리   | 유형                       | 직접 검증                                                                                                   |
| -------------------------- | ---------- | -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `convert-heic-to-jpg-free` | `software` | 비교 + How-to (측정형, 검색형) | 직접 만든 HEIC 24장(CC0 사진 → 4032×3024 Display P3, GPS·날짜, 세로 4장은 irot+EXIF 회전)을 XnConvert 1.118·ImageMagick 7.1.2·GIMP 3.2.6으로 변환, 원본 대비 ΔE2000·메타데이터·회전·속도 측정 + 설정 변경 후 재측정 |

- 선정 근거: 백로그 34. Trends(미국 3개월, 기준 `remove background` 35.7): `heic to jpg` **8.8** · `png to jpg` 4.0 · `compress video` 2.5 · `webp to jpg` 1.9. 자동완성: "heic to jpg" 34개(converter·windows·bulk·free·offline), "convert heic to jpg" 25개(windows 11·on mac·on iphone)
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Google Trends 미국 급상승 10개: 스포츠·화재·"varonis"(주식) → IT 도구 주제 없음. 공식 피드 새 항목: Windows 11 새 Photos 앱(Insider, HEIC 편집 포함)·Windows 11 기능 업데이트 글(10-15) → 직접 검증 불가라 새 글로 쓰지 않고 HEIC 글에 Photos 앱 소식 1문장으로 반영
- 적용한 노하우: 검색형 제목 53자·설명 155자, 측정 규모 제목 표기, 이미지 5장(대표 그래프 1200×675 + 설정 후 색·메모리 그래프 + 같은 사진 색 비교 + **직접 캡처한 앱 설정 화면 2장**(XnConvert·GIMP, Xvfb)), 요약 표 → 사실 확인표에 기록
- 내부 링크: 새 글 → 허브·배경 제거·OCR·PDF→Word·AI 이미지 판별 (5개). `convert-pdf-to-word-offline-free`에서 새 글로 역링크 1개 (V 기록 대상 아님). V1·V2 대상 글은 판정 전이라 변경하지 않음
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 10개, og:image 생성, 본문 이미지 5장 모두 width·height 지정

**측정값 (Xeon 2.8GHz 4코어, RAM 16GB, GPU 없음, 24장 일괄 × 3회 중앙값)**

| 도구 (기본 설정)  | 색 차이 ΔE2000 (중앙값) | 색 프로필 | GPS·날짜 | 세로 회전 | 24장 시간 | 최대 RAM | 평균 크기 |
| ----------------- | ----------------------- | --------- | -------- | --------- | --------- | -------- | --------- |
| XnConvert 1.118   | 1.63                    | 0/24      | 24/24    | 4/4       | **33초**  | 255MB    | 2.03MB    |
| ImageMagick 7.1.2 | **0.61**                | 24/24     | 24/24    | 4/4       | 55초      | 244MB    | 2.85MB    |
| GIMP 3.2.6        | 1.60                    | 0/24      | **0/24** | 4/4       | 67초      | 448MB    | 2.50MB    |

- 설정 변경 후: XnConvert **Preserve color profile** 켬 → ΔE 0.67, GIMP **Save Exif·Save color profile** 켬 → ΔE 0.63·GPS 24/24. XnConvert Preserve Metadata 끔 + 색 프로필 켬 → GPS·날짜 0/24, ΔE 0.67 (공유 전 위치 제거 방법)

**알게 된 것**

- 색 프로필을 버리는 변환기는 겉보기엔 정상이라 단어·해상도 비교로는 안 드러남 → 원본 대비 ΔE와 같은 사진 비교 이미지로 차이를 보여 줌. 기본 설정이 결론을 가르는 주제(메타데이터·색)는 "기본값 vs 설정 변경"을 둘 다 측정해야 함
- GUI 앱도 측정 가능: Xvfb + xdotool로 XnConvert(Qt) 창을 열어 클릭·스크린샷. 부족한 라이브러리(`libxcb-cursor0`, `libxcb-icccm4`, `libxcb-keysyms1`)는 apt로 설치. GIMP 3.2.6 AppImage는 `gimp-console --batch-interpreter python-fu-eval`로 배치 가능. 창 관리자가 없어 키 입력이 캔버스로 가는 경우가 있음 → 입력 전 `xdotool windowfocus`, 결과를 GUI 결과와 대조
- `pkill -f`/`pgrep -f` 패턴이 내 셸 명령 문자열과도 맞아 셸이 종료됨 (exit 144) → 프로세스 이름(`pgrep -x`)이나 PID로 종료
- Wikimedia Commons API·upload.wikimedia.org는 컨테이너에서 429(Too Many Requests) → 퍼블릭 도메인 사진은 Hugging Face `Spawning/PD12M` 메타데이터(parquet) + `pd12m.s3.us-west-2.amazonaws.com` 사본으로 받음. download.gimp.org·xnview.com·imagemagick.org(→ GitHub Releases 고정 태그)·apps.microsoft.com 접속 가능
- 실수: Wikimedia 다운로드 재시도 중 요청 User-Agent에 계정 이메일을 1회 넣음 (요청은 429로 거부). 외부 요청 헤더에 개인 정보를 넣지 않도록 함
- 1차 출처가 없는 일반 상식(“iPhone은 Display P3로 저장”, “ΔE 1 이하는 안 보임”)은 글에 쓰지 않고 측정 조건으로만 표현

**다음 할 일**

- 사용자: `remove-background-from-image-free-offline`이 발행 5일째 크롤링 전(`Discovered - currently not indexed`). Search Console URL 검사 → **색인 생성 요청** 1회 권장 (API로는 요청 불가, 세션 8에서도 요청)
- Claude: 새 글 노출 검색어 확인 (`heic to jpg`, `convert heic to jpg free` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`, 클릭 2회로 가장 성과 있는 글)
- Claude: 발행 11편 / AdSense 신청 기준 20편
- 대시보드: `stats` DB 7개 문서는 갱신됨(버전 7·4). 비로그인 열람용 `data.js` 스냅숏 재게시는 세션 8에 이어 이번에도 Claude Code 자동 모드 권한 분류기가 거부("Live-Shared Artifact Sensitive Delta") → 비로그인 화면은 세션 7 값. → **사용자 결정(2026-10-16)**: 정기 세션에서는 `data.js`를 자동으로 올리지 않음. 공개 링크 아티팩트는 `Artifact` 허용 규칙이 있어도 정기 실행에서 재게시할 수 없음(문서: 정기 실행의 무확인 재게시는 공개 링크가 아닌 아티팩트만 가능). README 대시보드 절차 4단계를 대화형 세션 전용으로 바꿈

## 2026-10-15 · 세션 8 (정기 실행 7회차): PDF→Word 오프라인 변환

세션 시각: 2026-10-15 09:10 UTC (한국 18:10). 열린 PR 없음.

**지표 (`gsc_report.py`, 2026-09-17 ~ 10-15, 세션 7 이후 바뀐 값만)**

- 노출 33 → **39**, 클릭 1(홈), CTR 2.6%, 평균 순위 15.4
  - `turn-off-ai-in-chrome` 21 → 25 (순위 5.4) / `transcribe-audio-offline-free` 6 → 8 (18.8) / `check-if-image-is-ai-generated` 5 (62.2)
  - 새 검색어 `speech to text offline` (85위, `transcribe-audio-offline-free`로 추정)
- sitemap 10-15 03:42 UTC 재다운로드. URL 검사: `image-to-text-offline-free` **`Submitted and indexed`** (10-15 07:14 UTC 크롤링, 발행 당일) → 9편 중 8편 색인. `remove-background-from-image-free-offline`은 `URL is unknown` → 다시 **`Discovered - currently not indexed`** (발행 후 4일째 미크롤링)
- 성과 검증: 판단 시점이 지난 행 없음 (V1 11-11, V2 11-12) → 판정·노하우 상태·writing-guide 변경 없음

**발행한 글**

| slug                               | 카테고리   | 유형                  | 직접 검증                                                                                                   |
| ---------------------------------- | ---------- | --------------------- | ----------------------------------------------------------------------------------------------------------- |
| `convert-pdf-to-word-offline-free` | `software` | 비교 (측정형, 검색형) | 직접 만든 PDF 11개(텍스트 10개 15쪽 + 스캔 1개)를 LibreOffice 26.8.1·pdf2docx 0.5.13·Calibre 7.6으로 변환, 정답과 비교 + 편집 테스트 + OCRmyPDF 후 재변환 |

- 선정 근거: Trends(미국 3개월, 기준 `remove background` 35.3): `pdf to word` **23.4** · `passkey` 16.6 · `heic to jpg` 8.6 · `compress pdf` 4.9 · `upscale image` 1.3 · `photo enhancer` 1.4. 자동완성: "pdf to word offline" 16개(Google·Bing·YouTube: converter·free download·for pc), "convert pdf to word free" 29개(no sign up·ocr·editable). 상위 결과가 업로드형 온라인 변환기 → "업로드 없이"·직접 측정으로 차별화
- 반복 일정: Chrome 156은 10-20, Windows 11-10 → 해당 없음. Google Trends 미국 급상승 10개: 연예·스포츠·복권·"fortnite servers"(게임 서버 장애) → IT 도구 주제 없음. 공식 피드 새 항목(Chrome 조기 안정판 업데이트, Gemini 4 Argon 안전성 글) → 새 글 대상 아님
- 적용한 노하우: 검색형 제목 53자·설명 156자, 측정 규모 제목 표기, 이미지 5장(대표 그래프 1200×675 + 송장 표 비교 + 편집 테스트 + 2단 뉴스레터 비교 + 속도·메모리), 요약 표 → 사실 확인표에 기록. **첫 `software` 카테고리 측정 글**
- 내부 링크: 새 글 → OCR 글·허브·받아쓰기·배경 제거 (4개). `image-to-text-offline-free`에서 새 글로 역링크 1개 (V 기록 대상 아님). 허브는 V2 판정 전이라 변경하지 않음
- 빌드 HTML 확인: title·description·BlogPosting/BreadcrumbList JSON-LD 정상, h1 1개·h2 9개, og:image 생성, 본문 이미지 5장 모두 width·height 지정

**측정값 (Xeon 2.8GHz 4코어, RAM 16GB, GPU 없음, 기본 설정, 파일당 1회 실행 × 3회 중앙값)**

| 도구             | 문단 유지 | 격자 표 재구성(/4) | 텍스트 상자 비율 | 2단 순서 유지 | 초/파일 | 최대 RAM |
| ---------------- | --------- | ------------------ | ---------------- | ------------- | ------- | -------- |
| pdf2docx 0.5.13  | **95.5%** | **4**              | 0%               | 10/10         | 0.68    | 125MB    |
| LibreOffice 26.8 | 0%        | 0                  | 100%             | 2/10          | 0.71    | 202MB    |
| Calibre 7.6      | 84%       | 0                  | 0%               | 2/10          | 0.94    | 100MB    |

- 3개 모두 텍스트 PDF의 단어 100%·이미지 3/3 유지, 스캔 PDF는 0%. OCRmyPDF 17.13(3.1초) 후 재변환: LibreOffice 95.5%, pdf2docx·Calibre 0% (보이지 않는 OCR 텍스트 층을 무시)

**알게 된 것**

- LibreOffice는 `--convert-to docx`만 쓰면 PDF를 Draw로 열어 "no export filter" 오류 (24.2·26.8 모두). `--infilter=writer_pdf_import` 필요. 결과는 한 줄마다 텍스트 상자라 겉모양은 가장 비슷하지만 문장을 넣으면 상자 밖으로 잘림
- 렌더링 함정: `dpkg -x`로 푼 LibreOffice 26.8은 시스템 글꼴 대체 설정을 못 써 Helvetica를 Noto Serif로 그려 글자가 잘려 보였음 → 결과 화면은 시스템 LibreOffice 24.2(Liberation Sans)로 다시 렌더링. 처음 화면만 보고 "LibreOffice가 글자를 자른다"고 쓸 뻔함 → 렌더링 환경의 글꼴(`pdffonts`)부터 확인
- download.documentfoundation.org(LibreOffice deb 220MB)·archive.ubuntu.com(calibre·tesseract) 접속 가능. download.calibre-ebook.com·code.calibre-ebook.com은 curl TLS 오류(exit 60) → apt calibre 7.6.0 사용
- 정답을 아는 문서를 직접 만들면 "단어 보존"은 세 도구 모두 100%라 변별력이 없음 → 편집 가능성(문단·표·텍스트 상자) 지표가 결론을 가름

**다음 할 일**

- 사용자: `remove-background-from-image-free-offline`이 발행 4일째 크롤링 전(`Discovered`↔`URL is unknown` 반복). Search Console URL 검사 → **색인 생성 요청** 1회 권장 (API로는 요청 불가)
- Claude: 새 글 노출 검색어 확인 (`pdf to word offline`, `convert pdf to word free` 등), 검증 기록 V1(11-11)·V2(11-12) 판정
- Claude: Chrome 156(10-20) 반영 여부 검토 (`turn-off-ai-in-chrome`)
- Claude: 발행 10편 / AdSense 신청 기준 20편
- 대시보드: `stats` DB 7개 문서는 갱신됨(버전 6·3). 비로그인 열람용 `data.js` 스냅숏 재게시는 Claude Code 자동 모드 권한 분류기가 거부 → 비로그인 화면은 세션 7 값. 다음 세션에서 다시 시도, 계속 막히면 사용자가 허용 여부 결정

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
