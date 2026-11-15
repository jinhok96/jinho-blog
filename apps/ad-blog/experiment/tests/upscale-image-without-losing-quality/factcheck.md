# upscale-image-without-losing-quality 사실 확인표

- 검증 유형 (가설 H3): **검증형** — 정답이 있는 같은 사진 6장을 무료 웹 업스케일러 3곳에서 직접 2배·4배로 키우고 원본과 화소·구조·지각 차이를 잼
- 주 검색어 (가설 H6): `upscale image without losing quality` — 브리프 주 검색어

## 작성 전 브리프 (2026-11-16 KST 세션 98, 일반 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `photo-video` 상시 글 (검색형). 허브 `free-image-converter-photo-tools`에 확대(업스케일) 절이 없음 |
| 주 검색어 | `upscale image without losing quality` — `demand_check.py suggest` 2026-11-15: Google·Bing·YouTube 3곳. Trends 3개월(미국) 같은 요청: `upscale image` 1.2 · `upscale image without losing quality` 0.0 · `enlarge image without losing quality` 0.0 · `convert iphone video to mp4` 0.0 · 기준 `remove background` 33.6 (롱테일) |
| 하위 검색어 | `upscale image without losing quality free`(Google·Bing), `enlarge image without losing quality`(Google·YouTube), `resize image without losing quality`(Google·YouTube), `upscale image without losing quality online`·`… online free`·`… ai`(Google), `upscale image quality free`(Bing), `upscayl`(별도 자동완성 21개: `upscayl free`·`upscayl desktop` 3곳) |
| 검색 의도 | 비교형 + How-to (어떤 무료 도구로, 정말 화질이 안 떨어지나) |
| 채널 | 검색형 |
| 상위 결과 (WebSearch 2026-11-15 `upscale image without losing quality free`) | letsenhance.io 블로그·upscale.media 블로그·depositphotos 업스케일러·pixelbin 블로그(top 10 AI tools)·vanceai·tutkit·stickermule·any-video-converter·themeisle·x-design·magicstudio·ezremove·MyEdit — **모두 도구 회사 자기 홍보 글·도구 페이지**. 공통: "AI는 보통 확대보다 낫다" + 자기 도구 단계. 빠진 것: 정답 원본과 비교한 측정, 무료 등급의 실제 제약(로그인해야 원래 크기, 워터마크, 몇 장 뒤 막힘), 글자·얼굴에서 AI가 만들어 내는 차이 |
| 차별점 | 원본이 있는 사진 5장(CC0) + 글자 화면 1장을 2배·4배로 줄였다가 각 도구로 다시 키워 원본과 비교(PSNR·SSIM·LPIPS) + 보통 확대(bicubic) 기준선. 확대 비교 그림(글자·얼굴·간판). 직접 본 무료 등급 제약: Pixelcut은 로그인 없이 1080×810 미리보기만, Icons8은 워터마크·데모 3회, iLoveIMG는 2x만 무료이고 몇 장 뒤 Premium 창, waifu2x는 사람 확인 화면 |
| 내부 링크 계획 | 나가는 링크: 허브 `free-image-converter-photo-tools`, `compress-image-to-100kb`(키운 뒤 용량 줄이기), `convert-heic-to-jpg-free`(iPhone 사진 먼저 JPG로), `remove-bg-alternative-free`(같은 측정 방식의 AI 웹 도구 비교), `remove-metadata-from-photos`(올리기 전 위치 정보 지우기). 받는 링크: **색인된 `compress-image-to-100kb`**(줄이기의 반대 방향 문단 1문장), **색인된 `convert-heic-to-jpg-free`**(작은 사진 문단이 있으면), 허브 표 행 + 짧은 절 |
| 개요 | 결론 → 요약 표 → 결과 그래픽 → Can you really upscale without losing quality? → How we tested → Results at 2x → Results at 4x → 확대 비교(글자·얼굴) → Bigjpg 단계 → iLoveIMG 단계 → Img.Upscaler(언제 쓸지) → 무료라더니 막힌 것(Pixelcut·Icons8·waifu2x·Upscale.media) → Windows Photos Super resolution(Copilot+ PC) → Which one should you use? → FAQ |
| 이미지 | 대표: 격자가 보이는 작은 풍경 타일 → 점선 화살표 → 큰 액자의 매끈한 풍경 + 돋보기(버터 노랑·청록·더스티 로즈, 정면). 본문: 결과 차트(2x·4x), 글자 확대 비교, 얼굴 확대 비교(4x), Bigjpg 설정 창, Pixelcut 다운로드 메뉴, iLoveIMG Premium 창 |

## 선정 근거

- 우선순위 1·2 공백 후보: AI Overviews(google.com 결과 화면 /sorry로 직접 확인 불가)·Galaxy AI·Dia·Acrobat AI·Edge/Brave 모바일(직접 확인 불가·문서 기반)·HDR→SDR(수요 0)·VLC 소리(기존 글과 겹침) → 통과 후보 없음. backlog 15번 오프라인 TTS는 독자 OS(Windows·Mac)용 GUI 앱을 컨테이너에서 실행할 방법이 없어 보류
- `vlc ai subtitles`(자동완성 3곳)는 VLC 최신판이 3.0.24라 기능 미출시 → 제외. `demand_check.py discover`(11-09~11-15): Gemini 4 Hydrogen 검색 업그레이드·Gemini in Chrome·Wallet 연결 등 기능 추가뿐 → 영향이 오래 가는 뉴스 칼럼 후보 없음
- backlog 41번(AI 업스케일, GUI 앱으로 측정할 수 있을 때만)에서 출발: Upscayl 2.15.0 AppImage(GitHub Releases, `main` package.json 2.15.0 = 최신)는 받았지만 **AppImage 풀기·실행이 자동 권한 검사("Undermining Oversight")에 거부** → 우회하지 않고 웹 도구로 측정. Upscayl은 본문에 "시험하지 않음"으로만

## 시험 환경

- 2026-11-15 17:40~19:10 UTC, 컨테이너 Ubuntu 24.04, Playwright(Node) + Chromium(헤드리스), 데스크톱 Chrome 140 사용자 에이전트, 로그인 없음, 모든 옵션 기본값(Bigjpg만 이미지 종류 Photo·배율 선택)
- 시험 세트: `build_set.py` — PD12M(Spawning/PD12M, CC0 Wikimedia Commons) 사진 5장(간판 `d8668572`, 고양이 `433b4d81`, 숲길 `ad0f91c8`, 건물 `2ce8e533`, 옛 흑백 인물 사진 `964dd75c`) + Pillow로 만든 주문 내역 화면 1장. 원본을 4:3으로 자르고 1600×1200으로 줄인 것을 정답(gt)으로, 넓이 평균(BOX)으로 800×600(2x 입력)·400×300(4x 입력)을 만듦. 시험 파일·결과 이미지는 크기 때문에 저장소에 넣지 않음 (`set.json`에 원본 URL·라이선스)
- 채점: `evaluate.py` — PSNR(dB)·SSIM(scikit-image)·LPIPS(AlexNet, lpips 0.1.4 / torch 2.15.0 CPU). 출력이 정답 크기(1600×1200)와 다르면 점수 없이 크기만. 기준선: Pillow bicubic·Lanczos 확대
- 업스케일 대표 이미지와 시간 겹침: Z-Image-Turbo 생성(17:40~18:22 UTC)과 iLoveIMG·Pixelcut·Img.Upscaler 2x 일부가 같은 시간 → 처리 시간은 비교하지 않음 (웹 도구는 서버에서 처리)

## 1차 출처 (이 세션에서 연 것, `source-*.txt`)

| 주장 | 출처 | 확인 |
| --- | --- | --- |
| iLoveIMG: 6MP보다 작은 이미지, 업스케일 옵션에 Premium 표시 | `source-iloveimg-upscale.txt` ("Select a size multiplier and click "Upscale" to upscale any image smaller than 6MP") + 직접 화면(4x 회색, `screens/iloveimg-cat-options.webp`) | 렌더링 본문 |
| iLoveIMG: 파일은 2시간 안에 삭제 | `source-iloveimg-legal.txt` ("deleted from our servers within 2 hours") | 렌더링 본문 |
| iLoveIMG Premium $5/월(연 $60 결제) | `source-iloveimg-pricing.txt` | 렌더링 본문 |
| Img.Upscaler: 무료 월 50 크레딧, 한 번에 1장, 광고 포함, 성공 1건당 1크레딧 | `source-imgupscaler-pricing.txt` | 렌더링 본문 |
| Img.Upscaler: 올린 이미지·결과는 처리 후 24시간 안에 자동 삭제, 큰 이미지는 처리 전 줄일 수 있음 | `source-imgupscaler-home.txt`·`source-imgupscaler-privacy.txt` | 렌더링 본문 |
| Bigjpg: 무료 사용자 3000×3000px·5MB, 무료 계정 업로드는 24시간 안에 삭제(유료 72시간), 8x·16x는 업그레이드 | `source-bigjpg-faq.txt` + 직접 화면(설정 창 'Want 8x / 16x? Upgrade!') | 렌더링 본문 |
| Pixelcut: 페이지 문구 "Free HD Download", "No login needed, no watermark on your download", 50MB·6000×6000px | `source-pixelcut-upscaler.txt` | 렌더링 본문 |
| Pixelcut: 로그인 없이 받으면 Preview resolution 1080×810만 Free, Full resolution 1600×1200은 "Free with sign in" | 직접 화면 `screens/pixelcut2-cat-menu.webp` + 받은 파일 1080×810 PNG(RGBA) | 직접 시험 |
| Icons8 Smart Upscaler: 로그인 없이 결과에 워터마크, "2 demo upscales left"(첫 업로드 뒤), 5MB·7680×7680px | 직접 화면 `screens/icons8-step3.webp` + `source-icons8-upscaler.txt` | 직접 시험 |
| waifu2x: 5MB·업스케일 1500×1500px 한도, Cloudflare 'Verify you are human' | `source-waifu2x.txt` + 직접 화면 `screens/waifu2x-step2.webp` | 우회하지 않음 |
| Upscale.media: 가입 없이 하루 1장, 가입 시 월 3 크레딧·3 다운로드 | `source-upscalemedia-pricing.txt` | 렌더링 본문 (시험 안 함) |
| Windows Photos Super resolution: Copilot+ PC 전용, 이미지만, Edit > Super resolution, 1x·2x·4x·8x, 기기 안에서 처리 | `source-microsoft-photos-super-resolution.txt` | 렌더링 본문 (시험 안 함) |

## 결과 (`results/scores.json`, `evaluate.py`)

평균 (6장, 출력 1600×1200, 정답 대비)

| 배율 | 도구 | PSNR (dB) | SSIM | LPIPS | 보통 확대보다 나은 장수 (LPIPS / PSNR) | 출력 |
| --- | --- | --- | --- | --- | --- | --- |
| 2x | 보통 확대 (bicubic) | 29.25 | 0.869 | 0.205 | - | - |
| 2x | Lanczos (참고) | 29.48 | 0.875 | 0.240 | - | - |
| 2x | Bigjpg (Photo) | **31.00** | **0.894** | **0.124** | 6/6 · 6/6 | PNG 0.29~4.1 MB |
| 2x | iLoveIMG | 27.46 | 0.815 | 0.192 | 4/6 · 2/6 | PNG 0.56~4.3 MB |
| 2x | Img.Upscaler | 26.21 | 0.774 | 0.230 | 3/6 · 0/6 | JPEG(이름은 .png) 0.13~0.70 MB |
| 4x | 보통 확대 (bicubic) | 25.42 | 0.702 | 0.460 | - | - |
| 4x | Lanczos (참고) | 25.53 | 0.705 | 0.471 | - | - |
| 4x | Bigjpg (Photo) | **26.44** | **0.739** | 0.339 | 6/6 · 6/6 | PNG 0.42~3.2 MB |
| 4x | Img.Upscaler | 23.97 | 0.653 | **0.300** | 5/6 · 1/6 | JPEG 0.14~0.65 MB |

- Bigjpg 2x LPIPS는 보통 확대보다 39.8% 낮음 (0.1237 vs 0.2054) → 본문 "about 40% less visible difference"
- iLoveIMG 2x 인물 사진: LPIPS 0.345 vs 보통 확대 0.144 (가장 나쁨), PSNR 30.23 vs 36.69. 확대 비교 그림에서 눈 주변 그림자가 짙어짐
- Img.Upscaler 4x 글자: 확대 비교(`crops.py` → `upscale-small-text-4x.webp`)에서 "Order"가 "Oidor"처럼, "November"가 "Novombor"처럼, "12"가 "17"처럼 보임. Bigjpg는 일부 번졌지만 날짜가 "November 12, 2026"으로 읽힘 (사람이 그림을 보고 판단, OCR로 채점하지 않음)
- Img.Upscaler 4x 흑백 인물 사진에 색이 생김: 눈 영역(1600×1200 기준 600,560~1120,820) RGB 최대-최소 차 평균 2.77·최대 56 (정답 0·0, Bigjpg 0.46·6) → 본문 "a faint blue-green tint to one iris"
- 2x 전체 밝기 변화는 모두 ±4 이내(회색조 평균) → 밝기 차이로 점수가 갈린 것은 아님
- 처리 시간(업로드~다운로드, 페이지 열기 포함, 같은 시간에 대표 이미지 생성이 겹친 실행 있음): iLoveIMG 약 16초, Img.Upscaler 32~45초, Bigjpg 23~57초 → 본문은 "under a minute"만
- 다운로드 형식: iLoveIMG·Bigjpg는 PNG(RGB), Img.Upscaler는 JPEG 내용인데 내려받은 파일 이름은 `cat.png` 등, Pixelcut 미리보기는 PNG RGBA 1080×810

## 무료 등급 관찰 (직접 시험)

- iLoveIMG: 첫 묶음(17:44~17:55 UTC)에서 cat·sign 성공 → forest·building·portrait는 업로드 뒤 'Upgrade to Premium / This is a Premium feature' 창 → text 성공. portrait는 몇 분 뒤 성공, building은 약 25분 뒤 성공, forest는 세 번째 시도(약 50분 뒤)에 성공. 횟수·시간 규칙은 안내 문구가 없어 확인 못 함 → 본문 "after two or three images in a row … sometimes … went through when we tried again later"
- Bigjpg: 설정 창 배율 라디오를 스크립트가 누르지 못해 첫 4x 실행이 2x(800×600)로 처리됨 → 라디오를 직접 눌러 다시 실행(결과 1600×1200 확인). 설정 창은 Photo·2x·None·Default가 기본(2x 실행 화면)
- Pixelcut: 업스케일 자체는 로그인 없이 됨(Fast Upscale, 2x 기본). Download 메뉴는 Preview resolution 1080×810 'Free' / Full resolution 1600×1200 'Free with sign in'
- Icons8: 첫 업로드 결과에 'Smart Upscaler' 사선 워터마크, 'Remove watermark'·'Enlarge to 4x' 메뉴, '2 demo upscales left'
- waifu2x: 파일 선택 뒤 Convert 위에 Cloudflare 'Verify you are human' → 진행하지 않음(우회 안 함)
- PicWish(photo-enhancer)는 업로드 단계를 자동화로 잡지 못해 제외(본문 언급 없음)
