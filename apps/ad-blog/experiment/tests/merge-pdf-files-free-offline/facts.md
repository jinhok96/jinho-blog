# merge-pdf-files-free-offline 사실 확인표

- 주 검색어: `merge pdf files free` (+ `merge pdf offline`, `combine pdf files into one`, `merge pdfs on mac`, `combine pdfs in preview on mac`, `merge pdf free download`, `merge pdf 24`, `merge pdf files into one free`)
- 수요 근거 (2026-10-16): Google Trends(미국 3개월, 3회 429 후 응답) 기준 `remove background` 35.1 · `merge pdf` **6.3** · `png to jpg` 3.9 · `webp to jpg` 1.9 · `upscale image` 1.3. 자동완성 "merge pdf" 28개(files·files free·free·online·adobe가 Google·Bing, merge pdf가 3곳, offline·free download·mac·iphone), "combine pdf" 24개(files free 3곳, into one·mac·preview on mac·microsoft edge)
- 채널: **검색형** (상시 수요, 비교 + How-to). 제목 48자, 설명 158자
- 차별점: "무손실 결합"이라 차이가 없어 보이는 작업에서 **합친 뒤 무엇이 깨지는지**를 측정. (1) 책갈피·목차 링크가 도구 6개 중 3개에서 사라지거나 동작하지 않음, (2) 같은 양식 2부를 합치면 pypdf·pdfunite 결과에서 한쪽에 입력한 값이 다른 쪽에도 들어감(Chrome PDF 뷰어에서 직접 입력), (3) Ghostscript는 양식을 평면화. 기본 설정으로 4항목을 모두 지킨 도구는 pdftk뿐, 문서에 있는 옵션(`add_form_topname`)을 쓴 pypdf도 통과
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 표기 `6 Tools Tested`(노하우 2), 이미지 6장(노하우 7: 대표 점검표 1200×675 + Chrome 양식 입력 비교 + Chrome 책갈피 사이드바 + Chrome 목차 링크 클릭 결과 + Ghostscript 평면화 비교 + 속도·메모리 그래프, 모두 직접 캡처·생성), 요약 표, 내부 링크 5개(PDF 압축·PDF→JPG·JPG→PDF·PDF→Word·OCR) + PDF 압축 글에서 역링크. 카테고리 `software`
- 측정 환경: Ubuntu 24.04.5, Intel Xeon 2.10GHz 4코어, RAM 16GB, GPU 없음, 2026-10-16 (`env.txt`)

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 입력 5개 21쪽 5.6MB(5,623,998바이트): 직접 만든 3쪽 보고서 2개(Chromium 141 인쇄, 책갈피 4개·목차 링크 3개·외부 링크 1개씩), IRS Form W-9(Rev. March 2024, 6쪽, 양식 칸 23개) 2부(1번 칸에 `TEST VENDOR ONE LLC`·`TEST VENDOR TWO LLC`), CC0 사진 3쪽(3000px 폭 JPEG, img2pdf) | `build_inputs.py`, `summary.json` `expected` |
| 순서: 보고서 A → W-9 A → W-9 B → 사진 → 보고서 B | `run_tests.py` `IN` |
| 도구·버전: qpdf 12.4.2, pdfunite(Poppler 26.10.0), Ghostscript 10.08.0, pdftk-java 3.3.3(OpenJDK 21), pypdf 6.21.0, PyMuPDF 1.28.2 | `env.txt` |
| 책갈피(8개 중 대상 쪽까지 맞는 수): pdftk·pypdf·Ghostscript 8, qpdf·pdfunite·PyMuPDF 0 | `summary.json` `toc_correct`, Chrome 사이드바 캡처 |
| 목차 링크(6개 중 맞는 쪽으로 가는 수): pdftk·pypdf·Ghostscript 6, qpdf·pdfunite 0(링크는 남지만 이름 목적지 `/Dests`가 빠짐), PyMuPDF 0(문서 안 링크 자체를 뺌) | `summary.json` `internal_links_ok`, `internal_links`; Chrome에서 "Measurements" 클릭 → pdftk·pypdf·Ghostscript 2/21, 나머지 1/21 그대로 (`chrome_tests.json`) |
| 외부 링크 2개는 6개 도구 모두 유지 | `summary.json` `external_links` |
| 양식: qpdf(`topmostSubform[0]+1`), pdftk(`1.` 접두사), PyMuPDF(`[215]` 덧붙임)는 두 번째 W-9 칸 이름을 바꿔 분리. pypdf는 같은 이름 그대로, pdfunite는 AcroForm 사전 자체를 빼고 같은 이름 | `summary.json` `name_fields`, `acroform` |
| Chrome 141 PDF 뷰어에서 4쪽 Name 칸에 입력 → pypdf·pdfunite 결과는 10쪽 값도 바뀜, qpdf·pdftk·PyMuPDF·pypdf+`add_form_topname`은 10쪽 유지 | `chrome_form_test.py`, `chrome_tests.json`, 이미지 `merged-w9-form-fields-chrome.webp` |
| Ghostscript: 양식 칸 0개(평면화, 값은 페이지 글자로 남음 `TEST VENDOR ONE LLC`), Chrome에서 파란 입력 칸 없음 | `summary.json` `widgets`, `pdftotext -f 4 -l 4`, 이미지 `ghostscript-flattened-w9-chrome.webp` |
| Ghostscript 결과 문서 제목(Title)이 마지막 파일의 "Test report B" | `pdfinfo`, Chrome 탭 제목 |
| 사진 3장: 6개 도구 모두 픽셀 동일(디코딩 후 MD5), Ghostscript 10.08 포함 모두 JPEG 스트림 바이트 동일 (10.02.1은 끝에 2바이트 덧붙임, 픽셀 동일) | `summary.json` `photos_pixels_identical`, `photos_stream_identical` |
| 쪽별 텍스트(pdftotext)가 입력과 같음: Ghostscript 외 21/21, Ghostscript 17/21(W-9 쪽, 평면화된 값 포함) | `summary.json` `text_pages_identical` |
| qpdf 변형: 첫 파일을 기본 입력으로(`qpdf a.pdf --pages . b.pdf … -- out.pdf`) → 책갈피 4/8·목차 링크 3/6 (첫 파일 것만) | `summary.json` `qpdf-primary` |
| pypdf 변형: 양식이 있는 파일에 `add_form_topname("file2")` 등 → 책갈피 8/8·링크 6/6·양식 분리 | `summary.json` `pypdf-topname`, Chrome 캡처 |
| 시간(3회 중앙값)·최대 메모리: qpdf 0.06초·22MB, pdfunite 0.16·11, PyMuPDF 0.16·58, pypdf 0.24·42, Ghostscript 0.50·30, pdftk 0.61·87 (Python·Java 시작 포함) | `runs.jsonl` |
| 결과 크기 5.24~5.33MB (입력 합 5.62MB보다 작음, 원인은 따로 분석하지 않음 → 본문에 크기 비교 없음) | `summary.json` `bytes` |
| pdfunite 26.10 결과를 poppler `pdfinfo`가 열면 "Internal Error: xref num … not found", qpdf --check 경고(객체 수 불일치). Ubuntu 24.02와 같은 결과 | 직접 실행 |
| Poppler 24.02(Ubuntu)와 26.10 pdfunite: 분석 항목 모두 같음 | `analyze.py` 비교 |
| pdftk `*.pdf cat output merged.pdf` 두 번째 실행: "The given output filename: merged.pdf matches an input filename. Exiting." → 출력 안 만듦. `A=report-a.pdf B=w9-a.pdf cat A1-3 B1` → 4쪽 | 직접 실행 |
| Chrome에서 같은 이름 칸을 한 칸처럼 취급(한쪽 입력이 다른 쪽에 반영) | Chrome 양식 테스트 |
| 대표 이미지 1200×675, 본문 이미지 6장 | `charts.py` |

## 문서 (2026-10-16 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| qpdf: 책갈피·양식 등 문서 수준 정보는 기본 입력(primary input)에서만 복사, `--empty`는 빈 파일에서 시작 | https://qpdf.readthedocs.io/en/stable/cli.html ("Limitations", "--pages") |
| PyMuPDF `insert_pdf`: 이름 링크(LINK_NAMED) 항상 제외, 원본 TOC 복사 안 함, `join_duplicates=False`면 겹치는 칸 이름에 문자열 덧붙임 | https://pymupdf.readthedocs.io/en/latest/document.html#Document.insert_pdf |
| pypdf: 양식을 합치면 같은 이름 칸이 생길 수 있어 `add_form_topname`으로 그룹 이름을 붙이라고 안내 | https://pypdf.readthedocs.io/en/stable/user/merging-pdfs.html ("Merging forms") |
| Ghostscript pdfwrite: Link·Widget 주석은 주석으로 보존하지 않음, Outlines는 pdfmark로 보존 | https://ghostscript.readthedocs.io/en/latest/VectorDevices.html (`-dPreserveAnnots`, `-dNO_PDFMARK_OUTLINES`) |
| Mac Preview 합치기: View > Thumbnails, 썸네일 끌어 놓기, Finder에서 PDF 아이콘 끌기, 변경 자동 저장 → File > Duplicate | https://support.apple.com/guide/preview/combine-pdfs-prvw43696/mac |
| PDF24 Creator: Windows 10·11 전용, 오프라인, 무료, Merge 기능 | https://tools.pdf24.org/en/creator |
| PDFtk Server 2.02 Windows 설치 파일, GPL 무료 | https://www.pdflabs.com/tools/pdftk-server/ |
| pdftk-java: 최신 v3.3.3 (2022-09-22), Homebrew·Debian/Ubuntu 패키지 | GitLab API releases, README (gitlab.com/pdftk-java/pdftk), formulae.brew.sh `pdftk-java` 3.3.3 |
| 최신 버전: qpdf 12.4.2, Ghostscript 10.08.0 (Homebrew formulae API) | formulae.brew.sh |

## 직접 확인하지 못한 것

- Mac Preview·PDF24 Creator·PDFtk Server(Windows, C++ 원본)·Adobe Acrobat·온라인 도구(iLovePDF·Smallpdf): 실행하지 않음 → 본문에 "not tested" 명시
- Adobe Acrobat·Firefox(pdf.js)에서 같은 이름 양식 칸 동작: 확인 안 함 (Chrome만)
