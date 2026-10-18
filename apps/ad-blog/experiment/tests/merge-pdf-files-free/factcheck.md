# merge-pdf-files-free 사실 확인표

- 주 검색어: `merge pdf files free` (+ `merge pdf`, `merge pdf free`, `merge pdfs into one`, `merge pdf offline`, `merge pdf files into one mac`, `merge pdf on mac`, `merge pdf free download`)
- 수요 근거 (2026-10-18, 세션 21): 자동완성 "merge pdf" 28개(Google·Bing·YouTube: files free·free·online·adobe·i love pdf·offline·mac·free download). Google Trends(미국 3개월) `merge pdf` 6.3 · `combine pdf` 6.4 · `split pdf` 6.0 · 기준 `remove background` 35.5. backlog 45번(명령줄 글 삭제 후 GUI로 새로 쓸 후보), 세션 19 다음 할 일 "PDF 글 GUI 시리즈"
- 채널: **검색형** (상시 수요, 비교 + How-to). 제목 47자(`<title>` 59자), 설명 160자
- 차별점: 결과가 "다 똑같이 합쳐짐"으로 보이는 작업에서 **결과가 갈리는 조건 2가지와 무료판 한도**를 GUI로 직접 측정. (1) PDF Arranger는 책갈피 파일이 첫 번째가 아니면 책갈피 0/4·목차 링크 0/3 (기본으로 켜진 "Preserve document information from the first file opened" 때문, 끄면 책갈피는 복구되지만 링크는 여전히 0/3), PDFsam은 같은 순서에서 4/4·3/3. (2) 같은 양식 2부를 PDFsam "Merge fields"로 합치면 23칸 중 22칸이 공유돼 첫 W-9에 입력한 글자가 두 번째에 나타남(Chrome 확인), 기본값(rename)은 46칸 독립. (3) Sejda 무료판 64쪽 합치기 거부(50쪽 한도), 성공 3회 후 4번째 거부(약 24시간 카운트다운)
- 비개발자 기준: 본문 방법은 모두 GUI 앱(PDFsam Basic·PDF Arranger·Sejda PDF Desktop)과 Mac 미리보기. 측정 보조(Python pikepdf·PyMuPDF·Playwright)는 결과 점검에만 사용, 본문에 언급하지 않음. 코드 블록·인라인 코드 0개(빌드 HTML `<pre>`·`<code>` 0)
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 표기 `(3 Apps Tested)`(노하우 2), 이미지 8장(노하우 7: 대표 점검표 1200×675 + W-9 2부 Chrome 입력 비교 + PDF Arranger 설정 + PDFsam 양식 옵션 + Sejda 한도 화면 2개 + PDFsam·PDF Arranger·Sejda 합치기 화면, 모두 직접 캡처·생성), 요약 표, 내부 링크 4개(PDF 나누기·영상 압축·이미지 100KB·OCR) + `split-pdf-free`에서 역링크 1개. 카테고리 `software`
- 측정 환경: Linux 컨테이너, Intel Xeon 4코어, 2026-10-18 (`env.txt`). GUI 앱은 Xvfb + xdotool로 화면을 조작(클릭·입력·드래그)해 실행

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 입력: report.pdf 4쪽 36,749B(책갈피 4·목차 링크 3·외부 링크 1, Chromium 141 인쇄), w9.pdf 6쪽 239,154B(IRS W-9 Rev. March 2024, 양식 23칸, XFA 제거, 1번 칸 `TEST VENDOR ONE LLC`), photos.pdf 2쪽 2,462,601B(PD12M 14·15번 CC0, 3000px JPEG). 합 2,738,504B(2.74MB). w9-vendor2.pdf는 1번 칸만 `TEST VENDOR TWO INC` | `build_input.py`, 파일 크기 |
| 앱·버전: PDFsam Basic 6.0.6(.deb), PDF Arranger 1.14.0(Flathub), Sejda PDF Desktop 7.9.10(Flathub, 무료판 "Free limited version" 표시), Chromium 141.0.7390.37 PDF 뷰어 | `env.txt`, 캡처 |
| 3파일 합치기(보고서 먼저): 세 앱 모두 12쪽, 쪽별 텍스트 12/12 원본과 같음, 사진 JPEG 2개 바이트 동일, 책갈피 4/4, 목차 링크 3/3, 외부 링크 1, 양식 23칸·이름 값 유지 | `results.jsonl` (packet) |
| 크기: PDFsam 2,548,644B(2.55MB), PDF Arranger 2,576,055B(2.58MB), Sejda 2,547,730B(2.55MB) | `results.jsonl` |
| W-9 먼저·보고서 두 번째: PDFsam 책갈피 4/4(7~10쪽)·링크 3/3. PDF Arranger 기본 설정 0/4·0/3(이름 있는 목적지 표 없음), "Preserve document information from the first file opened" 해제 후 4/4·0/3. Sejda는 하루 한도로 미시험 | `results.jsonl` (W-9 first), 이미지 `pdf-arranger-preserve-first-file-setting.webp` |
| PDF Arranger 설정 기본값: 새로 설치한 상태에서 Preferences의 해당 체크박스가 켜져 있음 (이번 세션 이전에 바꾼 적 없음) | 캡처 `pa-prefs.png` |
| W-9 2부(기본값 Merge renaming existing fields / PDF Arranger 기본): 세 앱 모두 고유 필드 46개, 두 W-9 위젯이 공유하는 필드 0, 1번 칸 값 각자 유지. Chrome에서 첫 W-9 2번 칸에 `TYPED ON FORM 1` 입력 → 두 번째 W-9 2번 칸 비어 있음 | `results.jsonl`, `shared.py`, `chrome_shared_check.py` |
| PDFsam "Merge fields": 고유 필드 24개, 23칸 중 22칸이 두 W-9에서 공유(값이 다른 1번 칸만 이름 바꿈). Chrome에서 첫 W-9 2번 칸 입력 → 두 번째 W-9 2번 칸에도 같은 글자 | `results.jsonl` (two-w9-mergefields), 이미지 `merge-two-w9-forms-shared-fields.webp` |
| PDFsam "Flatten": AcroForm 없음(위젯 0), 이름 글자는 보이고 Chrome에서 입력해도 변화 없음 | `results.jsonl` (two-w9-flatten), `flat-p1.png` |
| PDFsam·Sejda 양식 옵션 목록과 기본값: PDFsam Merge renaming existing fields / Merge fields / Flatten / Discard forms, Sejda Discard / Merge / Merge (Rename existing) / Flatten (기본 Merge (Rename existing)), 책갈피 기본 Keep all | 캡처 `pdfsam-forms-menu.png`, `s20.png` |
| Sejda 무료 한도 화면 문구: 합치기 화면 "Files are processed locally. Free service for documents up to 50 pages or 50 MB and 3 tasks per day." | 캡처 `sejda-free-limit.png` |
| Sejda 64쪽(long-60 60쪽 + report 4쪽) 합치기 → "You reached your free limit of 50 pages per merge." 저장 안 됨. 이후 성공(03:29·03:30·03:35 UTC) 3회 뒤 4번째 → "You reached your free limit of 3 tasks per day. ... take a break for 23:53:30" → 거부된 64쪽 시도는 횟수에 포함되지 않음 | 캡처 `sejda-limit-50.png`, `sejda-limit-3tasks.png`, 결과 폴더 파일 시각 |
| Sejda 파일 순서: report·w9·photos를 report→w9→photos 순으로 클릭해 선택했는데 Files view에 photos·report·w9 순으로 표시, W-9 2부도 클릭 순서와 다르게 표시 → 끌어서 맞춤 | 캡처 `s18.png`, `s25.png` |
| PDFsam 64쪽 합치기: 알림 없이 64쪽 결과 | 직접 실행 |
| PDF Arranger 저장 시 "Saving produced some warnings ... Despite the warnings the document(s) should have no visible issues. The metadata field /SPDF ... has no XMP equivalent, so it was discarded" 표시 | 캡처 `s13.png` |
| PDFsam 완료 후 진행 막대 Completed, Run 옆 Open 버튼 | 캡처 `pdfsam-done.png` |

## 문서 (이번 세션에서 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| PDFsam Basic v6.0.6, Windows 다운로더는 PDFsam Enhanced 체험을 제안, 요구 사항 Windows 10 이상 64비트·macOS 11 Big Sur 64비트·Linux 64비트 | https://pdfsam.org/download-pdfsam-basic/ (curl) |
| PDFsam Basic: no watermarks, no size limits, Windows·macOS·Linux, Merge의 Page ranges·Bookmarks·AcroForms(discard·merge·rename on clash)·Table of contents 옵션 | https://pdfsam.org/pdfsam-basic/ (curl) |
| PDF Arranger: merge·split·rearrange, Windows 다운로드 링크 + Linux 패키지 (Mac 없음) | https://raw.githubusercontent.com/pdfarranger/pdfarranger/main/README.md |
| PDF Arranger: Open one or several PDF documents, Import(끝에 추가), Save, "Preserve document information from the first file opened"(1.14.0~, 체크 시 첫 파일의 outlines·links 사용, 해제 시 outlines 병합) | https://github.com/pdfarranger/pdfarranger/wiki/User-Manual (raw) |
| Sejda PDF Desktop: Mac(Intel·Silicon)·Windows 64-bit·Linux(.deb·.rpm), 무료 3 tasks per day, 합치기 최대 30파일·50쪽, 유료 Desktop Week Pass·Desktop+Web Annual | https://www.sejda.com/desktop (WebFetch. curl은 프록시 차단 403 "Access blocked") |
| Mac 미리보기 합치기: File > Duplicate 권장(자동 저장 경고), View > Thumbnails, 썸네일을 다른 PDF 사이드바로 끌기, Finder에서 PDF 아이콘을 사이드바로 끌면 전체 추가, 썸네일 끌어 순서 변경 | https://support.apple.com/guide/preview/combine-pdfs-prvw43696/mac (curl) |
| IRS Form W-9 원본 | https://www.irs.gov/pub/irs-pdf/fw9.pdf |

## 쓰지 않은 것

- Sejda 유료 가격: 웹 페이지 숫자 표기가 깨져(`$ 795`, `$ 63`) 정확한 금액을 확인하지 못함 → 플랜 이름만 씀
- Sejda 웹 페이지의 "documents up to 200 pages"는 앱 화면("50 pages or 50 MB")과 다름 → 앱 화면과 실제 거부 메시지(합치기 50쪽)만 씀
- Mac 미리보기의 양식·책갈피·링크 보존: macOS 실행 불가로 미확인 → 표에 "Not tested"
