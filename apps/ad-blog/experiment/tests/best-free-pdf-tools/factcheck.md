# best-free-pdf-tools 사실 확인표

- 주 검색어: `free pdf tools` (자동완성 Google·Bing·YouTube 3곳, 하위 23개)
- 하위 검색어: `free pdf tools for windows`, `free pdf tools online`, `free pdf tools download`, `best free pdf software`, `best free pdf converter`, `best free pdf compressor`, `best free pdf merger`, `best free pdf to word converter`
- 채널: 검색형 (허브 글, 상시 수요). 제목 49자(본제목)
- 차별점: 직접 측정한 6개 작업(나누기·합치기·JPG→PDF·PDF→JPG·PDF→Word·압축)의 작업별 추천 매트릭스, 기본값 함정 7개 표, 무료판 한도·업로드 여부 표, Sejda 3회/일이 앱 전체 공유라는 점에서 나온 "설치 조합" 추천
- 적용한 노하우: traffic-playbook 3번(허브 글: 같은 분야 측정 글 3편 이상 → 허브, 개별 글 모두 연결·역링크), 7번(이미지 6장: 새 그래픽 2 + 개별 글 측정 이미지 4 재사용), 디자인 시스템 라이트 모드(`chart_style.py`)
- Trends 미국 1개월(2026-10-20): `free pdf tools` 0.7 · `pdf editor free` 4.8 · `compress pdf` 5.2 · 기준 `remove background` 35.9 → 허브 자체 검색량은 작음. 선정 이유는 허브 규칙 + PDF 글 5편이 `URL is unknown`이라 내부 링크 발견 경로 보강

## 측정값 (재사용, 새 측정 없음)

| 주장 | 출처 (직접 측정한 글·자료) |
| --- | --- |
| 나누기: PDFsam 북마크 4/4·링크 3/3·양식 유지, PDF Arranger 빈 북마크 4개, Chrome 양식 평면화·북마크 0 | `split-pdf-free` 본문·`tests/split-pdf-free/` (2026-10-17) |
| 합치기: PDFsam 순서 무관 유지, PDF Arranger 두 번째 파일 북마크 0, Sejda 50쪽 제한·4번째 작업 약 24시간 대기 | `merge-pdf-files-free` (2026-10-18) |
| JPG→PDF: PDF Arranger 10/10 원본 유지·기본 페이지 약 56×42인치, Sejda 세로 2장 재저장(약 0.5%), Chrome 1.85MB → 21.6MB | `jpg-to-pdf-free` (2026-10-18) |
| PDF→JPG: Sejda만 기본값으로 2쪽 모두, GIMP 기본 마지막 쪽만·300ppi, LibreOffice Draw 96ppi 816×1056, 수정 방법(300 pixels/inch 후 너비 8.5인치) | `pdf-to-jpg-free` (2026-10-19) |
| PDF→Word: iLovePDF 표 4/5·2단 유지·문단 82%, Sejda 표 0/2·9pt 1단, LibreOffice 텍스트 상자·Draw로 열림 | `pdf-to-word-free` (2026-10-19~20) |
| 압축: iLovePDF Recommended 39.6 → 0.80MB, Sejda 0.94MB(차이 0.14MB), PDF24 100 DPI·품질 60 스캔 7.1 → 0.75MB(OCR 100%) | `compress-pdf-free` (2026-10-20) |

## 이번 세션에서 연 1차 출처 (2026-10-20, curl 브라우저 UA 정적 HTML)

| 주장 | 출처 | 확인 내용 |
| --- | --- | --- |
| PDFsam Basic 현재 버전 6.0.6, macOS 지원 | https://pdfsam.org/download-pdfsam-basic/ | "Download PDFsam Basic v6.0.6", macOS dmg |
| Sejda Desktop 무료: 3 tasks per day, 50MB·200 pages, compress 100MB, combine 30 files·50 pages, convert files one by one | https://www.sejda.com/desktop | 무료/Pro 비교 표 |
| iLovePDF 무료 파일 크기: PDF to Word 15MB, PDF to JPG 25MB, Merge·Split 100MB, Compress 200MB. Premium $5/월(연 $60), 월 결제 $9 | https://www.ilovepdf.com/pricing | 요금 표 |
| PDF24 "No artificial limits", "100% free of charge… advertising" | https://tools.pdf24.org/en/ | 홈 |
| PDF24 파일 1시간 후 삭제 | https://tools.pdf24.org/en/compress-pdf | "Files are automatically deleted from the PDF24 server after one hour" |
| GIMP 현재 안정판 3.2.6 (2026-09-10) | https://www.gimp.org/downloads/ | "The current stable release of GIMP is 3.2.6" |
| LibreOffice 26.8.1 다운로드 제공 | https://www.libreoffice.org/download/download-libreoffice/ | 다운로드 버튼 |
| PDF Arranger 1.14.0 | https://flathub.org/apps/details/com.github.jeromerobert.pdfarranger | "Changes in version 1.14.0" |

- Mac Preview 기능(합치기·나누기·크기 줄이기)은 개별 글에 링크한 Apple 가이드 기준 (측정 안 함, 본문에 명시)
- iLovePDF 파일 삭제 시간은 이번 세션에서 1차 출처 미확인 → 본문에 쓰지 않음

## 검사

- 명령어·코드 블록·터미널 단계 없음 (빌드 HTML `<pre>`·`<code>` 0개)
- 그래픽: `charts.py` (`/tmp/gsc/bin/python -I charts.py <출력 폴더>`, matplotlib·Pillow)
