---
name: output-style
description: 한국어 응답, 파일 참조 링크 형식, 커밋 메시지 포맷 등 출력 스타일 규칙. 응답 작성 시 적용.
user-invocable: false
---

## 언어

모든 응답, thinking, 분석은 **한국어**. 영어 사용 금지.

## 파일 참조 형식

파일이나 코드 위치 언급 시 반드시 클릭 가능한 마크다운 링크 사용:

- 파일: `[filename.ts](path/to/filename.ts)`
- 특정 라인: `[filename.ts:42](path/to/filename.ts#L42)`
- 범위: `[filename.ts:42-51](path/to/filename.ts#L42-L51)`

## 커밋 메시지 형식

`{Prefix}: 설명`

| Prefix     | 용도                                                        |
| ---------- | ----------------------------------------------------------- |
| `Feature`  | 새 기능 추가                                                |
| `Fix`      | 버그 수정                                                   |
| `Refactor` | 기능 변경 없는 코드 개선                                    |
| `Style`    | UI/CSS 스타일 변경                                          |
| `Content`  | 블로그 글 작성/수정                                         |
| `Document` | 문서 업데이트 (README, .claude/ 등)                         |
| `Test`     | 테스트 코드 추가/수정                                       |
| `Chore`    | GitHub Actions 등 CI/CD 설정, 의존성 업데이트, 설정 변경 등 |

## 작업 완료 시 커밋 제안 형식

변경 파일을 유형에 따라 여러 커밋으로 분리. 각 커밋은 아래 3개의 독립 코드 블록으로 표시:

커밋 메시지:

```text
{Prefix}: 설명
```

git add 명령:

```text
git add file1 file2
```

파일 목록:

```text
- file1.tsx
- file2.ts
```
