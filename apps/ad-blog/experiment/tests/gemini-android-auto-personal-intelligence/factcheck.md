# gemini-android-auto-personal-intelligence 사실 확인표

- 확인일: 2026-10-21 (세션 32, 화제 뉴스 세션 06:15 KST)
- 주 검색어: `gemini android auto`
- 하위 검색어: `android auto gemini update`, `gemini android auto settings`, `gemini personal intelligence privacy`, `gemini personal intelligence settings`, `enable gemini in android auto`, `gemini android auto rollout`
- 채널: 피드형 (뉴스 칼럼)
- 뉴스 유형: **화제** (Google 공식 발표 2026-10-20 20:00 UTC, 세션 시점 약 13시간 전)
- 독창 요소: 차 안 답변의 데이터 흐름도(연결 앱 6종 → Gemini → 음성 답변·활동 기록 저장, 대표 이미지), 설정별 효과 표(앱 연결 해제·채팅 삭제·Keep Activity 끄기·둘 다: "앞으로 사용 중지" vs "이미 가진 정보 삭제"), 사용자 유형별 영향 표, Google 문서끼리 연결한 분석(설정은 계정 전체로 차에 따라옴 + 차 안 모든 사람이 Gemini 사용 가능 → 동승자 위험, 차 전용 끄기 스위치 없음)
- 이미지: 2장 (직접 만든 그래픽 1200×675, `chart_style.py` 라이트 모드, `charts.py`): 데이터 흐름도(`thumbnail`), 설정별 효과 표
- 직접 실행: 없음 (Android Auto·Gemini 앱은 컨테이너에서 실행 불가, 단계적 배포). 설정 경로는 도움말 기반이라고 본문에 밝힘

## 화제성 신호 (선정 때 확인)

- Google News RSS 48시간: `Gemini Android Auto` 47건 (9to5Google·TechCrunch·Engadget·How-To Geek·ZDNET·Android Central), `"Personal Intelligence"` 18건
- 자동완성: `gemini android auto` 22개 (Google·Bing·YouTube: update·rollout·settings·not working·enable), `gemini personal intelligence` 19개 (privacy·settings·not working·reddit)
- Trends 미국 7일: `gemini android auto` 0.1(최고 3) · `gemini personal intelligence` 0.0(최고 3) · `spotify family` 10.8 · 기준 `remove background` 68.1 → 검색량은 작음(발표 직후). 피드형으로 판단
- Trends 급상승 RSS(10-21 06시): IT 항목은 `xbox game pass`(200+)·`cisa`(500+)뿐

## 후보 비교 (제외·보류)

- Xbox Game Pass: 48시간 기사 100건이지만 신규 게임 추가 소식 + "개편" 보도는 루머(Kotaku·Insider Gaming 소식통) → 제외
- CISA: 선거 장비 관련 정치 보도 → 제외 (정치)
- iOS 27.2 RC: 정식 배포 전 → 제외
- Walmart+·Sam's Club 번들: 분야 밖
- Google 금융 사기 광고 인증 확대(blog 10-20): 광고주 대상, 독자 행동 없음 → 제외
- Google 광고에 Gmail·Photos 정보 사용(세션 28부터 보류): 이번 세션에서도 공식 발표 미확인 → 보류 유지

## 주장 → 출처 → 확인 방법

| 주장 | 출처 | 확인 |
| --- | --- | --- |
| 2026-10-20 발표, Gemini가 Android Auto·Google built-in 차에서 전 세계 제공, Personal Intelligence는 Android Auto에 오늘부터·Google built-in은 수개월 내 | blog.google/.../android-auto-cars-with-google-built-in-gemini-personal-intelligence/ (`datePublished` 2026-10-20T20:00:00Z) | curl 정적 HTML (`source-google-blog-2026-10-20.txt`) |
| 예시 질문 3개(비행기 게이트, 병원 예약, 세차장 사진), 앱은 직접 켜기 전 연결 안 됨, built-in 차는 휴대폰 연결 시만 개인 답변, 앱에서 이미 켰으면 차로 따라옴, 안 써도 기능은 그대로 | 같은 글 | 같음 |
| 개인 계정·18세 이상, Workspace 업무·교육 계정 제외, EEA·스위스·영국·나이지리아 제외 | 같은 글 각주, gemini.google/overview/personal-intelligence FAQ | 같음 + curl |
| 연결 가능 앱 6종(Contacts·Photos·Wallet(US)·Workspace·Search services·YouTube), 설정 경로(앱: Menu > 프로필 > Personal Intelligence > Connected Apps / 웹: Menu > Settings & help > ...), Get started·Connect all·Choose apps, Keep Activity 필수, 삭제는 연결 해제 + 채팅 삭제 둘 다 필요, 기존 Workspace·Photos 연결 초기화, Gems 등 일부 기능 미지원 | support.google.com/gemini/answer/16598406 | curl (`source-help-16598406-connect-manage.txt`) |
| Contacts는 US·영어·AI Ultra 필요, 학습: 원본 직접 학습 안 함 + 요약·발췌·추론으로 학습("the summary may just be the email"), 사람 검토 일부·계정 분리, 기밀 정보 앱은 연결하지 말라 | support.google.com/gemini/answer/16836988 | curl (`source-help-16836988-connected-apps-data.txt`) |
| Android Auto 요구 사항(Android 11+, RAM 2GB, Gemini 기본 어시스턴트), 차 안 누구나(어린이 포함) 사용 가능, 환각·안전 관련 의존 금지 | support.google.com/gemini/answer/16735982 | curl (`source-help-16735982-gemini-in-car.txt`) |
| Gemini가 2026년 대부분 휴대폰에서 Assistant 대체 | support.google.com/androidauto/answer/6348083 | curl (`source-help-androidauto-6348083.txt`) |
| Keep Activity 18세 이상 기본 켜짐, 자동 삭제 기본 18개월(3·18·36개월·끄기), 활동 경로 gemini.google.com > Settings & help > Activity, Turn off / Turn off and delete activity, 꺼도 72시간 보관 | support.google.com/gemini/answer/13278892 | curl (`source-help-13278892-activity.txt`) |
| 앞으로 더 많은 Google 앱 연결 예정 ("even more of your Google apps and services") | gemini.google/overview/personal-intelligence | curl |

## 노하우 적용

- traffic-playbook 1번 피드형 제목 74자(주 검색어 `Android Auto`·`Gemini`는 앞 21자), 5번 "그래서 내가 할 일"(What to do now 6단계), 7번 뉴스 이미지 2장
- 내부 링크: `gemini-gems-to-skills`·`turn-off-ai-in-chrome` (2개). 역링크: `gemini-gems-to-skills` 마지막 섹션 1문장
