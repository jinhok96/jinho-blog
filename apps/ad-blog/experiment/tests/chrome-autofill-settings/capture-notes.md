# Chrome 156 자동 완성 실험 기록 (2026-10-29 15:53~16:45 UTC)

- Chrome: `Google Chrome 156.0.8078.73` (dl.google.com 안정판 deb를 `dpkg-deb -x`로 `/tmp/cr/chrome`에 풂, 설치 없음)
- 실행: `run.py {프로필} {시나리오}` — Xvfb `:99` 1280×900, `--no-first-run --no-sandbox --test-type --lang=en-US`, CDP 9333에 Playwright 연결. 브라우저 말풍선·자동 완성 목록은 페이지 밖이라 xdotool로 클릭(apt `xdotool`). 캡처는 ImageMagick `import`
- 시험 페이지: `test-site/form.html`(배송 양식, `autocomplete` 속성 name·email·tel·address-line1·address-level2·address-level1·postal-code + 속성 없는 Delivery note), `checkout.html`(카드 양식), `thanks.html`. `python3 -m http.server 8765 --bind 127.0.0.1`로 열고 `http://localhost:8765`로 접속
- 컨테이너 정책 파일(`/etc/opt/chrome/policies/managed`: 인증서·ECH)을 Chrome이 읽어 설정 위에 "Your browser is managed by your organization"이 뜸. 자동 완성 정책은 없음(회색 스위치 시험 때만 `zz-toolproof-autofill-test.json`을 넣었다가 지움). 글 이미지는 그 줄이 안 보이게 자름

## 진행 순서와 결과

| 순서 | 시나리오 | 결과 | 캡처 |
| --- | --- | --- | --- |
| 1 | `s_survey.py`·`s_survey2.py`·`s_dump.py` (프로필 p1) | 설정 묶음·문구·스위치 상태 기록 → `source-chrome-156-settings-text.txt` | `01`~`06` |
| 2 | `s_addr1.py` (p2) | 새 프로필에서 이름 칸 클릭 → 제안 없음. 8칸 입력 후 제출 → **Save address?** (United States 추가, 전화 +15550100199) | `10` |
| 3 | `s_addr2.py` (p3) | Save 클릭 → **Address saved to this device**(로그인하면 Google 계정에 저장된다는 안내). 이름 칸 → 저장 주소 제안. (방향키+Enter는 말풍선이 열린 채라 양식이 제출됨 → 이후 xdotool 클릭으로) | `11`·`12` |
| 4 | `s_addr3.py` (p3) | 배송 메모 칸 → "Leave at the side door" 제안, 도시 칸 → Springfield 제안, Contact info에 주소 1개. **Save and fill addresses 끔** → 이름·메모 칸 제안 없음, 새 주소(Sam Tester) 제출해도 저장 제안 없음, 주소는 목록에 남고 Add 회색. 다시 켬 → 메모 제안 돌아옴(끈 동안 입력한 "Ring the bell"은 없음) | `13`·`14`·`20`~`24` |
| 5 | `s_addr4.py` (p3) | 제안 위에 마우스 → 미리 보기, 클릭 → 7칸 채움(메모 칸 제외). 메모 제안을 고른 채 **Shift+Delete** → 그 항목 사라짐, 다시 열어도 없음 | `15`·`16`·`30`~`32` |
| 6 | `s_card1.py`·`s_card2.py` | 카드 칸 클릭 → "Automatic payment methods filling is disabled because this form does not use a secure connection." 카드 입력 후 제출 → **Save card?** "save your card and encrypted security code to your device", Save → Payments에 "Visa ••1111 · 12/30 CVC saved" + "Delete saved security codes" 링크 | `40`~`42` |
| 7 | `s_clear.py`·`s_clear2.py` | Delete browsing data: 기본 Last hour, Show more 아래 Autofill form data(기본 해제) "1 payment method, 1 address, 8 others". 지운 뒤 주소·카드 목록 비어 있음 (이 실행은 체크 위치가 밀려 방문 기록·쿠키·사이트 설정 등도 함께 지움 → 7-1에서 Autofill form data만 다시 시험) | `50` |
| 7-1 | `s_clean.py`·`s_clean2.py` | 주소·카드를 다시 저장 → 대화상자에서 **Autofill form data만** 체크(기간 Last 4 weeks, "1 payment method, 1 address, 9 others") → 지움 → Credit & debit cards (1)→(0), Addresses (1)→(0), 이름·메모 칸 제안 없음 | `51`~`53` |
| 8 | `s_policy.py` | 정책 `{"AutofillAddressEnabled": false, "AutofillCreditCardEnabled": false}` → Save and fill addresses 꺼짐·회색·건물 아이콘, 문구 "This setting is managed by your administrator."; Save and fill payment methods·Save security codes·Card benefits 회색, Allow sites to check…는 그대로 | `60`·`61` |

## 실행 중 문제와 해석

- `s_addr2.py`가 오류(`input_value` 시간 초과)로 멈추면서 `run.py`가 Chrome을 닫지 못해, 그 뒤 실행(p3·p4·p5 지정)은 모두 **9333 포트를 잡고 있던 p3 브라우저 하나**에 붙었음 (새로 띄운 Chrome은 포트를 못 열거나 같은 프로필이라 기존 창으로 넘김). 탭 수가 늘어나는 것과 `Web Data` DB(p4 복사본: 주소 1·입력 기록 7, p3·p5: 0)로 확인. 따라서 4~8번은 같은 로그아웃 프로필에서 순서대로 진행된 것이고, 결과 해석은 그대로 유효. `run.py`는 이후 `try/finally`로 항상 Chrome을 닫게 고침
- 7-1 대화상자의 기간 칩은 앞선 실행에서 고른 값(All time)을 기억해, 좌표 클릭이 "Last 4 weeks"를 고름. 데이터는 몇 분 전에 저장한 것이라 결과는 같음. 글 그래픽에 기간을 밝힘
