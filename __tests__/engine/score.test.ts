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
      ['cherry', 'grape',  'lemon', 'coin',  'gem'],
      ['crown',  'lucky7', 'skull', 'lemon', 'cherry'],
      ['grape',  'lemon',  'coin',  'gem',   'crown'],
    ])
    expect(calculateGroupScore(grid)).toBe(0)
  })

  test('cherry 3개 연결(groupValue=20) → 20×3×1 = 60', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'grape', 'coin'],
      ['lemon',  'gem',    'crown',  'skull', 'lucky7'],
      ['grape',  'lemon',  'coin',   'gem',   'crown'],
    ], 20)
    expect(calculateGroupScore(grid)).toBe(60)
  })

  test('cherry 4개 연결(groupValue=20) → 20×4×2 = 160', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'cherry', 'coin'],
      ['lemon',  'gem',    'crown',  'skull',  'lucky7'],
      ['grape',  'lemon',  'coin',   'gem',    'crown'],
    ], 20)
    expect(calculateGroupScore(grid)).toBe(160)
  })

  test('cherry 5개 이상 연결(groupValue=20) → 20×5×4 = 400', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'cherry', 'cherry'],
      ['lemon',  'gem',    'crown',  'skull',  'lucky7'],
      ['grape',  'lemon',  'coin',   'gem',    'crown'],
    ], 20)
    expect(calculateGroupScore(grid)).toBe(400)
  })

  test('skull 3개 연결(groupValue=-20) → 감점 -60', () => {
    const grid = [
      [makeSymbol('skull', -20), makeSymbol('skull', -20), makeSymbol('skull', -20), makeSymbol('lemon', 10), makeSymbol('coin', 10)],
      [makeSymbol('cherry', 20), makeSymbol('gem', 10),    makeSymbol('crown', 10),  makeSymbol('grape', 10), makeSymbol('lucky7', 10)],
      [makeSymbol('lemon', 10),  makeSymbol('coin', 10),   makeSymbol('gem', 10),    makeSymbol('crown', 10), makeSymbol('grape', 10)],
    ]
    expect(calculateGroupScore(grid)).toBe(-60)
  })
})

describe('calculateScore', () => {
  test('그룹 없을 때 이펙트도 없으면 total=0', () => {
    const grid = makeGrid([
      ['cherry', 'grape',  'lemon', 'coin',  'gem'],
      ['crown',  'lucky7', 'skull', 'lemon', 'cherry'],
      ['grape',  'lemon',  'coin',  'gem',   'crown'],
    ])
    const result = calculateScore(grid, [])
    expect(result.groupScore).toBe(0)
    expect(result.total).toBe(0)
  })

  test('cherry 3개(groupValue=20) + 이펙트 없음 → total=60', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'grape', 'coin'],
      ['lemon',  'gem',    'crown',  'skull', 'lucky7'],
      ['grape',  'lemon',  'coin',   'gem',   'crown'],
    ], 20)
    const result = calculateScore(grid, [])
    expect(result.total).toBe(60)
  })

  test('score_multiply 2배 이펙트 적용', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'grape', 'coin'],
      ['lemon',  'gem',    'crown',  'skull', 'lucky7'],
      ['grape',  'lemon',  'coin',   'gem',   'crown'],
    ], 20)
    const effect: Effect = { type: 'score_multiply', value: 2, duration: 'next_spin', description: '2배' }
    const result = calculateScore(grid, [effect])
    expect(result.total).toBe(120) // 60 × 2
  })

  test('score_add 이펙트 적용', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'grape', 'coin'],
      ['lemon',  'gem',    'crown',  'skull', 'lucky7'],
      ['grape',  'lemon',  'coin',   'gem',   'crown'],
    ], 20)
    const effect: Effect = { type: 'score_add', value: 50, duration: 'permanent', description: '+50' }
    const result = calculateScore(grid, [effect])
    expect(result.total).toBe(110) // 60 + 50
  })
})
