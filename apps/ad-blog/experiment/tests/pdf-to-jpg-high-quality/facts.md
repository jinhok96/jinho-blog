# pdf-to-jpg-high-quality 사실 확인표

- 주 검색어: `pdf to jpg` (+ `pdf to jpg high quality`, `pdf to jpg high resolution`, `pdf to jpg converter free`, `pdf to jpg free`, `pdf to jpg converter in pc`, `pdf to jpg converter download`, `pdf to jpg free no sign up`)
- 수요 근거 (2026-10-16): Google Trends API 429(쿠키 방식, 재시도 후 실패) → 상대 검색량 비교 없음. 자동완성 "pdf to jpg" 30개 — converter·converter free·free·canva가 Google·Bing·YouTube 3곳, high quality·iphone 2곳, high resolution·converter in pc·free no sign up. 비교 후보: "merge pdf" 28개(측정 차별점 약함: 무손실 결합), "png to jpg" 29개, "webp to jpg" 22개
- 채널: **검색형** (상시 수요, 비교 + How-to). 제목 55자, 설명 154자
- 차별점: 상위 결과가 업로드형 온라인 변환기인 검색어에서 (1) 도구별 **기본 DPI**(72·96·150·300)와 그 결과 작은 글씨 판독률(OCR), (2) **ImageMagick이 흰 배경 없는 PDF를 검은 페이지로** 만드는 문제와 해결 옵션, (3) LibreOffice가 1쪽만 내보내고 글꼴을 바꾸는 문제, (4) DPI별 크기·판독률 표
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 표기 `5 Free Offline Tools Tested`(노하우 2), 이미지 7장(노하우 7: 대표 그래프 1200×675 + DPI별 확대 비교 + DPI 크기·판독률 그래프 + ImageMagick 검은 배경 비교 + LibreOffice 글꼴 대체 비교 + LibreOffice JPEG 옵션 스크린샷 + GIMP 가져오기 대화상자 스크린샷, Xvfb에서 직접 캡처), 요약 표, 내부 링크 5개(JPG→PDF·이미지 100KB·OCR·PDF→Word·PDF 압축) + JPG→PDF 글에서 역링크. 카테고리 `software`
- 측정 환경: Ubuntu 24.04, Intel Xeon 2.80GHz 4코어, RAM 16GB, GPU 없음, 2026-10-16 (`env.txt`)

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 입력: IRS Form 1040 2025(2쪽 Letter, Designer 6.5, 글꼴 임베드), 직접 만든 보고서 1쪽(Chromium 141 인쇄, 흰 배경 없음, 7pt 각주 28단어), CC0 사진 3쪽(3000px 폭, img2pdf `Letter^T`) | `build_inputs.sh`, `mixed-test-page.html`, `pdfinfo`·`pdffonts` |
| 기본 출력 크기·품질(Letter): pdftoppm·pdftocairo 1275×1650·Q75, Ghostscript 612×792·Q76(추정, 문서 기본 75), ImageMagick 612×792·Q92, PyMuPDF 612×792·Q95(헤더 96 DPI 표기), LibreOffice 816×1056·Q75 | `summary.json` (`magick identify %w %h %Q`) |
| 3개 도구(PyMuPDF·Ghostscript·ImageMagick) 기본 72 DPI | 위 픽셀 크기 |
| OCR(Tesseract 5.3.4, psm 3) 1040 1쪽 단어 재현율: 기본 pdftoppm 80.6%, PyMuPDF 6.7%, Ghostscript 2.7%, ImageMagick 5.6%, LibreOffice 58.4%(1쪽만) / 300 DPI·Q90: pdftoppm 91.0%, PyMuPDF 90.4%, Ghostscript(AA) 90.0%, ImageMagick(흰 배경) 81.8%, LibreOffice 2550×3300 82.0% | `scores.json` `p1_recall` |
| 최고값 93%(pdftoppm 600 DPI Q75) | `scores.json` |
| Ghostscript 300 DPI: AA 없음 88.1% · 1,537KB/쪽, `-dTextAlphaBits=4 -dGraphicsAlphaBits=4` 90.0% · 1,431KB/쪽(-6.9%) | `summary.json` |
| DPI 스윕(pdftoppm, 1040, KB/쪽 Q75·Q90·1쪽 OCR Q75): 72 125·180·4.0%, 100 210·297·51.3%, 150 386·546·80.6%, 200 576·816·87.4%, 300 1,007·1,411·88.9%, 400 1,540·2,136·83.1%, 600 2,625·3,574·93.0%. Q75→Q90 크기 +40~41%, OCR ±3~5%p | `summary.json` |
| 사진 쪽 300 DPI Q90 1,779KB/쪽(본문 1.8MB) | `summary.json` `photos` |
| 7pt 각주(28단어): 72 DPI Q75 6/28(21.4%), 100 DPI 27/28, 150 DPI 이상 28/28 | `scores.json` `fine_recall` |
| ImageMagick: 보고서 PDF가 검은 배경으로 저장(기본 OCR 0%, 300 DPI 1.85%), `-background white -alpha remove` 98.2%. 1040·사진은 영향 없음 | 출력 이미지 직접 확인, 평균 밝기 0.41 vs 0.91 |
| ImageMagick은 Ghostscript를 `png16malpha` 장치·`-r72x72`로 호출, gs가 없으면 `FailedToExecuteCommand 'gs'` | `/usr/bin/gs`를 잠시 치우고 실행한 오류 메시지 |
| ImageMagick 쪽 번호 0부터(`p-0.jpg`) | 출력 파일 이름 |
| LibreOffice `--convert-to jpg`: PDF마다 JPG 1개(1040 1쪽, 사진 1쪽 — pdftoppm 1쪽과 RMSE 0.04, 2쪽과 0.50) | `runs.jsonl` files, `magick compare` |
| LibreOffice가 글꼴을 바꿔 "Digital Assets"가 옆 질문과 겹침 | 300 DPI 비교 이미지 `libreoffice-pdf-font-substitution.webp`, Draw 화면 |
| LibreOffice Draw JPEG Options 기본: 8.50×11.00 inches, 38 pixels/cm, 24-bit, Quality 75, 예상 188.4 kB | Xvfb 스크린샷 `libreoffice-draw-jpeg-options.webp` |
| GIMP 3.2.6 PDF 가져오기 기본: Open pages as Layers, 2550×3300, 300 pixels/in, Use Anti-aliasing·Fill transparent areas with white 체크, Select range 칸 | Xvfb 스크린샷 `gimp-import-pdf-300-dpi.webp`. 열린 이미지 2550×3301·2 layers(창 제목) |
| GIMP Linux AppImage에 libpoppler.so.147·libpoppler-glib 포함 | AppImage 압축 해제 후 `usr/lib/x86_64-linux-gnu` |
| 시간(3회 중앙값, 300 DPI Q90) 1040·보고서·사진: pdftoppm 0.46·0.28·1.05초(합 1.8), Ghostscript AA 0.90·0.48·1.50(합 2.9), PyMuPDF 1.14·0.65·2.73(합 4.5), ImageMagick 흰 배경 4.56·2.41·14.47 · 최대 500MB(자식 gs 포함). LibreOffice 2550 0.85~1.63초 | `runs.jsonl` (`os.wait4` ru_maxrss) |
| Poppler 24.02(Ubuntu)와 26.10.0(소스 빌드) pdftoppm 출력 바이트 동일 | `md5sum` |
| Ghostscript `-o` 명령(본문 명령)과 `-sOutputFile` + `-dNOPAUSE -dBATCH` 출력 동일 | `cmp` |
| 72 DPI에서 3000px 사진 → 792px 폭 페이지 | 사진 PDF 기본 출력 792×612 |

## 문서 (2026-10-16 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| pdftoppm `-r` 기본 150, `-f`/`-l`, `-png`, `-jpegopt` | `pdftoppm -h` (24.02·26.10) |
| Poppler 최신 26.10.0, 사이트에 소스 tarball과 CI(AppVeyor Windows) 링크 | https://poppler.freedesktop.org/ |
| Homebrew `poppler` 26.10.0, `ghostscript` 10.08.0 | https://formulae.brew.sh/api/formula/poppler.json, ghostscript.json |
| Ghostscript: 기본 해상도 "usually 72 dpi", JPEGQ 기본 75, AlphaBits는 "control the use of subsample antialiasing" | https://ghostscript.readthedocs.io/en/latest/Devices.html |
| Ghostscript Windows 콘솔 실행 파일 `gswin64c`, `-o`가 `-dBATCH -dNOPAUSE` 포함 | https://ghostscript.readthedocs.io/en/latest/Use.html |
| Ghostscript for Windows (64 bit) 다운로드 | https://ghostscript.com/releases/gsdnld.html |
| ImageMagick `-density` 기본 72 DPI("one point per pixel"), PDF 등 벡터 형식 읽을 때 적용, `-alpha remove` "Composite the image over the background color", JPEG 품질 기본은 입력 추정값 또는 92 | https://imagemagick.org/command-line-options/ |
| ImageMagick 최신 7.1.2-34, Windows 설치 파일 | https://imagemagick.org/download/ |
| PyMuPDF `get_pixmap(*, matrix=Identity, dpi=None, ..., alpha=False)`, `save(..., jpg_quality=95)` | https://pymupdf.readthedocs.io/en/latest/page.html, `help(pymupdf.Pixmap.save)` |
| PyMuPDF 1.28.2, AGPL 3.0 또는 Artifex 상용 라이선스 | https://pypi.org/pypi/pymupdf/json |
| Mac Preview: File > Export, Format에서 JPEG, 품질 조절, Save. PDF 여러 쪽·해상도 언급 없음 | https://support.apple.com/guide/preview/convert-image-file-types-prvw1012/mac |
| IRS Form 1040 2025 | https://www.irs.gov/pub/irs-pdf/f1040.pdf |
| PD12M CC0 사진 | `convert-heic-to-jpg-free/sources.json` (14·15·18번) |

## 한계

- Mac Preview·Windows 내장 방법은 직접 실행하지 못함 (Apple 문서만, 해상도 미확인). Apple 공식 문서에는 PDF→JPEG 전용 안내가 없음
- GIMP는 가져오기 대화상자 기본값만 확인, 출력 파일은 측정하지 않음(xdotool 입력이 내보내기 창에 전달되지 않아 중단)
- OCR 재현율은 판독성의 대리 지표. 같은 DPI에서도 ±3~5%p 흔들림(400 DPI가 300보다 낮음)
- 입력 PDF 3개로 일반화에 한계. ImageMagick 검은 배경은 흰 배경을 칠하지 않는 PDF에서만 발생
