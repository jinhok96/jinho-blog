# rotate-video-without-losing-quality 사실 확인표

- 검증 유형 (가설 H3): **검증형** — 무료 데스크톱 앱 3개와 웹 도구 2곳을 컨테이너에서 직접 실행해 결과 파일을 원본과 프레임 단위로 비교하고 브라우저 3곳에서 재생 확인
- 주 검색어 (가설 H6): `rotate video without losing quality` — 브리프 주 검색어

## 작성 전 브리프 (2026-11-22 UTC, 세션 103 일반 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `photo-video` (우선순위 2) 상시 글, 검색형. 카테고리 `software` |
| 주 검색어 | `rotate video without losing quality` — `demand_check.py suggest` 2026-11-22: **Google·Bing·YouTube 3곳**(같은 문구). 하위 16개: `rotate mp4 video without losing quality`·`how to rotate a video on iphone/mac without losing quality`·`rotate video without losing quality android/online`·`why won't my video rotate`·`why are my videos not rotating`(Google), `rotate video online without losing quality`·`rotate video iphone without losing quality`(Bing). 같은 날 `rotate video and save` 17개(`rotate video and save windows 11` Google·Bing, `vlc rotate video and save` Bing, `rotate video vlc and save` YouTube, `mac rotate video and save`·`rotate video and save online` Google), `rotate video permanently` 14개(`rotate video permanently vlc`·`windows` Google, `how to rotate video permanently in vlc` Bing, `how to rotate video permanently` YouTube). Trends 미국 3개월(기준 `remove background` 평균 33.1): `rotate video without losing quality`·`rotate video and save`·`rotate video permanently`·`how to rotate a video` 모두 0.0 → 롱테일 |
| 하위 검색어 | rotate video and save (windows 11 / vlc / mac / online) · rotate video permanently vlc · why won't my video rotate · rotate video on iphone without losing quality · rotate mp4 video without losing quality |
| 검색 의도 | 정보형(How-to) + 비교형(어느 무료 도구가 화질을 지키나) |
| 채널 | 검색형 |
| 상위 결과 (WebSearch `rotate video without losing quality`, 2026-11-22) | 도구 사이트: CapCut(resource·tools)·Cloudinary(guide·tool)·InVideo·Dreamina / 개발자: FFmpeg 메일링 리스트·Mux 'rotate a video with ffmpeg' / 작은 블로그: wildandfreetools 'Can You Rotate a Video Without Losing Quality? Here's the Truth' / 업체 블로그: videoconverterfactory·VideoProc(유료 앱 홍보) / 포럼: Apple Discussions(일본), Adobe community. **공통**: 회전 표시(메타데이터)만 바꾸면 무손실이고 그 밖에는 다시 인코딩한다는 설명 + FFmpeg 명령 + 자사 도구 홍보. **빠진 것**: 비개발자가 쓰는 무료 앱·웹 도구가 실제로 어느 방식을 쓰는지 결과 파일로 확인한 값(같은 프레임 비율·PSNR·프레임 수·소리·촬영 날짜), '회전 표시만 바꾼 파일'이 브라우저·플레이어에서 어떻게 보이는지, VLC로 '영구 회전'한 파일이 플레이어마다 다르게 보인다는 점, ezgif 'Copy original'이 실제로는 다시 인코딩한다는 점 |
| 차별점 | 같은 시험 영상(휴대폰을 눕혀 찍기 시작해 옆으로 누워 보이는 MP4: 가로 프레임 + 회전 표시 −90°, 촬영 날짜·위치 태그)을 5개 도구 7가지 설정으로 돌려 원본 프레임과 비교. **LosslessCut 3.70.0만 720프레임 모두 원본과 같음**(회전 표시만 지움, 크기 그대로, 날짜·위치 유지), VLC 3.0.20은 Effects만 켜면 저장 파일이 그대로 누워 있고 프로필 변환 필터까지 켜면 VLC에서는 바로 보이지만 **Chromium에서는 좌우가 뒤집히고 Firefox 160.0.1에서는 옆으로 누워 보임**, ezgif 'Copy original'도 크기 53.6% 감소·42.2 dB(다시 인코딩), 123apps는 무료 내보내기 720p·30fps(34.0 dB), HandBrake 1.7.2는 42.3 dB·날짜 재설정 |
| 내부 링크 계획 | 나가는 링크: 허브 `free-image-converter-photo-tools`, `trim-video-without-losing-quality`(LosslessCut·복사 모드), `convert-iphone-video-to-mp4`(회전 표시·VLC 거울상·123apps), `compress-video-for-discord-email`(HandBrake로 크기 줄이기), `remove-metadata-from-photos`(위치 태그). 받는 링크: **색인된 `convert-heic-to-jpg-free`**('세로 사진 방향 태그' 문단에 영상도 같은 방식이라는 1문장), 허브 `free-image-converter-photo-tools`(영상 절에 1문장 + 요약 표), `convert-iphone-video-to-mp4`(회전 표시 문단에 1문장) |
| 개요 | 첫 문단(결론·측정 범위) → 요약 표 → Why rotating a video usually lowers quality → Which free tools keep the original quality?(결과 표·그림) → How to rotate a video without losing quality in LosslessCut → How to rotate a video in VLC and save it(왜 저장이 안 되나·필터·플레이어별 결과) → Rotate a video in HandBrake when you need a new file → Rotate a video online with ezgif or 123apps → Rotate a video on iPhone, Mac, Windows or Android without another app(문서 기반) → Why won't my video rotate? → How we tested → Which method should you use? |
| 이미지 | 대표: 옆으로 누운 휴대폰에서 둥근 화살표가 넘어가 같은 휴대폰이 바로 서는 장면 + 필름 릴(연한 페리윙클 배경, 코럴·골든 옐로, 아이소메트릭). 본문: 결과 표 그래픽(charts.py), LosslessCut 회전 버튼 전후 화면 + 주석, VLC 결과 한 파일을 VLC·Chromium·Firefox에서 본 화면 비교, VLC 프로필 Filters 탭 + Effects Transform 화면 + 주석, ezgif 결과(-53.57%)·123apps 내보내기 화면 + 주석 |

## 측정 환경

- 측정일: 2026-11-22 UTC (세션 103, 2026-11-23 KST)
- 원본 영상: Tears of Steel 1080p(CC BY 3.0 Blender Foundation, `https://download.blender.org/demo/movies/ToS/tears_of_steel_1080p.mov.zip`) 3:00~3:30 → `make_clips.sh`
  - `clip-h264.mp4`(26,264,820 B, MD5 `b66da733bc5475d14564f8f0bb4d6f25`): H.264 High CRF 18, 1920×800, 24fps, 720프레임, 키프레임 2초마다 + AAC 192 kbps 44.1 kHz
  - **`sideways.mp4`**(26,264,855 B, MD5 `627671ada802863616ff7fe76e47b622`): 위 파일을 다시 인코딩 없이 복사하고 회전 표시(display matrix −90°)를 더함 → 재생 때 800×1920으로 옆으로 누워 보임. 휴대폰을 눕혀 찍기 시작해 방향이 잘못 기록된 영상을 흉내 냄. `creation_time` 2026-06-14T15:30:00Z, `location` +40.6892-074.0445/(Android 휴대폰 MP4가 쓰는 ©xyz 태그)
  - `baked-sideways.mp4`(24,363,110 B, MD5 `836115c3e7307914d78dfc69156b2864`): 프레임 자체를 시계 방향 90°로 돌려 다시 인코딩(CRF 18), 회전 표시 없음 → 다른 앱을 거치며 회전이 굳은 영상. LosslessCut만 시험
  - **실제 휴대폰으로 찍은 영상이 아님**: 휴대폰 MP4의 회전 표시 방식을 흉내 낸 시험 파일. 1080p 휴대폰 영상(1920×1080)이 아니라 영화 원본 비율(1920×800)
- 데스크톱 앱 (Xvfb 1366×900 + xdotool, 캡처 ImageMagick `import`)
  - LosslessCut 3.70.0 Linux AppImage (`https://github.com/mifi/lossless-cut/releases/download/v3.70.0/LosslessCut-linux-x86_64.AppImage`, 221,422,511 B, SHA-256 `98360f3cc3f5f7a2302876eb237447150d961acf67ba7f999dea6d4a11501320`), `--appimage-extract` 뒤 `losslesscut --no-sandbox --disable-gpu`. Flathub에는 3.69.0까지(2026-11-22 API), GitHub 릴리스 3.71.0 이상은 404 → 3.70.0을 최신으로 봄
  - VLC 3.0.20 (Ubuntu 24.04 패키지 `3.0.20-3build6`, root 실행 거부 → 일반 사용자 `tester`, `--aout=dummy`(소리 장치 없음 오류 창 방지)). videolan.org 최신판은 아래 '버전 차이'
  - HandBrake 1.7.2 (Ubuntu 패키지 `1.7.2+ds1-1build2`, GUI `ghb`). handbrake.fr 최신 1.11.2(`app_versions.py` 11-22 주간 점검)
- 웹 도구: Playwright Chromium(headless, Linux, `/opt/pw-browsers/chromium-1243`), 2026-11-22 17:44~18:09 UTC
  - ezgif.com/rotate-video (`web_ezgif.cjs`), online-video-cutter.com/rotate-video = 123apps (`web_123apps.cjs`)
- 재생 확인: Chromium(같은 Playwright, `frame_shot.cjs`), Firefox 160.0.1(Mozilla 공식 tar.xz, Xvfb에서 로컬 페이지), VLC 3.0.20(`--video-filter=`로 저장된 회전 필터를 끈 채)
- 측정 보조: ffprobe/ffmpeg 6.1.1(framemd5·psnr·ssim), `analyze.py`(표시 크기·같은 프레임·PSNR·소리·태그 → `results.jsonl`), `align_psnr.py`(출력 프레임마다 원본 짝을 찾아 밝기 PSNR → `align.jsonl`, numpy)
- 대표 이미지 생성(17:33~18:16 UTC)이 앞부분 측정과 겹침 → 처리 시간은 비교에 쓰지 않음

## 결과 (`results.jsonl`, `align.jsonl`)

정답 = `sideways.mp4`를 회전 표시 없이 디코딩한 1920×800 프레임 720장. 결과는 재생 프로그램처럼 회전 표시를 적용해 디코딩(ffmpeg autorotate).

| 도구·설정 | 크기(B) | 저장 / 회전 표시 / 보이는 크기 | 프레임 | 원본과 같은 프레임 | 밝기 PSNR(짝 맞춤 평균) | 영상 비트레이트 | 소리 | 날짜·위치 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 원본 sideways.mp4 | 26,264,855 | 1920×800 / −90 / 800×1920(누움) | 720 | - | - | 6,802 kbps | AAC 196k | 둘 다 |
| **LosslessCut 3.70.0** 회전 버튼 1번(0°) + Export 기본값 | **26,264,855** | 1920×800 / 없음 / **1920×800** | 720 | **720 (100%)** | 같음 | 6,802 | AAC 복사(같음) | **둘 다 남음** |
| LosslessCut 3.70.0 baked-sideways, 270° | 24,363,110 | 800×1920 / 90 / 1920×800 | 720 | 0 (정답이 다른 인코딩) — **baked 원본 저장 프레임과는 720장 모두 같음** | 47.6(ffmpeg psnr, baked 인코딩 손실만) | 6,295 | AAC 복사(같음) | 둘 다 남음 |
| ezgif rotate 270 + **Copy original**(기본값) | 12,194,615 (−53.57%) | 1920×800 / 없음 / 1920×800 | 720 | 0 | 42.15 (ffmpeg psnr 43.03, SSIM 0.986) | 3,116 | AAC 129k(다시 인코딩) | 둘 다 지움 |
| ezgif rotate 270 + MP4 (h264/aac) | 12,195,098 | 같음 | 720 | 0 | 43.03(ffmpeg psnr) | 3,116 | AAC 129k | 둘 다 지움 |
| 123apps Rotate 3번 + Export 기본 720p | 10,303,362 | **1732×720** / 없음 / 1732×720 | **900 (30fps)** | 0 | 33.99 (원본 크기로 키워 비교, 원본 프레임 180장 반복) | 2,609 | AAC 130k | 둘 다 지움 |
| VLC 3.0.20 Effects Transform 270 + 기본 프로필 그대로 | 11,761,787 | 1920×800 / **−90 / 800×1920(그대로 누움)** | 718 | 0 | -(누움) | 3,024 | **MP2 128k** | 날짜 = 변환 시각, 위치 없음 |
| VLC 3.0.20 Effects Transform 270 + 프로필 **Video transformation filter** | 11,812,452 | 800×1920 / 행렬 [0 1; 1 0](회전 + 좌우 반전) / 1920×800 | 718 | 0 | 저장 프레임을 시계 방향 90°로 세우면 41.98(마지막 2프레임 빠짐), ffmpeg이 행렬대로 보이면 좌우 반전(12.3) | 3,038 | MP2 128k | 날짜 = 변환 시각, 위치 없음 |
| HandBrake 1.7.2 Fast 1080p30 + Rotation 270° | 13,960,045 | 1920×800 / 없음 / 1920×800 | 720 | 0 | 42.34 (ffmpeg psnr 43.24, SSIM 0.986) | 3,554 | AAC 162k | 날짜 = 인코딩 시각, 위치 없음 |

- 원본 `sideways.mp4`의 회전 행렬은 `[0 65536; -65536 0]`(순수 회전 −90°), VLC 결과는 `[0 65536; 65536 0]`(행과 열을 맞바꾼 전치 = 회전 + 좌우 반전, ffprobe는 'rotation=-90'으로만 표시)
- 같은 VLC 파일의 재생 결과(10초 화면): VLC 3.0.20 = 바로 서고 좌우 정상 / Chromium = 바로 서지만 좌우 반전 / Firefox 160.0.1 = 행렬을 무시하고 800×1920 저장 프레임 그대로(옆으로 누움) → `screens/play-*.webp` 캡처
- LosslessCut 결과는 Chromium·Firefox 모두 바로 섬(회전 표시를 지운 파일·90° 표시를 붙인 baked 파일 둘 다)
- 123apps 1080p: Export 창의 1080p 버튼에 초록 다이아몬드(유료) 표시 → 1080p 선택 시 문구만 바뀌고(`The video will be exported in high definition…`) 결과는 아래 '1080p 시도'
- ezgif: 'Copy original'과 'MP4 (h264/aac)' 결과가 크기 483 B 차이로 거의 같고 둘 다 encoder 태그 `ezgif.com`, 비트레이트 3,116 kbps → 'Copy original'은 '원래 코덱(H.264)으로 다시 인코딩'으로 해석
- LosslessCut 명령(로그): `ffmpeg -display_rotation:v:0 360 -i sideways.mp4 -map 0:0 -c:0 copy -map 0:1 -c:1 copy -map_metadata 0 -movflags +faststart` (0° = 360) / baked 270°: `-display_rotation:v:0 90` → LosslessCut의 숫자는 시계 방향 각도, 회전 버튼은 누를 때마다 0° → 90° → 180° → 270° 순서(처음 상태 'Don't modify')이고 저장 프레임 기준 절대 각도
- VLC: Effects and Filters > Video Effects > Geometry > Transform 'Rotate by 270 degrees' + Save → `vlcrc`에 `transform-type=270`·`video-filter=transform`이 저장돼 **이후 모든 재생에 계속 적용됨**(되돌리려면 Transform 체크 해제 + Save). 프로필 편집 창: Video codec > Filters > 'Video transformation filter' 체크, 같은 창에 'Keep original video track'(복사)도 있음
- HandBrake: Source가 회전 표시를 반영해 800×1920으로 읽음. Rotation 목록 Off·90°·180°·270°(시계 방향), 270° 선택 뒤 Summary 'Filters: Comb Detect, Decomb, Rotate', '1920×800 storage', 'Passthru Common Metadata' 켜져 있어도 creation_time이 인코딩 시각으로 바뀜

## 사실 확인표 (주장 → 출처 → 확인 방법)

| 주장 | 출처 | 확인 |
| --- | --- | --- |
| LosslessCut 회전 버튼 한 번으로 시험 영상이 0°(바로 섬), Export가 크기 그대로·720프레임 모두 원본과 같음, 날짜·위치 유지 | 직접 실행 (`results.jsonl`, 캡처 `screens/losslesscut-*`) | analyze.py framemd5 720/720, 크기 26,264,855 B 동일 |
| LosslessCut 기능 소개 'Edit metadata and rotation' | `source-losslesscut-app.txt` (losslesscut.app) | 렌더링 본문 54줄 |
| LosslessCut은 회전이 프레임에 굳은 영상도 회전 표시만 붙여 프레임을 그대로 둠 | 직접 실행 (baked 270°) | 저장 프레임 framemd5 목록 MD5 `b9229464…cdcb` 동일 |
| ezgif 'Copy original'(기본값)도 파일이 53.57% 작아지고 42.2 dB → 다시 인코딩 | 직접 실행 (`web_ezgif.cjs`, 결과 화면 `File size: 11.63MiB (-53.57%)`) | analyze.py·align_psnr.py |
| ezgif 소개 문구 'copy the original encoding for fastest processing', 최대 200MB, 서버 파일 1시간 뒤 삭제 | `source-ezgif-rotate-video.txt` + 결과 화면 문구('The file will be removed from our servers in 1 hour') | 렌더링 본문·결과 화면 텍스트 |
| 123apps 회전 페이지는 편집기 화면, Rotate 버튼 1번에 시계 방향 90°, 무료 내보내기 기본 720p, 1080p에 유료 표시 | 직접 실행 (`web_123apps.cjs`, 캡처 `screens/123apps-export.webp`) | 캡처·Export 창 텍스트 |
| 123apps 결과 1732×720·30fps·900프레임, 34.0 dB | 직접 실행 | analyze.py·align_psnr.py |
| 123apps 페이지 안내 문구는 'Save' 버튼(실제 화면은 Export) | `source-123apps-rotate-video.txt` | 렌더링 본문 20줄 |
| VLC Effects만으로는 저장 파일이 그대로 누움, 소리 MP2, 날짜 재설정 | 직접 실행 | analyze.py |
| VLC 변환 필터를 켜면 VLC에서는 바로 서지만 Chromium 좌우 반전, Firefox 160.0.1 누움 | 직접 실행 (`screens/play-*.webp`) | 세 플레이어 캡처 비교 |
| HandBrake 1.7.2 Rotation 270° 결과 42.3 dB, 720프레임, 날짜 재설정·위치 없음 | 직접 실행 | analyze.py·align_psnr.py |
| iPhone·Mac Photos 앱에서 Edit로 영상 회전 | `source-apple-104968-edit-videos.txt` ('Add a filter and rotate your videos') | 렌더링 본문 72~76줄 |
| QuickTime Player: View > Show Clips → 클립 선택 → Edit 메뉴에서 왼쪽·오른쪽 회전, 가로·세로 뒤집기 → Done | `source-apple-quicktime-rotate.txt` | 렌더링 본문 38~52줄 |
| Windows Photos 앱은 영상 자르기(Trim)만, 고급 편집은 'Edit in Clipchamp video editor', Save as Copy | `source-microsoft-edit-photos-videos.txt` | 125~135줄 |
| Clipchamp: 타임라인에서 클립 선택 → 떠 있는 도구 모음 점 3개 → 90° 회전 버튼 | `source-microsoft-clipchamp-rotate.txt` | 렌더링 본문 |
| Google Photos(Android): 영상 열기 → Crop → Rotate(90°) → Save(편집본 사본 저장) | `source-google-photos-10729480.txt` | 39~49줄 |
| 휴대폰·데스크톱 내장 앱이 회전 표시만 바꾸는지 다시 인코딩하는지는 확인하지 못함 | (iPhone·Mac·Windows·Android 앱은 컨테이너에서 실행 불가) | 본문에 '시험하지 못함'으로 씀 |

## 버전 차이·한계

- VLC: Ubuntu 패키지 3.0.20. 최신 3.0.x 판에서 회전 행렬이 고쳐졌는지는 확인하지 못함 → 본문에 시험한 판을 명시하고 단정하지 않음. 2026-11-10 `convert-iphone-video-to-mp4`(VLC 3.0.20 세로 영상 변환이 Chromium에서 좌우 반전)와 같은 현상
- HandBrake 1.7.2(Ubuntu) vs 최신 1.11.2: 회전 필터는 같은 이름·같은 목록(Off/90/180/270)으로 문서화 — 최신판은 시험하지 않음
- 123apps·ezgif: 2026-11-22 화면. 웹 도구는 공지 없이 바뀜
- 시험 파일 1개(H.264 MP4). HEVC .mov(iPhone 기본)는 이번에 시험하지 않음 — LosslessCut의 HEVC 복사는 `convert-iphone-video-to-mp4`·`trim-video-without-losing-quality`에서 확인

## 재생 확인 추가 (2026-11-22 19:0x UTC)

- LosslessCut(회전 표시 지움)·LosslessCut baked(90° 표시)·HandBrake·ezgif(Copy original)·123apps 결과 5개를 Chromium(`frame_shot.cjs` 2초)·Firefox 160.0.1(로컬 페이지 첫 화면)·VLC 3.0.20(`--video-filter=`, 3~4초)에서 열어 모두 바로 서고 좌우도 원본과 같음을 확인 → 본문 '세 플레이어 모두 바로 섬'의 근거. 캡처는 저장소에 넣지 않음(`/tmp/rv/play/players-check.png`, `firefox-all.png`)
- VLC 결과만 VLC(정상)·Chromium(좌우 반전)·Firefox(누움)로 갈림 → 그래픽 `vlc-rotated-video-in-three-players.webp`
- Clipchamp 내보내기: `source-microsoft-clipchamp-export.txt` — MP4, 'The frame rate is 30fps', 480p·720p·1080p·4K·GIF, 유료 기능을 쓰면 다이아몬드 표시 → 본문 'Clipchamp exports an MP4 at 30 fps'
- 123apps 1080p: Export 창에서 1080p를 누르면 설명이 'The video will be exported in high definition…'으로 바뀌지만 Export 뒤 15분 안에 내려받기가 시작되지 않음(`web_123apps.cjs` 시간 초과) → 본문 '1080p는 시험하지 않음'
