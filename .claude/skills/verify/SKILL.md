---
name: verify
description: 코드 변경 후 lint → type-check → build 검증 절차. /verify로 호출하거나 작업 완료 후 실행.
disable-model-invocation: true
---

## 단계별 완료 후 (구현 단계마다)

```bash
pnpm lint
pnpm type-check
```

## 모든 작업 완료 후

```bash
pnpm lint
pnpm type-check
pnpm build
```

## 워크스페이스별 실행

```bash
pnpm lint -w @jinho-blog/web
pnpm type-check -w @jinho-blog/web
pnpm build -w @jinho-blog/web
```

## 판단 기준

- lint: 자동 수정 후 오류 없으면 통과
- type-check: 타입 오류 0개이면 통과
- build: exit code 0이면 통과

## 실패 시 처리

1. lint 실패 → 자동 수정 불가한 오류는 Edit으로 직접 수정
2. type-check 실패 → 타입 정의 확인 후 수정
3. build 실패 → 에러 메시지 분석 후 해당 파일 수정
