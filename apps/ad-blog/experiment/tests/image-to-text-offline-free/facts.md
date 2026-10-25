# image-to-text-offline-free 사실 확인표

- 주 검색어: `image to text` (Trends 미국 3개월 평균 9.8, 기준 `remove background` 35.5) + `free`·`offline` 조건
- 하위 검색어 (2026-10-14 `demand_check.py suggest`): image to text free (Google·Bing·YouTube), image to text offline (Google·Bing), image to text converter offline free, ocr offline free, ocr offline windows, offline image to text converter (YouTube), extract text from image free no sign up, image to text free unlimited
- Trends 비교 (미국, 최근 3개월): remove background 35.5 · ocr 13.2 · image to text 9.8 · extract text from image 0.0 · copy text from image 0.0 · image to text converter 0.0 · offline translator 0.0 → `image to text`를 주 검색어로, backlog 32의 번역 대신 OCR 선택
- 채널: **검색형** (상시 수요, 비교·측정). 제목 51자, 설명 154자
- 차별점: 오프라인 OCR 엔진 4종(설정 7가지)을 같은 50장(5개 유형)으로 직접 측정. 기본 설정 Tesseract가 영수증 가격 열을 통째로 빠뜨리는 것, RapidOCR가 긴 줄 일부를 깨뜨리는 것 같은 실제 실패를 출력 그대로 보여 줌. Windows Snipping Tool·Mac Live Text 같은 내장 기능을 먼저 안내
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 표기(노하우 2), 이미지 5장(노하우 7: 대표 표 그래프 1200×675 + 속도·메모리 그래프 + 테스트 이미지 예시 + 영수증 실제 출력 비교 + 작은 글자 실제 출력 비교), 요약 표, 허브 `free-offline-ai-tools`에 섹션·요약 표 행 추가(노하우 3 허브 갱신)
- 측정 환경: Linux, Intel Xeon 2.80GHz 4코어, RAM 16GB, GPU 없음, 2026-10-14 (`env.txt`)

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 테스트 이미지 50장 (5유형 × 10) | `gen.py` (본문은 Project Gutenberg 퍼블릭 도메인 책 3권, 영수증은 스크립트가 만든 가상 품목·가격) |
| 엔진별 정확도·속도·메모리 | `bench.py`·`run_all.sh` → `results/*.jsonl`, `score.py` → `summary.json` |
| 그래프·예시·출력 비교 이미지 5장 | `charts.py` |
| 거의 완벽(CER ≤ 2%) 이미지 수: Tesseract psm6 42, 기본 33, RapidOCR small 34, medium 35, EasyOCR 1, docTR 33, docTR mobile 31 | `summary.json` `overall.clean_images` |
| 단어 재현율: docTR 99.0%, mobile 99.1%, medium 97.3%, psm6 96.4%, RapidOCR 93.6%, Tesseract 93.1%, EasyOCR 85.6% | `summary.json` `overall.word_recall_mean` |
| 영수증 숫자 재현율: Tesseract 51%, psm6 86%, RapidOCR 95%, medium 98%, EasyOCR 47%, docTR 97%, mobile 98% | `summary.json` `by_cond.receipt.num_recall_mean` |
| 속도(중앙값)·RAM: Tesseract 0.55초·55MB, RapidOCR 1.5초·0.61GB, medium 26.4초·0.89GB, EasyOCR 3.6초·1.79GB, docTR 3.0초·1.34GB, mobile 1.1초·1.09GB | `summary.json` `sec_median`·`max_rss_gb` (`results/*.time`) |
| Tesseract 기본: 영수증 10장 중 7장 숫자 재현율 50% 미만(가격 열 누락), "I"→"\|" (작은 글자), psm6: "12oz"→"120z", "1.71"→"Loft" | `summary.json` images, `results/tesseract*.jsonl` |
| RapidOCR small: 스크린샷·작은 글자 20장 중 12장 단어 재현율 97% 미만(긴 줄이 흩어진 글자로), 사진 10장 모두 거의 완벽. medium: scan_06 문단 하나 통째 누락 | `summary.json`, `results/rapidocr*.jsonl` |
| docTR: 영수증 가격을 품목과 따로 블록으로 출력(거의 완벽 0/10), 사진 줄 순서 섞임 | `results/doctr.jsonl` (receipt_01, photo_01) |
| EasyOCR: 쉼표 뒤 공백 누락 ("hands,and") | `results/easyocr.jsonl` (scan_02) |
| RapidOCR small 모델은 pip 패키지에 포함(첫 실행 다운로드 없음), medium은 modelscope.cn에서 다운로드 | `rapidocr-3.10.0.dist-info/RECORD`, `default_models.yaml` |
| `tesseract receipt.jpg result --psm 6` → `result.txt` 생성 | 컨테이너에서 직접 실행 |

## 문서 (2026-10-14 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| Snipping Tool: Text actions 버튼, Copy all text, Quick redact, "All text recognition processes are performed locally on your device", Windows 11·Windows 10 적용, Windows logo key + Shift + S | support.microsoft.com/en-us/windows/use-snipping-tool-to-capture-screenshots-00246869-1843-655f-f220-97299b865f6b |
| PowerToys Text Extractor: 기본 단축키 Win + Shift + T, 클립보드로 복사, OCR 언어 팩 필요, Snipping Tool 사용 권장 | learn.microsoft.com/en-us/windows/powertoys/text-extractor |
| Mac Preview Live Text: Control-click → Copy Text, Tools > Text Selection, 일부 지역·언어 미지원 | support.apple.com/guide/preview/prvw625a5b2c/mac |
| iPhone Camera Live Text: 노란 프레임 → 텍스트 버튼, Copy·Select All, Settings > Camera > Show Detected Text | support.apple.com/guide/iphone/iphcf0b71b0e/ios |
| Tesseract: Apache 2.0, 100개 이상 언어, Windows 설치 파일은 UB Mannheim, Mac `brew install tesseract` | raw.githubusercontent.com/tesseract-ocr/tesseract/main/LICENSE·README.md, tesseract-ocr.github.io/tessdoc/Installation.html |
| NAPS2: 무료·오픈소스 스캔 앱(Windows·Mac·Linux), 8.5.1, OCR 버튼 → 언어 다운로드, 검색 가능한 PDF, 텍스트 파일 직접 저장 불가 | naps2.com, naps2.com/doc/ocr |
| RapidOCR 3.10.0·EasyOCR 1.7.2·docTR 1.1.0 Apache 2.0 | PyPI JSON API |
| EasyOCR 80개 이상 언어 | raw.githubusercontent.com/JaidedAI/EasyOCR/master/README.md |
| Apple 페이지는 Live Text가 인터넷 없이 되는지 밝히지 않음 → 글에서 오프라인이라고 주장하지 않음 | 위 Apple 문서 2개 |

## NAPS2 측정 (2026-10-25, 개선 세션 49)

- 보강 근거 (`seo-audit` rankings-push): Search Console 2026-09-27 ~ 10-25 노출 74·평균 14.4위, 날짜별 순위 10-15 6.0 → 10-21 9.8 → 10-22 19.1 → 10-23 29.0 → 10-24 25.7. 보이는 검색어 `free offline ocr` 8.0·`image to text offline` 7.5·`offline ocr tools` 5.0·`free ocr offline` 7.0 (나머지는 익명). 마지막 크롤링 10-15라 색인본은 측정 표가 있던 10-15판, 10-17 이후 본문(문서 기반만, 이미지 0장)은 아직 크롤링 전 → 다음 크롤링 때 직접 측정이 없는 판이 들어갈 위험
- 상위 결과 (WebSearch `image to text offline free`·`free offline ocr software windows`): App Store 앱 목록(Fast Offline OCR·Scanner Pro OCR), Umi-OCR·Kaizen OCR 소개, fitgap 목록, ocr.space 블로그. 직접 측정한 정확도는 없음 → 빠진 것 = 직접 실행 결과. 비개발자 기준을 지키는 GUI 앱 중 컨테이너에서 실행 가능한 NAPS2로 측정
- 환경: Ubuntu 24.04 컨테이너, Xvfb 1440×900 + openbox, NAPS2 8.5.1 Linux deb(`github.com/cyanfish/naps2/releases/download/v8.5.1/naps2-8.5.1-linux-x64.deb`, naps2.com/download의 최신판), 4코어. 대표 이미지 엔진 빌드가 같은 시간에 돌아 속도는 재지 않음
- 절차 (GUI 직접 조작): OCR 버튼 → 언어 선택 창(English 체크, "Estimated download size: 12.3 MB", `naps2/ocr-download-dialog.png`) → Download → OCR Setup(기본값: Make PDFs searchable using OCR 꺼짐, English, OCR mode Fast, Fix white balance and remove noise 꺼짐, Pre-emptively run OCR after scanning 켜짐) → Make PDFs searchable 체크 → Import로 50장 선택(파일 이름순) → Save PDF. OCR mode 드롭다운은 Fast·Best 2개(`naps2/naps2-ocr-mode.png`). 설정 3가지로 3번 저장: Fast / Best / Best + Fix white balance and remove noise
- 테스트 이미지: `gen.py`로 재생성 (Gutenberg pg1342·pg84·pg11, 시드 20261015). 2026-10-14 원본과 정답 텍스트 50개 동일 확인, Chromium은 1243으로 바뀜(`CHROMIUM` 환경변수)
- 채점: PDF 페이지별 텍스트를 `pdftotext -layout`(poppler, 측정 보조)으로 뽑아 `naps2/pdf_to_jsonl.py` → `score.py`와 같은 지표(`naps2/naps2-summary.json`). 단어 재현율은 순서 무시. 가격은 정답의 `\d+\.\d\d`(뒤에 % 없음) 토큰이 결과에 그대로 있는지

| 주장 (본문) | 근거 |
| --- | --- |
| Fast(기본) 단어 재현율: 스캔 99.8%, 스크린샷 98.4%, 작은 글자 90.6%, 영수증 65.6%, 사진 61.5%, 전체 83.2% | `naps2/naps2-summary.json` `naps2-fast.by_cond.*.word_recall_mean`·`overall` |
| Best 전체 82.4% (작은 글자 86.7%, 나머지는 Fast와 1%p 이내 → "within 4 points"), Best + 노이즈 제거 81.3% | 같은 파일 `naps2-best`·`naps2-best-clean` |
| 스캔 10장 중 8장 단어 재현율 100% | `naps2-fast.images` scan_00·01·02·03·04·06·07·09 |
| 작은 글자: "of course" → "ofcourse", "little" → "litle" | `naps2/naps2-fast.jsonl` small_04 |
| 영수증 가격: Fast 36/133, 0개인 영수증 6장(00·01·02·06·07·08), 03은 1/14, 04 12/14, 05 13/14, 09 10/12. Best 39/133, Best + 노이즈 제거 39/133 — 두 설정 모두 6장은 여전히 0 | `naps2/naps2-*.jsonl` (위 가격 정의로 계산) |
| receipt_00: 상호·주소·전화·날짜·품목 10개 중 4개(Greek Yogurt·Rice Jasmine·Dish Soap·Cheddar Cheese)만, 가격 14개 전부 없음 (6.25%는 세율) | `naps2/receipt_00-naps2-fast.txt`, `pdftotext -bbox` 단어 31개 |
| 사진: 7장에서 연속 39~104단어 누락(00 75·01 104·04 59·05 70·07 39·08 102·09 75), photo_00은 148단어 중 73단어(첫 문단)만. 02·03·06은 최대 12~25단어 | `naps2/naps2-fast.jsonl` + 정답 대조(difflib) |
| NAPS2 문서: 첫 OCR 클릭 때 언어 다운로드, Make PDFs searchable using OCR, Mac은 Tools → OCR, Best는 "sometimes"가 더 나음·느림, Fix white balance는 저품질 스캔에 도움·느림, OCR은 PDF 저장 중 실행, 텍스트 파일 직접 저장 불가(PDF에서 Select All·Copy), 텍스트가 이미 있는 PDF 페이지는 건드리지 않음, "completely free of charge, with no ads or restrictions" | naps2.com/doc/ocr (2026-10-25 curl) |
| 최신판 8.5.1 | naps2.com/download "Latest release (8.5.1)" |
| OCR 엔진 Tesseract, GPL 2.0 이상 | raw.githubusercontent.com/cyanfish/naps2/master/README.md |

## 변경 기록

- 2026-10-17: 비개발자 기준(명령줄 금지)에 따라 명령줄 OCR 엔진(Tesseract·RapidOCR·EasyOCR·docTR) 비교 표·결과·추천·설치 단계·What we tested와 이미지 5장 전부 제거. 본문은 Snipping Tool·PowerToys Text Extractor·Live Text·NAPS2(모두 문서 기반, 직접 측정 없음)만 남김. 제목 "Image to Text Offline for Free on Windows and Mac", 설명 교체, thumbnail 삭제, 삭제된 글(PDF to Word·배경 제거·TTS) 링크 정리. 측정 자료(`summary.json`·`results/`)는 보관
- 2026-10-25: NAPS2 8.5.1 GUI 직접 측정(50장, 설정 3가지) 추가 — 사용 단계·정확도 표·Best/노이즈 제거 비교·How we tested NAPS2, 본문 이미지 3장(OCR 설정 화면 캡처·유형별 정확도·영수증 출력 비교, `naps2_charts.py`) + 대표 이미지, 둘째 문단을 측정 결과로 교체, `updatedAt` 2026-10-25. 검증 기록 V5
