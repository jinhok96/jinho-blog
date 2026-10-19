# pdf-to-word-free 사실 확인표

- 주 검색어: `pdf to word free` (+ `pdf to word`). Trends 미국 3개월 `pdf to word` 23.4 (기준 `remove background` 35.3, 2026-10-15 세션 기록 재사용)
- 하위 검색어 (2026-10-20 `demand_check.py suggest "pdf to word free"` 32개): pdf to word free converter (Google·Bing·YouTube), free download, no account, no sign up, free ocr, free online, reddit, ilovepdf·i love pdf·smallpdf·adobe (Bing), editable
- 채널: **검색형** (상시 수요, 비교·측정). 제목 52자, 설명 153자
- 차별점: 정답을 아는 PDF 11개로 GUI 앱 2개 + 웹 서비스 1개를 직접 측정(편집 가능한 문단·실제 Word 표·텍스트 상자·OCR), 편집 테스트(문장 추가 후 재배치), 기본값 함정(LibreOffice는 PDF를 Draw로 열어 Word 저장 불가, Writer 필터 선택 필요), 무료판 제한 화면(Sejda 작업당 1파일·하루 3회, iLovePDF OCR Premium 표시)
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 표기 `(3 Tools Tested)`(노하우 2), 이미지 11장(노하우 7: 대표 점검표 1200×675 + 송장 표 비교 + 편집 테스트 + LibreOffice 화면 3 + Sejda 화면 3 + iLovePDF 화면 2), 요약 표·결과 표, 내부 링크 5개(OCR·PDF→JPG·JPG→PDF·나누기·합치기) + `pdf-to-jpg-free`에서 역링크. 카테고리 `software`
- 이전 명령줄 글 `convert-pdf-to-word-offline-free`(2026-10-17 삭제)의 테스트 PDF 생성기(`../convert-pdf-to-word-offline-free/gen.py`)·지표를 재사용 → 결과를 이전 글과 같은 기준으로 비교 가능
- 측정 환경: Ubuntu 24.04 컨테이너, Intel Xeon 2.10GHz, Xvfb 1600×1000 + xdotool로 앱 화면 조작, iLovePDF는 Playwright Chromium(로그인 안 함), 2026-10-19~20 KST (`env.txt`)

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 테스트 PDF 11개(텍스트 10개 + 스캔 1개), 정답 텍스트·표·이미지 수 | `../convert-pdf-to-word-offline-free/gen.py` → `truth.json` (Gutenberg 3권 cache/epub 다시 받음, seed 고정) |
| LibreOffice 26.8.1: Writer에서 PDF를 그냥 열면 Draw로 열림, Draw 저장 형식은 ODF Drawing 계열 3개뿐(Word 없음) | GUI 캡처 `libreoffice-pdf-opens-in-draw.webp`, Save As 형식 목록 확인 |
| Writer 열기 창 파일 형식 목록에 "PDF - Portable Document Format (Writer)" (Word·Mac 형식 뒤, Calc 형식 앞), 저장 형식 "Word 2010–365 Document (.docx)", 확인 버튼 "Use Word 2010–365 Document Format" | GUI 캡처 |
| Writer로 연 편지 상태 표시줄 "0 words, 0 characters" | `libreoffice-writer-zero-words.webp` |
| GUI 변환 결과와 같은 필터 일괄 변환 결과 텍스트 동일 | `convert_libreoffice.sh` 주석 (md5) |
| LibreOffice: 문단 0%, 텍스트 상자 100%, 표 0/5, 단어 100%, 순서 92%(뉴스레터 20%), 쪽 수 원본과 같음, 그림 3/3 | `summary.json` `libreoffice.overall_text`, 렌더링 `pdfinfo` |
| Sejda Desktop 7.9.10 무료: "Free users are limited to a single file per task", 4번째 작업에 "You reached your free limit of 3 tasks per day" + 23:55:12 카운트다운 | GUI 캡처 `sejda-free-daily-limit.webp` |
| Sejda 화면 문구 "Files are processed locally. Free service for documents up to 200 pages or 50 MB and 3 tasks per day." | GUI 캡처 |
| Sejda 스캔 PDF: "Scanned documents are not supported" | `sejda-scanned-not-supported.webp` |
| Sejda (03·05·09): 문단 100%, 표 0/2(행이 공백 구분 텍스트 줄), 2쪽 문서 2개가 1쪽으로, 본문 9pt(w:sz 18, 원본 11pt), 제목 스타일 없음(pStyle 0) | `summary.json`, document.xml 검사, 렌더링 |
| iLovePDF 웹: 옵션 No OCR(기본)·OCR "Premium" 표시, 버튼 Convert to WORD·Download WORD | 캡처 `ilovepdf-ocr-premium-option.webp` |
| iLovePDF: 문단 82%, 표 4/5(이력서 테두리 없는 표 실패), 단어 99.96%, 2단 구역(w:cols num=2), Heading1·Heading2 스타일, 글머리표 목록 numPr 3개, 쪽 수 원본과 같음, 그림 3/3. 편지 문단 1개가 PDF 줄바꿈 위치에서 둘로 나뉨 | `summary.json`, document.xml 검사 |
| iLovePDF 스캔 PDF: "You are trying to convert a scanned PDF … Do you want to apply OCR?" → Continue without OCR = 그림(단어 0%), Apply OCR(로그인 안 함) = 단어 99.7% | `ilove_scan.py`, `summary.json` `11-scanned-ocr` |
| 편집 테스트(05-newsletter 첫 문단에 문장 추가): LibreOffice는 "(This" 한 단어만 보이고 나머지 그대로, Sejda·iLovePDF는 문단 재배치 | `edit_test.py` → `pdf-to-word-editing-test.webp` |
| 화면 비교는 Microsoft Word가 아니라 LibreOffice Writer 24.2로 렌더링 | 글 How we tested에 명시 |

## 문서 (2026-10-20 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| iLovePDF 무료: PDF to Word 작업당 1파일, 15MB, OCR은 Premium. Premium $9/월, $60/년 | https://www.ilovepdf.com/pricing (WebFetch) |
| iLovePDF 파일 최대 2시간 보관 후 삭제, 직접 삭제 가능 | https://www.ilovepdf.com/help/faq (WebFetch) |
| Sejda Desktop 무료 하루 3작업, 50MB·200쪽, 변환은 한 번에 1파일, Desktop+Web 연간 $63, 파일은 컴퓨터에서 처리(업로드 안 함), Windows·macOS·Linux | https://www.sejda.com/desktop (WebFetch). Week Pass 가격은 페이지 표기가 "$795"로 깨져 있어 글에 쓰지 않음 |
| LibreOffice 최신 26.8.1, Windows·macOS | https://www.libreoffice.org/download/download-libreoffice/ (curl) |
| Word: File > Open → 복사본 변환, "works best with files that are mostly text", 차트·그래픽 위주 페이지는 그림으로 들어올 수 있음, Microsoft 365·2024·2021·2019·2016 | https://support.microsoft.com/en-us/office/opening-pdfs-in-word-1d1d2acc-afa0-46ef-891d-b76bcd83d9c8 (curl) |
| Google Docs: Drive 우클릭 > Open with > Google Docs, 2MB 이하, "Lists, tables, columns, footnotes, and endnotes are not likely to be detected" | https://support.google.com/drive/answer/176692?hl=en (curl) |

## 쓰지 않은 것

- ONLYOFFICE Desktop Editors 10.0.0 (flatpak): `Gtk-ERROR: Can't create a GtkStyleContext without a display connection`으로 실행 실패(DISPLAY·XAUTHORITY·--no-sandbox·Xvfb -ac 모두 시도, `onlyoffice_launch_failed.sh`) → "Other tools"에 측정 못 함으로만
- Adobe Acrobat online: curl 403
- Google Docs → Word 다운로드 메뉴 경로: Google 공식 문서에서 확인하지 못해 "save as a Word file"로만 씀
- Sejda 변환 시간: 첫 시도에서 출력 폴더 대화상자 처리 실수로 측정값이 무효 → 속도는 글에 쓰지 않음
- Sejda는 하루 3회 제한으로 01·02·04·06·07·08·10을 변환하지 못함 → 결과 표에 "3 files" 명시
