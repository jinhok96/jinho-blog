# jpg-to-pdf-free 사실 확인표

- 주 검색어: `jpg to pdf` (+ `jpg to pdf free`, `jpg to pdf converter free`, `jpg to pdf merge`·`combine`, `jpg to pdf high quality`, `jpg to pdf on mac`, `jpg to pdf windows 11`, `image to pdf`)
- 수요 근거 (2026-10-18): 자동완성 "jpg to pdf" 32개(converter·free가 Google·Bing·YouTube 3곳, converter free·free online·merge 2곳, high quality·on mac·windows 11·no sign up). Google Trends 미국 3개월 평균, 기준 `remove background` 35.3 — `jpg to pdf` **13.1** · `pdf to jpg` 13.0 · `image to pdf` 7.9 · `compress pdf` 4.8. backlog 43번(2026-10-17 명령줄 글 삭제 → GUI 앱으로 새로 쓸 후보), 세션 21 다음 할 일 "PDF GUI 시리즈"
- 채널: **검색형** (상시 수요, How-to + 측정). 제목 50자(`<title>` 62자), 설명 160자
- 차별점: 상위 결과가 업로드형 온라인 변환기인 검색어에서, 설치형 GUI 2개 + Chrome을 같은 사진 10장(세로 2장 EXIF Orientation=6)으로 측정. (1) 세로 사진 방향(3곳 모두 바로 섬), (2) 사진 데이터 보존(PDF Arranger 10/10, Sejda 세로 2장 다시 저장, Chrome 세로 사진 무압축 저장 → 1.85MB가 21.6MB), (3) 기본 페이지 크기(PDF Arranger 사진 크기 56×42인치, Sejda A4, Chrome A4 + 날짜·파일 경로 머리글), (4) Chrome Landscape 레이아웃에서 2쪽으로 넘침과 해결 설정, (5) Sejda 무료판 한도(5MB 표기와 실제 동작 차이, 하루 3회)
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 표기 `(3 Ways Tested)`(노하우 2), 이미지 8장(노하우 7: 대표 점검표 1200×675 + 사진 크기 그래프 1200×675 + PDF Arranger 화면 2 + Sejda 화면 2 + Chrome 화면 2, 모두 Xvfb에서 직접 캡처), 요약 표, 내부 링크 4개(PDF 합치기·HEIC→JPG·이미지 100KB·PDF 나누기) + `merge-pdf-files-free` 역링크 1문장. 카테고리 `software`
- 측정 환경: Linux 컨테이너(Intel Xeon 2.10GHz), PDF Arranger 1.14.0·Sejda PDF Desktop 7.9.10(Flathub), Chromium 141.0.7390.37, 2026-10-18 (`env.txt`)

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 입력: CC0 사진 8장(PD12M 01~08, `convert-heic-to-jpg-free/sources.json`) → 4032×3024 가운데 자르기, 품질 92·4:2:0·72 DPI JPEG + 세로 사진 2장(03·08의 세로 자르기, 픽셀은 눕혀 저장 + EXIF Orientation=6). 0.87~5.48MB, 합계 22,555,152바이트(22.6MB). 세로 09 1,853,453 / 10 1,866,130바이트 | `build_set.py` |
| PDF Arranger: 파일 인자로 10장 열기 → Ctrl+Shift+S 저장. 22,561,369바이트(+6,217), 10/10 JPEG 바이트 동일, 세로 2장은 페이지 /Rotate 90으로 바로 섬, 페이지 4032×3024pt(상태 표시줄 1422.4 mm × 1066.8 mm = 56×42인치) | `analyze.py` → `results.jsonl` (`pdfarranger-default.pdf`), 화면 캡처 |
| PDF Arranger 열기 대화상자 필터 "All supported files"에 JPG가 보임 | 화면 캡처 (pa12) |
| PDF Arranger Page Size(전체 선택 후 S): Fit to paper·US Letter·Landscape·Fit mode Scale → 가로 사진 792×594pt(11×8.25인치), 세로 사진 612×459pt + /Rotate 90(6.375×8.5인치), 사진 바이트 동일 4/4. 4장 7,348,005바이트 | `pdfarranger-letter.pdf`, `pdfinfo`, 화면 캡처 |
| Sejda JPG to PDF 기본값: Page size A4 (8.27 x 11.69), Page orientation Auto, Margin None, Merge into one document 체크. Page size 메뉴: Fit to image, Custom size, A5~A1, Letter (8.5 x 11), Legal, Ledger, Tabloid, Executive. Margin: None, Small margin 0.5", Large margin 1" | 화면 캡처 |
| Sejda 시작 화면 문구 "Files are processed locally." "Free service for documents up to 30 pages or 5 MB and 3 tasks per day." | 화면 캡처 |
| Sejda 기본 변환(10장, 22.6MB 입력): 20,691,487바이트, 가로 8장 바이트 동일, 세로 2장은 돌려서 다시 저장(3024×4032, 905,079·946,696바이트), 10/10 바로 섬. Letter+Small margin 20,691,394바이트(612×792·792×612pt), Fit to image 20,691,418바이트(사진 크기 페이지) | `results.jsonl` |
| Sejda 세로 사진 다시 저장 차이: 평균 절대 차이 1.325·1.304(0~255, 약 0.5%), 최대 28, 99백분위 5. PSNR 43.06·43.10 dB | `sejda_portrait_diff.py`, `analyze.py` `psnr_vs_input` |
| Sejda 4번째 변환: "Upgrade required" "You reached your free limit of 3 tasks per day. Upgrade to continue now, or take a break for 23:55:38." (변환 3회 성공 후) | 화면 캡처 |
| Chrome: file:// 로 JPG 열기 → Ctrl+P. 기본 Destination Save as PDF, Layout Portrait, Paper size A4(컨테이너 환경), Margins Default, Scale Default, Headers and footers 체크 → 날짜·시각, 파일 이름(픽셀 크기), file:// 경로, 쪽 번호 인쇄 | 화면 캡처 `chrome-print-preview-default.png`·`chrome-more-settings.png` |
| Chrome 가로 사진 01 기본: 893,958바이트, JPEG 바이트 동일, 세로 A4 페이지 | `chrome-01-default.pdf` |
| Chrome 세로 사진 09 기본: 21,575,104바이트(원본 1,853,453의 11.6배), 이미지 FlateDecode 4032×3024 21,553,862바이트, 디코딩 픽셀은 원본과 동일(PSNR 99=무손실), 바로 선 모습 | `chrome-09-default.pdf`, `pdfimages -list` |
| Chrome Layout Landscape(Default 배율): 2쪽(2쪽째에 사진 띠), Margins None에서도 2쪽, Margins None + Scale Custom 90 → 1쪽(841.9×595pt). Layout 설정은 다음 인쇄에 유지됨(새로고침 후 Ctrl+P에서 Landscape 그대로) | 화면 캡처, `chrome-01-landscape.pdf`(2쪽)·`chrome-01-landscape-fit.pdf`(1쪽) |
| Margins None이면 Headers and footers 옵션이 사라짐 | 화면 캡처 (ch10) |

## 문서 (2026-10-18 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| PDF Arranger: "Import images (convert image to PDF)", "Added images are converted to PDF pages", Page Size 대화상자 | https://raw.githubusercontent.com/wiki/pdfarranger/pdfarranger/User-Manual.md |
| PDF Arranger Windows판은 GitHub releases, Linux는 Flathub·Snap, macOS는 별도 문서(macOS.md) | https://raw.githubusercontent.com/pdfarranger/pdfarranger/main/README.md |
| Sejda Desktop: Mac·Windows·Linux 빌드, 무료 "3 tasks per day", "Images up to 5MB" 등 | https://www.sejda.com/desktop (WebFetch) |
| Chrome 인쇄: 페이지·이미지·파일을 열고 Ctrl+P(Mac ⌘+P), Save as PDF | https://support.google.com/chrome/answer/1069693 |
| Gmail 개인 계정 첨부 한도 25 MB | https://support.google.com/mail/answer/6584 |
| Mac Finder: Control-클릭 > Quick Actions > Create PDF, 선택한 순서, 첫 파일과 비슷한 이름 | https://support.apple.com/guide/mac-help/mchl21ac2368/mac |
| Mac: File > Print > PDF 팝업 > Save as PDF | https://support.apple.com/guide/mac-help/save-a-document-as-a-pdf-on-mac-mchlp1531/mac |
| Windows Microsoft Print to PDF: support.microsoft.com·learn.microsoft.com 공식 단계 문서 없음(Microsoft Q&A 커뮤니티 답변뿐, 일부 AI 생성 표시) → 본문에 단계 없이 "테스트하지 못함" | WebSearch (allowed_domains support.microsoft.com·learn.microsoft.com) |
| 자동완성에 iLovePDF·Smallpdf·Adobe 온라인 변환기 | `demand_check.py suggest "jpg to pdf"` |

## 한계

- Windows·macOS 내장 방법은 직접 실행하지 못함 (Mac은 문서 기반, Windows는 공식 문서 없음)
- Chrome은 Playwright 번들 Chromium 141(현재 Chrome 안정판보다 오래됨). 용지 기본값 A4는 컨테이너 로캘 영향일 수 있어 본문에 "our test setup chose A4"로만 씀
- Sejda 30쪽 한도는 시험하지 않음 (10장만 변환). 5MB 표기는 22.6MB 입력·5.48MB 사진이 변환되어 실제로 적용되지 않음을 확인
- PDF Arranger 기본 페이지 크기는 사진의 DPI 정보에 따라 달라짐 (입력은 72 DPI로 저장)
