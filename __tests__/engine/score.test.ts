import { calculateGroupScore, calculateScore } from '@/lib/engine/score'
import type { SlotSymbol } from '@/types/symbol'
import type { Effect } from '@/types/effect'

function makeSymbol(type: SlotSymbol['type'], groupValue: number): SlotSymbol {
  return { id: type, type, tier: 'L1', groupValue }
}

function makeGrid(types: string[][], groupValue = 10): SlotSymbol[][] {
  return types.map((row) =>
    row.map((t) => makeSymbol(t as SlotSymbol['type'], groupValue)),
  )
}

describe('calculateGroupScore', () => {
  test('연결 그룹 없으면 0점', () => {
    const grid = makeGrid([
      ['cherry', 'clover',  'lemon', 'coin',  'gem'],
      ['crown',  'lucky7', 'skull', 'lemon', 'cherry'],
      ['clover',  'lemon',  'coin',  'gem',   'crown'],
    ])
    expect(calculateGroupScore(grid)).toBe(0)
  })

  test('가로 3개(groupValue=20) → 20×3×1 = 60', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'clover', 'coin'],
      ['lemon',  'gem',    'crown',  'skull', 'lucky7'],
      ['clover',  'lemon',  'coin',   'gem',   'crown'],
    ], 20)
    expect(calculateGroupScore(grid)).toBe(60)
  })

  test('가로 4개(groupValue=20) → 20×4×2 = 160', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'cherry', 'coin'],
      ['lemon',  'gem',    'crown',  'skull',  'lucky7'],
      ['clover',  'lemon',  'coin',   'gem',    'crown'],
    ], 20)
    expect(calculateGroupScore(grid)).toBe(160)
  })

  test('가로 5개(groupValue=20) → 20×5×3 = 300', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'cherry', 'cherry'],
      ['lemon',  'gem',    'crown',  'skull',  'lucky7'],
      ['clover',  'lemon',  'coin',   'gem',    'crown'],
    ], 20)
    expect(calculateGroupScore(grid)).toBe(300)
  })

  test('skull 가로 3개(groupValue=-20) → 감점 -60', () => {
    const grid = [
      [makeSymbol('skull', -20), makeSymbol('skull', -20), makeSymbol('skull', -20), makeSymbol('lemon', 10), makeSymbol('coin', 10)],
      [makeSymbol('cherry', 20), makeSymbol('gem', 10),    makeSymbol('crown', 10),  makeSymbol('clover', 10), makeSymbol('lucky7', 10)],
      [makeSymbol('lemon', 10),  makeSymbol('coin', 10),   makeSymbol('gem', 10),    makeSymbol('crown', 10), makeSymbol('clover', 10)],
    ]
    expect(calculateGroupScore(grid)).toBe(-60)
  })

  test('V자(∨) 패턴(groupValue=10) → 10×5×5 = 250', () => {
    const grid = [
      [makeSymbol('cherry', 10), makeSymbol('lemon',  10), makeSymbol('clover',  10), makeSymbol('crown',  10), makeSymbol('cherry', 10)],
      [makeSymbol('coin',   10), makeSymbol('cherry', 10), makeSymbol('gem',    10), makeSymbol('cherry', 10), makeSymbol('skull',  10)],
      [makeSymbol('lucky7', 10), makeSymbol('clover',  10), makeSymbol('cherry', 10), makeSymbol('lemon',  10), makeSymbol('crown',  10)],
    ]
    expect(calculateGroupScore(grid)).toBe(250)
  })

  test('역V자(∧) 패턴(groupValue=10) → 10×5×5 = 250', () => {
    const grid = [
      [makeSymbol('lemon', 10),  makeSymbol('coin', 10),  makeSymbol('clover', 10), makeSymbol('cherry', 10), makeSymbol('lemon', 10)],
      [makeSymbol('coin', 10),   makeSymbol('clover', 10), makeSymbol('lemon', 10), makeSymbol('clover', 10),  makeSymbol('coin', 10)],
      [makeSymbol('clover', 10),  makeSymbol('lemon', 10), makeSymbol('coin', 10),  makeSymbol('cherry', 10), makeSymbol('clover', 10)],
    ]
    expect(calculateGroupScore(grid)).toBe(250)
  })

  test('풀 하우스(groupValue=10) → 10×15×10 = 1500', () => {
    const grid = Array.from({ length: 3 }, () =>
      Array.from({ length: 5 }, () => makeSymbol('coin', 10)),
    )
    expect(calculateGroupScore(grid)).toBe(1500)
  })

  test('symbol_score_multiply 적용: cherry×2 → 40×3×1 = 120', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'clover', 'coin'],
      ['lemon',  'gem',    'crown',  'skull', 'lucky7'],
      ['clover',  'lemon',  'coin',   'gem',   'crown'],
    ], 20)
    const effects: Effect[] = [
      { type: 'symbol_score_multiply', value: 2, duration: 'permanent', targetSymbol: 'cherry', description: 'cherry ×2' },
    ]
    expect(calculateGroupScore(grid, effects)).toBe(120) // 20×2 × 3 × 1
  })
})

describe('calculateScore', () => {
  test('그룹 없을 때 이펙트도 없으면 total=0', () => {
    const grid = makeGrid([
      ['cherry', 'clover',  'lemon', 'coin',  'gem'],
      ['crown',  'lucky7', 'skull', 'lemon', 'cherry'],
      ['clover',  'lemon',  'coin',  'gem',   'crown'],
    ])
    const result = calculateScore(grid, [])
    expect(result.groupScore).toBe(0)
    expect(result.total).toBe(0)
  })

  test('가로 3개(groupValue=20) + 이펙트 없음 → total=60', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'clover', 'coin'],
      ['lemon',  'gem',    'crown',  'skull', 'lucky7'],
      ['clover',  'lemon',  'coin',   'gem',   'crown'],
    ], 20)
    const result = calculateScore(grid, [])
    expect(result.total).toBe(60)
  })

  test('score_multiply 2배 이펙트 적용', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'clover', 'coin'],
      ['lemon',  'gem',    'crown',  'skull', 'lucky7'],
      ['clover',  'lemon',  'coin',   'gem',   'crown'],
    ], 20)
    const effect: Effect = { type: 'score_multiply', value: 2, duration: 'permanent', description: '2배' }
    const result = calculateScore(grid, [effect])
    expect(result.total).toBe(120) // 60 × 2
  })

  test('symbol_score_multiply + score_multiply 중첩', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'clover', 'coin'],
      ['lemon',  'gem',    'crown',  'skull', 'lucky7'],
      ['clover',  'lemon',  'coin',   'gem',   'crown'],
    ], 20)
    const effects: Effect[] = [
      { type: 'symbol_score_multiply', value: 2, duration: 'permanent', targetSymbol: 'cherry', description: 'cherry ×2' },
      { type: 'score_multiply', value: 2, duration: 'permanent', description: '전체 ×2' },
    ]
    const result = calculateScore(grid, effects)
    expect(result.total).toBe(240) // (20×2 × 3 × 1) × 2
  })
})
