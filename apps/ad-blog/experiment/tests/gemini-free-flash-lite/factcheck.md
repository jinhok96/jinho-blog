# gemini-free-flash-lite 사실 확인표

- 확인일: 2026-10-21 (세션 34, 영향 뉴스 세션 18:15 KST)
- 주 검색어: `gemini free`
- 하위 검색어: `gemini free tier`, `gemini free tier limits`, `gemini free vs pro`, `gemini free vs paid`, `gemini flash lite`, `gemini flash lite vs flash vs pro`, `gemini flash lite context window`, `gemini free for students`
- 채널: 피드형 (뉴스 칼럼)
- 뉴스 유형: **영향** (무료 계정 2026-10-09 시행, AI Plus는 계정별 이메일 날짜로 진행 중, 학생 무료 AI Pro 신청 마감 2026-12-31)
- 독창 요소: 요금제별 모델·사용 한도·컨텍스트 창 매트릭스(대표 이미지, 공식 문서 4곳을 한 표로), 컨텍스트 창을 Google 자체 환산(1M ≈ 1,500쪽)으로 쪽수 비교(무료 약 48쪽·Plus 약 192쪽, 우리 추정임을 본문·그래픽에 표시), 공식 문서 간 충돌(About Gemini models는 AI Plus에 Pro 표시, 변경 공지·요금 페이지는 미포함) 지적, 무료 사용자가 Flash·Pro에 닿는 유일한 경로(Auto) 설정 위치·응답 모델 확인 방법
- 이미지: 2장 (직접 만든 그래픽 1200×675, `chart_style.py` 라이트 모드): 요금제 매트릭스(`thumbnail`), 컨텍스트 창 쪽수 비교. 생성 [charts.py](charts.py)
- Gemini 앱은 컨테이너에서 로그인할 수 없어 직접 실행하지 않음 → 문서 기반 (본문에 "We read…"로 밝힘, "we tested" 표현 없음)

## 화제성 신호 (선정 때 확인)

- Google News RSS 30일 `Gemini free Flash-Lite` 51건 (The Verge·TechRepublic·Android Police·Engadget·9to5Google·Thurrott 등, 10-03~10-13)
- 자동완성: `gemini free` 하위 검색어 약 45개(Google·Bing·YouTube: free tier·free tier limits·free vs pro·free vs paid·for students), `gemini flash lite` 17개(vs flash vs pro·context window·free)
- Trends 미국 1개월: `gemini free` 14.5(최고 18) · `gemini ai plus` 0.6 · `gemini flash lite` 0.2 · 기준 `remove background` 40.0

## 후보 비교 (제외·보류)

- Samsung Messages 종료("this month", Kurt the CyberGuy 10-19): Samsung 공식 공지를 이번 세션에서 확인하지 못함 → 다음 세션 후보
- WhatsApp 구형 Android 지원 종료: 보도만(공식 FAQ 날짜 미확인), 미국 영향 작음 → 보류
- Marvel Unlimited 종료·Discovery+ 가격 인상: 분야 밖
- Mac Developer ID 인증서(2027-02-01): 개발자 대상 → 제외
- Windows 11 23H2 Enterprise/Education 종료(11-10): 기업·학교 대상 → 제외

## 주장 → 출처 → 확인 방법

| 주장 | 출처 | 확인 |
| --- | --- | --- |
| 개인 계정 모델 제공 변경이 2026-10월 시작, 무료 사용자 10-09부터, AI Plus는 이메일로 시행일 안내 | support.google.com/gemini/answer/17004136 "Changes to Gemini model access and limits" | curl 정적 HTML + Playwright 렌더링 (`source-changes-help.txt`) |
| 변경 후 표: 무료 Auto / Plus Flash-Lite·Flash(Pro 없음) / Pro·Ultra 셋 다 | 같은 문서 표 | Playwright로 표 셀 아이콘 확인 (Checkmark vs 빈 아이콘) |
| Auto 기본, 대부분 Flash-Lite, 깊은 추론은 Flash·Pro 가능, 끄면 전부 Flash-Lite | 같은 문서, answer/18648722 | 같음 (`source-gemini-models-help.txt`) |
| effort(thinking) level Low·Medium·High, 높을수록 한도 더 사용 | 17004136, 18648722 (무료도 Low/Medium/High) | 같음 |
| 2026-05-17 compute 기반 한도, 5시간마다 갱신·주간 한도 | 17004136 Previous changes | 같음 |
| 한도: 무료 standard, Plus 2x, Pro 4x, Ultra Pro 대비 5x/20x | answer/16275805 | Playwright 표 추출 (`source-gemini-limits-help.txt`) |
| 컨텍스트 창: 무료 32k, Plus 128k, Pro·Ultra 1M. 1M ≈ 1,500쪽 | 16275805 | 같음. 48쪽·192쪽은 같은 비율 환산(우리 추정) |
| 무료 가능 기능(Canvas·Skills·Deep Research·Connected apps·Audio overviews·Nano Banana 2·Music 등)과 유료 전용(Daily brief·Tasks·Nano Banana Pro redo·Video·Scheduled actions) | 16275805 Feature availability 표 | Playwright로 셀 아이콘 확인 (Checkmark alt vs alt 없음 아이콘) |
| 무료 사용자는 수요가 많을 때 Deep Research 등 일부 기능 제한 가능, "Limits may change without notice" | 16275805 | 같음 |
| 대화 주제가 바뀌면 새 채팅 → 사용량 절약 | 16275805 Tip | 같음 |
| Auto 설정 위치 Settings > Usage limits, 응답 모델 확인 More > Show thinking steps | 18648722 | 같음 |
| About Gemini models 페이지는 AI Plus에 Pro 포함 표시 (변경 공지와 충돌) | 18648722 Model availability 표 | 같음 (2026-10-21) |
| 미국 가격: 무료 $0(Flash-Lite, 15GB), Plus $4.99(Flash, 2x, 400GB), Pro $19.99(Argon·Pro·Flash, 4x, 5TB), Ultra $99.99·$199.99 | gemini.google/subscriptions | Playwright 렌더링 (`source-gemini-subscriptions.txt`), curl 교차 확인 |
| Gemini 4 Argon 2026-10-13 AI Pro·Ultra 대상 출시 | gemini.google/release-notes (2026.10.13) | curl |
| 요금제 변경 Google One > Manage membership > Change membership plan | answer/14517446 | curl |
| 학생: 미국 18세 이상 대학생 AI Pro 1년 무료, 2026-12-31까지 신청, 결제 수단 필요, 이후 $19.99/월 자동 청구 | gemini.google/students | curl (`source-students.txt`) |
| 업무·학교 계정은 Workspace 라이선스에 따름 | 18648722 | curl |

- 보도로만 확인(본문 미사용): AI Pro에 Deep Think 추가, AI Plus가 잃는 모델명 "Gemini 3.1 Pro"(Engadget 10-06). Engadget이 출처로 든 17004136을 직접 열어 날짜 확인
- 접근 불가: web.archive.org(연결 리셋) → 변경 전 페이지 비교 못 함. one.google.com 요금 페이지는 렌더링해도 가격이 나오지 않음
