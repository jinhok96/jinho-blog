## 결정사항
- [어느 단계를 결정론적으로?] → 사용자 위임(2026-11-18 "검토 후 자유롭게 도입"). 판단이 필요 없는 단계만 스크립트로: 세션 유형·환경 준비, 지표 기록 블록, 판정 시점 지난 검증 실행, 발행 전 체크리스트, 주간 점검 데이터 수집. 주제 선정·작성·개선 내용 선택·해석은 세션 판단으로 남김
- [지표 단계 순서] → daily_metrics.py를 세션 시작 지표 단계로 옮기고 그 출력으로 log.md 지표 블록을 만듦 (gsc_report.py URL 검사 중복 제거)
- [출력 방식] → 스크립트는 log.md 등 문서를 직접 고치지 않고 붙여 넣을 블록·PASS/FAIL만 출력 (기록은 세션이)

## 웨이브 계획
Wave 1 (병렬): [A] 세션 시작: 유형 판정·환경 준비 (files: experiment/tools/session_start.py) | [B] 지표 블록·검증 판정 (files: experiment/tools/session_report.py) | [C] 발행 전 체크리스트 (files: experiment/tools/prepublish_check.py) | [D] 주간 점검 데이터 묶음 (files: experiment/tools/weekly_checks.py)
Wave 2 (Wave1 완료 후): [E] 문서 반영·스크립트 실행 확인 (files: experiment/README.md, routine-prompt.md, writing-guide.md, log.md, .claude/ad-blog.md)
