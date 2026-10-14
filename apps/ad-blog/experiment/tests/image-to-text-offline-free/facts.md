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
