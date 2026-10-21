# convert-webp-to-jpg-free 사실 확인표

- 주 검색어: `webp to jpg` (+ `convert webp to jpg`). Trends 미국 1개월(2026-10-21): `webp to jpg` 2.4 · `webp to png` 4.3 · `heic to jpg` 9.3 · 기준 `remove background` 40.3
- 하위 검색어 (2026-10-21 `demand_check.py suggest`): webp to jpg converter (Google·Bing·YouTube), webp to jpg free, webp to jpg bulk, webp to jpg mac, webp to jpg online free, webp to jpg cloudconvert, webp to jpg ezgif, webp to jpg ilovepdf, convert webp to png (3곳). 하위 검색어 22개 + `convert webp` 28개
- 채널: **검색형** (상시 수요, 비교·측정 + How-to). 제목 52자, 설명 155자
- 차별점: 상위 결과가 변환기 사이트 자체·단순 단계 안내인 검색어에서, 무료 도구 5개(앱 2·웹 3)의 **기본 설정 결과**를 같은 파일 10개로 측정. 사진은 모두 괜찮지만 투명 배경(흰색/검은색 채움으로 그림이 사라짐)·애니메이션(한 프레임만, 또는 잘린 조각)에서 차이가 난다는 점, JPG가 WebP보다 1.66~2.23배 커진다는 점
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 표기 `(5 Tools Tested)`(노하우 2), 이미지 5장(노하우 7: 대표 그래픽 투명 결과 비교 1200×675 `thumbnail` + 크기 그래프 + 애니메이션 결과 + XnConvert·CloudConvert 화면 캡처 2장, 모두 직접 만들거나 직접 찍음, `chart_style.py` 라이트 모드), 요약 표, 내부 링크 4개 + 역링크 2개(`convert-heic-to-jpg-free`·`compress-image-to-100kb`). 카테고리 `software`
- 측정 환경: Ubuntu 24.04 컨테이너, Intel Xeon 2.80GHz 4코어, GPU 없음. 웹은 Playwright + Chromium 141(`/opt/pw-browsers/chromium-1194`), 계정 없음. 2026-10-21 15:20~15:50 UTC (한국 10-22 00:20~00:50)

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 테스트 파일 10개: 사진 6장(PD12M CC0, `convert-heic-to-jpg-free/sources.json` 1~6번 → 1600×1067 가운데 자르기 → `cwebp -q 80`), 투명 3장(직접 그린 검은 로고·흰 SALE 스티커 무손실 WebP, 꽃 사진 원형 잘라내기 손실 WebP + 알파), 애니메이션 1개(12프레임 800×450, Pillow → libwebp 애니메이션 인코더, 9프레임은 바뀐 부분만 저장) | `build_set.py`, `webpmux -info` 결과(프레임 2~5·7~9·11~12가 부분 크기) |
| 기본 JPG 품질: XnConvert 85, GIMP 90, ezgif 90, iLoveIMG 92, CloudConvert "auto" → 92 | XnConvert Write settings 화면(`xnconvert-jpg-settings.webp`), ezgif 폼 기본값(`quality-input` 90), CloudConvert Options 화면("auto", `cloudconvert-options.webp`), 결과 파일 `identify -format %Q` |
| 사진 6장: 모든 도구가 1600×1067 유지, SSIM(디코딩한 WebP 대비) 0.9727~0.9936, 중앙값 XnConvert 0.9795·GIMP 0.9843·iLoveIMG 0.9868·CloudConvert 0.987·ezgif 0.9793 | `results/summary.json` `photo_summary`·`tools.*.photos` (`analyze.py`, scikit-image) |
| 크기 배율(JPG 합계 / WebP 합계): XnConvert 1.66(2,013.2 / 1,215.1 KB)·ezgif 1.84·GIMP 2.00·CloudConvert 2.17(5장)·iLoveIMG 2.23(2,715.1 KB) | `summary.json` `size_ratio`·`total_jpg_kb` |
| iLoveIMG와 CloudConvert의 사진 JPG 5장이 바이트 단위로 같음 | `cmp` (photo1·2·3·5·6) |
| 투명 영역: XnConvert·GIMP·CloudConvert·ezgif 흰색(255,255,255), iLoveIMG 검은색(로고·스티커 0,0,0), 잘라내기는 녹색 줄무늬(평균 99,118,30) | `summary.json` `transparent.*.bg_rgb` |
| 흰 스티커는 흰색 채움 4개 도구에서 사라짐(불투명·배경 밝기 차 0.0), 검은 로고는 iLoveIMG에서 거의 사라짐(밝기 차 21.4, 다른 도구 233.5) | `summary.json` `fg_bg_luma_diff` |
| 배경색 선택: ezgif만 있음(`background-color` 기본 #ffffff). CloudConvert Options는 Resolution·Strip·Quality만, iLoveIMG는 "All images will be converted to JPG."만 표시 | ezgif 페이지 HTML(`<input name="background-color" value="#ffffff">`), `cloudconvert-options.webp`, iLoveIMG 업로드 화면 캡처 |
| XnConvert Output 탭·JPG 설정에 배경색 항목 없음 | XnConvert Output 탭·Write settings 캡처 (Actions 탭은 열어 보지 않음 → "Output 탭과 JPG 설정에서 찾지 못함"으로만 씀) |
| GIMP PNG 내보내기: 투명 3장 모두 알파 동일, 보이는 픽셀 최대 차 0 | `gimp_png.py` + 비교 (2026-10-21) |
| 애니메이션: XnConvert 1장 = 1프레임, GIMP 1장 = 12프레임(마지막), iLoveIMG ZIP 11장(전체 크기 3·부분 8), CloudConvert ZIP 12장(전체 3·부분 9, 3번 프레임 207×273), ezgif 서버 변환 "Argh! It failed..." 3회 | `summary.json` `animated`, `identify` 크기, `analyze.py` 프레임 대조(평균 오차 1.17·1.14) |
| CloudConvert: 실행 중 photo4에서 "Your daily limit of 10 conversion credits exceeded." (그 뒤 파일 3개는 변환됨) | `ccfail_photo4.png` 캡처 |
| ezgif: 일부 업로드·변환 클릭이 30초 시간 초과 → 다시 시도하면 성공 | 실행 로그 (logo·photo6·sticker 2~3회째 성공) |
| XnConvert Input 탭 버튼 "Add files..."·"Add folder...", Output 탭 Format "Same as original" → "JPG - JPEG / JFIF", 파일 이름 기본 `{Filename}_result`, Source folder 기본 | Xvfb 캡처 |
| GIMP 3.2.6: WebP 로드 시 애니메이션은 레이어 12개, JPEG 기본 내보내기(배치 `Gimp.file_save`) | `gimp_batch.py` 출력 |

## 문서 (2026-10-21 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| XnConvert 1.118.0, WebP 지원, 개인·교육용 프리웨어, 회사 라이선스 1개 15.00 € | https://www.xnview.com/en/xnconvert/ |
| GIMP 현재 안정판 3.2.6 (2026-09-10) | https://www.gimp.org/downloads/ |
| CloudConvert 무료: 10 conversion credits / day, 매일 초기화, 최대 1GB | https://cloudconvert.com/pricing |
| iLoveIMG Basic 무료 "Limited document processing", Premium 연 $60(월 $5)·월 결제 $9 | https://www.iloveimg.com/pricing |
| ezgif: 업로드 파일 1시간 후 자동 삭제, 애니메이션 WebP는 프레임별 JPG로 변환한다고 안내, WebP to GIF·WebP to MP4 도구 | https://ezgif.com/webp-to-jpg (페이지 본문) |
| Mac Preview: File > Export → Format에서 HEIC·JPEG·JPEG-2000·OpenEXR·PDF·PNG·TIFF, JPEG 품질 조절, 여러 파일은 사이드바에서 선택 | https://support.apple.com/guide/preview/prvw1012/mac |
| WebP Image Extension: 무료(`price: 0`), File Explorer·Photos 등 Windows 앱에서 WebP 보기 | https://apps.microsoft.com/detail/9pg2dk419drg (JSON-LD) |

## 쓰지 않은 것

- Windows Paint·Photos로 WebP → JPG 저장: Microsoft 공식 문서를 찾지 못하고 실행도 못 함 → 글에 단계로 쓰지 않음
- Mac Preview가 WebP를 여는지: Apple 문서에 입력 형식 목록 없음 → "export 목록이지 열 수 있는 형식 목록이 아님"으로만 씀
- Adobe Express(403), Canva(이전 세션 403), Convertio·FreeConvert(접속은 되지만 시간 관계로 미측정)
- ezgif WebP to GIF·MP4: 페이지에 도구가 있다는 것만 쓰고 결과는 측정하지 않음
- CloudConvert 애니메이션이 크레딧 몇 개를 썼는지: 확인 못 함 → 쓰지 않음
- iLoveIMG·CloudConvert 결과가 같은 이유(같은 변환 엔진 추정): 근거 없음 → 결과가 같았다는 사실만 씀
