# remove-audio-from-video 사실 확인표

- 검증 유형 (가설 H3): **검증형** — 무료 데스크톱 앱 3개와 웹 도구 3곳을 컨테이너에서 직접 실행해 소리를 뺀 결과 파일을 원본과 프레임 단위로 비교
- 주 검색어 (가설 H6): `remove audio from video` — 브리프 주 검색어

## 작성 전 브리프 (2026-11-24 UTC, 세션 104 일반 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `photo-video` (우선순위 2) 상시 글, 검색형. 카테고리 `software` |
| 주 검색어 | `remove audio from video` — `demand_check.py suggest` 2026-11-24: **Google·Bing·YouTube 3곳**. 하위 18개: `… iphone`(3곳), `… canva`·`… online`·`… online free`·`… windows`(Google·Bing), `… vlc`(Bing·YouTube), `… davinci resolve`(Google·YouTube), `… android`·`… free`(Google), `… clipchamp`(Bing), `… capcut`·`… premiere pro`·`… final cut pro`(YouTube). 가장 구체적인 3곳 변형은 `remove audio from video iphone`이지만 답이 앱 버튼 하나이고(AI 요약 위험) iPhone 앱은 컨테이너에서 실행할 수 없어 기본 검색어로 정하고 iPhone은 소제목으로 (README 기준 3번의 예외 판단, 세션 62 `turn off ai in firefox`와 같은 이유). Trends 미국 3개월(기준 `remove background` 평균 33.1): `remove audio from video` 0.3 · `… iphone` 0.0 · `mute video` 0.9 · `rotate video` 0.9 → 롱테일 |
| 하위 검색어 | remove audio from video online free · remove audio from video vlc · remove audio from video windows · remove audio from video iphone · remove audio from video android · mute video |
| 검색 의도 | 정보형(How-to) + 비교형(어느 무료 도구) |
| 채널 | 검색형 |
| 상위 결과 (WebSearch 2026-11-24 `how to remove audio from video`, `remove audio from video online free`) | 업체·도구 페이지: Adobe(Creative Cloud·Express), Microsoft Clipchamp 도움말, MAGIX, CapCut, Descript, Kapwing, VEED, Cloudinary, InVideo, Fotor, FlexClip, Wondershare·EaseUS(업체 블로그). **공통**: 자기 도구의 Mute 버튼 안내, 'no watermark'·'keep quality' 주장. **빠진 것**: 결과 파일이 다시 인코딩됐는지·해상도/프레임 속도가 바뀌는지·촬영 날짜·위치가 남는지·세로 영상이 어떻게 나오는지를 잰 글이 없음 |
| 차별점 | 같은 시험 영상 2개(가로 H.264 MP4·iPhone식 세로 HEVC .mov, 촬영 날짜·위치 태그)를 무료 도구 6개·7가지 설정으로 처리해 프레임 MD5·PSNR·프레임 수·해상도·소리 트랙·태그·회전 표시를 원본과 대조. **LosslessCut 3.70.0·ezgif만 프레임 100% 동일**, ezgif는 날짜 태그를 지움(iPhone식은 위치까지), VLC 'Keep original video track'은 마지막 프레임을 자르고 세로 영상 회전 행렬을 거울상으로 바꿈, Cloudinary는 74.7% 작게 다시 인코딩, 123apps 무료 내보내기는 720p·30fps이고 **세로 영상을 가로 틀에 늘려 찌그러뜨림** |
| 내부 링크 계획 | 나가는 링크: 허브 `free-image-converter-photo-tools`, `trim-video-without-losing-quality`(복사 모드·ezgif·LosslessCut), `rotate-video-without-losing-quality`(회전 표시·VLC 거울상), `convert-iphone-video-to-mp4`(HEVC·hev1·HandBrake 세로), `compress-video-for-discord-email`(HandBrake로 크기 줄이기), `remove-metadata-from-photos`(위치 태그). 받는 링크: **색인된 `convert-heic-to-jpg-free`**(iPhone 영상 형식 문단에 1문장), 허브 요약 표 1행, `compress-video-for-discord-email` HandBrake 단계 아래 1문장 |
| 개요 | 첫 문단(결론·측정 범위) → 요약 표 → Does removing audio lower video quality? → Which free tools remove audio without re-encoding?(결과 표) → How to remove audio from a video in LosslessCut → Remove audio from a video online with ezgif → How to remove audio from a video in VLC → HandBrake, Cloudinary and 123apps re-encode the picture → Remove audio on iPhone, Mac, Windows or Android → Other tools we looked at → How we tested → Which method should you use? |
| 이미지 | 대표: 재생 삼각형이 있는 휴대폰 + 필름 릴 옆 스피커에서 음파가 흩어지고 가위가 음파 하나를 자르는 장면(연한 라일락 배경, 세이지 그린·살구색, 약간 높은 옆 시점). 본문: 결과 표 그래픽, LosslessCut Tracks·Export options 화면 + 주석, ezgif 결과·로컬 처리 화면 + 주석, VLC 프로필 두 탭 + 주석, 세로 영상 10초 화면 비교(원본·ezgif·Cloudinary·123apps) |

## 측정 환경

- 측정일: 2026-11-24 UTC 17:37~18:08 (세션 104, 2026-11-25 KST)
- 원본: Tears of Steel 1080p(CC BY 3.0 Blender Foundation, `https://download.blender.org/demo/movies/ToS/tears_of_steel_1080p.mov.zip`) 3:00~ → `make_clips.sh`
  - **`landscape.mp4`**(26,264,855 B, MD5 `fc049f168d1794c28965e082127708a8`): H.264 High CRF 18, 1920×800, 24fps, 720프레임, 키프레임 2초마다 + AAC 192 kbps 44.1 kHz 스테레오. `creation_time` 2026-06-14T15:30:00Z, `location` +40.6892-074.0445/(Android 휴대폰 MP4가 쓰는 ©xyz 태그). 회전 글의 `clip-h264.mp4`와 같은 인코딩(크기 26,264,820 B 동일)
  - **`portrait.mov`**(11,541,125 B, MD5 `f17e47407745f57de0eb21fd5934caf5`): HEVC(x265 CRF 20, `hvc1`) 1920×800 저장 + 회전 표시 −90°(재생 때 800×1920 세로) + AAC 192 kbps, 20초 480프레임. `creation_time`, `com.apple.quicktime.creationdate` 2026-06-14T11:30:00-0400, `com.apple.quicktime.location.ISO6709` +40.6892-074.0445+010.000/, `com.apple.quicktime.make` Apple
  - **실제 휴대폰으로 찍은 영상이 아님**: 휴대폰 파일의 저장 방식(가로 프레임 + 회전 표시, Apple 태그)을 흉내 낸 시험 파일
- 데스크톱 앱 (Xvfb 1366×900 + xdotool, 캡처 ImageMagick `import`)
  - LosslessCut 3.70.0 Linux AppImage (`https://github.com/mifi/lossless-cut/releases/download/v3.70.0/LosslessCut-linux-x86_64.AppImage`, 221,422,511 B, SHA-256 `98360f3cc3f5f7a2302876eb237447150d961acf67ba7f999dea6d4a11501320` — 세션 103과 같은 파일), `--appimage-extract` 뒤 `losslesscut --no-sandbox --disable-gpu`
  - VLC 3.0.20 (Ubuntu 24.04 패키지 `3.0.20-3build6`, 일반 사용자 `tester`, `--aout=dummy`)
  - HandBrake 1.7.2 (Ubuntu 패키지 `1.7.2+ds1-1build2`, GUI `ghb`, 일반 사용자 `tester`)
- 웹 도구: Playwright Chromium(headless, Linux), 로그인 없음
  - ezgif.com/mute-video 서버 처리(`web_ezgif.cjs`)·Local processing(`web_ezgif_local.cjs`), online-video-cutter.com/volume = 123apps(`web_123apps.cjs`), cloudinary.com/tools/remove-audio-from-video(`web_cloudinary.cjs`), clideo.com/mute-video(`web_clideo.cjs`, 내려받기 403)
- 측정 보조: ffprobe/ffmpeg 6.1.1(framemd5·psnr·ssim·volumedetect), `analyze.py`(→ `results.jsonl`), `frame_map.py`(빠진 원본 프레임 번호 → `frame_map.jsonl`), `align_psnr.py`(출력 프레임마다 원본 짝을 찾아 밝기 PSNR → `align.jsonl`, 세션 103 파일 복사)
- 대표 이미지 생성(17:31 UTC~)이 측정과 겹침 → 처리 시간은 비교에 쓰지 않음

## 결과 (`results.jsonl`, `align.jsonl`, `frame_map.jsonl`)

정답 = 원본 파일을 회전 표시 없이(-noautorotate) 디코딩한 저장 프레임. 같은 프레임 = 프레임 MD5가 비트 단위로 같음.

### 가로 H.264 MP4 (`landscape.mp4`, 720프레임)

| 도구·설정 | 크기(B) / 변화 | 같은 프레임 | 밝기 PSNR(짝 맞춤 평균) | 해상도·fps·프레임 | 소리 트랙 | 날짜·위치 |
| --- | --- | --- | --- | --- | --- | --- |
| LosslessCut 3.70.0 Tracks에서 소리 끔 + Export 기본값 | 25,516,452 / −2.85% | **720 (100%)** | 같음 | 1920×800, 24, 720 | 없음 | **둘 다 남음** |
| ezgif Mute video (서버) | 25,516,451 / −2.85% | **720 (100%)** | 같음 | 1920×800, 24, 720 | 없음 | 날짜 지움, 위치 남음 |
| ezgif Mute video (Local processing) | 25,516,452 / −2.85% | **720 (100%)** | 같음 | 같음 | 없음 | 날짜 지움, 위치 남음 |
| VLC 3.0.20 Audio 체크 해제 + Keep original video track | 25,443,365 / −3.13% | 715 (순서대로 비교) — 717프레임 모두 원본에 있음, **원본 715·718·719번 빠짐** | - | 1920×800, 24, 717 (29.833초) | 없음 | 날짜 = 변환 시각(2026-11-24T17:59:15Z), 위치 없음 |
| VLC 3.0.20 Video - H.264 + MP3 (MP4) 프로필, Audio 체크 해제 | 11,261,859 / −57.12% | 0 | 42.09 (중앙값 42.39, 최저 36.42), 원본 718·719번 빠짐 | 1920×800, 24, 718 | 없음 | 날짜 = 변환 시각, 위치 없음 |
| HandBrake 1.7.2 Fast 1080p30 기본값 + Audio 탭 트랙 X | 13,423,305 / −48.89% | 0 | 42.24 (ffmpeg psnr Y 42.99·평균 44.24, SSIM 0.986) | 1920×800, 24, 720 (H.264 Main) | 없음 | 날짜 = 인코딩 시각, 위치 없음 |
| Cloudinary Remove Audio (MP4) | 6,651,382 / −74.68% | 0 | 39.85 (중앙값 40.22, 최저 34.38; ffmpeg psnr Y 40.64·평균 41.88, SSIM 0.978) | 1920×800, 24, 720, 1,772 kbps | 없음 | 둘 다 지움 |
| 123apps Change Video Volume 0% + Export 기본(720p) | 9,772,910 / −62.79% | 0 | 원본 크기로 키워 30 → 24fps로 맞춘 ffmpeg psnr Y 32.33·평균 33.90 / align_psnr 38.70(프레임 반복 900장이라 짝 맞춤이 부정확: 짝 없는 원본 74장) → 글에는 dB 대신 '720p로 다시 인코딩'만 | **1728×720, 30fps, 900** | 없음 | 둘 다 지움 |

- 소리 트랙: 모든 결과가 소리 트랙 0개(무음 트랙을 남긴 도구 없음). 123apps는 Volume 0%로도 트랙 자체를 뺌
- 크기 −2.85%는 원본 소리 트랙(AAC 약 196 kbps × 30초) 크기만큼. 검증용으로 ffmpeg `-an -c copy`도 25,516,452 B·720/720 (`results.jsonl` '검증용' 행, 글에는 쓰지 않음)

### 세로 iPhone식 HEVC .mov (`portrait.mov`, 480프레임)

| 도구·설정 | 크기(B) | 같은 프레임 | 회전 표시 / 보이는 방향 | 코덱 태그 | 날짜·위치(Apple 태그) |
| --- | --- | --- | --- | --- | --- |
| LosslessCut 3.70.0 기본값 | 11,040,362 | **480 (100%)** | 원본과 같은 행렬, 세로 | hvc1 | `creation_time`만 남음, Apple 날짜·위치·제조사 태그 빠짐 |
| LosslessCut 3.70.0 + **Preserve all MP4/MOV metadata** 켬 | 11,040,914 | **480 (100%)** | 같음 | hvc1 | **모두 남음** |
| ezgif 서버 / Local processing | 11,040,361 / 11,040,448 | **480 (100%)** | 같음 | hvc1 | 모두 지움 |
| VLC 3.0.20 Audio 해제 + Keep original video track (MP4로 저장) | 11,036,230 | 477프레임 모두 원본에 있음, **원본 1·477·479번 빠짐** | 행렬 `[0 65536; 65536 0]`(회전 + 좌우 반전, 원본은 `[0 65536; -65536 0]`) | **hev1**(원본 hvc1) | 날짜 = 변환 시각, 위치 없음 |
| Cloudinary (MP4) | 3,834,207 | 0 | 회전 표시 없음, 프레임 자체를 800×1920으로 세움 → 바르게 섬. 세운 원본과 PSNR Y 40.59·평균 41.87 | H.264(avc1) | 모두 지움 |
| 123apps Volume 0% + Export 720p | 5,268,812 | 0 | **1728×720 가로, 회전 표시 없음** — 세운 원본(800×1920)을 1728×720으로 늘린 것과 PSNR Y 35.13 → 세로 화면을 가로 틀에 늘려 찌그러뜨림. 편집기 미리보기부터 같은 모양(`screens/123apps-portrait-set.webp`) | H.264(avc1) | 모두 지움 |

- HandBrake는 세로 파일을 시험하지 않음 (세션 93: Fast 1080p30이 세로 영상을 1,080줄로 줄임 → `convert-iphone-video-to-mp4` 링크로)
- `hev1` 태그 HEVC는 Apple 기기에서 재생되지 않을 수 있다는 것은 이번 세션 1차 출처로 확인하지 않음 → 글에서는 '태그가 바뀌었다'는 사실만, 영향은 단정하지 않음

### 시험하지 못한 도구

- **Clideo**(clideo.com/mute-video): 업로드 → 자동 처리(30초) → 결과 화면 'Mute · 27.5 MB / MP4 · Remove watermark · Download' → Download 클릭 시 `403 Forbidden nginx` (`web-runs.jsonl`, `screens/clideo-landscape-*.webp`). 세션 91에서도 같은 403. 'Remove watermark' 버튼이 있다는 사실만 씀(워터마크가 실제로 들어갔는지는 파일을 못 받아 확인 못 함)
- **AudioRemover**(audioremover.com): headless Chromium에서 `403 Forbidden` → 우회하지 않음(README 규칙). curl로 받은 페이지 문구: "The audio track is removed and the video stream is copied whenever possible … Nothing is ever uploaded", "up to 10 videos · max 500 MB each" — 직접 시험하지 않아 글에서는 '우리 시험 브라우저를 막음'만
- Kapwing·VEED·Adobe Express·Canva·CapCut: 계정·편집기 기반 → 시험하지 않음(글에서 이름만, 로그인 필요 여부 단정하지 않음)
- iPhone Photos·Google Photos·Clipchamp·QuickTime·iMovie: 컨테이너에서 실행 불가 → 1차 출처 문장만

## 사실 확인표

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| LosslessCut 3.70.0: Tracks에서 소리 트랙 끔 → Export, 720/720 같은 프레임, 날짜·위치 유지, 25,516,452 B | 직접 실행 (`results.jsonl`, `screens/lc-*.webp`) | analyze.py |
| LosslessCut 세로 파일: 기본값은 Apple 위치 태그 빠짐, Preserve all MP4/MOV metadata 켜면 모두 남음 | 직접 실행 (`screens/lc-preserve-metadata.webp`) | analyze.py 태그 |
| LosslessCut은 무료·오픈 소스, Windows 10·11·macOS 13 이상·Linux, 스토어판은 유료(서명 비용) | `source-losslesscut-app.txt` | 렌더링 본문 15·16·78·85~87줄 |
| ezgif Mute video: 720/720 같은 프레임, 날짜 태그 지움(가로는 위치 남음, iPhone식은 모두 지움), −2.85% | 직접 실행 (`web-runs.jsonl`, `screens/ezgif-*.webp`) | analyze.py |
| ezgif 로컬 처리: 파일 업로드 요청 없음(POST는 광고 주소뿐), 같은 결과 | 직접 실행 (`web_ezgif_local.cjs` 출력 `post_requests`) | Playwright 요청 기록 |
| ezgif 최대 200MB, 1시간 뒤 삭제, "audio track is completely removed, not just silenced", "No watermarks, no registration required" | `source-ezgif-mute-video.txt` | 렌더링 본문 45·57줄 |
| VLC Keep original: 717프레임, 마지막 3프레임(715·718·719) 빠짐, 날짜 재설정 / 세로: 1·477·479 빠짐, 행렬 회전 + 반전, hev1 | 직접 실행 (`results.jsonl`, `frame_map.jsonl`, `screens/vlc-*.webp`) | analyze.py·frame_map.py |
| VLC 기본 H.264 프로필 + Audio 해제: 다시 인코딩 −57.12%, 42.09 dB, 718프레임 | 직접 실행 (`align.jsonl`) | align_psnr.py |
| HandBrake 1.7.2: Audio 탭 X로 트랙 삭제 → 다시 인코딩 −48.89%, 42.24 dB, 날짜 재설정 | 직접 실행 (`screens/hb-audio-*.webp`) | analyze.py·align_psnr.py |
| Cloudinary: 다시 인코딩 −74.68%, 1,772 kbps, 태그 지움, 세로는 프레임을 세워 저장 | 직접 실행 (`web-runs.jsonl`) | analyze.py·ffmpeg psnr |
| Cloudinary 페이지: 무료, "no watermarks" | `source-cloudinary-remove-audio.txt` | 렌더링 본문 195·231·346줄 |
| 123apps: Volume 0% → 무료 기본 720p(1080p는 유료 표시), 1728×720·30fps·900프레임, 세로 영상 가로로 늘림 | 직접 실행 (`screens/123apps-*.webp`) | analyze.py·ffmpeg psnr(늘린 원본 35.13) |
| Mac QuickTime Player: Edit > Remove Audio → video only 파일 | `source-apple-quicktime-remove-audio.txt` | 렌더링 본문 38·46·48줄 |
| iMovie for iPhone: 클립 탭 → Audio 버튼 → Mute 버튼, 타임라인 클립 왼쪽 위에 음소거 아이콘 | `source-apple-imovie-iphone-adjust-audio.txt` | 렌더링 본문 44·46·50·52줄 |
| Apple iPhone 사용 설명서 'Trim video length, adjust speed, and edit audio'는 자르기·속도·Audio Mix만 다루고 음소거 단계 없음 | `source-apple-iphone-edit-videos.txt` | 렌더링 본문 grep `mute` 0건 |
| Google Photos(Android): Pixel 8+는 Audio → Mute(또는 Audio Eraser) → Save, 다른 기기는 Mute | `source-google-photos-10729480.txt` | 렌더링 본문 118~133줄 |
| Clipchamp: 스피커 기호로 음소거(내보내기에 소리 안 들어감), Detach audio 뒤 삭제 | `source-microsoft-clipchamp-mute-audio.txt` | 렌더링 본문 27~50줄 |
| Clideo: 결과 화면 Remove watermark 버튼, Download 403 | 직접 실행 (`screens/clideo-landscape-*.webp`) | 화면 |

## 버전 차이

- LosslessCut: GitHub 릴리스 3.70.0이 최신(세션 103 확인: 3.71.0 이상 404)
- VLC: Ubuntu 패키지 3.0.20 (videolan.org 최신 3.0.x는 세션 93 기준 3.0.24). 최신판에서 마지막 프레임·회전 행렬 동작이 고쳐졌는지는 확인 못 함 → 본문에 시험한 판 명시
- HandBrake: Ubuntu 패키지 1.7.2 (handbrake.fr 최신 1.11.2, 11-22 주간 점검)
