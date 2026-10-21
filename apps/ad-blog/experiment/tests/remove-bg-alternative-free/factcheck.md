# 사실 확인표 — remove-bg-alternative-free

확인일: 2026-10-21 (컨테이너 Chromium(Playwright)으로 각 사이트 화면을 직접 조작, 1차 출처는 같은 브라우저로 본문 텍스트 저장 → `results/*.txt`)

## 기획

- 주 검색어: `remove.bg alternative free`
- 하위 검색어 (`demand_check.py suggest`, 2026-10-21): remove bg alternative · remove.bg alternative free · best remove bg alternative · remove bg alternative hd · remove bg free hd · remove bg free high quality · remove bg free no sign up · remove background from image free no sign up · remove background free canva
- 수요 (`trends_compare.py`, 미국 1개월): `remove background` 40.0 · `background remover` 21.2 · `remove bg` 14.4 · `remove background from image` 3.2 · 비교 `webp to jpg` 2.5
- 채널: 검색형 (상시 수요 비교 글, remove.bg 12-01 종료로 대체 수요 발생). 제목 56자
- 차별점: 정답 알파 매트가 있는 AIM-500 20장으로 웹 도구 4개 정확도(IoU)·경계 오차를 직접 측정, 무료 다운로드 해상도(iLoveIMG만 원본 크기·무가입), Pixlr 하루 3회 한도 직접 확인, remove.bg 종료 FAQ(크레딧 만료·환불·청구서 내보내기)
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모를 제목·첫 문단에(노하우 2, 제목은 `Tested`), 이미지 6장 = 그래프 2·예시 비교 1·사이트 화면 3, 대표 이미지는 1200×675 측정 그래프(노하우 7), 내부 링크 5개
- 내부 링크: 새 글 → `convert-heic-to-jpg-free`·`compress-image-to-100kb`·`best-free-pdf-tools`·`free-offline-ai-tools`·`check-if-image-is-ai-generated`. 역링크: `compress-image-to-100kb`·`convert-heic-to-jpg-free` 마지막 문단 뒤 각 1문장 (`updatedAt` 변경 없음)

## 출처

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| remove.bg 독립 웹사이트 2026-12-01 09:00 CET부터 이용 불가, 기능은 Canva로, API는 Leonardo.ai로, Enterprise API 계약은 유지 | remove.bg/faq | Chromium으로 FAQ 항목을 펼쳐 본문 저장 (`results/faq_full.txt`), 업로드 화면 배너 스크린샷 |
| remove.bg는 2021년 Canva에 편입 | remove.bg/faq ("became part of Canva in 2021"), 푸터 "a Canva Austria GmbH brand" | 같은 파일 |
| PAYG 크레딧 12-01 만료, 연간 구독 일할 환불, 월간 구독 11-01 이후 마지막 갱신 무료, 계정 12-01 이후 접근 불가·청구서와 사용 보고서 사전 내보내기, Photoshop 플러그인·기타 연동 12-01 종료 | remove.bg/faq | 같은 파일 |
| Canva Background Remover가 remove.bg와 같은 기술 사용 | remove.bg/faq | 같은 파일 |
| Affinity는 무료지만 배경 제거는 Canva Pro 필요 | remove.bg/faq | 같은 파일 |
| Canva 무료 요금제 포함 여부 | canva.com (help·features·pricing) | **확인 불가**: curl 403, Chromium 차단 페이지, WebFetch 403 → 글에 "확인하지 못함"으로 씀 |
| remove.bg 무료 다운로드 = Preview(1620×1080 사진에서 612×408), Max는 Unlock | 직접 실행 | 20장 모두 Preview 다운로드, 메뉴 스크린샷(공개용은 퍼블릭 도메인 고양이 사진 확대본 1620×1077 → 613×407) |
| remove.bg 요금: PAYG 3크레딧 $3, 구독 40크레딧 $9/월, 크레딧 12-01 만료 | remove.bg/pricing (`results/removebg_pricing.txt`) | Chromium 본문 (글에는 가격 미기재) |
| iLoveIMG: Select images → Remove background → Download file, JPG·PNG만 (`accept=.jpg,.jpeg,.png`) | iloveimg.com/remove-background | 직접 실행 + 페이지 본문 "Remove the background of your JPG and PNG images" |
| iLoveIMG 무료 다운로드 원본 크기, 20장 연속 처리에 한도 없음 | 직접 실행 | 20장 모두 원본 해상도 PNG(팔레트 모드, 알파 단계 중앙값 59) |
| iLoveIMG 무료 "Limited document processing", Premium $5/월(연 $60) | iloveimg.com/pricing (`results/iloveimg_pricing.txt`) | Chromium 본문 |
| removal.ai 무료 Download 600×400 수준, Download HD는 원본(1620×1077) | 직접 실행 | 결과 화면 스크린샷 |
| removal.ai "Unlimited free previews", 1 image = 1 credit or less, 3 credits $1.89 | removal.ai/pricing (`results/removalai_pricing.txt`) | Chromium 본문 |
| Pixlr: Browse → Save, 원본 크기 PNG, 4번째 저장에서 "Snap! You have used all of your daily free saves!" | 직접 실행 | 3장 저장 후 팝업 스크린샷 (한도 우회 시도 안 함) |
| Pixlr Plus $2.49/월 (연간 결제 시 20% 할인 = $1.99), 팝업 Plus $1.99·Premium $7.99·Ultra $19.99 | pixlr.com/pricing (`results/pixlr_pricing.txt`), 팝업 스크린샷 | Chromium 본문 |
| Mac Preview: Remove Background 버튼, PNG 변환 질문(Cancel → File > Duplicate / Convert), Edit > Undo | support.apple.com/guide/preview/remove-a-background-prvw15636/mac (macOS 27 선택 가능) | Chromium 본문 (`results/apple_preview.txt`) |
| iPhone: 주제를 길게 눌러 Copy·Share·Add Sticker | support.apple.com/guide/iphone/…iphfe4809658/ios | Chromium 본문 (`results/apple_iphone.txt`) |
| Windows Paint: 툴바 Remove background 버튼, 사각형 선택 영역에도 적용, 2023-09 Insider 배포 | blogs.windows.com/windows-insider/2023/09/07/background-removal-in-paint-begins-rolling-out-to-windows-insiders/ | curl 본문 |
| AIM-500: 500장, 수작업 알파 매트, MIT | huggingface.co/datasets/nobg/AIM-500 README | curl raw README (세션 2026-10-13 기록과 일치) |
| 예시 사진: Chelsea(CC0, Stefan van der Walt), astronaut(NASA, 퍼블릭 도메인) | scikit-image `skimage.data` docstring | 컨테이너에서 출력 |

## 측정 (직접 실행)

- 환경: Playwright 1.x(Python) + Chromium 1194(`/opt/pw-browsers`), Linux, 데스크톱 UA, 로그인 없음, 2026-10-21 03:30~04:00 UTC
- 입력: AIM-500에서 범주별 층화 무작위 20장 (seed 20261021: 동물 6·인물 5·식물 3·가구 2·장난감 2·과일 2, 투명 물체 제외). 약 1080×1620(1.75MP). `extract.py` → `results/picked.txt`
- 실행: `run_rb.py`(remove.bg), `run_il.py`(iLoveIMG), `run_ra.py`(removal.ai), `run_px.py`(Pixlr, 3장 후 한도) — 각 사이트 버튼을 클릭해 무료 다운로드 저장
- 평가: `evaluate.py` → `results/results.json`·`summary.json`
  - 정확도: 출력 알파를 정답 크기로 확대(bilinear) 후 0.5 이진화 IoU. 깨끗 ≥ 0.95, 실패 < 0.8
  - 경계 오차: 정답 윤곽 ±15px 띠에서 |예측 알파 − 정답 알파| 평균
- 결과 (20장)

| 도구 | 무료 다운로드 (MP 중앙값) | 깨끗 | 실패 | IoU 중앙값 | 경계 오차 중앙값 |
| --- | --- | --- | --- | --- | --- |
| remove.bg | 0.25 (612×408) | 19 | 1 | 0.985 | 0.062 |
| iLoveIMG | 1.75 (원본) | 17 | 2 | 0.983 | 0.084 |
| removal.ai | 0.24 (600×400) | 18 | 2 | 0.987 | 0.055 |
| Pixlr (3장) | 1.75 (원본) | 2 | 1 | 0.972 | 0.090 |

- 실패는 모두 식물: `o_009542a4`(화면 전체에 퍼진 식물, NS) 4개 도구 모두 0.60~0.69, `o_527e5a54` remove.bg 0.983 · removal.ai 0.323 · iLoveIMG 0.491
- 그래픽: `charts.py`(라이트 모드 `chart_style.py`) → free-download-size(대표), cutout-accuracy, same-photo-three-removers. 스크린샷 3장은 퍼블릭 도메인 사진 업로드 후 촬영·잘라냄 (`results/rb_menu.png`·`ra_shot.png`·`pixlr_limit.png` 원본)
- 공개하지 않은 것: AIM-500 사진 자체(저작권은 원저작자) — 수치만 사용
