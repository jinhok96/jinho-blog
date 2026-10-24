# turn-off-ai-in-windows-11 사실 확인표

## 작성 전 브리프 (2026-10-24 세션 44)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `ai-settings` 상시 글 (허브 `turn-off-ai-features`의 Windows 11 절을 상시 글로 확장). Windows 기능이라 `windows-microsoft` 글과도 이어짐 |
| 주 검색어 | `turn off ai in windows 11` — `demand_check.py suggest` 2026-10-24: 본 검색어 Google·Bing·YouTube 3곳, 하위 14개 (`turn off ai features windows 11` Google·Bing, `turn off all ai windows 11` Google·Bing, `can you turn off ai in windows 11`, `turn off ai components windows 11`, `turn off ai search windows 11`). Trends 미국 3개월 0.0 (`turn off copilot` 0.5, 기준 `remove background` 35.6) → 롱테일 |
| 하위 검색어 | can you turn off ai in windows 11 / turn off ai components windows 11 / turn off all ai windows 11 / turn off copilot windows 11 / turn off recall / turn off ai in notepad·paint |
| 검색 의도 | 정보형 How-to (기능별 끄는 법 + 끌 수 없는 것) |
| 채널 | 검색형 |
| 상위 결과 (WebSearch `turn off ai in windows 11`, 2026-10-24) | webnots·Popular Science·pureinfotech(Edge)·Substack·Windows Latest(2026-02)·PCWorld·Guiding Tech. 공통: Recall·Click to Do·Copilot·AI actions 경로 나열, 그룹 정책·레지스트리·서드파티 디블로트 스크립트(Win11Debloat 등) 권장. 빠진 것: 기능별로 "내 PC에 있나(Copilot+ PC 전용 vs 모든 PC)" 구분, Microsoft 문서끼리 충돌(메모장 AI는 끌 수 있다 vs M365 FAQ "Notepad·Paint는 끌 수 없음", Copilot 키 경로 두 가지), AI 모델(수 GB) 삭제 위치 Settings > System > AI Components, 2026-10 문서 기준(26H2) |
| 차별점 | Microsoft 지원·Learn 문서 20여 개를 이번 세션에 직접 열어 기능별 "어느 PC에 있나 / 어디서 끄나 / 완전히 꺼지나" 표, 문서 충돌을 밝힘, 명령줄·정책·레지스트리·서드파티 스크립트 없이 설정 화면만으로 되는 범위, AI Components에서 모델 삭제 |
| 내부 링크 계획 | 나가는 링크: 허브 `turn-off-ai-features`, `turn-off-copilot-in-word`, `turn-off-ai-in-chrome`, `check-if-image-is-ai-generated`, `windows-11-24h2-end-of-support`. 받는 링크: 색인된 같은 클러스터 `check-if-image-is-ai-generated` C2PA 절(Paint 이미지에 C2PA가 붙는다는 Microsoft 문서 + 링크 1문장), 허브 Windows 절 끝 1문장 |
| 개요 | Which AI features does your PC have? / How to remove the Copilot app / How to change what the Copilot key does / How to turn off Recall / How to turn off Click to Do / How to turn off AI actions in File Explorer / How to turn off AI in Notepad / Can you turn off AI in Paint? / How to remove AI models you don't use / What you can't turn off / Which AI features should you turn off? / How we checked |
| 이미지 | 대표: 모니터 + 토글 4개(3개 꺼짐) + 별이 상자로, 연분홍 배경 + 코발트·레몬, 아이소메트릭. 본문 그래픽 4장: 기능별 끌 수 있는 범위, 메뉴 경로, Copilot+ PC 전용 vs 모든 PC, 문서끼리 다른 점 |

## 사실 → 출처 (모두 2026-10-24 UTC curl로 직접 열어 `source-*.txt`에 저장)

| 주장 | 출처 | 파일 |
| --- | --- | --- |
| Recall 요구 조건: Copilot+ PC(또는 "Windows 11 AI+ PC") Secured-core, 40 TOPS NPU, 16GB RAM, 256GB, 50GB 여유, BitLocker/장치 암호화, Windows Hello ESS 생체 | support.microsoft.com/en-us/windows/ai/ai-features/retrace-your-steps-with-recall | source-recall.txt |
| 스냅숏 저장은 기본 꺼짐, 옵트인. Settings > Privacy & security > Recall & snapshots > Save snapshots. 변경 시 Windows Hello 확인 | 같은 문서, privacy-and-control-over-your-recall-experience | source-recall.txt, source-recall-privacy.txt |
| 시스템 트레이 Recall 아이콘에서 일시 중지 | privacy-and-control | source-recall-privacy.txt |
| Reset Recall: Settings > Privacy & security > Recall & snapshots > Advanced settings > Reset Recall, 내보낸 스냅숏은 남음 | retrace | source-recall.txt |
| Recall 제거: 작업 표시줄 검색 "Turn Windows features on or off" → Recall 체크 해제 → 재시작, 저장된 스냅숏 삭제. 다시 켜기 같은 경로. 관리되지 않는 기기에 기본 제공되는 선택적 기능 | retrace | source-recall.txt |
| 업무·학교 관리 기기는 Recall이 기본 제거, IT가 사용자 몰래 스냅숏을 켤 수 없음 | retrace | source-recall.txt |
| Click to Do: Copilot+ PC 기본 켜짐, 제거 불가, Settings > Privacy & security > Click to Do를 Off. 끄면 Win+클릭·Win+Q·오른쪽 스와이프로 안 열림, Snipping Tool 등에서 고르면 "Couldn't open Click to Do" 오류 | support click-to-do-do-more-with-what-s-on-your-screen | source-ctd.txt |
| Click to Do 요구 조건: Copilot+ PC, 40 TOPS, 16GB, 8 논리 프로세서, 256GB. 화면 분석은 기기 안에서, Search the web 등을 고르면 온라인으로 보냄. 사용자는 Settings > Apps > Actions에서 원하지 않는 작업을 끌 수 있음 | learn manage-click-to-do | source-clicktodo-learn.txt |
| File Explorer AI actions: 2025-09-29 KB5065789(미리 보기)에서 도입, 파일 우클릭 > AI actions, 이미지 4개(Visual Search·Blur Background·Erase Objects·Remove Background), Summarize는 M365 Copilot 라이선스, EEA 미제공 | support KB5065789 | source-kb5065789.txt |
| Copilot 앱 제거: Settings > Apps > Installed apps > … > Uninstall (Learn), 일반 앱 제거 문서 Start > Settings > Apps > Installed apps > More > Uninstall | learn manage-windows-copilot, support uninstall | source-copilot-learn.txt, source-uninstall.txt |
| "Turn Off Windows Copilot" 정책은 곧 폐지 예정(near-term deprecation), AppLocker 권장 → 글에서 정책 방법을 쓰지 않는 근거 | learn manage-windows-copilot | source-copilot-learn.txt |
| Copilot 키 사용자 지정: Settings > Personalization > Text input > Customize Copilot key on keyboard (단축키 문서). 화면 낭독기 문서는 Bluetooth & devices > Keyboard > Customise Copilot key on keyboard, 선택지 Search·Microsoft Copilot·Custom·Copilot. 작업 표시줄의 Copilot이 켜져 있으면 키 설정보다 우선 | support keyboard-shortcuts, use-a-screen-reader-to-manage-copilot-settings | source-kbd.txt, source-sr-copilot.txt |
| Copilot을 쓸 수 없으면 Copilot 키는 Windows 검색을 열거나 키 동작을 고르는 Settings를 엶 | keyboard-shortcuts | source-kbd.txt |
| 작업 표시줄 Ask Copilot 토글: Settings > Personalization > Taskbar > Ask Copilot | use-a-screen-reader-to-manage-copilot-settings | source-sr-copilot.txt |
| 메모장 AI(Rewrite·Summarize·Write): 끄려면 메모장 설정에서. 문서는 아직 "Insider Canary·Dev 채널" 표기. Microsoft 계정 로그인·AI 크레딧(M365 Personal·Family 월 60) 필요, 구독 기반 기능은 Azure 온라인 처리 | support enhance-your-writing-with-ai-in-notepad | source-notepad.txt |
| M365 FAQ: "You can't turn off Copilot features in Designer, Notepad, or Paint." 자녀는 Windows Family Safety로 제한 가능 | support frequently-asked-questions-about-copilot-in-microsoft-365-subscriptions | source-m365faq.txt |
| 관리용 정책 DisableAIFeaturesInNotepad(Notepad 11.2503.16.0 이상) | learn manage-notepad | source-notepad-learn.txt |
| Paint: Cocreator·Generative fill(Snapdragon Copilot+)·Sticker generator·Object Select는 Copilot+ PC. Image Creator는 Microsoft 계정·크레딧 필요(클라우드 DALL-E). Paint AI 이미지에 C2PA 매니페스트 | support use-copilot-pc-features-in-paint, use-image-creator-in-paint | source-paint-cplus.txt, source-paint-ic.txt |
| Paint AI 관리 정책(DisableCocreator·DisableGenerativeFill·DisableImageCreator), Settings 에이전트(DisableSettingsAgent), Click to Do, Recall 정책 = WindowsAI Policy CSP. 소비자용 스위치는 문서에 없음 | learn policy-csp-windowsai | source-csp.txt |
| Settings 에이전트: 24H2 KB5062660 이후 Copilot+ PC, 기기 안 모델 Settings Mu, 제안만 하고 사용자가 요청해야 변경, 끄는 것은 관리자 정책 | learn configuration/settings/agent | source-settings-agent.txt |
| Experimental agentic features: Settings > System > AI Components > Experimental agentic features, 기본 꺼짐, 관리자만 켤 수 있고 켜면 모든 사용자에 적용 | support experimental-agentic-features | source-agentic.txt |
| AI 모델: Copilot+ PC는 Phi Silica 등 NPU 모델 기본 포함, 다른 PC는 앱이 처음 요청할 때 수 GB 다운로드(Windows Update), 사용자가 Settings > System > AI Components에서 제거·재설치 | learn windows/ai/apis, troubleshooting | source-windows-ai-apis.txt, source-aiapi-trouble.txt |
| Copilot+ PC AI 구성 요소(Image Creation·Image Processing·Image Transform·Phi Silica·Vision)는 OS 일부, Windows Update로 별도 업데이트. 26H2 적용 대상, 2026-10-17 Vision 추가 | support windows-copilot-ai-components | source-aicomp.txt |
| 26H2 = Windows 11 2026 Update, enablement package | support 26h2 update history | source-h26.txt |

## 확인하지 못해 쓰지 않은 것

- 메모장 설정의 AI 스위치 정확한 이름 (Microsoft 문서는 "turn them off in Notepad settings"만 씀) → 이름을 지어내지 않고 "the AI features option in Notepad's settings"로만 씀
- Settings > Apps > Actions 화면의 개별 스위치 이름 (Learn 문서 경로만 있음)
- Edge의 Copilot 설정 (별도 앱, 이번 세션 범위 밖)
- Windows 검색(semantic indexing)·Photos(Relight·Super resolution)·Snipping Tool AI 끄기 — 소비자 문서에서 끄는 방법을 찾지 못함
- "Windows 11 AI+ PC" 정의 (Recall 문서에만 나옴, 다른 Microsoft 문서에서 정의 못 찾음) → How we checked에 언급만
- 레지스트리·그룹 정책 방법: Copilot 정책은 폐지 예정, Paint·메모장·Settings 에이전트 정책은 관리 기기용 → 글에 단계로 쓰지 않음

## 직접 실행

- Windows 11 PC가 없어 화면 직접 확인은 없음 (본문 How we checked에 밝힘)
