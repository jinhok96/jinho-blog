# /write 커맨드

블로그 콘텐츠 MDX 파일을 생성하고 완성합니다.

## 흐름 결정

현재 IDE에서 열린 파일(ide_opened_file)이 `content/mdx/` 하위의 `.mdx` 파일인 경우 → **Step 2 (초안 완성)**
그 외의 경우 → **Step 1 (파일 생성)**

---

## Step 1 — 파일 생성

### 1. 사용자에게 질문

AskUserQuestion 툴로 다음 두 가지를 질문합니다:

- **콘텐츠 유형**: `blog` / `library` / `project`
- **파일 이름(slug)**: kebab-case (예: `my-first-post`)

### 2. 파일 생성

`content/_templates/{type}.mdx`를 읽어 아래 경로에 새 파일 생성:

| 유형    | 경로                                   |
| ------- | -------------------------------------- |
| blog    | `content/mdx/blog/{filename}.mdx`      |
| library | `content/mdx/libraries/{filename}.mdx` |
| project | `content/mdx/projects/{filename}.mdx`  |

### 3. 완료 안내

생성된 파일 경로를 클릭 가능한 마크다운 링크로 알려주고 다음을 안내합니다:

> "파일이 생성되었습니다. IDE에서 파일을 열고 초안을 작성하세요. 작성이 완료되면 `/write`를 다시 호출하세요."

---

## Step 2 — 초안 완성

### 1. 파일 읽기

현재 IDE에서 열린 MDX 파일을 Read 툴로 읽습니다.

### 2. 초안 분석

frontmatter와 본문 내용을 분석하여 보완이 필요한 부분을 파악합니다.

### 3. 변경 전 반드시 확인

초안과 **조금이라도 달라지는 모든 부분**에 대해 **반드시 AskUserQuestion으로 먼저 확인**합니다.
수십~수백 번이라도 상관없습니다. 다음 모든 경우에 해당합니다:

- 없는 내용 추가 (예시 코드, 설명 등 포함)
- 기존 내용 삭제 또는 축약
- 잘못된 정보 수정
- 문장 표현 변경 또는 다듬기
- frontmatter 필드값 변경 (title, description, category, tech 등)
- 섹션 구조 변경 (헤딩 추가/삭제/변경)

**질문 형식**: 변경 이유와 변경 전/후 내용을 함께 보여주며 승인 요청합니다.

### 4. 파일 반영

모든 변경 사항이 승인된 후에만 파일에 반영합니다.

### 5. 빌드 검증

```bash
pnpm build
```

빌드 성공 여부를 확인하고 결과를 알려줍니다.
