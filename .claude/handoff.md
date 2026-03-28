# Handoff Document
생성일시: 2026-03-24 KST
effort: high

## 1. 완료한 작업
- 네온 아케이드 캐비닛 UI 전면 재설계 (globals.css, layout.tsx)
- 슬롯 릴 2단계 스핀 애니메이션 구현 (ReelColumn.tsx, SlotGrid.tsx 재구조화)
- 점수 딜레이 표시 + +N 플래시 구현 (ScoreBoard.tsx)
- 카드 패널 UI 개선 — 가로 배치, 크기 확대, 텍스트 색상 가독성 향상 (CardPanel.tsx)
- Math.random ESLint 위반 수정 — 랜덤 로직을 Zustand store로 이전
- GameState 타입에 spinId, spinStrips, scoreGain, offeredCards 필드 추가
- SlotGrid/CardPanel 테스트 업데이트

## 2. 변경 파일 요약
| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| app/globals.css | 수정 | 네온 아케이드 테마 CSS 변수/키프레임 전면 재작성 |
| app/layout.tsx | 수정 | Orbitron + Space Mono 폰트로 교체 |
| components/ReelColumn.tsx | 신규 | 2단계 릴 애니메이션 컴포넌트 (useAnimation) |
| components/SlotGrid.tsx | 수정 | 행→열 기반으로 구조 변경, ReelColumn 사용 |
| components/ScoreBoard.tsx | 수정 | displayScore 딜레이 + +N 플래시 애니메이션 |
| components/CardPanel.tsx | 수정 | offeredCards를 store에서 읽도록 변경 |
| components/SpinButton.tsx | 수정 | 네온 아케이드 스타일 버튼 |
| components/SymbolCell.tsx | 수정 | 네온 스타일 적용 |
| components/GameScreen.tsx | 수정 | isSpinning 로컬 상태 제거 |
| store/gameStore.ts | 수정 | REEL_FAKE_COUNT, spinId, spinStrips, scoreGain, offeredCards 추가 |
| types/game.ts | 수정 | GameState에 spinId/spinStrips/scoreGain/offeredCards 추가 |
| jest.config.ts | 수정 | 테스트 설정 |
| package.json | 수정 | 의존성 업데이트 |
| __tests__/components/ | 신규 | SlotGrid, CardPanel 테스트 파일 |

## 3. 테스트 필요 사항
- [ ] 슬롯 스핀 시 5개 릴이 순서대로 멈추는 애니메이션 확인
- [ ] 릴 멈춘 후 약 1.85초 뒤 점수 업데이트 및 +N 플래시 표시
- [ ] 당첨 심볼 네온 하이라이트 보더 정상 표시
- [ ] 카드 선택 패널 3장 가로 배치 및 텍스트 가독성
- [ ] 게임 리셋 시 점수 즉시 0으로 초기화

## 4. 알려진 이슈 / TODO
- [ ] 반응형 UI (모바일 대응) 미완성 — 현재 이슈로 제기됨
- [ ] 카드 선택 후 화면이 위로 밀렸다가 내려오는 현상 — 현재 이슈로 제기됨

## 5. 주의사항
- react-hooks/purity 규칙: useMemo/useEffect 내 Math.random() 사용 금지
- react-hooks/set-state-in-effect 규칙: useEffect 내 직접 setState 금지 (setTimeout 내에서만)
- SlotGrid 테스트: data-real="true" 속성으로 실제 심볼 셀 식별
- REEL_FAKE_COUNT = 22 (store에서 export)

## 6. 검증 권장 설정
- effort: high
- security: false
- coverage: true
- only: all
- loop: 3

---

# Handoff Document (추가)
생성일시: 2026-03-29 KST
effort: high

## 1. 완료한 작업
- 심볼 밸런스 조정: lemon/cherry=2pt, clover/coin=3pt, gem/crown=5pt, lucky7=7pt, skull=-10pt
- grape 심볼을 clover(🍀)로 교체 (타입, ID, 이모지, 색상 전체 변경)
- 심볼 출현 가중치 도입: 같은 groupValue끼리 동일 weight, lucky7=7%, skull=3%
- 라운드 스핀 횟수 고정: 랜덤(5~10) → 고정 7회
- 라운드 목표점수 재조정: 누적 합산 방식으로 변경 (R1=20, R2=52, R3=103...)
- 점수 누적 방식: roundScore 판정 → score(총 누적) 판정으로 변경
- 점수 표시: 내 점수 = 그대로, 목표 점수만 10의 자리 반올림

## 2. 변경 파일 요약
| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| types/symbol.ts | 수정 | grape→clover, weight? 필드 추가 |
| types/game.ts | 수정 | roundTarget 주석 업데이트 |
| lib/data/symbols.ts | 수정 | groupValue 재조정, weight 추가, grape→clover |
| lib/data/cards.ts | 수정 | grape 카드 2개 → clover로 교체 |
| lib/engine/round.ts | 수정 | 누적 목표점수 공식, 고정 스핀 7회, getSpinsInRound |
| lib/engine/spin.ts | 수정 | buildWeightedPool이 symbol.weight 사용 |
| lib/engine/odds.ts | 수정 | calculateSymbolOdds도 symbol.weight 사용 |
| store/gameStore.ts | 수정 | 클리어 판정 newScore 기준, getSpinsInRound |
| components/ScoreBoard.tsx | 수정 | score 표시, 목표만 반올림, 라벨 "Score" |
| components/GameScreen.tsx | 수정 | game_over 표시 수정 |
| components/CardPanel.tsx | 수정 | 목표점수만 반올림 |
| components/SymbolCell/ReelColumn/SlotGrid/SymbolOddsPanel | 수정 | grape→clover |

## 5. 주의사항
- calculateRoundTarget(round)이 누적 합산 반환 (per-round 아님)
- getSpinsInRound() 이름 변경 (getRandomSpinsInRound 삭제)
- SlotSymbol.weight optional — 미지정 시 1.0 fallback
- ScoreBoard가 roundScore prop을 더 이상 받지 않음

## 6. 검증 권장 설정
- effort: high
- security: false
- coverage: true
- only: all
- loop: 3
