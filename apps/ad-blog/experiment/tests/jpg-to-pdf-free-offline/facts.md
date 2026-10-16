# jpg-to-pdf-free-offline 사실 확인표

- 주 검색어: `jpg to pdf` (+ `image to pdf`, `jpg to pdf free`, `jpg to pdf converter free`, `jpg to pdf merge/combine`, `jpg to pdf high quality`, `jpg to pdf on mac`, `jpg to pdf windows 11`)
- 수요 근거 (2026-10-16): Google Trends 미국 3개월 평균, 기준 `remove background` 35.4 — `jpg to pdf` **13.1** · `mp4 to mp3` 8.8 · `image to pdf` 8.1 · `compress pdf` 4.8 · `png to jpg` 3.9 · `webp to jpg` 1.9 · `upscale image` 1.4. 자동완성 "jpg to pdf" 32개(converter·free가 Google·Bing·YouTube 3곳, merge·free online·converter free 2곳, 100kb·200kb·high quality·iphone·on mac·windows 11), "image to pdf" 29개(converter free·free가 3곳)
- 채널: **검색형** (상시 수요, How-to + 측정). 제목 56자, 설명 159자
- 차별점: 상위 결과가 업로드형 온라인 변환기인 검색어에서 (1) 도구별로 사진이 **그대로 들어가는지(픽셀 동일 여부)**, (2) **세로 사진(EXIF Orientation)이 옆으로 눕는지**, (3) PDF 크기가 왜 달라지는지를 24장으로 측정
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 표기 `(5 Tools Tested)`(노하우 2), 이미지 6장(노하우 7: 대표 그래프 1200×675 + 세로 사진 방향 비교 + 같은 영역 확대 비교 + 속도 그래프 + LibreOffice 스크린샷 2장, Xvfb에서 직접 캡처), 요약 표, 내부 링크 5개(HEIC→JPG·이미지 100KB·PDF 압축·OCR·PDF→Word) + PDF→Word 글에서 역링크. 카테고리 `software`
- 측정 환경: Ubuntu 24.04, Intel Xeon 2.80GHz 4코어, RAM 16GB, GPU 없음, 2026-10-16 (`env.txt`)

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 입력: CC0 사진 20장(PD12M, `convert-heic-to-jpg-free/sources.json`) → 4032×3024, 품질 92·4:2:0·72 DPI JPEG + 세로 사진 4장(픽셀 가로 저장 + EXIF Orientation=6). 합계 61,760,327바이트(61.8MB), 세로 4장 1,675,494~2,517,747바이트 | `build_set.sh`, `set_orientation.py` |
| 설정: img2pdf 0.6.3 기본·`--pagesize Letter`, ImageMagick 7.1.2-34 기본·`-auto-orient`, Pillow 12.3.0 `save_all`, LibreOffice 26.8.1 `--convert-to pdf`(사진당 PDF 1개), Chromium 141.0.7390.37 Playwright 1.64 `page.pdf()`(사진당 1개, Letter) | `run_tests.py` |
| PDF 크기: img2pdf 61,773,174 (+12,847바이트, 쪽당 약 535) / Letter 61,773,246 / ImageMagick 61,799,205 / -auto-orient 61,790,761 / Pillow 33,115,862 (-46%) / LibreOffice 20,341,041 (-67%) / Chromium 146,345,291 | `timing.json`, `summary.json` |
| 픽셀 동일(24장 중): img2pdf 24, Chromium 24, ImageMagick 0, Pillow 0, LibreOffice 0, LibreOffice 무손실+해상도 변경 끔 24 | `analyze.py` (pdfimages -j로 꺼내 원본과 픽셀 비교) |
| SSIMULACRA2(원본 해상도, 줄어든 이미지는 Lanczos로 원래 크기로 확대 후 비교) 중앙값·최저: ImageMagick 92.3·89.3(20번), Pillow 78.9·73.6(17번), LibreOffice 59.5·26.7(18번 눈 덮인 숲). 18번: ImageMagick 93.1, Pillow 75.3, LibreOffice 26.7 | `summary.json`, `results.jsonl` |
| 다시 저장한 JPEG 품질: ImageMagick 92(입력과 같음), Pillow 75, LibreOffice 90 | `magick identify -format %Q` (pdfimages -j로 꺼낸 1번) |
| 세로 사진 4장 방향: img2pdf 4/4 바로(페이지 /Rotate 90, 픽셀 그대로), Chromium 4/4, ImageMagick 0/4, `-auto-orient` 4/4, Pillow 0/4, LibreOffice 0/4(무손실 설정에서도 0/4) | `analyze.py` `orientation_ok`(렌더링 후 기준 이미지와 비교), 렌더링 화면 직접 확인 |
| LibreOffice Draw에서 세로 사진(21번)을 열면 옆으로 누워 보임 | Xvfb 스크린샷 `libreoffice-draw-portrait-photo-sideways.webp` |
| LibreOffice 기본 내보내기: 이미지 2244×1683(A4, 컨테이너 로캘 없음), `LANG=en_US.UTF-8`에서는 Letter 페이지·2313×1734 | `pdfimages -list`, `pdfinfo` |
| LibreOffice PDF 기본값: JPEG compression Quality 90%, Change image resolution to 300 DPI | PDF Options 대화상자 스크린샷 + `share/registry/main.xcd`(`Filter/PDF/Export` Quality 90, ReduceImageResolution true, MaxImageResolution 300, UseLosslessCompression false) |
| LibreOffice `UseLosslessCompression=true`, `ReduceImageResolution=false`: 24장 픽셀 동일, 61,920,333바이트 | `--convert-to 'pdf:draw_pdf_Export:{...}'` 직접 실행 |
| Chromium: 가로 사진은 JPEG 그대로(DCT), 세로 사진은 풀어서 무압축 이미지로 저장 → 20,230,941~26,811,483바이트(원본의 9.7~12.7배, 본문 "10 to 13 times"는 반올림), 세로 4장 합계 92,579,479바이트 | `pdfimages -list` (enc `image`), `ls -l` |
| img2pdf 페이지 크기: 기본은 사진 크기 ÷ DPI(72) → 4032×3024pt(56×42인치). `--pagesize Letter --auto-orient`: 가로 사진 792×612, 세로 사진 792×612 + /Rotate 90 → 바로 선 세로 Letter. `-a` 없으면 가로 사진이 세로 Letter 가운데에 작게 | `pdfinfo` |
| EXIF Orientation 0: img2pdf `error: Invalid rotation (0): use --rotation=ifvalid or rotation=img2pdf.Rotation.ifvalid to ignore`, `--rotation=ifvalid`로 성공 | 직접 실행 |
| 시간(3회 중앙값)·최대 메모리: img2pdf 0.28초·108MB, Pillow 3.14초·1,138MB, Chromium 31.6초, LibreOffice 33.6초, ImageMagick 34.1초·3,403MB(3.3GB). Chromium·LibreOffice 메모리는 자식 프로세스가 빠져 기록 안 함 | `timing.json` (`os.wait4` ru_maxrss) |

## 문서 (2026-10-16 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| img2pdf: "Lossless conversion of raster images to PDF", "the input image is just pasted into the PDF document as-is", Windows는 releases의 `img2pdf.exe`, EXIF Orientation 0은 허용 값이 아니며 "Anroid phones and Canon DSLR cameras" 가 씀 → `--rotation=ifvalid` | https://pypi.org/project/img2pdf/ (0.6.3, 2025-11-05 업로드) |
| img2pdf.exe 최신 0.6.0 (2025-02) | https://gitlab.mister-muffin.de/josch/img2pdf/releases |
| `--auto-orient`: 페이지 방향을 이미지 방향과 같게 바꿈 | `img2pdf --help` |
| Pillow PDF: RGB는 JPEG 인코딩, `save_all`, JPEG `quality` 기본 75 | https://pillow.readthedocs.io/en/stable/handbook/image-file-formats.html |
| LibreOffice PDF 일반 탭: Lossless compression "All pixels are preserved", JPEG compression 품질 낮으면 일부 픽셀 손실 | https://help.libreoffice.org/latest/en-US/text/shared/01/ref_pdf_export_general.html |
| LibreOffice 최신 26.8.1 | https://download.documentfoundation.org/libreoffice/stable/ |
| Mac Finder: Control-클릭 > Quick Actions > Create PDF, 선택한 순서대로, 첫 파일 이름 | https://support.apple.com/guide/mac-help/mchl21ac2368/mac |
| Mac: File > Print > PDF 팝업 > Save as PDF | https://support.apple.com/guide/mac-help/save-a-document-as-a-pdf-on-mac-mchlp1531/mac |
| Preview 인쇄: Auto Rotate, Scale to Fit | https://support.apple.com/guide/preview/print-pdfs-and-images-prvw15175/mac |
| SSIMULACRA2 점수 해석(90 visually lossless, 70 high, 50 medium) | https://github.com/cloudinary/ssimulacra2 (README, 이전 세션 확인 내용과 같음) |
| Windows Microsoft Print to PDF: support.microsoft.com 공식 문서를 찾지 못함(검색 결과 제3자·Q&A 커뮤니티 답변뿐) → 본문에 단계 없이 "테스트하지 못함"만 씀 | - |

## 한계

- Windows·macOS 내장 방법은 직접 실행하지 못함 (문서 기반, 화질·방향 미측정)
- Chromium은 Playwright 번들 141 (현재 Chrome 안정판보다 오래됨), 인쇄 대화상자가 아닌 `page.pdf()` 경로
- SSIMULACRA2는 원본 해상도 기준이라 LibreOffice(해상도 축소)에 불리. 화면 크기 기준이면 점수가 더 높을 수 있음 → 본문에 명시
