# 사실 확인표 — remove-background-from-image-free-offline

확인일: 2026-10-13 (컨테이너에서 curl·WebFetch로 원문 확인)

## 기획

- 주 검색어: `remove background from image free offline`
- 하위 검색어 (`demand_check.py suggest`, 2026-10-13): remove background from image free no sign up · remove background offline app/software · remove background ai offline · rembg · rembg models · rembg windows · rembg gpu · birefnet · birefnet-general · free software to remove background from image
- 채널: 검색형 (상시 수요 비교 글)
- 차별점: 같은 CPU·같은 50장(정답 알파 매트 있는 AIM-500)으로 8개 모델의 정확도·속도·메모리를 직접 측정. rembg 기본 모델(bria-rmbg)이 가장 느리고 상업 이용 불가라는 점, 대형 모델은 사진 1장에 RAM 7.8~9.6GB가 필요하다는 점, 웹 UI 기본값(Alpha matting·Post process mask 켜짐)이 CLI와 다르다는 점
- 적용한 노하우: 검색형 제목 58자(노하우 1), 측정 규모를 제목에 `8 Free Models Tested`(노하우 2), 이미지 5장 = 측정 그래프 2·예시 비교 2·웹 UI 스크린샷 1, 대표 이미지는 1200×675 측정 그래프(노하우 7). ToolProof에서 이미지를 넣은 첫 글 → 이미지 0장인 기존 5편과 비교 대상
- 내부 링크: 새 글 → `check-if-image-is-ai-generated`·`transcribe-audio-offline-free`·`free-offline-text-to-speech` (3편), 세 글 모두에서 새 글로 역링크

## 출처

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| rembg 2.0.85 (PyPI 2026-09-20 업로드), MIT 라이선스, Python 3.11~3.13 | pypi.org/pypi/rembg/json, raw.githubusercontent.com/danielgatis/rembg/main/README.md·LICENSE.txt | API·raw README |
| 설치 `pip install "rembg[cpu,cli]"`, 명령 `rembg i`(파일)·`rembg p`(폴더)·`rembg s`(웹 UI·HTTP 서버), `-m` 모델 지정, `-dc` 색 번짐 제거 | rembg README, `rembg i --help` | raw README + 컨테이너에서 실행 |
| 기본 모델은 `bria-rmbg` (CLI `[default: bria-rmbg]`, `new_session` 기본값) | `rembg i --help` 출력, `rembg/session_factory.py` | 컨테이너에서 확인 |
| RMBG-2.0: CC BY-NC 4.0, 상업 이용은 BRIA와 별도 계약, Hugging Face에서 접근 신청 필요 | huggingface.co/briaai/RMBG-2.0, rembg README 모델 목록 | WebFetch·API(`gated: auto`, `license:other`) |
| U²-Net 코드·모델 Apache 2.0 | raw.githubusercontent.com/xuebinqin/U-2-Net/master/LICENSE | raw LICENSE |
| IS-Net(DIS) 코드 Apache 2.0, `isnet-general-use`는 일반 용도 최적화 가중치 | raw.githubusercontent.com/xuebinqin/DIS/main/README.md | raw README |
| BiRefNet MIT, general 모델 학습 데이터 목록 (AIM-500 미포함, DIS-VD로 평가) | raw.githubusercontent.com/ZhengPeng7/BiRefNet/main/README.md·LICENSE | raw README |
| `withoutbg` 모델은 클라우드 API(이미지를 서버로 전송, API 키 필요) | rembg README, `rembg/sessions/withoutbg.py` | 코드 확인 |
| AIM-500: 500장, 7개 범주, 수작업 알파 매트, MIT 라이선스, 이미지 저작권은 원저작자 | huggingface.co/datasets/nobg/AIM-500 README, AIM-500 Release Agreement PDF | PDF 원문 |
| DIS5K는 비상업 전용 → 광고 사이트라 측정에 쓰지 않음 | DIS5K Dataset Terms of Use PDF | PDF 원문 |
| Mac Preview: 이미지 열기 → Remove Background 버튼, PNG 변환 질문 (File > Duplicate), Edit > Undo | support.apple.com/guide/preview/prvw15636/mac (macOS 27) | 페이지 본문 |
| Paint 배경 제거: 한 번 클릭, 선택 영역에만 적용 가능 (2023-09 Insider 발표, 11.2306.30.0) | blogs.windows.com/windows-insider/2023/09/07/background-removal-in-paint-begins-rolling-out-to-windows-insiders/ | 페이지 본문 |
| Office(Word·PowerPoint 등): Picture Format > Remove Background, Mark Areas to Keep/Remove | support.microsoft.com/topic/c0819a62-6844-4190-8d67-6fb1713a12bf | 페이지 본문 |
| 예시 이미지: astronaut(NASA, 퍼블릭 도메인), chelsea(CC0), coffee(CC0) | scikit-image `skimage.data` docstring | 컨테이너에서 확인 |

## 측정 (직접 실행)

- 환경: rembg 2.0.85, onnxruntime 1.31.0 (CPU), Python 3.11, Linux, Intel Xeon 2.8GHz 4코어, RAM 16GB(컨테이너 제한), GPU 없음
- 입력: AIM-500에서 범주별 층화 무작위 50장 (seed 20261013: 동물 15·인물 10·식물 8·투명 6·가구 5·장난감 4·과일 2)
- 정확도: 예측 알파와 정답 알파를 0.5에서 이진화한 IoU. "깨끗한 결과" = IoU ≥ 0.95, "실패" = IoU < 0.8. 투명 물체(유리 등)는 정답 알파 대부분이 0.5 미만이라 IoU가 의미 없어 따로 표시
- 속도: 50장 처리 시간 중앙값(4스레드, 다른 작업 없음). 모델 로딩 시간 제외
- 메모리: onnxruntime 메모리 아레나·패턴 끔(`enable_cpu_mem_arena=False`, `enable_mem_pattern=False`) 상태의 프로세스 최대 RSS
- 스크립트: `bench.py`(측정), `summarize.py`(요약 → `summary.json`), `examples.py`·`grid.py`(예시 그림), `charts.py`(그래프)
- CLI 1장 처리(모델 로딩 포함 시간·최대 RSS, onnxruntime 기본 설정): `clirun.py`, 결과 `results/cli_memory.txt`. 같은 프로세스에서 여러 대형 세션을 연달아 열면 14GB를 넘어 OOM 종료됨(측정 초기 시행착오) → 측정은 모델마다 새 프로세스
- 메타데이터: EXIF(Make·Software)를 넣은 JPEG → `rembg i -m u2netp` → 출력 PNG에 EXIF·텍스트 정보 없음 (`results/exif_test.txt`)
- 웹 UI: `rembg s --host 127.0.0.1 --port 7000` → Playwright(Chromium 1194)로 고양이 사진 업로드·isnet-general-use 실행, 3.4초 (`shot3.py`). 체크박스 기본값은 `rembg/commands/s_command.py` 500·511행 (`Alpha matting`·`Post process mask` = True)
- 예시 사진 결과 관찰 (그림 확인): astronaut에서 birefnet-general-lite가 헬멧 대부분을 지움, u2netp는 왼쪽 성조기 일부 남김. 고양이 근접 사진에서 u2netp·isnet은 흐린 배경 얼룩을 반투명하게 남김

## 결과 요약 (summary.json)

| 모델 | 깨끗(44) | 실패(44) | 투명 평균 IoU(6) | 초/장 중앙값 | CLI 1장 RAM | 파일 |
| --- | --- | --- | --- | --- | --- | --- |
| bria-rmbg | 40 | 0 | 0.726 | 46.0 | 9.37GB | 1024MB |
| birefnet-general | 39 | 0 | 0.739 | 41.4 | 9.61GB | 973MB |
| birefnet-general-lite | 38 | 0 | 0.707 | 29.6 | 7.82GB | 224MB |
| isnet-general-use | 30 | 5 | 0.565 | 1.47 | 1.14GB | 179MB |
| u2netp | 28 | 4 | 0.225 | 0.31 | 0.54GB | 5MB |
| u2net | 27 | 8 | 0.217 | 0.51 | 0.85GB | 176MB |
| silueta | 27 | 8 | 0.220 | 1.10 | 0.69GB | 44MB |
| u2net_human_seg | 20 | 14 | 0.173 | 0.51 | 0.85GB | 176MB |

## 재현

1. `python3 -m venv /tmp/rb && /tmp/rb/bin/pip install "rembg[cpu,cli]==2.0.85" pyarrow pillow matplotlib scikit-image playwright`
2. 데이터: `https://huggingface.co/datasets/nobg/AIM-500/resolve/main/data/test-00000-of-00001.parquet` → `/tmp/bgdata/aim.parquet`
3. `bash runall.sh` (모델은 rembg가 GitHub Releases에서 자동 다운로드, 결과 `res/*.json`) → `summarize.py` → `charts.py`
4. 예시: `examples.py <모델,…> ex` → `grid.py ex <astronaut|chelsea> <모델,…> <라벨,…> <출력.webp> 3`
