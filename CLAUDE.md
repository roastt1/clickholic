@AGENTS.md

# Clickholic

3x5 슬롯 머신 기반 전략 덱빌딩 로그라이크 퍼즐 게임.
매 스핀마다 15개 심볼이 랜덤 배치되어 점수를 계산하고, 아이템 카드를 선택해 덱을 강화하는 10분 내외의 고점수 인플레이션 게임.

## 기술 스택

| 영역       | 기술                              |
| ---------- | --------------------------------- |
| 프레임워크 | Next.js (App Router), TypeScript  |
| 스타일링   | Tailwind CSS v4                   |
| 상태 관리  | Zustand (게임 엔진 + 영속성)      |
| 애니메이션 | Framer Motion (슬롯 Elastic 효과) |
| 사운드     | use-sound                         |
| 백엔드     | Supabase (리더보드, 점수 저장)    |

## 개발 명령어

```bash
npm run dev    # 개발 서버
npm run build  # 프로덕션 빌드
npm run lint   # ESLint
```

## 폴더 구조

```
app/           → 라우팅, 페이지, 레이아웃
components/    → UI 컴포넌트 (슬롯 그리드, 카드 선택 등)
lib/engine/    → 게임 로직 순수 함수 (UI 의존성 없음)
lib/supabase/  → Supabase 클라이언트 및 쿼리
store/         → Zustand 스토어
types/         → 공유 인터페이스 (Symbol, Card, Effect)
```

## 아키텍처 원칙

### 게임 엔진 분리 (CRITICAL)

`lib/engine/` 하위 파일은 React/DOM에 의존하지 않는 **순수 함수만** 포함한다.
점수 계산, 심볼 상호작용, 카드 효과 적용 로직은 반드시 여기에 작성한다.
UI 컴포넌트 내부에 게임 로직을 직접 작성하지 않는다.

```typescript
// ✅ lib/engine/score.ts
export function calculateScore(symbols: Symbol[]): number { ... }

// ❌ components/SlotGrid.tsx 안에 점수 계산 로직 작성 금지
```

### Interface 중심 설계

새로운 Symbol, Card, Effect를 추가할 때 반드시 `types/` 인터페이스를 먼저 확인하고 확장한다.
구체 구현보다 인터페이스에 의존하여 카드 추가/변경 비용을 최소화한다.

```typescript
// types/card.ts
export interface ItemCard {
    id: string;
    name: string;
    description: string;
    apply: (state: GameState) => GameState; // 순수 함수
}
```

### 렌더링 전략

Canvas를 사용하지 않는다. DOM + Framer Motion으로 슬롯 애니메이션을 구현한다.
슬롯 스핀 효과는 Framer Motion의 `spring` / `elastic` 트랜지션을 사용한다.

## 성능 규칙

### useMemo 적극 활용 (CRITICAL)

3x5 슬롯의 15개 심볼은 매 스핀마다 연산 비용이 발생한다.
불필요한 리렌더링을 방지하기 위해 심볼 연산 결과는 반드시 `useMemo`로 메모이제이션한다.

```typescript
// ✅ 심볼 연산 결과 메모이제이션
const scoreResult = useMemo(
  () => calculateScore(symbols),
  [symbols]
)

// ✅ 심볼 그리드 렌더링 메모이제이션
const symbolGrid = useMemo(
  () => symbols.map((s, i) => <SymbolCell key={i} symbol={s} />),
  [symbols]
)
```

의존성 배열에 불필요한 값을 포함하지 않는다. 심볼 배열이 바뀔 때만 재연산되도록 설계한다.

## 코딩 규칙

### 불변성

상태를 직접 수정하지 않는다. 항상 새 객체를 반환한다.

```typescript
// ❌ 금지
state.score += points;

// ✅ 올바른 방법
return { ...state, score: state.score + points };
```

### 환경변수

Supabase URL, anon key 등 모든 시크릿은 `.env.local`에만 저장한다. 코드에 하드코딩 금지.

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
```

### 파일 크기

파일당 200줄 이하, 함수당 50줄 이하를 유지한다. (테스트 파일 `*.test.ts`, `*.test.tsx` 예외)
게임 엔진 로직이 복잡해지면 `lib/engine/score.ts`, `lib/engine/effects.ts` 등으로 분리한다.

## Git 워크플로우 (CRITICAL)

> **브랜치 전략 (절대 규칙)**
> - feature/fix 브랜치 → **`dev`** (PR `--base dev` 필수)
> - `dev` → `main` 은 배포 시에만
> - `main`에 직접 PR 금지. `--base` 생략 시 자동으로 `dev`가 선택됨 (GitHub 기본 브랜치 = `dev`)

새 기능 또는 버그 수정 시 반드시 아래 순서를 따른다.

### 1단계: Issue 생성

작업 시작 전 GitHub Issue를 먼저 생성한다.

```bash
gh issue create \
  --title "feat: 슬롯 스핀 애니메이션 구현" \
  --body "## 작업 내용\n- 설명\n\n## 완료 조건\n- [ ] 체크리스트" \
  --label "enhancement"
```

라벨 규칙:

- 새 기능 → `enhancement`
- 버그 수정 → `bug`
- 문서/설정 → `documentation`

### 2단계: Branch 생성

Issue 번호를 포함한 브랜치명으로 생성한다.

```bash
# 형식: feat/#{issue-number}-{짧은-설명}
git checkout -b feat/#3-slot-spin-animation

# 버그 수정
git checkout -b fix/#7-score-calculation-error
```

브랜치 접두사:

- `feat/` → 새 기능
- `fix/` → 버그 수정
- `refactor/` → 리팩터링
- `docs/` → 문서

### 3단계: 작업 및 커밋

커밋 메시지는 Conventional Commits 형식을 따른다.

```bash
git add [파일]
git commit -m "feat: 슬롯 스핀 Elastic 애니메이션 추가 (#3)"
```

### 4단계: PR 생성

작업 완료 후 Issue를 닫는 PR을 생성한다.

```bash
gh pr create \
  --title "feat: 슬롯 스핀 애니메이션 구현" \
  --body "## 변경 사항\n- 내용\n\n## 테스트\n- [ ] 체크리스트\n\nCloses #3" \
  --base dev
```

- PR body에 반드시 `Close #{issue-number}` 포함 (PR merge 시 Issue 자동 닫힘)
- **`--base dev` 반드시 명시** — 생략하면 안 됨 (GitHub 기본 브랜치가 `dev`이므로 생략해도 `dev`로 가지만, 명시적으로 작성)
- **feature/fix 브랜치 → `dev`** PR을 통해 merge
- **`dev` → `main`** 은 배포 시에만 (릴리즈 PR)
- `main`, `dev` 브랜치에 직접 push 금지

---

## AI 작업 가이드라인

- 새 Symbol / Card / Effect 추가 시 `types/` 인터페이스를 먼저 확인하고 확장할 것
- 점수 계산 로직은 `lib/engine/` 외부에 작성 금지
- 스핀 애니메이션은 반드시 Framer Motion 사용 (CSS keyframes 단독 사용 지양)
- 15개 심볼 연산이 포함된 컴포넌트는 `useMemo` 적용 여부를 항상 검토할 것
- Supabase 쿼리는 `lib/supabase/` 하위에만 작성하고 컴포넌트에서 직접 호출 금지
