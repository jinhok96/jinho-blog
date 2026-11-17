# convert-publisher-file-to-pdf 사실 확인표
- 검증 유형 (가설 H3): **검증형** — 같은 Publisher 파일 2개를 LibreOffice Draw 화면에서 열어 PDF로 내보내고 온라인 변환기 4곳에 직접 올려 받은 PDF를 정답 텍스트와 비교함
- 주 검색어 (가설 H6): `convert publisher file to pdf` — 브리프 주 검색어

## 작성 전 브리프 (2026-11-18 KST 세션 100, 일반 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `windows-microsoft` 상시 글 (허브 `microsoft-end-of-support-dates` Publisher 절의 후속, backlog 클러스터 공백 후보 'Publisher 없이 .pub 열기·PDF 변환') |
| 주 검색어 | `convert publisher file to pdf` — `demand_check.py suggest` 2026-11-17: Google·Bing·YouTube 3곳 (같은 묶음 14개). `open pub file without publisher`는 Google·Bing 10개라 하위로 |
| 하위 검색어 | `open pub file without publisher`(Google·Bing), `convert publisher file to pdf free`·`online free`(Google·Bing), `open publisher file in word`(Google·Bing), `open publisher file on mac`(Google·Bing), `open publisher file in libreoffice`(Google), `open publisher files in affinity`(Google), `pub file to pdf converter`(Google) |
| 검색 의도 | 정보형 How-to + 비교 (어느 무료 방법이 레이아웃을 지키나) |
| 채널 | 검색형 |
| 상위 결과 (WebSearch 2026-11-17) | `convert publisher file to pdf`: helpdeskgeek(작은 블로그, Publisher 메뉴 경로), wps.com(자사 앱 홍보), convertapi(개발자 API), Illinois State 대학 IT 지식 베이스, Aspose 제품 페이지, Zamzar 도구 페이지, Wondershare(자사 앱 홍보). `open pub file without publisher`: chron·techwalla(오래된 How-to), office-watch(뉴스 블로그), krumzi·PubHarbor(도구 홍보). → 공통: Publisher 메뉴 경로, 온라인 변환기 목록, LibreOffice 이름만. **빠진 것: 같은 파일을 여러 도구로 바꿔 결과를 비교한 곳이 없음, 변환기가 실제로 무엇으로 바꾸는지(Publisher인지 LibreOffice인지), 여러 단 신문형 문서에서 글이 반복되는 문제** |
| 차별점 | ① 같은 .pub 2개(브로슈어 2쪽·뉴스레터 4쪽)를 5가지 경로로 바꿔 정답 텍스트(.pub 안 글자) 대비 반복 단어·겹친 글자를 잼 ② PDF 속성의 제작 프로그램으로 변환 엔진 확인: Zamzar = Microsoft Publisher 2010, CloudConvert = LibreOffice 26.8.0, FreeConvert = LibreOffice 26.2.5 ③ LibreOffice 계열은 판(24.2·26.2·26.8)과 글꼴 유무와 관계없이 연결된 단마다 같은 기사를 처음부터 반복 ④ Aspose 무료 앱은 두 파일 모두 서버 오류 |
| 내부 링크 계획 | 나가는 링크: 허브 `microsoft-end-of-support-dates`, `office-2021-end-of-support`(Publisher 2021 지원 종료 같은 날), `pdf-to-word-free`(PDF를 다시 편집할 때), `compress-pdf-free`(큰 PDF), `microsoft-365-family-storage-2tb`. 받는 링크: **색인된** `microsoft-365-family-storage-2tb` 끝 문단에 1문장, 허브 Publisher 절에 1문장, `office-2021-end-of-support` 대체 앱 절에 1문장 |
| 개요 | 첫 문단(결론: Publisher 있으면 내보내기, 없으면 Zamzar 무료 3MB가 Publisher로 변환, LibreOffice는 한 쪽짜리는 괜찮고 여러 단 신문형은 글 반복) → 요약 표 → 결과 그림 → Publisher가 아직 열리면 → 없을 때 Zamzar → LibreOffice Draw(무료, 오프라인) → LibreOffice 결과에서 생기는 일(반복·글꼴) → 다른 온라인 변환기(CloudConvert·FreeConvert·Aspose) → Word·Mac·Affinity → 상황별 추천 → How we tested → FAQ |
| 이미지 | 대표: 접힌 브로슈어·소식지 묶음 → 점선 화살표 → 깔끔한 한 장 + 리본 배지(하늘색 배경, 귤색·민트, 3/4 시점). 본문 5장: 결과 표, 반복·겹침 막대, 같은 쪽 비교(Zamzar vs LibreOffice), LibreOffice Draw Export as PDF 메뉴, Zamzar 화면 |

## 주제 선정 근거

- 우선순위 1·2 클러스터 공백 후보 재확인(2026-11-17): AI Overviews(google.com 결과 화면 직접 확인 불가)·Galaxy AI(대형 매체)·Dia·Acrobat AI·Edge/Brave 모바일·Improve Siri & Dictation(독자 앱을 컨테이너에서 실행 불가, 문서 기반)·HDR→SDR(수요 0)·VLC 소리(기존 글과 겹침) → 통과 후보 없음 (세션 98과 같음)
- `demand_check.py discover`(11-10~11-17): Google Wallet iOS 미국 출시·AI Mode 임시 대화·Gemini Tasks 등 기능 추가뿐, 종료일·시행일이 있는 영향 뉴스 없음 → 뉴스 칼럼 대신 상시 글
- backlog `windows-microsoft` 'Publisher 없이 .pub 열기·PDF 변환'(세션 99 허브 작성 중 발견): 자동완성 3곳, 직접 시험 가능(LibreOffice Draw·웹 변환기), 수명 수년(옛 .pub 파일은 계속 남음)

## 시험 파일

| 파일 | 출처·라이선스 | 내용 | SHA-256 |
| --- | --- | --- | --- |
| `samples/SampleBrochure.pub` | Apache POI 저장소 `test-data/publisher/SampleBrochure.pub` (Apache License 2.0, `source-apache-poi-license.txt`) | 가로 A4 2쪽 미술관 브로슈어, 글상자·그림 | `ffed034a…6c29c87` |
| `samples/SampleNewsletter.pub` | Apache POI `test-data/publisher/SampleNewsletter.pub` (같음) | 세로 A4 4쪽 학급 소식지, 기사 하나가 3단 연결 글상자로 이어짐 | `6a825ba2…62b644dfcf` |

- 정답 텍스트: `scripts/pub_text.py`가 .pub 안 Quill CONTENTS의 TEXT 블록을 꺼냄(Apache POI HPBF 구조) → `reference/*.txt` (브로슈어 640단어·뉴스레터 1,596단어, 채점 단위 660·1,614)
- 원래 글꼴(파일 안 이름): Arial Black, Franklin Gothic Book·Demi Cond·Heavy·Medium Cond, Rockwell Condensed, Tahoma, Times New Roman 등 — 시험 컴퓨터(LibreOffice 24.2.7)에는 없어 Inter·DejaVu 등으로 대체됨

## 측정 결과 (2026-11-17 UTC, `scripts/collect.py` → `results.json`)

| 경로 | PDF 제작 프로그램(속성) | 브로슈어: 정답 단어 / 반복 / 겹친 글자 | 뉴스레터: 정답 단어 / 반복 / 겹친 글자 | 글꼴 |
| --- | --- | --- | --- | --- |
| Zamzar | 브로슈어 `Microsoft® Publisher 2010`, 뉴스레터 `Zamzar` | 98.5% / 0% / 0% | 98.0% / 1.0% / 0% | Gill Sans MT·Franklin Gothic·Rockwell Condensed 등 원래 글꼴 |
| LibreOffice Draw 24.2.7 (화면에서 Export as PDF) | LibreOffice 24.2 | (헤드리스와 같음) | 100% / **152%** / **28.1%** | 대체 글꼴 |
| LibreOffice 24.2.7 (헤드리스, 같은 엔진) | LibreOffice 24.2 | 99.7% / 0% / 1.1% | 100% / 152% / 28.1% | 대체 글꼴 |
| CloudConvert | LibreOffice 26.8.0.3 | 99.7% / 0% / 2.1% | 100% / 152% / 29.7% | Noto Sans 등 대체 |
| FreeConvert | LibreOffice 26.2.5.1 | 99.7% / 0% / 0.5% | 100% / 152% / 19.2% | 원래 Office 글꼴(Gill Sans MT·Franklin Gothic·Rockwell) |
| Aspose PUB 앱 | - | 서버 오류 | 서버 오류 | - |

- 정답 단어 = 정답 텍스트 단어 중 PDF에서 찾은 비율(줄 끝 자동 하이픈은 다시 붙임). Zamzar가 100%가 아닌 것은 Publisher가 한 글자짜리 기호·장식 글자를 유니코드 없는 글꼴로 넣어 PDFium이 읽지 못한 것(`words_not_in_ref` g·t·v 등)
- 반복 = 정답보다 더 나온 단어 수 ÷ 정답 단어 수. LibreOffice 계열 4개가 모두 **2,460단어(152%)**로 똑같음 → 판(24.2.7·26.2.5·26.8.0)과 글꼴에 관계없이 같은 가져오기 결과
- 겹친 글자 = 다른 줄 글자 상자와 30% 이상 겹치는 글자 비율 (PDFium 글자 상자). 원래 글꼴이 있는 FreeConvert가 19%로 가장 낮아 글꼴이 겹침을 줄이지만 반복은 그대로
- 쪽 수·크기: 모든 결과 브로슈어 2쪽 11.69×8.27인치, 뉴스레터 4쪽 8.27×11.69인치(A4) — 같음
- 화면 비교(`renders/`): 뉴스레터 2쪽 'Inside Story Headline' 기사가 LibreOffice 결과에서 세 단 모두 "This story can fit 150-200 words."부터 같은 글로 시작하고 아래 기사와 겹침. 쪽 머리의 'PAGE 2'가 'PAGE #'로 나옴. 1쪽 제목(Rockwell Condensed)이 대체 글꼴로 커져 다음 줄과 겹침
- SSIM(쪽 그림, Zamzar 대비, 참고용): 브로슈어 LibreOffice 0.725·CloudConvert 0.719·FreeConvert 0.767, 뉴스레터 0.672·0.683·0.747
- 소요 시간(올리기 → 받기, 자동화 기준): Zamzar 약 59초, CloudConvert 32~34초, FreeConvert 33~35초 (본문에는 "about a minute or less")
- Aspose(2026-11-17 18:03·18:10 UTC): 두 파일 모두 'Convert' 뒤 빨간 오류 "One or more errors occurred. (Could not load file or assembly 'Aspose.PDF, Version=25.12.0.0, …'" (`shots/aspose-SampleBrochure-result.png`), 'Save result to your computer' 링크는 빈 다운로드 화면

## LibreOffice 판

- 시험: Ubuntu 24.04 패키지 LibreOffice 24.2.7.2 (libmspub 0.1.4). 최신 26.8.3 deb(`LibreOffice_26.8.3_Linux_x86-64_deb.tar.gz`, SHA-256 `e7cd3538…000dcabf`, 공식 .sha256과 일치)을 받아 풀었지만 **변환 실행이 자동 권한 검사에 두 번 거부**("Unauthorized Access" → "Undermining Oversight") → 우회하지 않고 설치된 24.2.7로 시험
- 근거 보강: 26.8.3은 libmspub 0.1.5, 24.2.7은 0.1.4 (`download.lst`, `source-libmspub-versions.txt`). 0.1.5 NEWS는 "Memory safety fixes · Minor cleanups"뿐. 실제 결과도 CloudConvert(26.8.0)·FreeConvert(26.2.5)가 24.2.7과 같은 2,460단어 반복 → 본문은 "we tested 24.2.7; the same repeat appeared in PDFs made by LibreOffice 26.2 and 26.8 at FreeConvert and CloudConvert"

## 사실 → 출처

| 주장 | 출처 | 확인 |
| --- | --- | --- |
| Publisher는 2026년 10월 수명 종료, Microsoft 365 구독자는 10-01 무렵 이후 제거 업데이트로 접근 불가, 영구판 지원은 10-13(Office 2021과 같은 날) 종료 | `source-publisher-retirement-2026-11-17.txt` | "Microsoft 365 subscribers will not be able to access Publisher on or shortly after October 1, 2026, as the removal update process rolls out." "Support for the perpetual version of Publisher will end on October 13, 2026" |
| 영구판은 지원이 끝나도 계속 설치·사용 가능, 구독자는 Publisher로 파일을 열거나 편집 못 함 | 같음 FAQ | "if you have the Perpetual version of Publisher, although support will end, you will still be able to install and use the app" |
| Microsoft 권장: PDF로 저장(File > Save as > PDF), 편집하려면 PDF → Word, 레이아웃이 바뀔 수 있음, 서드파티 변환 도구는 품질이 다르고 지원 안 함 | 같음 | "Converting a Publisher file to PDF, and then a Word file." "its layout may vary from the original PDF—particularly if the document includes many graphics" "These services vary in quality and capabilities" |
| Microsoft는 Affinity가 .pub를 가져올 수 있을지 모른다고 언급 | 같음 FAQ | "3rd party programs, such as Affinity, which may be able to import native Publisher files" |
| .pub 파일 찾기: PC·OneDrive·SharePoint에서 ".Pub" 검색 | 같음 FAQ | "A file search for “.Pub” on your PC, OneDrive, or SharePoint" |
| Publisher 내보내기 경로 File > Export > Create PDF/XPS Document > Create PDF/XPS, 옵션 4가지(Minimum Size·Standard·High Quality Printing·Commercial Press) | `source-publisher-save-as-pdf-2026-11-17.txt` | 문서 문장 |
| Affinity: Publisher 97 이후 .pub 기본 가져오기, 열면 편집 가능한 Affinity 문서로 변환 | `source-affinity-publisher-alternative-2026-11-17.txt` | "This includes files created in Publisher 97 and later. Opening a file converts it into an editable Affinity document" (시험 안 함: Windows·Mac 앱) |
| LibreOffice 최신 26.8.3 (Windows x86-64·ARM64, macOS Apple Silicon·Intel) | `source-libreoffice-download-2026-11-17.txt` | 다운로드 페이지 |
| Zamzar 무료: 파일당 최대 3MB, 변환 파일 최대 24시간 보관 | `source-zamzar-pub-to-pdf-2026-11-17.txt` | "Max. file size 3MB" "Free converted files are stored securely for a maximum of 24 hours" |
| CloudConvert 무료: 하루 10회, 파일은 늦어도 24시간 뒤 자동 삭제 | `source-cloudconvert-pricing-2026-11-17.txt`·`source-cloudconvert-privacy-2026-11-17.txt` | "10 / day" "Daily reset", "This will happen automatically at the latest after 24 hours." |
| FreeConvert: 최대 1GB, 8시간 뒤 자동 삭제 | `source-freeconvert-pub-to-pdf-2026-11-17.txt` | "Max file size 1GB." "automatically deleted after 8 hours" |
| Aspose 앱 페이지 | `source-aspose-pub-to-pdf-2026-11-17.txt` | 화면 문장, 오류는 직접 시험 |
| Microsoft 365 Current Channel 릴리스 노트에 Publisher 제거 항목 없음 (최신 Version 2610, 11-10) | `source-m365-current-channel-2026-11-17.txt` | grep 'publisher' 0건 → 본문에 제거 빌드 번호를 쓰지 않음 |

## 쓰지 않은 것

- Canva로 .pub 열기: Canva 도움말(업로드 형식)이 Cloudflare 확인 화면이라 1차 출처를 못 봄 → 본문에 Canva 주장 없음
- 여러 파일 한꺼번에 변환: Microsoft 방법은 PowerShell 스크립트(비개발자 규칙으로 제외)
- Scribus(같은 libmspub 엔진), Krumzi·PubHarbor·Univik 등 홍보성 도구, Affinity 직접 시험(Windows·Mac 전용)
- office-watch의 '11월 중순 Version 2611부터 제거' 보도: Microsoft 문서로 확인 못 함
