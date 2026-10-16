# compress-pdf-offline-free 사실 확인표

- 주 검색어: `compress pdf` (+ `compress pdf offline`). Trends 미국 3개월(2026-10-16): `compress pdf` 4.8 (기준 `remove background` 34.9), `mp4 to mp3` 8.7, `compress video` 2.4, `reduce pdf size` 1.9
- 하위 검색어 (2026-10-16 `demand_check.py suggest`): compress pdf file (Google·Bing·YouTube), compress pdf free, compress pdf on mac, compress pdf size, compress pdf without losing quality, compress pdf offline (Google·Bing·YouTube), compress pdf offline windows 10/11, compress pdf offline free download, compress pdf offline mac. 하위 검색어 31개 + 12개
- 채널: **검색형** (상시 수요, 비교·측정 + How-to). 제목 48자, 설명 152자
- 차별점: 상위 결과가 업로드형 온라인 압축기인 검색어에서, 무료 오프라인 도구 3개·설정 10개를 직접 만든 PDF 4개로 측정. 크기뿐 아니라 **글자 판독(OCR 재현율)·쪽별 SSIM·링크·텍스트 층**까지 확인 → "Ghostscript가 텍스트·스크린샷 PDF를 오히려 키움", "/screen은 글자를 OCR이 21~24% 못 읽을 만큼 흐림" 같은 결과
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 표기 `(3 Tools Tested)`(노하우 2), 이미지 6장(노하우 7: 대표 그래프 1200×675 + 판독률 그래프 + 속도·메모리 그래프 + 사진·스캔·슬라이드 확대 비교 3장, 모두 직접 측정·렌더링. 앱 화면 스크린샷은 없음: 세 도구 모두 명령줄 도구), 요약 표, 내부 링크 4개(OCR·PDF→Word·HEIC→JPG·허브) + PDF→Word 글에서 역링크. 카테고리 `software`
- 측정 환경: Ubuntu 24.04.5, Intel Xeon 2.10GHz 4코어, RAM 16GB, GPU 없음, 2026-10-16 (`env.txt`)

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 테스트 PDF 4개(46쪽, 합계 48.1MB): 사진 안내서 8쪽 39.6MB(CC0 카메라 JPEG 8장 원본 그대로 삽입, 12~20MP, 쪽마다 링크 1개), 스캔 편지 6쪽 7.1MB(300dpi 컬러 JPEG q92, 0.4° 기울임·종이색·노이즈, 텍스트 층 없음), 슬라이드 12쪽 1.4MB(1920×1080 PNG, 18px 글자·단색 막대), 텍스트 보고서 20쪽 86KB(DejaVu 글꼴 포함, 벡터 차트 3개, 쪽마다 링크) | `gen.py`, `truth.json`. 사진 출처는 `../convert-heic-to-jpg-free/sources.json` 1~8번 (PD12M, CC0) |
| ReportLab 기본값(`useA85=1`)은 이미지를 ASCII85로 한 번 더 감싸 파일이 약 25% 커지고 OCRmyPDF가 "multiple compression filters"로 최적화를 건너뜀 → `useA85=0`으로 생성 (실제 앱 PDF와 같게) | 첫 생성 결과(46.4MB)·OCRmyPDF `-v 1` 로그 |
| 도구: Ghostscript 10.08.0(공식 소스 빌드), qpdf 12.4.2(공식 Linux 바이너리 zip, sha256 `env.txt`), OCRmyPDF 17.13.0(PyPI) + pngquant 2.18.0, jbig2enc 없음 | `bench.sh`, `env.txt` |
| 설정 10개: qpdf 무손실(`--object-streams=generate --compress-streams=y --recompress-flate --compression-level=9`), qpdf `--optimize-images`, Ghostscript 프리셋 없음·`/screen`·`/ebook`·`/printer`·`/prepress`, OCRmyPDF `--ocr-engine none --skip-text --output-type pdf -O 1/2/3` | `bench.sh` |
| 크기(원본 대비): OCRmyPDF -O3 사진 14%(5.51MB)·스캔 33%(2.34MB)·슬라이드 29%(403KB)·텍스트 89%, 합계 8.33MB(17.3%). GS /ebook 4%(1.57MB)·19%(1.37MB)·115%·133%, 합계 4.64MB(9.7%). GS /screen 1%·7%·76%·133%, 합계 2.17MB(4.5%). qpdf 100%·100%·88%·87%, 합계 99.6% | `summary.json` `ratio`·`bytes` |
| Ghostscript는 모든 프리셋에서 텍스트 보고서를 키움(133~140%), /screen 외 모든 프리셋에서 슬라이드를 키움(115%) | `summary.json` |
| qpdf `--optimize-images`는 네 파일 모두 무손실 qpdf와 같은 크기 | `summary.json` `qpdf-oi` |
| OCR 단어 재현율(Tesseract 5.3.4 `--psm 6`, 스캔 300dpi·슬라이드 200dpi 렌더링): GS /screen 스캔 79.2%·슬라이드 76.3%, 나머지 모든 설정과 원본 100% | `summary.json` `ocr_recall`, `score.py` |
| 쪽별 SSIM(100dpi 흑백): GS /ebook 사진 5쪽 0.798(전체 최저), /screen 최저 0.853, OCRmyPDF -O3 최저 0.988(사진), 스캔 0.997·슬라이드 1.000 | `summary.json` `ssim_min`·`ssim_median`, 쪽별 값은 세션 중 직접 계산 |
| 링크 28개(사진 8·보고서 20) 모든 설정에서 유지, 텍스트 층 있는 2개 파일의 pdftotext 결과가 원본과 동일 | `summary.json` `links`, pdftotext md5 비교(세션 중) |
| OCRmyPDF -O3는 사진 해상도 유지(첫 사진 5456×3632), GS /ebook은 약 150ppi(1125~1152px)로 축소. OCRmyPDF -O2/-O3는 슬라이드 PNG를 4비트(16색) 인덱스 이미지로 변환 | `pdfimages -list` |
| 시간·메모리(3회 중앙값, 사진 안내서): qpdf 0.08초·27MB, OCRmyPDF -O3 2.01초·817MB, GS /ebook 4.00초·86MB, /screen 2.79초·85MB, /printer 6.14초·86MB. OCRmyPDF 스캔 최대 5.09초 | `timing.tsv`, `summary.json` `sec`·`ram_mb` (`/usr/bin/time -f %M`) |
| Ubuntu 24.04 apt Ghostscript는 10.02.1, `ocrmypdf` 패키지는 ghostscript·tesseract-ocr에 의존 | `gs --version`(apt 설치), `apt-cache depends ocrmypdf` |

## 문서 (2026-10-16 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| Ghostscript 최신 10.08.0 (2026-09-08) | https://ghostscript.readthedocs.io/en/latest/News.html |
| PDFSETTINGS: /screen 72dpi·/ebook 150dpi 다운샘플, /printer·/prepress 300dpi 다운샘플 안 함 | https://ghostscript.readthedocs.io/en/latest/VectorDevices.html |
| Windows 64비트 명령줄 실행 파일 `gswin64c` | https://ghostscript.readthedocs.io/en/latest/Install.html |
| Windows 64비트 AGPL 릴리스 다운로드 | https://www.ghostscript.com/releases/gsdnld.html |
| qpdf 최신 12.4.2 (2026-09-26), `--jpeg-quality` 12.1.0 추가 | https://qpdf.readthedocs.io/en/stable/release-notes.html |
| qpdf 변환 옵션은 "change the structure of a PDF file without changing its content" | https://qpdf.readthedocs.io/en/stable/cli.html |
| OCRmyPDF -O1 무손실, -O2 손실 JPEG·색 양자화, -O3 더 공격적. pngquant는 설치돼 있을 때만 사용, jbig2enc는 직접 설치 | https://ocrmypdf.readthedocs.io/en/latest/optimizer.html |
| OCR 없이 이미지 최적화: `--ocr-engine none --optimize 3 --skip-text` | https://ocrmypdf.readthedocs.io/en/latest/cookbook.html |
| Windows 설치: winget으로 Tesseract·uv, `uv tool install ocrmypdf`, Ghostscript는 winget에 없어 따로 설치, pngquant 선택. macOS `brew install ocrmypdf`(Tesseract·Ghostscript·jbig2enc·pngquant 포함), Ubuntu `apt install ocrmypdf` | https://ocrmypdf.readthedocs.io/en/latest/installation.html |
| Mac Preview: File > Export > Quartz Filter > Reduce File Size, "may be of lower quality than the original" | https://support.apple.com/guide/preview/compress-a-pdf-prvw1509/mac |
| Gmail 개인 계정 첨부 25MB, 초과 시 Google Drive 링크로 바뀜 | https://support.google.com/mail/answer/6584 |
| PDF24 Creator: Windows 전용, 무료, 오프라인("NOT uploaded"), 압축 도구 포함, 최신 11.31.1 (측정 안 함) | https://tools.pdf24.org/en/creator |

## 쓰지 않은 것

- Mac Preview·PDF24 Creator 결과: 실행 불가(Linux 컨테이너) → 문서 기반으로만 소개, "we didn't test" 명시
- Ghostscript가 텍스트 PDF를 키우는 원인(글꼴 재포함 등): 원인을 확인하지 않아 쓰지 않음
- pngquant 없는 Windows 환경의 결과: 측정하지 않음 → "likely smaller savings on screenshots"로만 표현
