# convert-iphone-video-to-mp4 사실 확인표

- 검증 유형 (가설 H3): **검증형** — 웹 변환기 2곳과 데스크톱 앱 3개를 컨테이너에서 직접 실행해 결과 파일을 원본과 프레임 단위로 비교
- 주 검색어 (가설 H6): `convert iphone video to mp4` — 브리프 주 검색어

## 작성 전 브리프 (2026-11-10 UTC, 세션 93 일반 세션)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `photo-video` (우선순위 2) 상시 글, 검색형 |
| 주 검색어 | `convert iphone video to mp4` — `demand_check.py suggest` 2026-11-10: Google·Bing·YouTube 3곳. 하위 18개(`free`·`online free` Google·Bing, `on pc`·`on mac`·`app`·`imovie`(Google), `how to … without losing quality`·`in windows`·`in laptop`(YouTube), `can you …`(Bing)). 같은 날 `convert mov to mp4` 20개(`mac`·`on iphone` 3곳, `vlc`·`free`·`online` Google·Bing, `without losing quality` Bing·YouTube, `handbrake` YouTube). Trends 미국 3개월(기준 `remove background` 34.3): `mov to mp4` 2.1 · `convert mov to mp4` 0.3 · `convert iphone video to mp4` 0.0 · `trim video` 3.5 → 롱테일 |
| 하위 검색어 | convert mov to mp4 without losing quality · convert iphone video to mp4 on pc / on mac · convert mov to mp4 vlc · convert mov to mp4 handbrake · convert iphone video to mp4 online free · can you rename mov to mp4 |
| 검색 의도 | 정보형(How-to) + 비교형(어느 도구가 원본을 지키나) |
| 채널 | 검색형 |
| 상위 결과 (WebSearch 2026-11-10) | `convert iphone video to mp4`: FlexClip learn(자기 도구 홍보), weareopen discourse 복제 글, byteplus(벤더), Penn State Media Commons 2017(HandBrake 단계), apeaksoft·Wondershare·MiniTool(유료 변환기 홍보). `convert mov to mp4 without losing quality`: Stellar·Movavi·cococonvert 등 홍보 글과 복제 스팸. **공통: 방법 나열. 빠진 것: 결과 파일이 원본과 같은지·소리·프레임 수·회전·촬영 날짜가 남는지를 확인한 곳 없음** |
| 차별점 | 같은 HEVC .mov 클립(iPhone 기본 형식: HEVC + AAC, 촬영 날짜·위치 태그, 세로 회전 표시)으로 5개 도구 7가지 설정을 돌려 프레임 MD5·PSNR·소리 코덱·프레임 수·회전·메타데이터를 원본과 대조. LosslessCut만 같은 프레임 100%(+메타데이터 스위치), HandBrake 기본 프리셋이 세로 영상을 1,080줄로 줄임, VLC 기본 프로필 소리가 MP2라 Chromium에서 무음, 123apps가 24 → 25fps로 프레임 반복, CloudConvert 기본 CRF 23·무료 하루 10크레딧 |
| 내부 링크 계획 | 나가는 링크: 허브 `free-image-converter-photo-tools`, `trim-video-without-losing-quality`(LosslessCut·복사 모드), `compress-video-for-discord-email`(HandBrake), `convert-heic-to-jpg-free`(iPhone 사진 HEIC), `remove-metadata-from-photos`(위치 정보). 받는 링크: 색인된 `convert-heic-to-jpg-free`(iPhone HEIC 설명 문단에 영상 1문장), 색인된 `compress-image-to-100kb` 또는 허브 요약 표 행. 다른 글 `updatedAt`은 V7 판정(11-13) 전이라 바꾸지 않음 |
| 개요 | 첫 문단(결론·측정 범위) → 요약 표 → Why iPhone videos are .mov files → Which converter keeps your video as it was?(결과 표) → How to convert iPhone video to MP4 with every frame intact (LosslessCut) → When you need an H.264 MP4 instead (HandBrake) → Convert iPhone video to MP4 online → What VLC's Convert/Save does → Convert on the iPhone or Mac without another app → How we tested → Which method should you use? → FAQ(rename) |
| 이미지 | 대표: 휴대폰에서 떠오른 영상 타일이 모양이 다른 상자로 그대로 옮겨지는 장면(살구색 배경·청록·남색, 3/4 시점). 본문: 결과 표 그래픽(charts.py), LosslessCut 내보내기 설정 화면 + 주석, HandBrake 세로 영상 Dimensions 화면 + 주석, CloudConvert 옵션 화면 + 주석, VLC 프로필 소리 탭 + 주석 |

## 측정 환경

- 측정일: 2026-11-10 UTC (세션 93, 2026-11-11 KST)
- 원본 영상: Tears of Steel 1080p(CC BY 3.0 Blender Foundation) 3:00~4:00 → `make_clips.sh`
  - `clip-hevc.mov`: `trim-video-without-losing-quality`와 같은 명령·같은 파일(MD5 `68b10e613f9e693cc194948ff48beafe`, 40,847,895 B). HEVC Main 1920×800 24fps(CRF 20, `hvc1`) + AAC 192 kbps 44.1 kHz 스테레오, 60초 1,440프레임
  - `iphone-style.mov`(40,848,447 B): 위 파일을 다시 인코딩 없이 복사하고 iPhone이 .mov에 넣는 방식의 태그 추가 — `creation_time` 2026-06-14T15:30:00Z, `com.apple.quicktime.creationdate` 2026-06-14T11:30:00-0400, `com.apple.quicktime.location.ISO6709` +40.6892-074.0445+010.000/, `com.apple.quicktime.make` Apple
  - `iphone-portrait.mov`(11,580,253 B): 같은 클립 앞 20초(482프레임)에 세로 회전 표시(display matrix −90°) — 프레임은 가로로 저장, 재생 때 세로(800×1920)로 보임
  - **실제 iPhone으로 찍은 영상이 아님**: iPhone 기본 형식(HEVC + AAC, .mov — Apple 116944)과 메타데이터 방식을 흉내 낸 시험 파일. 실제 iPhone 영상의 HDR(Dolby Vision)·가변 프레임 속도·추가 메타데이터 트랙은 시험하지 않음
- 웹 도구: Playwright Chromium 153(headless, Linux), 2026-11-10 19:44~20:05 UTC
- 데스크톱 앱(Xvfb 1366×900 + xdotool, 화면 캡처 ImageMagick `import`): LosslessCut 3.69.0 Linux AppImage(SHA-256 `179eaae2…12676`, 세션 91·92와 같은 파일), VLC 3.0.20(Ubuntu 24.04 패키지, root 실행 거부 → 일반 사용자로 실행), HandBrake 1.7.2(Ubuntu 패키지 `1.7.2+ds1-1build2`). 최신판은 VLC 3.0.24(videolan.org)·HandBrake 1.11.2(handbrake.fr) — 아래 '버전 차이'
- 측정 보조: ffprobe/ffmpeg 6.1.1(framemd5·psnr·ssim), `analyze_convert.py`, `align_psnr.py`(numpy 2.4.6), `playback_check.cjs`(Chromium 소리·영상 디코딩 바이트)
- CPU 4코어·RAM 15GB. 대표 이미지 생성이 함께 돌아 처리 시간은 비교에 쓰지 않음. **첫 대표 이미지 생성(19:36 시작)이 20:39에 메모리 부족으로 종료됨**(`align_psnr.py` 첫 판이 원본 프레임 1,440장을 float32로 메모리에 올려 cgroup 한도 초과 → sd-cli가 OOM kill) → 스트리밍 방식으로 고친 뒤 20:41 재시작

## 결과 요약 (`results.jsonl`, `run_analysis.sh`)

| 도구·설정 | 클립 | 크기(B) | 그릇(major brand) | 영상 | 소리 | 프레임 | 같은 프레임 | 밝기 PSNR(맞춘 짝) | 태그 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 원본 `iphone-style.mov` | 가로 | 40,848,447 | qt | HEVC `hvc1` 24fps | AAC 192k | 1,440 | - | - | 촬영 시각·Apple 날짜·위치 |
| LosslessCut 3.69.0 mp4 기본값 | 가로 | 40,847,839 | isom | HEVC `hvc1` 복사 | AAC 복사 | 1,440 | 100% | 같음 | 촬영 시각(mvhd)만 남음, Apple 날짜·위치 없음 |
| LosslessCut + Preserve all MP4/MOV metadata | 가로 | 40,848,326 | **qt**(원본 brand 그대로) | HEVC 복사 | AAC 복사 | 1,440 | 100% | 같음 | 세 태그 모두 남음 |
| VLC 3.0.20 + Keep original video/audio track | 가로 | 40,837,554 | isom | HEVC 복사, 태그 `hev1`로 바뀜 | AAC 복사 | 1,437 | 1,437개 모두 원본과 같음, **원본 1·1436·1438번 빠짐** | 같음 | 촬영 시각이 변환 시각(2026-11-10T20:44:17Z)으로, 위치 없음 |
| VLC 기본 `Video - H.264 + MP3 (MP4)` | 가로 | 26,048,200 | isom | H.264 High 약 3.35 Mbps | **MP2** 128k | 1,438(ffprobe)·1,439(디코딩) | 0% | 41.97 dB(최저 36.12) | 변환 시각, 위치 없음 |
| HandBrake 1.7.2 Fast 1080p30 | 가로 | 30,581,974 | mp42 | H.264 Main RF 22, 24fps | AAC 약 162k | 1,440 | 0% | 41.97 dB(최저 33.38) | 변환 시각(20:49:34Z), 위치 없음 (Passthru Common Metadata 켜짐) |
| CloudConvert 기본값 | 가로 | 26,874,905 | isom | H.264 High CRF 23 | AAC 128k | 1,440 | 0% | 42.01 dB(최저 36.12) | 모두 없음 |
| 123apps Video Converter 기본값 | 가로 | 40,000,614 | isom | H.264 High **25fps** | AAC 128k | **1,500**(24프레임마다 1개 반복) | 0% | 43.36 dB(최저 36.25) | 모두 없음 |
| 123apps 기본값 | 세로 | 10,331,309 | isom | H.264 800×1920(픽셀을 세움, 회전 표시 0) 25fps | AAC 128k | 503 | 0% | 43.57 dB | 모두 없음 |
| VLC 기본 프로필 | 세로 | 6,784,469 | isom | H.264 1920×800 + 회전 표시 **[0 1; 1 0]**(회전 + 좌우 반전) | MP2 | 480 | 0% | (반전 때문에 비교 불가, 12.9 dB) | 변환 시각 |
| HandBrake Fast 1080p30 | 세로 | 5,156,780 | mp42 | H.264 **800×1080, SAR 9:16**(재생 때 800×1920으로 늘림) | AAC | 482 | 0% | 39.52 dB(800×1920으로 늘려 비교) | 변환 시각 |
| LosslessCut mp4 기본값 | 세로 | 11,579,645 | isom | HEVC 복사, 회전 표시 −90(원본과 같은 행렬) | AAC 복사 | 482 | 100% | 같음 | 촬영 시각만 |

- 밝기 PSNR은 `align_psnr.py`(출력 프레임마다 원본에서 가장 비슷한 프레임을 찾아 짝지은 뒤 Y 평면 PSNR). 정지 장면에서 축소판이 같아 빠짐·겹침 번호가 1~2개 틀릴 수 있어(CloudConvert·HandBrake도 73·77번 '빠짐'으로 나옴 — 실제로는 1,440프레임) 프레임 수는 ffprobe·framemd5 값을 씀. `analyze_convert.py`의 PSNR(출력 n번 ↔ 원본 n번)은 VLC처럼 프레임이 빠지면 27 dB대로 잘못 낮게 나와 글에 쓰지 않음
- VLC Keep original의 빠진 프레임: framemd5 대응으로 원본 1번(두 번째 프레임)·1436·1438번 (원본은 모든 프레임 MD5가 서로 달라 혼동 없음)
- Chromium 153 재생(`playback_check.cjs`, 3.5초 재생 뒤 `webkitAudioDecodedByteCount`): CloudConvert·123apps·HandBrake 소리 61~75 KB 디코딩, **VLC 기본 프로필 0 B**(가로·세로 모두). 세로 결과 화면(`frame_shot.cjs`, 4.2초): HandBrake·123apps는 원본 방향, **VLC는 좌우 반전**(screens/*-in-chromium.webp). 원본·LosslessCut 결과는 ffmpeg 디코딩으로 같은 방향 확인(Chromium은 HEVC 디코딩 불가)
- 이름만 바꾸기(FAQ): `iphone-style.mov` 사본을 `.mp4`로 바꾼 파일의 major brand `qt`, 영상 HEVC 그대로 (ffprobe)
- LosslessCut 내보내기 시간: 앱 로그 ffmpeg 명령 20:28:48.566Z → 완료 알림 20:28:48.709Z (0.14초, 대표 이미지 생성과 CPU 공유 중)
- CloudConvert: 기본값 변환 1회 성공(Download까지 24.3초) 뒤 Copy 설정 시험에서 "Conversion credits exceeded — Your daily limit of 10 conversion credits exceeded" (screens 없음, `/tmp/mv/shots/cc-style-copy-wait.png`). 앞선 시도(옵션 창을 닫지 못한 첫 실행)가 변환을 했는지는 확인 못 함 → 글에는 "free daily allowance를 다 써서 Copy를 시험 못 함"만
- 123apps 업로드: 39 MB에 약 240초(컨테이너 네트워크 기준, 글에 쓰지 않음)

## 주장 → 출처 → 확인 방법

| 주장 | 출처 | 확인 |
| --- | --- | --- |
| iPhone 7 이상 HEVC 촬영, Most Compatible이면 새 사진·영상 JPEG·H.264, HEVC가 같은 화질에 공간 적게 씀, 옛 형식이 "more broadly compatible with other devices and operating systems" | Apple 116944 (`source-apple-116944-heif-hevc.txt`, Published 2025-12-05) | 본문 문장 대조 |
| AirDrop·Messages·email은 받는 기기가 지원하지 않으면 JPEG·H.264로 보낼 수 있음, USB 가져오기 때 변환될 수 있고 Settings > Apps > Photos에서 아래로 내려 Keep Originals | Apple 116944 | 대조 |
| Windows 호환을 위해 Camera > Formats > Most Compatible 권장 | Apple 120267 (`source-apple-120267-transfer-to-pc.txt`, 2026-09-14) | 대조 |
| QuickTime Export As는 .mov(H.264·HEVC), "QuickTime Player doesn't export movies as MP4 videos", 1080p·4K에서 Greater Compatibility = H.264 | Apple QuickTime Player 설명서 qtp20e395859 (`source-apple-quicktime-export.txt`, macOS 27 선택 목록 있음) | 대조 |
| HEVC Video Extensions $0.99(미국 Store), "Play High Efficiency Video Coding (HEVC) videos in any video app on your Windows 10 device" | Microsoft Store 9NMZLZ57R3T7 JSON-LD `price 0.99 USD`·description (`store-hevc-video-extensions-jsonld.txt`: Chromium 렌더링 본문은 제목뿐이라 curl HTML의 JSON-LD 발췌, 2026-11-10 19:38Z) | JSON-LD |
| Clipchamp: MOV 입력, MP4 내보내기, 30fps, 무료 요금제 존재 | Microsoft Clipchamp 도움말 2쪽 (`source-microsoft-clipchamp-*.txt`) | 대조 |
| HandBrake 기본 프리셋 Fast 1080p30, 프리셋은 큰 해상도를 줄이고 높은 프레임 속도를 상한으로 묶음(인용) | HandBrake 문서 latest official presets (`source-handbrake-official-presets.txt` 88·99행) | 대조 |
| Fast 1080p30 = 1920×1080·30 PFR·RF 22·AAC 160, master에서도 같음, 크기 계산 함수가 1.7.2와 master에서 같음 | `handbrake-preset-fast1080p30.txt`(GitHub raw preset_builtin.json·libhb/hb.c 비교) | 직접 비교 |
| HandBrake 최신 1.11.2, VLC 최신 3.0.24 | handbrake.fr·handbrake.fr/downloads.php, videolan.org/vlc (curl, 2026-11-10) | 페이지 문자열 |
| HandBrake 1.7.2 GUI: Resolution Limit 1080p Full HD → 세로 Final 800×1080·PAR 9:16, 2160p 4K Ultra HD → 800×1920, Framerate 30·Peak Framerate, Passthru Common Metadata 켜짐 | 직접 실행 화면 (`screens/handbrake-*.webp`) | 화면 |
| LosslessCut 무료(웹사이트·GitHub), 앱 스토어판은 구매로 지원, 리먹스로 형식 바꾸기 | losslesscut.app (`source-losslesscut-app.txt`) | 대조 |
| LosslessCut 화면 문구: "Exporting whole file without cutting, because there are no segments to export.", HEVC 열 때 "File is not natively supported. Preview playback may be slow and of low quality, but the final export will be lossless." | 직접 실행 (`/tmp/mv/shots/llc-3.png`, `screens/losslesscut-*.webp`) | 화면 |
| CloudConvert 기본 H.264 CRF 23·AAC 128, Video/Audio Codec에 Copy (no re-encoding), 무료 하루 10 conversion credits | 직접 실행 화면 + `source-cloudconvert-pricing.txt` | 화면·대조 |
| 123apps: 무료·가입 없음, 4 GB, 서버 파일 "a few hours" 뒤 삭제, Settings 코덱 H.264/AVC·MPEG-4·H.265/HEVC | `source-123apps-video-converter.txt` + 직접 실행 | 대조·화면 |
| VLC: Media > Convert / Save, 프로필 Video - H.264 + MP3 (MP4), Audio codec MPEG Audio 128 kb/s, Keep original video/audio track | 직접 실행 화면 (`screens/vlc-*.webp`) | 화면 |

## 버전 차이·하지 않은 것

- HandBrake 1.11.2(현재)·VLC 3.0.24(현재)·Windows/Mac판은 실행하지 않음. HandBrake는 소스 비교로 같은 크기 제한을 확인, VLC는 "다를 수 있으니 소리 확인" 안내
- CloudConvert Copy (no re-encoding) 결과, 실제 iPhone 촬영본(HDR·Dolby Vision·가변 프레임 속도·4K·60fps), iPhone·Mac 내장 방법(기기 없음), 변환 속도 비교(대표 이미지 생성과 CPU 공유)
- 4K·60fps 축소는 HandBrake 문서·프리셋 값 기반 (시험 클립은 1080p급 24fps)
