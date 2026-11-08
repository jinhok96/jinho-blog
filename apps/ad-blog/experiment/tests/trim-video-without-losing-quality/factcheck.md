# trim-video-without-losing-quality 사실 확인표

- 검증 유형 (가설 H3): **검증형** — 무료 온라인 자르기 도구 3곳(5가지 설정)을 Chromium에서 직접 실행하고 결과 파일을 원본 프레임과 비교(How we tested)
- 주 검색어 (가설 H6): `trim video without losing quality` — 브리프 주 검색어

## 작성 전 브리프 (2026-11-09 KST 세션 91)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `photo-video` 상시 글 (검색형). 허브 `free-image-converter-photo-tools` |
| 주 검색어 | `trim video without losing quality` — `demand_check.py suggest` 2026-11-08: 본 검색어 Google·Bing·YouTube 3곳, 하위 21개. Trends 미국 3개월 `trim video` 평균 3.6 · `compress video` 2.5 · `video to gif` 6.6 · `convert mov to mp4` 0.3 (기준 `remove background` 33.8) |
| 하위 검색어 | `cut video without losing quality`(Google·YouTube), `trim video without losing quality online`·`online free`·`free`(Google), `trim video online without losing quality`(Bing), `trim video without losing quality windows`·`windows 11`·`android`(Google), `ezgif trim video without losing quality`(Bing) |
| 검색 의도 | 정보형 How-to + 도구 선택(비교) — "어떤 도구·설정이면 화질이 그대로인가" |
| 채널 | 검색형 |
| 상위 결과 (WebSearch 2026-11-08) | Microsoft Tech Community 포럼 질문(Windows 11 Photos), Amped Software 블로그(포렌식, 2021), Storrito 도움말(자기 도구 홍보 "No quality loss"), brightcoding 블로그, CloudConvert 블로그(2013), VideoConverterFactory(유료 소프트웨어 홍보), edesy·wildandfreetools(자기 도구 홍보). 공통: "재인코딩하지 않으면 화질이 그대로", LosslessCut·Avidemux 추천. 빠진 것: 실제로 결과 파일을 원본과 비교한 곳 없음, 키프레임 때문에 시작점이 얼마나 앞당겨지는지 수치 없음, 인기 도구의 기본값이 재인코딩인지 확인 없음 |
| 차별점 | ① 결과 파일의 모든 프레임을 원본과 MD5로 비교(같은 프레임 %) + 재인코딩이면 PSNR·SSIM ② 123apps(online-video-cutter.com)는 기본값이 재인코딩이고 'No re-encoding' 스위치를 켜야 원본 그대로 ③ 원본 그대로 모드의 시작점: ezgif는 숨은 앞부분을 파일에 넣고 12.5초부터 재생, 123apps는 앞 키프레임(12.0초·9.5초)부터 시작 ④ "재인코딩 없음"을 내세운 Storrito가 우리 시험에서는 재인코딩(같은 프레임 0%, 소리 Opus) |
| 내부 링크 계획 | 나가는 링크: 허브 `free-image-converter-photo-tools`, `compress-video-for-discord-email`, `convert-heic-to-jpg-free`(iPhone Most Compatible), `remove-metadata-from-photos`(업로드 전 개인정보) / 받는 링크: 색인된 `compress-image-to-100kb` 마지막 문단(영상 압축 문장 뒤 1문장), 허브 요약 표 행 + 짧은 절, `compress-video-for-discord-email`(자르기만 필요할 때 1문장) |
| 개요 | 첫 문단(답: 재인코딩하지 않는 모드 + 키프레임) → 요약 표 → What "without losing quality" actually means → Which free online trimmers kept the original frames? → How to trim with ezgif's Copy original → How to turn on No re-encoding in 123apps → Why does a lossless trim start early? → Storrito → Phone and computer apps (Photos, QuickTime, Google Photos, LosslessCut — 문서 기반) → Which method should you use? → FAQ → How we tested |
| 이미지 | 대표: 필름 띠에서 한 토막을 그대로 들어 올린 장면(페리윙클 + 코랄·머스터드, 정면). 본문: ① 도구별 결과 표 그래픽 ② 키프레임 시작점 타임라인 그래픽 ③ ezgif 설정 화면(Copy original 표시) ④ 123apps 설정 화면(No re-encoding 표시) |

## 측정 (직접 실행, 2026-11-08 UTC)

| 주장 | 근거 |
| --- | --- |
| 원본: Tears of Steel 1080p(1920×800, 24fps, CC BY 3.0 Blender Foundation) 3:00~4:00을 시험 클립 2개로 → H.264 MP4(CRF 18, 키프레임 1초마다, AAC 192k, 61.2 MB), HEVC MOV(CRF 20, x265 기본 키프레임 = 장면 전환마다: 0·3.25·9.5·13.08·18.5·21.17·26.67·28.67·32.46초…, 40.8 MB) | `make_clips.sh`, ffprobe 키프레임 목록(log) |
| 요청 구간: 0:12.5~0:30.0 (17.5초, 420프레임). 시작점 앞 키프레임은 H.264 12.0초(0.5초 앞), HEVC 9.5초(3.0초 앞) | 위 키프레임 목록 |
| 같은 프레임 판정: 출력과 원본을 디코딩해 프레임별 MD5(framemd5), 같은 MD5 비율. 같지 않으면 96×40 회색 축소판으로 원본 프레임을 찾아 맞춘 뒤 ffmpeg psnr·ssim | `analyze.py` |
| 측정 도구 보정: ffmpeg `-c copy` 자르기 = 같은 프레임 100%·표시 12.5초·저장 12.0초, x264 재인코딩 = 0%·43.9 dB | `analyze.py` 시험 (log) |
| ezgif Copy original(기본값): H.264 100%·표시 12.5초(파일 안 저장 12.0초, 0.5초 숨김)·끝 30.083초·15.7 MB / HEVC 100%·표시 12.5초(저장 9.5초, 3.0초 숨김)·9.6 MB, 영상·소리 원본 그대로(AAC 197k) | `results.jsonl` |
| ezgif MP4 (h264/aac): 같은 프레임 0%, PSNR 45.1 dB·SSIM 0.986(H.264) / 45.6 dB·0.988(HEVC → H.264로 바뀜), 7.1·6.4 MB, 소리 AAC 130k, 시작·끝 정확 | `results.jsonl` |
| 123apps 기본값(MP4, No re-encoding 꺼짐): 0%, PSNR 44.7 dB·SSIM 0.988(H.264) / 45.0 dB·0.990(HEVC → H.264), 14.8·12.3 MB, AAC 130k, 시작·끝 정확 | `results.jsonl` |
| 123apps No re-encoding 켬: 100%, 시작 12.0초(H.264, 0.5초 앞)·9.5초(HEVC, 3.0초 앞), 편집 목록 없이 앞 키프레임부터 저장·재생, 끝 30.083초, 15.7·9.6 MB. 켜면 File format이 Auto로 바뀌고 MP4·MKV·MOV는 회색 | `results.jsonl`, `screens/123apps-no-re-encoding.webp` |
| 123apps 설정 문구: "No re-encoding — Available only when trimming or rotating. When enabled, saving is instant but may cause playback issues in rare cases." 기본 꺼짐 | 화면 캡처 2026-11-08 (`screens/`) |
| Chromium 153 `<video>` 재생 첫 화면: ezgif Copy original H.264 → 원본 12.5초 화면(차이 1.1 vs 12.0초 22.1), 길이 17.58초 / 123apps No re-encoding → 원본 12.0초 화면(0.62 vs 21.5), 길이 18.17초 | `playback_check.cjs` (log) |
| Storrito(storrito.com/tools/video-trim): H.264 0%, PSNR 43.2 dB·SSIM 0.980, 영상 3.6 Mbps(원본 구간 6.75 Mbps), 소리 AAC → Opus 128k, 8.1 MB. 키프레임에 맞춘 12.0~30.0초도 0%·43.3 dB. HEVC는 Chromium 153(Linux)에서 소리만 든 285 KB 파일을 "Saved"로 저장(영상 없음) | `results.jsonl`, ffprobe |
| Storrito 페이지 문구: "There is no re-encoding - the original codec is preserved - so quality is identical to the source", 배지 "No quality loss", "No upload" | `source-storrito-video-trim.txt` |
| Storrito는 숫자 입력 없이 손잡이만 → 픽셀 단위로 끌어 화면의 in·out 표시가 12.50·30.00이 되게 맞춤 | `web_storrito.cjs` |
| ezgif 처리 시간: Copy original 1.0~1.1초, MP4 재인코딩 8.5~9.0초(서버 처리, 업로드 제외, 1회) | `web_ezgif.cjs` 출력 |
| Clideo: 결과 페이지까지 갔으나 내려받기 주소가 우리 Chromium에서 403 → 시험에서 뺌. 결과 페이지에 "Remove watermark" 버튼 | `web_clideo.cjs`, 캡처 |
| 시험 환경: Playwright Chromium 153.0.8010.12(headless, Linux), ffmpeg 6.1.1(Ubuntu 패키지, 측정 보조) | `env.txt` |

## 문서 (1차 출처, 2026-11-08 UTC 렌더링)

| 주장 | 출처 |
| --- | --- |
| ezgif: 최대 200MB, 1시간 뒤 자동 삭제, "keep" 모드는 기본으로 원본 영상·소리 스트림을 복사(재인코딩 없음), "remove" 모드는 항상 재인코딩, MP4·WebM을 고르면 재압축 | `source-ezgif-cut-video.txt` (https://ezgif.com/cut-video) |
| 123apps: 4 GB까지, 몇 시간 뒤 서버에서 자동 삭제, Premium $6/월 "Save videos without length limits"·"Open files up to 4 GB in size"·"Full HD video export" | `source-123apps-online-video-cutter.txt` |
| LosslessCut: 무료(웹사이트·GitHub), MS Store·App Store판은 유료(지원 목적), Windows 10·11, macOS 13 이상, Linux. "Lossless cuts can only start at a keyframe, so a cut starts at the keyframe before your cut point, a fraction of a second up to several seconds earlier depending on the encoding." "Beware of unofficial websites" | `source-losslesscut-app.txt` (https://losslesscut.app/) — 앱은 이번 세션에서 실행하지 못함 |
| Windows Photos: Trim (Ctrl + E), Save as Copy 또는 드롭다운의 Save로 원본 덮어쓰기. 화질·재인코딩 언급 없음 | `source-microsoft-edit-photos-videos.txt` |
| iPhone·Mac 사진 앱: Save Video(잘린 판만) vs Save Video as New Clip(원본 유지 + 새 클립), Revert to Original, New Clip은 Revert해도 길이 복원 안 됨. 화질 언급 없음 | `source-apple-104968-edit-videos.txt` |
| QuickTime Player: Edit > Trim, 노란 손잡이, 손잡이를 누르고 있으면 프레임 단위, Trim 클릭. 화질 언급 없음 | `source-apple-quicktime-trim.txt` |
| Google Photos(Android): 손잡이로 자르고 Save → 편집본을 사본으로 저장, 일부 편집은 RAM·Android 버전 조건 | `source-google-photos-10729480.txt` |
| Tears of Steel CC BY 3.0 | https://mango.blender.org/sharing/ (`compress-video-for-discord-email` 글과 같은 표기) |

## 쓰지 않은 것

- LosslessCut·Avidemux·Shotcut 직접 시험: 내려받은 데스크톱 앱 실행이 이번 세션 권한에서 막힘 → LosslessCut은 공식 사이트 문장으로만, "we tested" 쓰지 않음
- Windows Photos·QuickTime·iPhone 사진 앱이 재인코딩하는지: 기기가 없고 공식 문서에 언급이 없음 → "문서가 말하지 않는다"로만
- Storrito가 Chrome(Windows·Mac)에서 다르게 동작하는지: 확인 못 함 → 우리 환경(Chromium 153, Linux)을 밝히고 단정하지 않음
- 확대 비교 그림: 200% 확대에서도 재인코딩 차이가 눈으로 거의 구분되지 않아(밝기 평균 차이 1 미만) 그림으로 쓰지 않고 수치로만
