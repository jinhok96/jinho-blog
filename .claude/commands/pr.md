현재 브랜치에서 main으로 합치는 PR의 제목과 설명을 작성해줘.

다음 순서로 진행해:

1. `git log main..HEAD --oneline --no-merges` 로 커밋 목록 확인
2. `git diff main...HEAD --stat` 로 변경 파일 요약 확인
3. 커밋 목록을 접두어별로 분류 (Feature, Fix, Refactor, Test, Style, Chore, CI, Content, Document)
4. 아래 규칙에 따라 PR 제목과 설명 작성

**PR 제목 규칙:**

- 70자 이내
- 가장 비중이 큰 변경사항을 중심으로 작성
- 여러 유형이 섞여 있으면 `Release: ` 접두어 사용
- 단일 유형이면 해당 접두어 사용 (예: `Test: ...`, `Refactor: ...`)

**PR 설명 규칙:**

- 변경사항이 있는 섹션만 포함 (빈 섹션 제외)
- 각 항목은 커밋 메시지에서 접두어를 제거하고 간결하게 작성
- 체크리스트는 항상 포함

**출력 형식 (반드시 이 형식 그대로):**

**PR 제목:**

```
[제목 내용]
```

**PR 설명:**

- @/.github/pull_request_template.md

변경사항이 있는 섹션만 포함하고, 없는 섹션은 제거해서 출력해.
