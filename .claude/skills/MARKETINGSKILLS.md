# 외부 SEO 스킬 (marketingskills)

ToolProof(`apps/ad-blog`) 개선 세션이 혼자 판단하지 않고 널리 쓰이는 SEO 노하우를 참조하도록 받아 둔 스킬입니다 (2026-10-24 사용자 결정). 계정 플러그인(searchfit-seo 등)은 정기 세션에 로드되지 않는 경우가 많아, 저장소에 넣어 모든 세션이 같은 스킬을 쓰게 합니다.

- 출처: [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) 커밋 `e85f3cbc2e4a79bf33b2a12e9bdd9087d414735b` (2026-10-24 받음). Claude Code·Codex 등에서 널리 쓰이는 마케팅 스킬 모음 (GitHub 스타 수만 개 수준, 집계 사이트마다 다름)
- 라이선스: MIT ([MARKETINGSKILLS-LICENSE](MARKETINGSKILLS-LICENSE)). 원문을 고치지 않고 그대로 둠
- 받기 전 전체 내용을 읽고 확인함 (외부 지시·도구 실행 요구 없음)

| 스킬 | 포함 파일 | 쓰는 곳 |
| --- | --- | --- |
| `seo-audit` | SKILL.md, references/rankings-push.md·title-tags.md·ai-writing-detection.md | 개선 세션: 8~20위 글 보강(rankings-push), CTR 낮은 글 제목·설명(title-tags), 색인·기술 점검 |
| `copy-editing` | SKILL.md, references/content-refresh.md·checklist.md | 개선 세션: 기존 글 갱신 범위 정하기(상위 결과 대비 빠진 소제목 표), AI 문체 점검 |
| `link-building` | SKILL.md, references/risk-policy.md·tactics.md·prospecting-and-outreach.md | 외부 링크 후보·공유 문안을 사용자에게 제안할 때 (발송·게시는 사용자) |
| `ai-seo` | SKILL.md만 | AI 답변 인용 구조 점검 (references는 받지 않음 → 스킬이 참조하면 "없음"으로 처리) |

받지 않은 참조 파일: seo-audit의 local-seo·international-seo(해당 없음), copy-editing의 plain-english-alternatives, ai-seo의 references 전체. 필요해지면 같은 커밋에서 받아 읽은 뒤 추가하고 이 표를 고칩니다.

## 우리 규칙이 우선

스킬은 일반 마케팅 조언이라 [experiment/README.md](../../apps/ad-blog/experiment/README.md)·[writing-guide.md](../../apps/ad-blog/experiment/writing-guide.md)와 다르면 **우리 규칙을 따릅니다**.

- FAQPage·HowTo 구조화 데이터 넣지 않음, 키워드 반복 목표 없음, 제목 꼬리표·콜론 부제 금지, 결론 요약 대신 상황별 추천
- 가상 인물·후기·수치 금지 (스킬의 testimonial·expert quote 제안은 실제 출처가 있을 때만)
- 독자는 비개발자: 명령줄·코드 방법 금지
- `.agents/product-marketing.md` 같은 맥락 파일은 없음 → 대신 experiment/README.md 결정사항을 읽음
- 지표를 노린 변경은 한 글에 한 가지, [traffic-playbook.md](../../apps/ad-blog/experiment/traffic-playbook.md) 검증 기록에 행 추가 (스킬의 "3~4주 뒤 판단"과 같음)
- 외부 발송(아웃리치 메일·커뮤니티 게시)은 하지 않고 초안만 사용자에게 남김
