# LosslessCut 3.69.0 직접 시험 (2026-11-09 UTC, 세션 92 개선 세션)

- 앱: LosslessCut 3.69.0 Linux AppImage (`https://github.com/mifi/lossless-cut/releases/download/v3.69.0/LosslessCut-linux-x86_64.AppImage`, 221,591,107 B, SHA-256 `179eaae27bffbe25a6549a4a714474126b57c288cefc307046fc9c6313a12676` — 세션 91에서 받은 파일과 같은 값). `--appimage-extract`로 푼 뒤 `losslesscut --no-sandbox --disable-gpu`, 내장 ffmpeg `n8.0-23-gd1f31a829d-20251022`
- 화면: Xvfb 1366×900, xdotool로 조작(창 크기 1366×900), 캡처는 ImageMagick `import`. 사람이 쓰는 GUI 순서 그대로: File > Open(ctrl+O, 경로 입력) → Toggle advanced view → 구간 시작·끝 상자에 `00:00:12.500`·`00:00:30.000` 입력(오른쪽 패널 "17500 ms, 420 frames") → Export → Export options(기본값 확인, 필요하면 스위치 하나만 바꿈) → Export
- 원본 클립: `make_clips.sh`로 다시 만든 `clip-h264-1s.mp4`(61,240,968 B)·`clip-hevc.mov`(40,847,895 B) — 세션 91 글의 크기(61.2 MB·40.8 MB)와 같음. MD5 `d2acd8457e0ccc13d8dbd9e211878011`·`68b10e613f9e693cc194948ff48beafe`
- 측정: `analyze.py`(프레임 MD5·표시/저장 시작점·PSNR/SSIM), 프레임별 원본 대응은 framemd5 목록 비교, 재인코딩 프레임 PSNR은 ffmpeg `psnr` 필터로 프레임마다(출력 n번 ↔ 원본 300+n번), 재생 첫 화면은 `playback_check.cjs`(Playwright Chromium 153)로 0초 화면을 원본 12.0·12.5·13.0초 화면과 평균 절대 차이 비교

## Export options 기본값 (Show advanced options 켬)

Export mode: Separate files · Output container: 입력과 같음(mp4 / mov) · Keeping 2 tracks · 저장 위치: 원본 폴더(Working dir unset) · 파일 이름 `{원본}-00.00.12.500-00.00.30.000.{확장자}` · Overwrite existing files 켬 · Shift all start/end times +0 frames · Enable MOV Faststart 켬 · Preserve all MP4/MOV metadata 끔 · Preserve chapters 켬 · Preserve metadata Default · **Smart cut (experimental) 끔** · **Keyframe cut mode 켬** · avoid_negative_ts make_zero · ffmpeg experimental flag 끔 (`export-options-default.webp`)

화면 문구: Smart cut 켜면 "Smart cut is experimental and will not work on all files." / Keyframe cut mode 끄면 "Note: Keyframe cut is recommended for most common files" / HEVC 열 때 "File is not natively supported. Preview playback may be slow and of low quality, but the final export will be lossless. You may convert the file from the menu for a better preview." / 내보내기 뒤 "Export is done! … Cutpoints may be inaccurate."

## 결과 (요청 0:12.5 ~ 0:30.0, 420프레임)

| 설정 | 클립 | 같은 프레임 | 표시 시작 | 프레임 수 | 크기 | Chromium 첫 화면 | 비고 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 기본값 (Keyframe cut 켬) | H.264 | 100% (434/434) | 12.0초 (−0.5) | 434 | 15,718,044 B | 12.0초 화면 (차이 1.0 vs 12.5초 25.3) | 길이 18.17초, 편집 목록 없음 |
| 기본값 (Keyframe cut 켬) | HEVC | 100% (494/494) | 9.5초 (−3.0) | 494 | 9,591,635 B | - (Chromium HEVC 디코딩 불가) | 123apps No re-encoding과 같은 시작점 |
| Smart cut 켬 | H.264 | 97.39% (410/421) | 12.5초 | 421 | 15,527,510 B | 12.5초 화면 (1.44) | 앞 11프레임(원본 300~310) 재인코딩 PSNR 47.1~53.2 dB, 그 뒤 원본 312번(13.0초)부터 복사 → **원본 311번(12.958초) 빠짐** |
| Smart cut 켬 | HEVC | 96.91% (408/421) | 12.5초 | 421 | 8,117,619 B | - | 앞 13프레임(원본 300~312) 재인코딩 PSNR 44.6~49.4 dB, 원본 314번(13.083초)부터 복사 → **원본 313번(13.042초) 빠짐**. `analyze.py` 전체 PSNR 26.5 dB·SSIM 0.893은 빠진 1프레임 때문에 정렬이 밀린 값이라 쓰지 않음 |
| Keyframe cut 끔 | H.264 | 100% (410/410) | 13.0초 (+0.5) | 410 | 14,874,858 B | 13.0초 화면 (1.57) | 영상 start_time 0.5초·소리 0.015초 → 소리는 12.5초부터, 영상은 다음 키프레임 13.0초부터 |

- 끝점: 모두 30.083초(요청보다 2프레임 뒤, 온라인 복사 모드와 같음). 소리는 모두 원본 AAC 복사(약 197 kbps)
- Smart cut의 ffmpeg 명령(`ffmpeg-commands.log`): 복사 구간 `-ss 13.000000 … -t 17.000000 -c copy`(HEVC `-ss 13.083333 -t 16.916667`) + 인코딩 구간 `-ss 12.500000 … -t 0.458333 -c:0 h264 -b:0 9557359`(HEVC `-t 0.541666 -c:0 hevc -b:0 6293848`) → concat. 인코딩 구간 길이가 (다음 키프레임 − 시작 − 1프레임)이라 이음매 1프레임이 빠지는 것으로 보임 (해석)
- 기본값 명령: `-ss 12.500000 -i … -t 17.500000 -avoid_negative_ts make_zero -c copy` (입력 앞 탐색 → 앞 키프레임부터)
- 캡처: `h264-segment.webp`(구간 입력 뒤), `export-options-default.webp`·`export-options-smartcut.webp`, `h264-export-done.webp`·`h264-smartcut-done.webp`·`h264-nokeyframe-done.webp`, `hevc-open.webp`(HEVC 미리보기 안내), `hevc-export-done.webp`·`hevc-smartcut-done.webp`. 결과 파일 자체는 저장소에 넣지 않음(`/tmp/tv/out/losslesscut/`, 크기는 위 표)
