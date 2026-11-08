# 외부 링크 후보 (사용자 제안용)

> **2026-11-09 사용자 결정: 사용자가 직접 글을 올리는 홍보는 하지 않음** ([README](README.md#결정사항) '외부 홍보'). 이 문서에 새 후보·초안을 더하지 않으며, 아래 기록은 이전 판단 근거로만 남깁니다.

Claude는 외부 사이트에 글을 올리거나 메일을 보내지 않습니다 (정기 실행 제약). 이 문서는 개선 세션이 `link-building` 스킬로 찾은 후보와 **초안**만 담고, 게시 여부·문구는 사용자가 정합니다. 유료 링크·링크 교환·자동 게시는 하지 않습니다 (스킬 Step 5, Google 스팸 정책). 게시한 곳은 아래 기록 표에 남기면 다음 세션이 Search Console 유입·색인 변화와 함께 봅니다.

## 진단 (2026-11-04 세션 79)

- **링크가 병목인가**: 색인 17/53, 미색인 36편 중 `Discovered - currently not indexed` 17편 · `URL is unknown` 19편. Google은 홈을 1.5~2일마다 다시 크롤링하고(11-03 05:18) 홈 허브·최근 글 링크를 이미 봤지만(`link_seen.py` 19편) 그 글들을 가져가지 않음 → 내부 링크는 이미 채웠고(받는 링크 2개 미만 0편), 남은 원인은 사이트 전체의 크롤링 수요(외부 언급·방문)가 작다는 쪽 (해석). 스킬 표의 **Foundation gap**(도메인에 외부 링크가 거의 없음)
- **이미 있는 언급**: WebSearch `"tool-proof.com"` 결과 0건(이름이 비슷한 다른 사이트만) → 링크 없는 언급 회수(reclamation) 대상 없음. 외부 링크 수는 Search Console **Links** 보고서(사용자 화면 전용, API 없음)에서 확인 가능
- **링크할 자산**: 직접 실행한 측정·화면이 있는 글. 특히 커뮤니티 질문에 그대로 답이 되는 글 (`turn-off-ai-in-brave`: 스위치 5개로 안 사라지는 곳 + flags 하나로 제거, Brave Search 설정이 쿠키라는 점)

## 후보

| # | 곳 | 상태 (11-04 확인) | 맞는 글 | 각도 | 비고 |
| --- | --- | --- | --- | --- | --- |
| 1 | Brave Community "[How do I remove Leo](https://community.brave.app/t/how-do-i-remove-leo/544520)" | 열림, 52개 답·조회 10,035, 마지막 답 10-28 (Brave 직원이 유료 Brave Origin 안내) | `turn-off-ai-in-brave` | 무료판에서 `brave://flags` 하나로 Leo 제거(10-28 답 보완), 3월 답 "search.brave.com에서 껐는데 다시 켜짐" → 설정이 쿠키라 지워지면 돌아옴 | 사용자 본인 계정으로, 운영자임을 밝힘. Discourse 새 계정은 링크 수가 제한될 수 있음 |
| 2 | Brave Community "[Is there a way to ACTUALLY disable ai from brave search?](https://community.brave.app/t/is-there-a-way-to-actually-disable-ai-from-brave-search/545575)" | 열림, 31개 답·조회 17,029, 마지막 답 2025-12-29 | `turn-off-ai-in-brave` (Brave Search 절) | **Answer with AI** 위치와 쿠키 이름·기간(`summarizer`, 180일) | 1번을 먼저. 같은 문구를 두 곳에 붙이지 않음 |

**검토했지만 뺀 곳**

- [Ubuntu Discourse "Can't disable Copilot in Microsoft Edge"](https://discourse.ubuntu.com/t/cant-disable-copilot-in-microsoft-edge/76690): `turn-off-copilot-in-edge`(Linux Edge로 측정)와 딱 맞지만 2026-03-21 닫힘
- Brave Community "How do I KILL Leo? Not Resolved" 두 글: 2025-12-31 닫힘
- Karen Smiley Substack 옵트아웃 모음: 2024-10 이후 갱신 없음, 대형 매체만 링크
- TechRadar "How to turn off AI in the apps you use every day": 대형 매체 자체 기사(자원 목록 아님)
- Mozilla 지원 포럼·Mozilla Connect(`turn-off-ai-in-firefox`): 컨테이너에서 403·Client Challenge라 글 상태를 확인 못 함 → 후보로 올리지 않음 (사용자가 직접 보면 1번과 같은 방식 가능)
- Reddit: 컨테이너에서 본문을 읽을 수 없어 확인 못 함

## 초안

### 1. Brave Community "How do I remove Leo" (영어, 사용자 계정)

> For anyone who finds this thread later: on desktop you don't need Brave Origin to get rid of Leo. I tested Brave 1.98.63 on a new profile on November 3, 2026. Turning off the five switches (three in Settings > Leo, the toolbar button's Hide Leo AI icon, and Leo AI Assistant under Settings > Appearance) hid the buttons, but the Leo AI item in the main menu and the brave://leo-ai page still worked. Setting **Brave AI Chat** to **Disabled** at brave://flags/#brave-ai-chat and relaunching removed every Leo button, menu item, setting and the chat page. It applies to every profile on that computer, and choosing **Default** brings it back.
>
> About the earlier reply where AI in Brave Search turned itself back on: the **Answer with AI** switch on search.brave.com/settings is saved as a cookie (named `summarizer`, kept for 180 days), not in your Brave settings. Anything that clears that site's cookies, such as a private window or clearing cookies when the browser closes, would put it back to on.
>
> Disclosure: I run ToolProof, a small site that tests these settings. The full steps with screenshots are here: https://tool-proof.com/posts/turn-off-ai-in-brave

- 사실 근거: `turn-off-ai-in-brave` 본문(직접 실행 기록 `tests/turn-off-ai-in-brave/`). "cookie가 지워지면 돌아온다"는 쿠키 저장 방식에서 나온 설명이라 "would"로 씀 (Brave에서 종료 시 쿠키 삭제를 켜고 직접 재현하지는 않음)

## 게시 기록

| 날짜 | 곳 | 링크한 글 | 게시한 사람 | 결과 (다음 세션이 채움) |
| --- | --- | --- | --- | --- |
| - | - | - | - | - |
