# convert-pdf-to-word-offline-free 사실 확인표

- 주 검색어: `pdf to word offline` (+ `convert pdf to word free`). Trends 미국 3개월: `pdf to word` 23.4 (기준 `remove background` 35.3), `passkey` 16.6, `heic to jpg` 8.6, `compress pdf` 4.9, `upscale image` 1.3
- 하위 검색어 (2026-10-15 `demand_check.py suggest`): pdf to word offline converter (Google·Bing·YouTube), pdf to word offline converter free download, pdf to word offline tool, convert pdf to word offline, pdf to word offline for pc, convert pdf to word free no sign up, convert pdf to word free ocr, convert pdf to editable word document free
- 채널: **검색형** (상시 수요, 비교·측정). 제목 53자, 설명 156자
- 차별점: 상위 결과가 온라인 변환기(업로드)인 검색어에서 "업로드 없이" 조건. 정답을 아는 PDF 11개로 무료 오프라인 도구 3개를 직접 측정 (편집 가능한 문단·실제 Word 표·텍스트 상자 비율), 변환 후 문장을 넣어 보는 편집 테스트, 스캔 PDF는 OCR 후 재변환까지
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 표기 `(3 Tools Tested)`(노하우 2), 이미지 5장(노하우 7: 대표 그래프 1200×675 + 속도·메모리 그래프 + 송장 표 비교 + 편집 테스트 + 2단 뉴스레터 비교), 요약 표, 내부 링크 4개(OCR 글·허브·받아쓰기·배경 제거) + OCR 글에서 역링크. 카테고리 `software` (ToolProof 첫 비 AI 도구 측정 글)
- 측정 환경: Linux, Intel Xeon 2.80GHz 4코어, RAM 16GB, GPU 없음, 2026-10-15 (`env.txt`)

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 테스트 PDF 11개(텍스트 10개 15쪽 + 스캔 1개), 정답 텍스트·표·이미지 수 | `gen.py` → `truth.json` (본문: Project Gutenberg 퍼블릭 도메인 3권, 표·송장·이력서는 가상 값). 01~08 ReportLab 5.0.1, 09~10 python-docx → LibreOffice 24.2 PDF 내보내기, 11 = 01을 200dpi 이미지로 |
| 3개 도구 변환, 파일당 1회 실행 × 3회 | `bench.sh` (LibreOffice 26.8.1 `--infilter=writer_pdf_import`, `pdf2docx convert`, `ebook-convert`) |
| 문단 유지: pdf2docx 95.5%(글·그래프 96%), Calibre 84%, LibreOffice 0% | `summary.json` `overall.para_intact` |
| 표 재구성(격자 표 4개): pdf2docx 4, LibreOffice 0, Calibre 0. 이력서 테두리 없는 표는 pdf2docx도 정렬된 텍스트 줄 | `summary.json` `tables_ok`, `docs.07-resume` |
| 텍스트 상자 비율: LibreOffice 100%, 나머지 0% | `summary.json` `textbox_share` |
| 단어 보존: 텍스트 PDF 10개에서 3개 도구 모두 100%, 이미지 3/3 | `summary.json` `word_recall`, `images` |
| 속도(중앙값)·최대 메모리: pdf2docx 0.68초·125MB, LibreOffice 0.71초·202MB, Calibre 0.94초·100MB (Calibre 06은 1.03초) | `summary.json` `sec_median`·`rss_gb_max` (/usr/bin/time -v) |
| LibreOffice 편지 = 텍스트 상자 26개(한 줄씩), pdf2docx 문단 10개 | `summary.json` `docs.01-letter.out_paragraphs` |
| 쪽 수: LibreOffice 10개 모두 원본과 같음, pdf2docx 뉴스레터 2→3쪽, Calibre 일정표 1→2·09 2→4쪽(목차 페이지 생성) | 변환 결과를 LibreOffice 24.2로 PDF 저장 후 `pdfinfo` |
| 2단 뉴스레터: 순서 유지 pdf2docx 10/10, LibreOffice·Calibre 2/10 (LibreOffice는 문서 안 텍스트 상자 순서가 두 단을 번갈아, Calibre는 두 단을 한 단으로 섞음) | `summary.json` `order_intact`, LibreOffice document.xml 첫 문단 순서 확인 |
| 송장: LibreOffice 표 머리글 행 글자가 음영 뒤로 가려짐(파일에는 글자 있음), pdf2docx 머리글 음영 유지, Calibre 셀 값이 한 줄씩 나열 | 렌더링 이미지 `pdf-to-word-invoice-table-comparison.webp` |
| 편집 테스트: LibreOffice는 추가 문장 앞부분만 보이고 다음 줄 그대로, pdf2docx·Calibre는 문단이 다시 흐름 | `edit_test.py` → 렌더링 `pdf-to-word-editing-test.webp` |
| 목록: 어느 도구도 Word 자동 목록을 안정적으로 만들지 않음 (`w:numPr` LibreOffice 0, pdf2docx 0, Calibre 09 파일에서만 3). pdf2docx는 09의 글머리표 목록을 테두리 없는 1행 표로 | document.xml 검사 |
| 머리글·쪽 번호: 3개 모두 본문 텍스트로 유지, Word 머리글/바닥글 파트 없음 | document.xml·header*.xml 검사 |
| 스캔 PDF: 3개 모두 단어 0% (페이지 이미지 1장만) | `summary.json` `scanned_word_recall` |
| OCRmyPDF 17.13.0(Tesseract 5.3.4) 3.08초 후 재변환: LibreOffice 95.5% 단어(텍스트 상자), pdf2docx·Calibre 0% | `ocr_test.py` → `ocr_summary.json` |
| LibreOffice 26.8 `--convert-to docx`를 `--infilter` 없이 실행하면 "no export filter" 오류 | 컨테이너에서 직접 실행 (24.2도 같음) |
| LibreOffice 메뉴 이름 "PDF - Portable Document Format (Writer)"·"(Draw)", 저장 형식 "Word 2010–365 Document" | LibreOffice 26.8.1 `share/registry/pdfimport.xcd`·`writer.xcd`의 UIName |
| pdf2docx MIT, PyMuPDF AGPL 3.0 또는 상용 이중 라이선스, OCRmyPDF MPL-2.0 | 설치된 패키지 METADATA |

## 문서 (2026-10-15 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| LibreOffice 최신 26.8.1, Windows·macOS·Linux, 소스는 MPL 2.0 | https://www.libreoffice.org/download/download-libreoffice/ |
| Word: File > Open → 복사본 변환 안내 → OK. "works best with PDFs that are mostly text", 변환이 잘 안 되는 요소(셀 간격 있는 표, 프레임, 여러 쪽에 걸친 각주, 미주, PDF 주석 등). Microsoft 365·2024·2021·2019·2016. 변환 위치(로컬 여부)는 언급 없음 | https://support.microsoft.com/en-us/office/opening-pdfs-in-word-1d1d2acc-afa0-46ef-891d-b76bcd83d9c8 , https://support.microsoft.com/en-us/office/edit-a-pdf-b2d1d729-6b79-499a-bcdb-233379c2f63a |
| Google Docs: Drive에서 우클릭 > Open with > Google Docs, 2MB 이하, "Lists, tables, columns, footnotes, and endnotes are not likely to be detected" | https://support.google.com/drive/answer/176692?hl=en |
| Calibre 출력 형식에 DOCX 포함 | https://manual.calibre-ebook.com/faq.html |
| Calibre: PDF는 "one of the worst formats to convert from", 다단·이미지 기반 문서 미지원, 표 추출 미지원 | https://manual.calibre-ebook.com/conversion.html |
| Tesseract 기본 설정이 스캔 10장 모두 거의 완벽 | 기존 측정 `tests/image-to-text-offline-free/summary.json` |

## 쓰지 않은 것

- Calibre 최신 버전(apt 7.6.0만 측정, download.calibre-ebook.com은 TLS 오류로 접속 실패) → 글에 "newer versions may behave differently"
- 변환 결과 화면은 Microsoft Word가 아니라 LibreOffice Writer 24.2로 렌더링 → 글에 명시. LibreOffice 26.8(압축 해제본)로 렌더링하면 Helvetica가 Noto Serif로 대체돼 글자가 잘려 보였음 → 시스템 24.2(Liberation Sans, Helvetica와 글자 폭 호환)로 다시 렌더링
- Word·Google Docs·PDF24 등은 실행하지 못해 측정 대상에서 제외 (Word·Google Docs는 문서 기반으로만 소개)
