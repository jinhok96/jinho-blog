# pdf-to-jpg-free 사실 확인표

- 주 검색어: `pdf to jpg` (+ `pdf to jpg free`, `pdf to jpg converter free`, `pdf to jpg high quality`, `pdf to jpg high resolution`, `pdf to jpg on mac`, `pdf to jpg windows`, `pdf to jpg converter download`)
- 수요 근거 (2026-10-19): 자동완성 "pdf to jpg" 31개 — converter·converter free·free가 Google·Bing·YouTube 3곳, canva(Bing·YouTube), high quality·iphone(2곳), high resolution·mac·windows·converter download·in pc. Trends(미국 3개월) `pdf to jpg` 12.9 · `compress pdf` 4.8 · `webp to jpg` 1.8 · 기준 `remove background` 35.2. backlog 44번(명령줄 글 `pdf-to-jpg-high-quality` 2026-10-17 삭제 → GUI로 새로 씀) + 세션 23 다음 할 일 "PDF GUI 시리즈"
- 채널: **검색형** (상시 수요, 비교 + How-to). 제목 50자(접미사 포함 62자), 설명 158자
- 차별점: 상위 결과가 업로드형 온라인 변환기인 검색어에서 GUI 앱 3개의 **기본값 함정**을 직접 확인 — (1) GIMP 기본 `Open pages as: Layers`는 여러 쪽 PDF에서 **마지막 쪽만** JPG로 저장(레이어 2가 맨 위), `Images`로 바꾸면 쪽마다 따로 열림, (2) LibreOffice Draw 기본 96 ppi(816×1056), **Modify resolution에 300을 넣어도 픽셀 수 그대로**(인치만 2.72×3.52로 줄어듦) → 300 입력 후 Modify dimensions로 8.50인치 되돌리기, 해상도는 매번 96으로 초기화, 글꼴 바뀜, (3) Sejda 무료판 기본 150 dpi·최대 220 dpi, 품질 추정 100이라 파일이 큼, 20쪽·하루 3회
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 표기 `(3 Apps Tested)`(노하우 2), 이미지 9장(노하우 7: 대표 점검표 1200×675 + 확대 비교 + LibreOffice 글꼴 비교 + GIMP 화면 2 + LibreOffice 화면 2 + Sejda 화면 2, Xvfb에서 직접 캡처), 요약 표·결과 표, 내부 링크 5개(JPG→PDF·나누기·합치기·100KB 압축·OCR) + `jpg-to-pdf-free`에서 역링크. 카테고리 `software`
- 측정 환경: Ubuntu 24.04 컨테이너, Intel Xeon 2.10GHz, Xvfb 1600×1000 + xdotool로 각 앱 화면 조작, 2026-10-19 (`env.txt`)

## 측정 (직접 실행, `results.jsonl`)

| 주장 | 근거 |
| --- | --- |
| 입력: IRS Form 1040 2025(2쪽 Letter), 직접 만든 보고서 1쪽(Chromium 141 인쇄, 흰 배경 없음, 7pt 각주 28단어), CC0 사진 3쪽(가로 Letter) | `build_inputs.sh`, `pdfinfo` |
| GIMP 3.2.6 PDF 가져오기 기본: Open pages as Layers, 2550×3300, 300 pixels/in, Use Anti-aliasing·Fill transparent areas with white 체크 | 캡처 `gimp-import.png`(글에는 Images 선택 화면) |
| GIMP 기본(Layers)으로 2쪽 1040을 열면 레이어 2가 맨 위, 화면에 2쪽 표시 | 캡처 `gimp-last-page-on-top.webp` |
| GIMP Export As → JPEG 기본: Quality 90, Progressive 체크, Subsampling 4:4:4, 메타데이터 저장 모두 해제 | 캡처 `gimp-jpeg-options.png` |
| GIMP 기본 내보내기 결과: JPG 1개, 2550×3301, Q90, 1,276,264바이트, **1040 2쪽과 일치**(RMSE 0.014, 1쪽과는 0.255) | `results.jsonl` gimp/irs-1040.jpg, 직접 비교 |
| GIMP Open pages as Images: 3쪽 사진 PDF가 그림 3개(탭 3개)로 열림, 내보낸 1개는 3300×2550, 사진 1쪽과 일치 | 캡처 `gimp-open-pages-as-images.webp`, `results.jsonl` gimp/photos-p1.jpg |
| GIMP 1040 2쪽 OCR 단어 재현율 83.9%, mixed 97.7%·7pt 각주 28/28 | `results.jsonl` |
| LibreOffice Draw 26.8.1 File > Export → JPEG → JPG Options 기본: Modify dimensions 8.50×11.00 inches, 해상도 칸 38 pixels/cm(비활성), Quality 75, "2524.5 kB of memory, file size 188.4 kB" | 캡처 `lo-jpg-options-default.png` |
| LibreOffice 기본 결과: 1040 2쪽 PDF에서 JPG 1개(1쪽), 816×1056, Q75, 192,895바이트, OCR 51.5% | `results.jsonl` lo/irs-1040.jpg |
| Modify resolution → pixels/inch → 300: Width 2.72·Height 3.52 inches로 바뀌고 메모리 2524.5 kB 그대로. 결과 816×1056(Q90, 268,781바이트) | 캡처 `libreoffice-resolution-trap.webp`, `results.jsonl` lo/irs-1040-300ppi.jpg. OCR 19.7%는 파일 DPI 표기 300 때문에 Tesseract 배율이 어긋나 비교 불가로 처리 |
| 해결: Modify resolution 300 입력 후 Modify dimensions로 Width 8.5 → Height 11.00, "24653.3 kB of memory". 결과 2550×3300, Q90, 1,328,912바이트, OCR 82.2% | 캡처 `libreoffice-resolution-fixed.webp`, `results.jsonl` lo/irs-1040-fixed.jpg |
| LibreOffice는 다음 내보내기에서 Quality 90은 유지, 해상도는 96 pixels/inch로 초기화 (앱 재시작 후·다른 파일 모두) | 캡처 `l11.png`, `l13.png` |
| LibreOffice가 1040 글꼴을 바꿔 "Digital Assets"가 옆 질문과 붙음. 1040 1쪽 기준 렌더와 RMSE 0.075(Sejda 220 0.017) | 비교 이미지 `libreoffice-pdf-font-change.webp`, `results.jsonl` |
| Sejda PDF Desktop 7.9.10 무료판 PDF to JPG 시작 화면: "Free service for documents up to 20 pages or 50 MB and 3 tasks per day", "Files are processed locally" | 캡처 `sejda-pdf-to-jpg-start.png` |
| Sejda 옵션: Image resolution Small (75 dpi)·Medium (150 dpi, 기본 선택)·Large (220 dpi), Image format JPG(기본)·PNG·TIFF·TIFF (multi-page). 새 파일마다 Medium으로 돌아감 | 캡처 `sejda-pdf-to-jpg-options.webp`, `s16.png` |
| Sejda 저장: Select output folder → Folder output options(파일 이름 `[CURRENTPAGE]_[BASENAME]`, Rename 기본) → Continue. 결과 `1_irs-1040.jpg`·`2_irs-1040.jpg` | 캡처 `s9.png`, `sejda-done.png` |
| Sejda Medium: 1275×1649, 품질 추정 100, 1,205,751·1,055,941바이트, OCR 80.7%·87.6% / Large: 1870×2420, 2,064,553·1,793,802바이트, OCR 85.0%·83.1% / mixed Large 966,848바이트, 각주 28/28 | `results.jsonl` |
| Sejda 4번째 작업: "Upgrade required … You reached your free limit of 3 tasks per day. Upgrade to continue now, or take a break for 23:55:57" | 캡처 `sejda-free-daily-limit.webp` |
| 세 앱 모두 mixed(흰 배경 없는 PDF)를 흰 배경으로 저장(평균 밝기 0.915~0.916) | `results.jsonl` mean |
| 품질 추정값(%Q)·OCR(Tesseract 5.3.4 psm 3)·쪽 판별(300 DPI pdftoppm 기준 렌더와 회색조 축소 RMSE)은 측정 보조로만 사용 | `analyze.py` |

## 문서 (2026-10-19 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| GIMP 최신 안정판 3.2.6(2026-09-10), Linux·macOS·Windows 다운로드 | https://www.gimp.org/downloads/ (curl) |
| LibreOffice 26.8.1, Windows(x86-64·ARM64)·macOS(Apple Silicon·Intel)·Linux | https://www.libreoffice.org/download/download-libreoffice/ (curl) |
| Sejda Desktop: Mac Intel·Mac Silicon·Windows 64bit·Linux, 무료 "3 tasks per day", "Docs up to 50MB and 200 pages", 파일은 컴퓨터에서 처리 | https://www.sejda.com/desktop (curl 403 → WebFetch). 쪽수 표기가 앱 화면(20 pages)과 달라 글은 앱 화면 기준 + 차이 언급 |
| Mac Preview: File > Export, Format 팝업에서 JPEG, JPEG는 품질 조절, Save. 여러 쪽·해상도 언급 없음 | https://support.apple.com/guide/preview/convert-image-file-types-prvw1012/mac (curl) |
| 온라인 변환기 이름(iLovePDF·Smallpdf·Adobe·Canva) | 자동완성 결과(`demand_check.py suggest "pdf to jpg"`) |

## 한계

- Windows·macOS에서 직접 실행하지 않음 (Linux 판 GIMP·LibreOffice·Sejda로 측정). Mac Preview는 문서 기반 "Not tested"
- GIMP 1쪽(Layers 기본)과 Images 모드의 2·3쪽 내보내기는 하지 않음. LibreOffice에서 다른 쪽을 선택해 내보내는 동작은 확인하지 않음 (글은 "page selected when the file opened"로 씀)
- OCR 재현율은 판독성의 대리 지표 (같은 앱 1·2쪽 간에도 ±5%p 차이)
- Sejda 무료판 한도는 하루 3회라 사진 PDF 변환은 한도 화면 캡처로 대신함
