# make-pdf-searchable-free 사실 확인표

- 검증 유형 (가설 H3): **검증형** — 같은 스캔 PDF 2개를 NAPS2 8.6.0 GUI와 웹 도구 3곳에서 직접 처리하고 글자 층을 Chrome PDF 엔진으로 채점
- 주 검색어 (가설 H6): `make pdf searchable free` — 브리프 주 검색어

## 작성 전 브리프 (2026-11-13 KST 세션 95, 일반 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `pdf` 상시 글 (검색형). 허브 `best-free-pdf-tools`에 OCR 절이 없음 |
| 주 검색어 | `make pdf searchable free` — `demand_check.py suggest` 2026-11-12: Google·Bing·YouTube 3곳 (Bing은 이 세션에 고친 `qsonhs.aspx`로 확인). Trends 12개월(미국) 같은 요청에서 `make pdf searchable` 평균 59.2 · `convert iphone video to mp4` 31.2 · `turn off hdr video iphone` 2.0 · `remove hdr from iphone video` 0.0 |
| 하위 검색어 | `make pdf searchable free online`(Google·Bing), `make pdf text searchable free`(Google·Bing), `make scanned pdf searchable free`·`make large pdf searchable free`·`make pdf searchable and copyable`(Google), `how to make a scanned pdf searchable`(3곳), `ocr pdf free no sign up`(Google) |
| 검색 의도 | 정보형 How-to + 비교 (무료 도구 중 무엇으로) |
| 채널 | 검색형 |
| 상위 결과 (WebSearch 2026-11-12) | `make pdf searchable free`: iLovePDF 블로그(여러 언어판), usesignhouse·pdf.it.com·airparser·pdf.net·ocr.space·wildandfreetools 같은 도구 회사 안내 글. `how to make a scanned pdf searchable free without Adobe`: UPDF·Smallpdf·WPS·Foxit·pdf.online 도구 회사 글. 공통: OCR 설명 + 자기 도구 단계. 빠진 것: 같은 파일로 여러 무료 도구를 비교한 정확도, 결과 파일이 쪽 그림·크기·원래 글자 쪽을 어떻게 바꾸는지, 무료 한도·업로드 없이 하는 법 |
| 차별점 | 정답 텍스트가 있는 8쪽 스캔(본문 5·표·8pt·휴대폰 사진) + 글자 쪽이 섞인 3쪽 PDF로 4개 도구 직접 시험. Chrome PDF 엔진(PDFium) 기준 검색 가능 단어 비율·구절 검색, 쪽 그림 해상도·화질(PSNR), 파일 크기, 원래 글자 쪽·링크 처리. iLovePDF가 해상도를 절반으로 줄이면서 파일은 2배로 키우고 글자 쪽을 그림으로 바꾼 것, Sejda가 1~5쪽에 글자 층을 두 번 넣은 것 |
| 내부 링크 계획 | 나가는 링크: 허브 `best-free-pdf-tools`, `image-to-text-offline-free`(NAPS2 설정·사진 OCR), `pdf-to-word-free`(스캔 PDF를 Word로), `compress-pdf-free`(OCR 뒤 크기 줄이기), `jpg-to-pdf-free`(사진을 PDF로 먼저 묶기). 받는 링크: 색인된 `image-to-text-offline-free`의 'How to make a searchable PDF in NAPS2' 절 1문장, 허브 `best-free-pdf-tools` 표 행·절, `pdf-to-word-free` 'Scanned PDFs' 줄 |
| 개요 | 결론 → 요약 표 → 결과 그래픽 → Is your PDF already searchable? → How we tested → Results → PDF24 단계 → NAPS2 단계(오프라인) → Sejda 단계 → iLovePDF(언제 쓸지) → 글자 쪽이 섞인 PDF → Other ways(Google Drive·데스크톱판) → Which one should you use? → FAQ 3개 |
| 이미지 | 대표: 줄무늬 종이 더미 + 돋보기 + 떠오르는 글자 층(하늘색·주황·보라, 3/4 시점). 본문 6장: 결과 표 그래픽, Chrome 찾기 PDF24 1/1 vs Sejda 1/2, iLovePDF 확대 비교, PDF24 옵션, NAPS2 OCR Setup, Sejda 'Recognize text on all pages', iLovePDF 옵션 |

## 선정 근거 (요약, 상세는 log.md 세션 95)

- 우선순위 1·2 공백 후보: AI Overviews(결과 화면 직접 확인 불가)·Galaxy AI(대형 매체·문서 기반)·Personal Intelligence(콘텐츠 정리 3번과 겹침)·Dia(Mac·Windows 전용, 문서 기반)·Acrobat AI·Edge/Brave 모바일(직접 확인 불가)·HDR→SDR(수요 Trends 0) → 기준 통과 후보 없음
- `demand_check.py discover` 11-06~11-12: 영향이 오래 가는 뉴스(종료일·마감) 없음 → 상시 글

## 시험 환경

- 2026-11-12 17:40~19:40 UTC, 컨테이너 Ubuntu 24.04, Xvfb + openbox + xdotool
- NAPS2 8.6.0 Linux deb(`naps2-8.6.0-linux-x64.deb`, SHA-256 `bc618ce0…3626`)를 풀어 실행, OCR 언어 English(12.3 MB, 앱 안 OCR Download)
- 웹 도구: Playwright 1.64 + Chromium 153.0.8010.12(화면 있는 모드), 로그인 없음, 모든 옵션 기본값
- 채점: `score_pdf.py` — 글자 층을 pypdfium2(PDFium 159, Chrome·Edge PDF 보기 엔진)로 읽음. pdftotext는 기울어진 쪽에서 단어를 다른 줄로 옮겨 읽어 실제 보기 프로그램과 다름(NAPS2 결과 4쪽: pdftotext 구절 15/20 vs PDFium 20/20)
- 시험 파일: `gen_pdf.py`(Gutenberg 퍼블릭 도메인 문단 + 가상 명세서 표). 결과 PDF·시험 PDF는 크기 때문에 저장소에 넣지 않음, 해시는 `results/sha256.txt`

## 결과 (results/scores.json, results/image-quality.json)

| 항목 | NAPS2 8.6.0 (Fast) | PDF24 Tools | iLovePDF | Sejda |
| --- | --- | --- | --- | --- |
| 스캔 본문 5쪽 단어 (단어 수 가중) | 99.8% | 99.8% | 99.7% | 100.0% |
| 8pt 작은 글씨 | 99.6% | 99.3% | 97.8% | 99.6% |
| 표 숫자 (날짜·참조 번호·금액) | 100% | 100% | 100% | 100% |
| 휴대폰 사진 쪽 | 86.7% | 99.0% | 87.1% | 93.2% |
| 구절 검색 (PDFium 찾기, 본문 5쪽 100개 / 8pt 20 / 사진 20) | 100 / 20 / 14 | 98 / 19 / 18 | 98 / 18 / 14 | 100 / 20 / 14 |
| 쪽 그림 | 2550×3300 300 ppi, 회색조 → 컬러 JPEG로 다시 저장, PSNR 43.6 dB | 300 ppi 회색조, 기본 'Deskew pages'로 곧게 돌려 다시 저장 | 1275×1650(약 150 ppi), 쪽 크기 603.95×781.58 pt(Letter보다 약 1.3% 작음), PSNR 23 dB(쪽 크기 차이 포함) | 원본 JPEG 그대로 (PSNR inf) |
| 파일 크기 (원본 7.33 MB) | 5.90 MB | 7.34 MB | 14.81 MB | 7.39 MB |
| 섞인 PDF 원래 글자 쪽 1·3 | 그대로, 링크 1개 유지 | 그대로, 링크 유지 | 150 ppi 그림으로 바뀌고 OCR 글자로 덮음, 링크 0 | 그대로, 링크 유지 |
| 섞인 PDF 스캔 쪽 2 | 100% | 100% | 100% | 100% |
| 걸린 시간 (8쪽) | 측정 안 함 (대표 이미지 생성과 CPU 공유) | 48.4 s (마지막 시도. 첫 시도는 몇 분, 시도마다 다름) | 12.2 s | 43.6 s |
| 특이 사항 | Best 모드도 거의 같음(사진 85.2%) | 완료 화면 "4373 words were recognized" | Advanced 모드는 Premium | 1~5쪽 글자 층이 두 번(쪽 내용에 텍스트 XObject `Do` 2번) → Chrome 153 찾기 'know Mr. Bingley' 1/2 (PDF24 결과 1/1) |

## 사실 → 출처

| 주장 | 출처 | 확인 |
| --- | --- | --- |
| NAPS2: OCR 버튼 → 첫 클릭 때 언어 내려받기 → OCR Setup에서 "Make PDFs searchable using OCR" 체크, 이후 저장하는 PDF에 OCR | `source-naps2-ocr.txt` | 직접 실행 화면과 같음 (English 12.3 MB) |
| NAPS2: 가져온 PDF는 글자가 이미 있는 쪽은 그대로, 없는 쪽만 OCR | `source-naps2-ocr.txt` "Imported Documents" | 섞인 PDF로 직접 확인 |
| NAPS2: Fast로 보통 충분, Best는 더 느리고 가끔 더 좋음 | `source-naps2-ocr.txt` | 우리 파일에서는 거의 같음 |
| NAPS2: Windows·Mac·Linux 설치 파일, 8.6.0 | `source-naps2-download.txt` | Linux판 실행 |
| NAPS2: 무료, 광고·제한 없음 | `source-naps2-ocr.txt` 끝 문장 | - |
| PDF24: Free · Online · No limits · Secure, PDF/A·deskew·cleaned pages, 서버(클라우드)에서 인식, 파일은 "short period" 뒤 삭제, Windows용 PDF24 Creator | `source-pdf24-ocr-pdf.txt` | 옵션 기본값은 직접 확인(Deskew pages 켬, Rotate·Remove background·Clean pages·Force OCR·Combine files 끔, 출력 PDF) |
| iLovePDF OCR PDF: "Convert non-selectable PDF files into selectable and searchable PDF" | `source-ilovepdf-ocr-pdf.txt` | 옵션 패널(Standard / Advanced Premium, Auto rotate·Deskew·Dewarp, Original·Black & white·Greyscale)은 직접 본 화면 |
| iLovePDF 무료: "Limited document processing", 작업당 파일 크기 Limited, Premium $5/월(연 $60) | `source-ilovepdf-pricing.txt` | 숫자 한도는 문서에 없음 |
| iLovePDF: 파일은 2시간 뒤 자동 삭제 | 결과 화면 문구 (`results/ilp-scan.log`, 2026-11-12 18:02 UTC 시험 화면 텍스트). 보안 페이지(`source-ilovepdf-security.txt`)는 "does not retain user documents"만 펼쳐져 있음 | 직접 본 문구 |
| Sejda: 무료 10쪽 또는 50 MB, 시간당 3작업, PRO 100쪽, 2시간 뒤 삭제, Sejda Desktop은 로컬 처리 | `source-sejda-ocr-pdf.txt` | 8쪽 파일 무료 처리 확인 |
| Sejda: Web Week Pass $5, 무료는 쪽·시간 한도 | `source-sejda-pricing.txt` | - |
| Sejda: 더 높은 해상도가 결과가 좋음, OCR 전에 스캔을 압축하지 말 것 | `source-sejda-ocr-pdf.txt` | - |
| Google Drive: PDF·사진을 Google Docs로 열어 글자로 변환, 2 MB 이하, 글자 높이 10픽셀 이상, 표·열은 잘 안 됨 | `source-google-drive-ocr.txt` | 계정 없음 → 문서 기반 |

- 뉴스 유형 줄 없음 (상시 글)
- 쓰지 않은 것: Smallpdf(무료 체험 표기, 시험 안 함), Adobe Acrobat(로그인 필요), 속도 비교(대표 이미지 생성과 CPU 공유), NAPS2 Windows·Mac판 실행
