현재 브랜치에서 PR의 제목과 설명을 작성해줘.

다음 순서로 진행해:

1. `pnpm build`를 실행하여 린트 검사, 타입 검사, 테스트, 빌드 모두 성공적으로 통과했는지 체크 (pnpm build 명령어가 전부 수행함) -> 성공하면 계속 진행하고, 실패하면 무엇이 실패했는지 보고하고 종료
2. 베이스 브랜치 감지: `git log --simplify-by-decoration --pretty=format:'%D' HEAD | tr ',' '\n' | grep -oE 'origin/[^ ]+' | grep -v "$(git rev-parse --abbrev-ref HEAD)" | head -1` 실행 후 결과를 BASE_BRANCH로 사용. 결과가 없으면 `origin/main` 사용
3. `git log {BASE_BRANCH}..HEAD --oneline --no-merges` 로 커밋 목록 확인
4. `git diff {BASE_BRANCH}...HEAD --stat` 로 변경 파일 요약 확인
5. 커밋 목록을 접두어별로 분류 (@/.claude/CLAUDE.md 에서 Git 브랜치 섹션 참조)
6. 아래 규칙에 따라 PR 제목과 설명 작성

**PR 제목 규칙:**

- 70자 이내
- 가장 비중이 큰 변경사항을 중심으로 작성
- 여러 유형이 섞여 있으면 `Release: ` 접두어 사용
- 단일 유형이면 해당 접두어 사용 (예: `Test: ...`, `Refactor: ...`)
- 코드 블록으로 제공

**PR 설명 규칙:**

- 변경사항이 있는 섹션만 포함 (빈 섹션 제외)
- 각 항목은 커밋 메시지에서 접두어를 제거하고 간결하게 작성
- 1번의 결과를 바탕으로 체크리스트 표시
- 마크다운 코드 블록으로 제공

**출력 형식 (반드시 이 형식 그대로):**

**PR 제목:**

```
[제목 내용]
```

**PR 설명:**

- @/.github/pull_request_template.md

변경사항이 있는 섹션만 포함하고, 없는 섹션은 제거해서 출력해.
