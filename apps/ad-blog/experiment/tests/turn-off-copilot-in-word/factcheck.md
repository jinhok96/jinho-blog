# turn-off-copilot-in-word · 브리프와 사실 확인표

세션 41 (2026-10-23 12:16 KST, 일반 세션). 모든 출처는 이 세션에서 직접 열어 확인 (원문 발췌는 같은 폴더 `source-*.txt`, 2026-10-23 curl).

## 작성 전 브리프

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` · 상시 글 (backlog 클러스터 공백 후보 2번, `ai-settings` 상시 글 5편째) |
| 주 검색어 | `turn off copilot in word` — `demand_check.py suggest` 2026-10-23: Google·Bing·YouTube 3곳. 더 구체적인 3곳 변형은 `turn off copilot in word on mac` 하나뿐이라 Mac은 소제목으로 다룸 (Windows·Mac·웹·모바일을 한 글로 묶어야 Mac 독자도 "Mac에서는 되고 iPad에서는 안 된다"를 한 번에 확인). Trends 미국 3개월: `turn off copilot in word`·`in outlook`·`in excel` 모두 0.0, `turn off copilot` 0.5, 기준 `remove background` 35.8 → 상대량은 작지만 같은 클러스터 롱테일 |
| 하위 검색어 | `turn off copilot in word on mac` (3곳), `turn off copilot in word online` / `desktop` / `365` / `2026` (Google·Bing), `turn off copilot in word permanently`·`on ipad`·`app` (Google), `turn off copilot in word and excel`·`windows 11` (Bing), `how do i turn off copilot in word documents` (YouTube) |
| 검색 의도 | 정보형 How-to (끄는 방법 + 안 되는 곳 + 같이 꺼지는 것) |
| 채널 | 검색형 |
| 상위 결과 (WebSearch 2026-10-23) | SlashGear(대형 매체), TidBITS 포럼, Microsoft Q&A 답변 2건, Microsoft Tech Community 토론, lazyadmin.nl(작은 블로그). 공통: File > Options > Copilot > Enable Copilot, 없으면 개인정보 설정. 빠진 것: 체크박스가 앱별·기기별이라 Word만 끄면 Excel·다른 PC는 그대로라는 점, 개인정보 경로는 계정 전체로 다른 기기에 따라간다는 점(동기화), 웹·iPhone·iPad·Android에서는 체크박스가 없어 개인정보 설정만 가능하고 그 경로, 개인정보 경로로 같이 꺼지는 Word 기능 목록(받아쓰기·번역·텍스트 예측 등), 업무·학교 계정에서는 설정이 없음, 가족 구성원·나이 제한, 이미 저장된 Copilot 활동 기록 삭제 |
| 차별점 | Microsoft 문서 9개를 맞대어 만든 기기·계정별 "어떤 방법이 되는지" 표, 체크박스 vs 개인정보 설정 비교(범위·동기화·같이 꺼지는 기능), Learn의 connected experiences 표에서 Word에 해당하는 기능만 추린 목록, 현재 버전(Windows 2610·Mac 16.114.1)이 체크박스 최소 버전(2412·16.93)보다 한참 뒤라 업데이트된 Word에는 모두 있음 확인. 직접 실행은 없음(Microsoft 365 계정·Windows·Mac 없음) → 본문에 문서 기반임을 밝힘 |
| 내부 링크 계획 | 나감: `turn-off-gemini-in-gmail`(Docs·Gmail의 Gemini 끄기), `turn-off-ai-in-chrome`(브라우저 AI), `microsoft-365-family-storage-2tb`(구독 변경), `office-2021-end-of-support`(Office 2021 사용자). 받음: `microsoft-365-family-storage-2tb`(색인됨) 마지막 관련 글 문단에 1문장, `turn-off-gemini-in-gmail` Google Docs 소제목에 1문장. `turn-off-ai-in-chrome`은 V3 판단 기간(11-18)이라 고치지 않음 |
| 개요 | 도입(답) → 요약 표(기기별 방법) → How to turn off Copilot in Word on Windows → On a Mac → Why Copilot is still on in Excel or on your other PC → Word for the web, iPhone, iPad and Android → What else turns off with the privacy setting → Work or school accounts → Delete what Copilot already saved → Just hide the Copilot button → How we checked → FAQ |
| 이미지 | 대표: 이젤 위 빈 문서와 연필, 문서에서 반짝이 별들이 뚜껑 닫히는 상자로 들어가는 장면, 버터 옐로 배경 + 청록·코랄, 아이소메트릭 (최근 3장: 세이지·측면 / 연분홍·3/4 / 연보라·정면과 겹치지 않음). 본문: ① 기기·계정별 방법 표 ② 체크박스 vs 개인정보 설정 비교 ③ Windows·Mac·웹·iPhone·Android 메뉴 경로 ④ 개인정보 설정으로 같이 꺼지는 Word 기능 |

## 사실 확인표

| 주장 | 출처 | 확인 방법 |
| --- | --- | --- |
| 이 문서의 설정은 Microsoft 계정(개인 이메일)으로 로그인했을 때만, 업무·학교 계정에서는 없음 | support.microsoft.com/en-us/privacy/turn-off-copilot-in-microsoft-365-apps (`source-ms-turn-off-copilot-in-microsoft-365-apps.txt`) | 2026-10-23 curl |
| Enable Copilot 체크박스를 지우면 리본의 Copilot 아이콘이 비활성화되고 그 앱에서 Copilot 기능을 쓸 수 없음 | 같음 | 같음 |
| 리본에서 아이콘만 빼는 것은 Copilot을 끄지 않음 (바로 가기 메뉴 등으로 여전히 접근) | 같음 | 같음 |
| 체크박스는 앱마다·기기마다 따로, 기기에서 끄면 그 기기를 쓰는 모든 사람에게 꺼짐 | 같음 | 같음 |
| 체크박스 최소 버전 (2025-03-13 기준): Windows Word 2412·Excel 2501·PowerPoint 2501·OneNote 2502, Mac Word 16.93·Excel 16.93.2·PowerPoint 16.93.2 | 같음 | 같음 |
| iOS·Android·웹 버전 Word·Excel·PowerPoint에서는 Copilot을 끌 수 없음, 대신 개인정보 설정으로 끌 수 있음 | 같음 | 같음 |
| Windows: File > Options > Copilot > Enable Copilot 해제 > OK > 앱 재시작 | 같음 | 같음 |
| Mac: 앱 메뉴 > Preferences > Authoring and Proofing Tools > Copilot > Enable Copilot 해제 > 재시작 | 같음 | 같음 |
| Outlook은 Turn on Copilot 토글(웹·새 Outlook: Settings > Copilot, Mac·iOS·Android: Quick Settings > Copilot), 계정 전체 적용, classic Outlook은 예정일 없음 | 같음 | 같음 |
| 개인정보 경로로 끄면 Outlook 제안 답장, Word 텍스트 예측, PowerPoint Designer, 자동 대체 텍스트 등도 꺼짐 | 같음 | 같음 |
| Windows 개인정보 경로: File > Account > Account Privacy > Manage Settings > Connected experiences > "Turn on experiences that analyze your content" 해제 > OK > 재시작. 한 앱에서만 바꾸면 다른 앱에도 적용 | 같음 | 같음 |
| Mac 개인정보 경로: 앱 메뉴 > Preferences > Personal Settings > Privacy > Connected Experiences > Manage Connected Experiences > 체크 해제 | 같음 | 같음 (계정 개인정보 문서는 Preferences > Privacy로 적음 → 본문은 끄는 문서 경로를 씀) |
| 웹: 편집 모드 File > About > Privacy Settings, 보기 모드는 페이지 위 메뉴 > Privacy Settings | support.microsoft.com/en-us/privacy/access-your-account-privacy-settings (`source-ms-access-account-privacy-settings.txt`) | 2026-10-23 curl |
| iOS: 아무 Office 앱 > Settings > Privacy Settings. Android: 왼쪽 위 계정 사진 > Privacy Settings | 같음 | 같음 |
| 개인정보 대시보드: account.microsoft.com/privacy > Privacy > Find privacy settings in Microsoft products > Microsoft 365 | 같음 | 같음 |
| 개인정보 설정은 같은 계정으로 로그인한 Windows·Mac·Android·iOS에 따라감(로밍). 모든 선택적 연결 경험을 끄는 스위치를 끄면 그 기기는 로밍 안 됨 | 같음 | 같음 |
| 두 설정(Experiences that analyze content, All connected experiences) 중 하나라도 끄면 Word·Excel·PowerPoint·Outlook·OneNote에서 Copilot 기능을 못 씀 (Windows·Mac·iOS·Android 최신 버전) | support.microsoft.com/en-us/privacy/copilot-in-microsoft-365-apps-for-home-your-data-and-privacy (`source-ms-copilot-home-data-privacy.txt`) | 같음 |
| Copilot 프롬프트·응답·파일 내용은 기반 모델 학습에 쓰지 않음, 작업 중인 파일이나 요청한 파일만 사용 | 같음 | 같음 |
| Copilot 활동 기록: 개인정보 대시보드 > Privacy > Empower your productivity > Copilot > Your Copilot app activity history > Copilot in Microsoft 365 apps > Export / Delete all activity history | support.microsoft.com/en-us/privacy/manage-your-copilot-activity-history-in-the-privacy-dashboard (`source-ms-copilot-activity-history.txt`) | 같음 |
| Family·Premium의 Word·Excel·PowerPoint·Outlook·Designer AI 기능은 구독 소유자만 (공유 안 됨) | support.microsoft.com/en-us/Microsoft-365-Copilot/frequently-asked-questions-about-copilot-in-microsoft-365-subscriptions (`source-ms-copilot-subscriptions-faq.txt`) | 같음 |
| 나이 제한: 기준 나이 미만 사용자는 Word 등 AI 기능이 꺼짐 | 같음 | 같음 |
| Designer·Notepad·Paint의 Copilot 기능은 끌 수 없음 | 같음 | 같음 |
| "Experiences that analyze your content" 목록 중 Word 관련: Dictation, Editor(기본 맞춤법·문법은 남음), Read Aloud(오프라인이면 기기 음성), Translator, Text predictions(Mac Word는 기본 기능 남음), Automatic alt text, Similarity checker, Smart Lookup, Research, Learning Tools, Transcribe | learn.microsoft.com/en-us/microsoft-365-apps/privacy/connected-experiences (`source-learn-connected-experiences-analyze-content.txt`) | 2026-10-23 curl. 표의 앱 구분이 없어 Word에서 쓰는 기능만 골라 링크 대상 문서 이름으로 판단 (Similarity checker·Smart Lookup·Research는 업무·학교 계정에서 선택적 경험) |
| 연결 경험 전체 끄기 설정은 공동 작성·온라인 파일 저장 등도 끔 | support.microsoft.com/en-us/privacy/connected-experiences-in-microsoft-365 (`source-ms-connected-experiences.txt`) | 같음 |
| 리본 사용자 지정은 지금 쓰는 앱에만 적용, 리본 빈 곳 오른쪽 클릭 > Customize the Ribbon | support.microsoft.com Customize the ribbon in Office (`source-ms-customize-ribbon.txt`) | 같음 |
| Word 버전 확인: Windows File > Account > Product Information (About Word), Mac Word 메뉴 > About Word | support.microsoft.com What version of Office am I using (`source-ms-what-version.txt`) | 같음 |
| 현재 Current Channel 2610(2026-10-21), Mac 16.114.1(2026-10-22) | learn.microsoft.com/en-us/officeupdates/update-history-microsoft365-apps-by-date, …/update-history-office-for-mac | 2026-10-23 curl |
| 문서 요약 자동 표시는 Microsoft 365 Copilot(업무) 라이선스 + OneDrive·SharePoint 저장 문서에서만 | support.microsoft.com/en-us/word/copilot/create-a-summary-of-your-document-with-copilot-in-word | 2026-10-23 curl (본문 FAQ 근거) |

## 직접 확인하지 못한 것

- Word 화면(Microsoft 365 계정·Windows·Mac 없음, Word for the web은 로그인 필요) → 메뉴 이름은 모두 Microsoft 지원 문서 기준으로 쓰고 본문에 밝힘
- 업무·학교 계정에서 관리자가 Copilot을 끄는 방법 → 독자(비개발자)가 할 수 없으므로 "IT 관리자에게 문의"까지만 씀
- 상위 결과의 "떠 있는 Copilot 아이콘은 업데이트로 해결" 주장(WebSearch 요약) → 공식 문서에서 찾지 못해 쓰지 않음
- Microsoft 365 Classic 요금제(Copilot 없는 이전 가격) → 구독 전환 문서가 일반 전환 페이지로 바뀌어 현재 제공 여부를 확인 못 함, 쓰지 않음
