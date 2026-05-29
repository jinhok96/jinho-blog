# 커밋 메시지 형식

```text
{Prefix}: 설명
```

- 설명은 한국어로, 명령형이 아닌 평서형으로 작성
- 한 줄로 간결하게 (필요 시 본문 추가)

# 작업 순서

1. `git status`, `git diff`로 변경 내용 확인 -> 작업 내용에 따라 1~N개의 커밋으로 분류
2. 변경 내용에 맞는 Prefix 결정
3. 아래 "출력 형식"대로 사용자에게 제안
4. 사용자 승인 후 `git add` → `git commit` 실행

# 출력 형식 (반드시 아래 형식 준수)

## 커밋 메시지

```
{Prefix}: 설명
```

## git add 명령

```bash
git add 파일1 파일2
```

## 변경 파일 목록

- `파일1.tsx`
- `파일2.ts`

---

## 예시

### 커밋 메시지

```
Feature: 홈 페이지 헤더 컴포넌트 추가
```

### git add 명령

```bash
git add src/pages/home/ui/HomePage.tsx src/pages/home/index.ts
```

### 변경 파일 목록

- `src/pages/home/ui/HomePage.tsx`
- `src/pages/home/index.ts`
