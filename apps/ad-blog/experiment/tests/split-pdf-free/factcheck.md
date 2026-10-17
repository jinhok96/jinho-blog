# split-pdf-free 사실 확인표

- 주 검색어: `split pdf free` (+ `split pdf`, `split pdf into individual pages`, `split pdf pages`, `split pdf by size`, `split pdf into multiple pdfs`, `split pdf online free`, `extract pages from pdf`)
- 수요 근거 (2026-10-17, 세션 19): Google Trends(미국 3개월) `merge pdf` 평균 23.5 · `split pdf` **22.6**(최고 100, 최근 7개 지점 9.3) · `png to jpg` 14.4 · `webp to jpg` 6.6. 자동완성 "split pdf" 25개 이상(free·into individual pages·online·pages가 Google·Bing, by size·into multiple pdf(s)·i love pdf·smallpdf·sejda 등)
- 채널: **검색형** (상시 수요, 비교 + How-to). 제목 57자, 설명 154자
- 차별점: "무손실이라 차이 없음"으로 보이는 나누기에서 **결과 파일에서 무엇이 동작하지 않게 되는지**를 GUI 방법 3개로 측정. (1) Chrome 인쇄 → Save as PDF는 양식 평면화·책갈피·링크 삭제, (2) PDF Arranger는 W-9만 내보내도 다른 쪽을 가리키던 책갈피 4개가 남음(Chrome 사이드바에서 클릭해도 이동 없음), (3) PDFsam Split by size는 한 쪽이 한도보다 크면 그 쪽은 한도를 넘는 파일로 남음
- 비개발자 기준: 본문 방법은 모두 GUI 앱(PDFsam Basic·PDF Arranger)·브라우저 인쇄·Mac 미리보기. 측정 보조(Python pikepdf·PyMuPDF·Playwright)는 결과 점검에만 사용, 본문에 언급하지 않음. 코드 블록·인라인 코드 0개
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 표기 `3 Ways Tested`(노하우 2), 이미지 7장(노하우 7: 대표 점검표 1200×675 + Chrome 양식 입력 비교 + PDF Arranger 남은 책갈피 Chrome 캡처 + PDFsam Extract·Split by size 화면 + PDF Arranger Export 메뉴 + Chrome 인쇄 미리 보기, 모두 직접 캡처·생성), 요약 표, 내부 링크 4개(영상 압축·이미지 100KB·OCR·HEIC) + OCR 글에서 역링크 1개. 카테고리 `software`
- 측정 환경: Linux 컨테이너, Intel Xeon 2.10GHz 4코어, 2026-10-17 (`env.txt`). GUI 앱은 Xvfb + xdotool로 화면을 조작(클릭·입력)해 실행

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 입력 1개 12쪽 2.57MB(2,570,541바이트): 1~4쪽 직접 만든 보고서(Chromium 141 인쇄, 책갈피 4개·목차 링크 3개·외부 링크 1개), 5~10쪽 IRS Form W-9(Rev. March 2024, 양식 칸 23개, 1번 칸 `TEST VENDOR ONE LLC`), 11~12쪽 CC0 사진(PD12M 14·15번, 3000px 폭 JPEG) | `build_input.py`, `analyze.py` 원본 점검 |
| 앱·버전: PDFsam Basic 6.0.6(.deb, 공식 다운로드 페이지와 같은 버전), PDF Arranger 1.14.0(Flathub), Chromium 141.0.7390.37 인쇄 미리 보기 | `env.txt` |
| PDFsam Extract `1-4,5-10` + "A separate file for each set of pages" → `1_PDFsam_packet.pdf`(4쪽 29,194B), `5_PDFsam_packet.pdf`(6쪽 59,417B) | `results.jsonl`, 이미지 `pdfsam-extract-pages-settings.webp` |
| PDF Arranger Export Selection to a Single File(Ctrl+E) → 1~4쪽 32,861B, 5~10쪽 77,028B | `results.jsonl`, 이미지 `pdf-arranger-export-selection-menu.webp` |
| Chrome 인쇄 → Save as PDF, Pages Custom → 1~4쪽 31,466B, 5~10쪽 78,034B, 11쪽 1,187,351B. Print as image 체크 안 함 | `results.jsonl`, 이미지 `chrome-print-save-as-pdf-custom-pages.webp` |
| 텍스트: 세 방법 모두 쪽별 텍스트 원본과 같음(10/10) | `results.jsonl` `text_pages_identical` |
| 사진: 11쪽 단독 파일의 JPEG 스트림이 세 방법 모두 원본과 바이트 동일(약 1.19MB) | `results.jsonl` `jpeg_identical_to_source` |
| 1~4쪽 책갈피: PDFsam 4/4, PDF Arranger 4/4, Chrome 0 | `results.jsonl` `bookmarks` |
| 1~4쪽 목차 링크(이 파일 안의 쪽으로 풀리는 수): PDFsam 3/3, PDF Arranger 3/3, Chrome 0(링크 자체 없음). 외부 링크: 1, 1, 0 | `results.jsonl` `internal_links_resolve`, `external_links` |
| W-9 양식: PDFsam·PDF Arranger 23칸 유지, Chrome 0칸(평면화, 값은 쪽 글자로 남음). Chrome 141 뷰어에서 1번 칸 클릭 후 입력 → PDFsam 결과는 `TEST VENDOR ONE LLC - EDITED`, Chrome 결과는 변화 없음 | `results.jsonl` `form_fields`, `chrome_form_shot.py`, 이미지 `split-w9-form-pdfsam-vs-chrome-print.webp` |
| PDF Arranger W-9(5~10쪽) 파일에 보고서 책갈피 4개가 남음(대상 `/Dest`의 쪽이 null). Chrome 사이드바에 Test report·Summary·Measurements·Appendix 표시, Summary 클릭 후에도 1/6쪽 | `results.jsonl` `bookmarks`, pikepdf 확인, 이미지 `pdf-arranger-leftover-bookmarks.webp` |
| 한 쪽씩 나누기: PDFsam Split > Every page 12개 합 2,689,845B, PDF Arranger Export All Pages to Individual Files(Shift+Ctrl+E) 12개 합 2,725,470B (원본 2,570,541B). PDFsam 1쪽 파일은 목차 링크 0(대상 쪽이 다른 파일), 각 쪽 파일은 자기 쪽 책갈피 유지 | `results.jsonl` |
| PDF Arranger 한 쪽씩 내보내기에서 W-9 첫 쪽 파일: 위젯 23개 있으나 문서 `/AcroForm` 없음. Chrome에서는 입력 가능(본문에 "still accepted typing in Chrome"으로만 씀, 다른 뷰어는 확인 안 함) | pikepdf 확인, `chrome_form_check.py` |
| PDFsam Split by size 1MB → 3개: 1~10쪽 87,245B, 11쪽 1,188,481B, 12쪽 1,276,245B (한 쪽이 한도보다 크면 넘는 파일로 남음). 앱 홈 화면 설명 "Split a PDF document in files of the given size (roughly)." | 직접 실행, 이미지 `pdfsam-split-by-size-settings.webp`, 홈 화면 캡처 |
| PDFsam 앱 실행 시 "PDFsam Visual 7 is out" 알림 표시 | 홈 화면 캡처 |
| 측정 환경 문제(글에는 쓰지 않음): PDF Arranger Flatpak은 문서 포털(FUSE)이 없으면 저장 실패 → `XDG_RUNTIME_DIR` 지정 후 정상. "Export All Pages"는 포털 경유 저장에서 첫 파일만 이름이 정상이고 나머지는 `.xdp-page-0NN.pdf-*` 임시 이름으로 남음 → 이름만 바꿔 점검 (내용은 앱이 쓴 그대로) | 직접 실행 |

## 문서 (이번 세션에서 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| PDFsam Basic: free and open source, 문서가 컴퓨터에 남음, v6.0.6 Windows 다운로더(.exe)는 PDFsam Enhanced 체험을 제안, macOS(ARM·Intel dmg/zip), 요구 사항 Windows 10 이상 64비트·macOS 11 Big Sur 64비트·Linux 64비트·RAM 256MB | https://pdfsam.org/download-pdfsam-basic/ (curl) |
| PDF Arranger: python-gtk 앱, merge·split·rotate·crop·rearrange, Windows 공식 설치 파일/portable ZIP, Flatpak·Debian·Fedora 등 Linux 패키지 (Mac 없음) | https://raw.githubusercontent.com/pdfarranger/pdfarranger/main/README.md, https://github.com/pdfarranger/pdfarranger/wiki/Binary-packages (raw) |
| PDF Arranger 1.14.0부터 "Preserve document information from the first file opened" 설정: 체크하면 첫 파일의 outlines·links 사용, 해제하면 모든 문서의 outlines 병합 | https://github.com/pdfarranger/pdfarranger/wiki/User-Manual (raw) |
| PDF Arranger 최신 1.14.0 (Flathub 릴리스 목록 1.14.0·1.13.0·1.12.1) | flathub.org API `appstream/com.github.jeromerobert.pdfarranger` |
| Mac 미리보기: View > Thumbnails, 썸네일을 사이드바에서 데스크톱으로 끌면 새 PDF, Command-클릭으로 떨어진 쪽 선택, 변경이 자동 저장되므로 File > Duplicate로 사본 권장(Combine 문서의 경고) | https://support.apple.com/guide/preview/add-delete-or-move-pdf-pages-prvw11793/mac, https://support.apple.com/guide/preview/combine-pdfs-prvw43696/mac (Playwright 렌더링) |
| Chrome 인쇄: File > Print 또는 Ctrl+P(Windows·Linux), ⌘+P(Mac), 대상 선택, Save as PDF 언급 | https://support.google.com/chrome/answer/1069693 (Playwright 렌더링) |
| Gmail 개인 계정 첨부 한도 25MB, 넘으면 자동으로 첨부를 빼고 Google Drive 링크로 추가 | https://support.google.com/mail/answer/6584?hl=en (Playwright 렌더링) |
| IRS Form W-9 (Rev. March 2024) 공공 양식 | https://www.irs.gov/pub/irs-pdf/fw9.pdf (curl, 140,815B) |

## 쓰지 않은 것

- Adobe Acrobat 분할 기능의 유료 여부: 이번 세션에서 공식 페이지를 확인하지 않아 삭제
- Mac 미리보기 결과물의 양식·책갈피·링크 보존: macOS를 실행할 수 없어 "Not tested"로 표기
- 온라인 분할 서비스(iLovePDF·Smallpdf·Sejda)의 정책·한도: 확인하지 않음. 업로드가 필요하다는 점만 씀
- 처리 시간: 측정하지 않음 (GUI 조작 대기 시간이 섞여 의미 없음)
