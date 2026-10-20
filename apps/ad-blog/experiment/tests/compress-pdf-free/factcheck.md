# compress-pdf-free 사실 확인표

- 주 검색어: `compress pdf` (+ `compress pdf free`, `compress pdf online free`)
- 하위 검색어 (2026-10-20 `demand_check.py suggest "compress pdf"`, 31개): compress pdf file (Google·Bing·YouTube), compress pdf free, compress pdf online, compress pdf size, compress pdf on mac, compress pdf i love pdf / ilovepdf, compress pdf24, compress pdf extreme, compress pdf to 1mb, compress pdf without losing quality
- Trends: backlog 36번 기록 `compress pdf` 4.8 (기준 `remove background` 34.9, 2026-10-16). 이번 세션은 재조회하지 않음
- 채널: **검색형** (상시 수요, 비교·측정 + How-to). 제목 47자, 설명 155자. 카테고리 `software`
- 차별점: 2026-10-17 삭제한 명령줄 글(`compress-pdf-offline-free`)과 **같은 입력 PDF 4개**(`gen.py` 재사용)로 비개발자용 도구(웹 2개 + 무료 데스크톱 앱 1개)를 측정. 크기뿐 아니라 남은 해상도(ppi)·OCR 판독률·링크·텍스트 층 확인 → "스크린샷 PDF는 거의 안 줄어듦(Sejda 99%)", "Extreme은 작은 글자 OCR 93%", "PDF24 100 DPI·품질 60이면 스캔 0.75MB·OCR 100%"
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 `(3 Tools Tested)`(노하우 2), 이미지 9장(노하우 7: 대표 크기 그래프 1200×675 + 스캔·작은 글자 확대 비교 2 + iLovePDF 화면 2 + PDF24 화면 2 + Sejda 화면 2), 요약 표·결과 표, 디자인 시스템 라이트 모드(`chart_style.py`, 화면 주석 accent), 내부 링크 5개(split·merge·pdf-to-word·pdf-to-jpg·compress-image) + 역링크 2개(merge·split)
- 측정 환경: `env.txt` (Ubuntu 24.04.5, Xeon 2.10GHz, 2026-10-20)

## 측정 (직접 실행, 2026-10-20)

| 주장 | 근거 |
| --- | --- |
| 입력 PDF 4개: 사진 안내서 8쪽 39,561,047B, 스캔 편지 6쪽 7,069,739B(300ppi 2550×3300 JPEG, 텍스트 층 없음), 스크린샷 슬라이드 12쪽 1,376,493B(1920×1080 PNG), 텍스트 보고서 20쪽 85,651B | `gen.py`(이전 글에서 재사용, 사진은 `../convert-heic-to-jpg-free/sources.json` 1~8번 PD12M CC0), `summary.json` original |
| iLovePDF 웹(로그인 안 함) Extreme·Recommended·Less 3단계 × 4파일 | `ilove_run.py`, `ilove.log`. 업로드 뒤 옵션 패널이 늦게 뜨거나 대소문자가 다른 화면이 번갈아 나와 재시도(결과에는 영향 없음) |
| PDF24 Tools 웹 기본값(DPI 144·품질 75) × 4파일, DPI 100·품질 60 × 스캔·슬라이드 | `pdf24_run.py`, `pdf24.log`. 결과는 `iframe[src*=job-monitor]` 안 Download |
| Sejda PDF Desktop 7.9.10 무료판 기본값(Medium, 144ppi) × 사진·스캔·슬라이드 (Xvfb+xdotool로 GUI 조작) | `sejda_one.sh`. 4개 동시 선택 → "Free users are limited to a single file per task." 화면, 4번째 작업 → "You reached your free limit of 3 tasks per day ... 23:56:29" 화면 |
| 결과 크기·비율 (표 전체) | `summary.json` `bytes`·`ratio` |
| 사진 폭: iLove Rec 1125px, PDF24·Sejda 1080px, Extreme 540px, Less 1500px(JPEG 2000 `jpx`). 원본 5456px. 쪽 폭 7.5인치 → 150·144·72ppi | `summary.json` `img` (pdfimages -list 첫 이미지) |
| 스캔 해상도: Rec 1275×1650(150ppi), PDF24·Sejda 1224×1584(144), Extreme 612×792(72), Less 2550×3300(300, jpx), PDF24 100/60 850×1100(100) | `summary.json` `img` |
| OCR 단어 재현율(Tesseract 5.3.4 `--psm 6`, 스캔 300dpi·슬라이드 200dpi 렌더링): 원본 100%, Extreme 스캔 99.07%·슬라이드 93.13%, Rec 슬라이드 99.66%, PDF24 100/60 슬라이드 98.73%, 나머지 100% | `summary.json` `ocr_recall`, `score.py` |
| 링크(사진 8·보고서 20) 모든 결과에서 유지, 사진·보고서 텍스트 재현율 원본과 동일(0.995·0.971), 글꼴 수 유지 | `summary.json` `links`·`text_recall`·`fonts` |
| PDF24 기본값의 "Rasterize heavy graphics": 보고서 쪽별 SSIM 최저 1.000, 글꼴 3개 유지 | `summary.json` pdf24-default text-report |
| Sejda 슬라이드 결과 화면 "Your PDF file is already very well compressed", 사진 "We compressed your file to 939 KB (98% less)" | 화면 캡처(세션 중) |
| Sejda 옵션 툴팁: Medium "Choose this for smallest size. JPEG quality: 65%.", Good "A balance between image quality and file size. JPEG quality: 80%.", Best "The best image quality but larger file size. JPEG quality: 100%." 해상도 72·100·144·200·300·720, 기본 144 | 화면 캡처 `sejda-desktop-compress-options.webp`, tip-*.png |
| iLovePDF 결과 화면 "37.73 MB → 779.13 KB", 98% saved (이진 MB 표기) | `ilovepdf-compressed-result.webp` |
| PDF24 결과 상자 설정 목록(DPI 144, Image quality 75, Remove thumbnails, Deduplicate streams, Rasterize heavy graphics, Subset embedded fonts), 97.49% | `pdf24-compressed-result.webp` |

## 문서 (2026-10-20 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| iLovePDF 무료(Basic): Compress PDF 배치 2개, 작업당 200 MB | https://www.ilovepdf.com/pricing (curl) |
| iLovePDF 파일 최대 2시간 보관 후 삭제 | https://www.ilovepdf.com/help/faq (curl), 결과 화면 "automatically deleted after 2 hours" |
| iLovePDF 업로드 버튼 "Select PDF files" | https://www.ilovepdf.com/compress_pdf (curl) |
| PDF24: Free·No limits, 서버 독일, 1시간 뒤 자동 삭제, 기본 DPI 144·품질 75 | https://tools.pdf24.org/en/compress-pdf (curl + 화면) |
| PDF24 Creator: Windows 전용, 오프라인, 무료 | https://tools.pdf24.org/en/creator (curl) |
| Sejda Desktop: Mac·Windows·Linux, 3 tasks per day, Compress files up to 100MB, 파일은 컴퓨터에서 처리 | https://www.sejda.com/desktop (WebFetch, curl 403) |
| Mac Preview: File > Export > Quartz Filter > Reduce File Size > Save, 품질 저하 가능 | https://support.apple.com/guide/preview/reduce-the-size-of-a-pdf-prvw1509/mac (curl) |

## 쓰지 않은 것

- Adobe Acrobat 온라인·Smallpdf: 이번 세션에서 측정·확인하지 않아 언급 안 함
- Sejda Good·Best, iLovePDF·PDF24 OCR 등: 미측정
- 시간: 도구별 소요 시간은 업로드·대기 포함이라 글에 쓰지 않음 (iLovePDF 6~12초, PDF24 4~12초, Sejda 8~14초 수준, 로그)
