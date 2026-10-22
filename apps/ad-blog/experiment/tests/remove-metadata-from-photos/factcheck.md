# remove-metadata-from-photos 사실 확인표

- 주 검색어: `remove metadata from photo`. 하위 검색어 (2026-10-22 `demand_check.py suggest`): remove metadata from photo android·free·iphone·online (Google·Bing·YouTube 중 2곳 이상), remove metadata from photo mac·windows·online free, remove exif data from photo, remove location from photo (+ iphone·android·samsung·pixel·windows·mac·online, 20개), delete metadata from photos. 자동완성 `remove metadata from photo` 21개 · `remove location from photo` 20개
- Trends 미국 3개월(2026-10-22): `remove metadata` 0.4 · `exif data` 0.1 · `photo location` 3.4 · `webp to png` 3.0 · 기준 `remove background` 35.4. 긴 검색어(`remove metadata from photo` 등)는 0.0 → 검색량은 작지만 질문형 검색어가 많고 상시 수요
- 채널: **검색형** (상시 수요, 비교·측정 + How-to). 제목 60자, 설명 158자
- 차별점: 상위 결과가 도구 사이트 자체·단계 안내인 검색어에서, 무료 도구 6개(앱 2·웹 4)를 같은 테스트 사진으로 측정. ① 모두 개인 정보는 지움 ② 웹 3곳(Jimpl·Verexif·IMGonline)은 회전 태그까지 지워 세로 사진 2/2가 옆으로 누움 ③ 같은 3곳은 사진 전체를 서버로 업로드(브라우저 요청 크기로 확인), ExifRemove는 업로드 없음 ④ XnConvert는 기본값이 메타데이터 유지 ⑤ ExifCleaner 4.6.0 기본 "Save as copy"가 우리 Linux 환경에서 8장 모두 실패
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 표기 `(6 Tools Tested)`(노하우 2), 요약 표, 내부 링크 4개(노하우 7)
- 이미지: **대표 이미지**(AI 생성, `hero_image.py`, 기록은 `hero-image.md`, `thumbnail` 비움) + 본문 6장: 결과 표 그래픽·세로 사진 비교 그래픽(직접 만든 그래픽, `chart_style.py` 라이트 모드) + ExifCleaner 4.6.0 설정·XnConvert Output 탭(Xvfb 캡처)·ExifRemove 결과·Jimpl 결과 화면(Chromium 캡처)
- 측정 환경: `env.txt` (Ubuntu 24.04 컨테이너, Xeon 2.80GHz 4코어). 2026-10-22 03:26~04:05 UTC (한국 12:26~13:05). 대표 이미지 생성이 같은 시간에 CPU를 쓰고 있었지만 속도를 재는 측정은 없음

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 테스트 사진 8장: PD12M CC0 1~8번(`sources.json`) → 4032×3024 JPG 품질 92, 03·06은 세로 사진을 가로 픽셀 + EXIF Orientation 6으로 저장. 모든 파일에 GPS(40.6892 N, 74.0445 W, 고도 12m)·Make "ToolProof"·Model "Metadata Test Phone"·SerialNumber·LensModel·DateTimeOriginal·Artist/Copyright "Jane Example"(가상 테스트 값)·Software·XMP City/Location/Creator·IPTC City/Keywords·EXIF 썸네일·sRGB ICC 기록 | `build_set.sh`, `exiftool -G1` 출력 |
| 6개 도구(XnConvert는 Preserve Metadata 해제) 모두 GPS·카메라·일련번호·렌즈·촬영 시각·작성자·도시·썸네일 제거 | `results/summary.json` (`analyze.py`, ExifTool 12.76) |
| ExifCleaner 4.6.0: 남은 태그는 Orientation·ICC·해상도(DPI)·JFIF뿐, 저장된 픽셀 8/8 동일, 크기 0.2~0.9% 감소, 세로 2/2 정상 | `summary.json` `exifcleaner` |
| ExifCleaner 4.6.0 설정 기본값: Preserve orientation·Preserve color profile·Preserve resolution·Save as copy 켜짐, 첫 화면 "Cleaned copies will be created — originals stay untouched." | Xvfb 캡처 `exifcleaner-settings-preserve-orientation.webp` |
| ExifCleaner 4.6.0 Save as copy 켜짐: 8장 모두 "Couldn't verify cleaned output. The incomplete copy was removed", 0 of 8 cleaned. 끄고 다시 하면 8 of 8 cleaned, 248 tags removed, 1s (Before 67 → After 36) | Xvfb 캡처 (`/tmp/meta/shots/ec46_done.png`·`ec46_done2.png`, 저장소에는 넣지 않음). Linux AppImage에서만 확인 |
| ExifCleaner 3.6.0: 모두 제거(회전 태그 포함) → 세로 2/2가 옆으로 누움, 원본 파일을 덮어씀(선택 파일 그대로 정리) | `results/exifcleaner_3.6.0.json` |
| ExifCleaner 최신 버전 4.6.0: GitHub Releases 다운로드 주소 `v4.6.0` 200(302), `v4.6.1`·`v4.7.0`·`v5.0.0` 404 | curl (api.github.com은 403이라 태그 목록 대신 주소 확인) |
| ExifRemove: 4/4 제거, 남은 것 JFIF만, 가로 2장은 픽셀 동일, 세로 2장은 다시 저장(SSIM 0.9989·0.999, +21.2%·+19.5%) 후 정상 방향. 업로드 요청 없음 (사진 크기 50% 이상 요청 0건) | `summary.json`, `results/exifremove.json` (`run_web.py`, CDP Content-Length) |
| Jimpl·Verexif·IMGonline: 4/4 제거, 저장된 픽셀 동일, 세로 2/2 옆으로 누움(회전 태그 삭제). 사진 전체 업로드(예: Jimpl `/uploads?target=exif` 830,599바이트 = 01.jpg 830,416 + 양식) | `summary.json`, `results/jimpl.json`·`verexif.json`·`imgonline.json` |
| XnConvert 1.118.0: Output 탭 Preserve Metadata 기본 체크, Preserve color profile 기본 해제. 기본값 결과에 GPS 등 모두 남음. 해제 시 모두 제거(JFIF만), 세로 2/2 정상(픽셀을 돌림), 8/8 재압축, 크기 5.9~18.9% 감소, SSIM 0.9805~0.9961 | Xvfb 캡처, `summary.json` `xnconvert_default`·`xnconvert_nometa` |
| XnConvert Input 탭 "Add files..."·"Add folder...", 결과 파일 이름 기본 `{Filename}_result`, 저장 위치 Source folder | Xvfb 캡처 |
| ExifRemove 화면: "Keep photos the right way up" 기본 체크, "Photos that need rotation are re-saved at high quality. Other photos are cleaned without re-encoding.", 버튼 REMOVE METADATA·DOWNLOAD CLEANED JPEG·DOWNLOAD ALL AS ZIP, "JPG / JPEG · Up to 25 MB each · 50 photos / 200 MB per batch" | Chromium 캡처 `exifremove-cleaned-photos.webp` |
| Jimpl 결과 화면에 위치(고도·위도·경도)·카메라·작성자 표시, "This image will be deleted in 23:59:53" | Chromium 캡처 `photo-metadata-shown-by-jimpl.webp` |

## 문서 (2026-10-22 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| iPhone 공유 시 위치 끄기: Share > Options > Location 끄기, "Location Not Included" 표시. 사진 위치 삭제: More > Adjust Info > Adjust Location > No Location. 새 사진: Settings > Privacy & Security > Location Services > Camera > Never. Mac Photos: Image > Location > Hide Location. 위치가 있는 사진을 공유하면 받는 사람이 촬영 장소를 볼 수 있음 | [Apple Personal Safety User Guide](https://support.apple.com/guide/personal-safety/manage-location-metadata-in-photos-ips0d7a5df82/web) |
| Google Photos: "If the location of a photo or video was automatically added by your camera, you can't edit or remove the location." 내려받은 사진은 기기가 저장한 원래 위치를 보여 줌 | [Google Photos Help 6153599](https://support.google.com/photos/answer/6153599?hl=en) |
| 카메라 위치 끄기: Google 기기 "Save location", Samsung "Location tags" | [Google Photos Help 9921876](https://support.google.com/photos/answer/9921876?hl=en) |
| Windows: Properties > Details > Remove Properties and Personal Information, 기본 선택은 속성을 지운 복사본 생성, "zeroes out metadata, but it does nothing with the contents of the file itself" (Windows 7 기준 보관 문서) | [Microsoft Learn (TechNet Magazine 보관)](https://learn.microsoft.com/en-us/previous-versions/technet-magazine/ee851674(v=msdn.10)). Windows 10·11 최신 공식 문서는 찾지 못함 → 글에 "archived tip written for Windows 7", 직접 확인 못 함으로 표시 |
| ExifCleaner: "free and open source software. MIT License.", macOS·Windows·Linux, 이미지·영상·PDF | [exifcleaner.com](https://exifcleaner.com/) |
| ExifRemove: 브라우저 처리·업로드 없음, JPEG만, 회전 옵션 설명, 운영자 이름 없음(© 2026 ExifRemove) | [exifremove.com](https://exifremove.com/) |
| XnConvert 1.118.0, 개인·교육용 무료(FREEWARE), 회사는 라이선스 구매, Windows·Mac·Linux | [xnview.com/en/xnconvert](https://www.xnview.com/en/xnconvert/) |
| Jimpl: "All photos are deleted after 24 hours!", "Your uploads are private.", 50 MB | [jimpl.com](https://jimpl.com/) |
| Verexif: "We don't store any copy of the image", 20MB | [verexif.com/en](https://www.verexif.com/en/) (2026-10-22 페이지 본문) |
| IMGonline: "removes from photo all embedded information without recompression and without loss in quality" | [imgonline.com.ua delete-exif](https://www.imgonline.com.ua/eng/delete-exif.php) |

## 쓰지 않은 것

- Windows 11 파일 탐색기 메뉴 이름: 컨테이너에서 실행할 수 없고 최신 공식 문서를 찾지 못해 보관 문서 기준임을 밝힘
- Android 공유 시트의 위치 제거 옵션: 1차 출처 없음
- Metadata2Go: 접속은 되지만 시간 관계상 측정 안 함 (다음 갱신 후보)
- HEIC·PNG 파일: 측정 안 함 (ExifRemove는 JPEG만 지원)
