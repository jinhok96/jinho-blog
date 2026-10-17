# compress-video-for-discord-email 사실 확인표

- 주 검색어: `compress video for discord`
- 하위 검색어: `compress video`, `compress video file size`, `compress video free`, `compress video without losing quality`, `compress video to 10mb`, `compress video for email`, `compress video with handbrake`
- 채널: 검색형 (제목 57자, 설명 157자)
- 차별점: Discord 무료 한도가 2026-08 20MB로 바뀌었는데 HandBrake Social 프리셋(10MB·25MB)은 맞지 않음을 직접 측정. 클립 3개 × 설정 14개의 크기·VMAF·시간, 길이별 비트레이트 표
- 적용한 노하우: 검색형 제목, 측정 규모 제목 표기("14 Settings Tested"), 이미지 5장(대표 그래프 1200×675 + 인코더별 VMAF + 시간 + 화면 글자·얼굴 확대 비교 2장), 요약 표 + 전체 결과 표, 내부 링크 4개. 앱 화면 스크린샷 없음(HandBrake GUI는 컨테이너에서 창이 뜨지 않음)
- 측정일: 2026-10-16, 환경은 `env.txt`

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 클립 3개: BBB 1:30~2:30(4K→1080p), ToS 3:00~4:00(1920×800), 직접 녹화 화면 60초, 모두 x264 CRF 14 + AAC 256k | `make_sources.sh`, `record_screen.sh` |
| 원본 클립 비트레이트: 애니메이션 51.6MB/60초(약 6.9Mbps), 실사 89.0MB(약 11.9Mbps), 화면 7.0MB | `ls -la src_clips` |
| 설정 14개 크기·VMAF(평균·하위 5%)·시간·최대 RAM | `results.json`, `run-log.txt` (`run_tests.py`) |
| VMAF: 3프레임마다 1개(n_subsample=3), 출력을 원본 크기로 bicubic 확대 후 비교, 기본 모델 | `run_tests.py` `vmaf()` |
| 시간은 1회 실행. HandBrake Fast 1080p30 실사·19MB slow 계열 일부는 다른 확인 작업과 겹쳐 실행됨 → 30% 미만 차이는 노이즈로 표기 | 작업 기록 (log.md) |
| Social 10 MB 1 Minute: x264 평균 1125kbps, 2-pass, 최대 960×540, AAC 160 / Social 25 MB 1 Minute: 3000kbps, medium, 1280×720, AAC 160 / Fast 1080p30: RF 22, preset fast, main 4.0 | `hb-preset-*.json` (`HandBrakeCLI --preset-export`) |
| Social 10MB 결과 8.3~9.7MB, Social 25MB 결과 20.2~23.9MB | `results.json` |
| 19MB 목표(2380kbps) → 18.95~19.01MB(소리 있음), 화면 14.6~18.9MB | `results.json` |
| SVT-AV1 1-pass VBR(rc=1)은 목표보다 작게(12.7~17.4MB) | `results.json` |
| HandBrake RF 5에서도 원본 대비 PSNR 40.8dB (FFmpeg CRF 5 60.9dB), 화면 녹화는 HandBrake 50.8dB. 색 태그 제거·crop 0·decomb 끄기 모두 같음. 원인 미확인 → 글에 "우리 클립에 한정될 수 있음" 명시 | `hb_psnr_check.sh` |
| FFmpeg 기본 x264는 `crf=23.0` | 출력 파일 SEI 설정 문자열(`strings`) |
| HandBrake GUI(Linux) 라벨: "Bitrate (kbps):", "Multi-Pass Encoding", "Turbo Analysis Pass", "Encoder Preset", "Constant Quality" | flatpak `ghb` 바이너리 문자열 |
| 길이별 비트레이트 표: kbps = 목표 바이트 × 8 / 초 / 1000 × 0.99 − 128 | `run_tests.py` `target_kbps()`, 60초 결과로 확인 |

## 문서 (1차 출처, 2026-10-16 확인)

| 주장 | 출처 |
| --- | --- |
| Discord 무료 업로드 한도 20MB, "As of August 2026 ... 20MB (up from 10MB)", 압축 전 크기로 확인, Nitro Basic 50MB·Nitro 최대 1GB, MP4(H264·HEVC/H265·AV1) | https://support.discord.com/hc/en-us/articles/25444343291031 (Zendesk API `api/v2/help_center/en-us/articles/25444343291031.json`, updated 2026-10-15). 일반 페이지는 403 |
| Discord 모바일 업로드 압축: 비 Nitro Best Quality 720p, Standard(기본) 480p, 경로 User Settings > App Settings > Text & Media > Video Uploads | https://support.discord.com/hc/en-us/articles/9665451164951 (API, updated 2026-10-07) |
| Gmail 개인 계정 첨부 25MB, 넘으면 Google Drive 링크로 바뀜 | https://support.google.com/mail/answer/6584?hl=en |
| HandBrake 현재 버전 1.11.2, 무료·오픈소스 | https://handbrake.fr/ , https://handbrake.fr/downloads.php |
| Social 프리셋 "designed to guarantee video up to a certain duration will produce a file smaller than a specific size", 기본 프리셋 Fast 1080p30 | https://handbrake.fr/docs/en/latest/technical/official-presets.html |
| x264/x265 1080p 권장 RF 20-24 | https://handbrake.fr/docs/en/latest/workflow/adjust-quality.html |
| 평균 비트레이트는 목표 크기가 필요할 때만, 멀티 패스 권장 문장 인용 | https://handbrake.fr/docs/en/latest/technical/video-cq-vs-abr.html |
| Windows는 .NET Desktop Runtime 10.0.x 필요, Windows/Mac/Linux 지원 | https://handbrake.fr/docs/en/latest/technical/system-requirements.html |
| FFmpeg 최신 9.0.2 | https://ffmpeg.org/download.html |
| `winget install ffmpeg` (gyan.dev release full) | https://www.gyan.dev/ffmpeg/builds/ |
| Homebrew ffmpeg 9.0.2 | https://formulae.brew.sh/api/formula/ffmpeg.json |
| VMAF: Netflix가 개발한 perceptual video quality assessment | https://raw.githubusercontent.com/Netflix/vmaf/master/README.md |
| Big Buck Bunny·Tears of Steel CC BY 3.0 표기 | https://peach.blender.org/about/ , https://mango.blender.org/sharing/ (video-to-gif 글과 같은 표기) |

## 확인하지 못해 쓰지 않은 것

- Discord "20MB"가 10^6 단위인지 2^20 단위인지 → 19,000,000바이트를 목표로 함
- 기기·Discord 플레이어의 H.265·AV1 재생 호환성 (직접 테스트 불가) → "H.264가 안전" 정도로만, 재생 테스트 안 했다고 명시
- HandBrake Windows·Mac GUI의 정확한 라벨 (Linux 라벨만 확인)
- trac.ffmpeg.org 인코딩 가이드는 Anubis 봇 차단 → 인용하지 않음

## 변경 기록

- 2026-10-17: 비개발자 기준(명령줄 금지)에 따라 FFmpeg 섹션 전체(설치 `winget`·`brew`, 2-pass 명령, H.264·H.265·AV1 비교, 해상도 낮추기, 기본 명령), 요약 표·전체 결과 표의 FFmpeg 값·행 7개, FFmpeg 추천, 태그 FFmpeg, 삭제된 글(GIF·PDF 압축) 링크 제거 → 이미지 압축 글 링크로 교체. 10MB 행은 FFmpeg 9.5MB 대신 측정한 HandBrake Social 10 MB로, HandBrake-FFmpeg 차이 설명은 HandBrake slow·high 결과와 RF 5 주의 문장으로 정리. 제목 "(14 Settings Tested)" → "(7 Settings Tested)", 설명 교체, `updatedAt: 2026-10-17`. `charts_no_cli.py`로 대표 그래프(HandBrake 4개)·인코딩 시간(HandBrake 7개)을 다시 그리고, 확대 비교 2장은 FFmpeg 타일이 있는 아래 줄을 잘라냄(측정값·픽셀 그대로). 인코더별 VMAF 그래프(`compress-video-encoder-quality-19mb.webp`)는 FFmpeg를 빼면 HandBrake 1개만 남아 글과 이미지 폴더에서 삭제
