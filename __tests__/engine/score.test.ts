import { calculateBaseScore, calculateGroupBonus, calculateScore } from '@/lib/engine/score'
import type { SlotSymbol } from '@/types/symbol'
import type { Effect } from '@/types/effect'

function makeSymbol(type: SlotSymbol['type'], baseScore: number): SlotSymbol {
  return { id: type, type, rarity: 'common', baseScore }
}

function makeGrid(types: string[][], baseScore = 10): SlotSymbol[][] {
  return types.map((row) =>
    row.map((t) => makeSymbol(t as SlotSymbol['type'], baseScore)),
  )
}

describe('calculateBaseScore', () => {
  test('15개 심볼 baseScore 합산', () => {
    const grid = makeGrid([
      ['cherry', 'grape',  'lemon',  'orange', 'coin'],
      ['gem',    'crown',  'bomb',   'skull',  'cherry'],
      ['grape',  'lemon',  'orange', 'coin',   'gem'],
    ], 10)
    expect(calculateBaseScore(grid)).toBe(150) // 15 × 10
  })
})

describe('calculateGroupBonus', () => {
  test('연결 그룹 없으면 보너스 0', () => {
    const grid = makeGrid([
      ['cherry', 'grape',  'lemon',  'orange', 'coin'],
      ['gem',    'crown',  'bomb',   'skull',  'cherry'],
      ['grape',  'lemon',  'orange', 'coin',   'gem'],
    ])
    expect(calculateGroupBonus(grid)).toBe(0)
  })

  test('cherry 3개 연결 → baseScore×(2-1) 보너스', () => {
    // baseScore=10, 3개 연결 → 배율2 → 추가 보너스 = 10×3×(2-1) = 30
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'grape', 'coin'],
      ['lemon',  'gem',    'crown',  'bomb',  'skull'],
      ['orange', 'grape',  'lemon',  'coin',  'gem'],
    ], 10)
    expect(calculateGroupBonus(grid)).toBe(30)
  })

  test('cherry 4개 연결 → baseScore×(3-1) 보너스', () => {
    // baseScore=10, 4개 연결 → 배율3 → 추가 보너스 = 10×4×(3-1) = 80
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'cherry', 'coin'],
      ['lemon',  'gem',    'crown',  'bomb',   'skull'],
      ['orange', 'grape',  'lemon',  'coin',   'gem'],
    ], 10)
    expect(calculateGroupBonus(grid)).toBe(80)
  })

  test('cherry 5개 이상 연결 → 배율5 적용', () => {
    // baseScore=10, 5개 연결 → 배율5 → 추가 보너스 = 10×5×(5-1) = 200
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'cherry', 'cherry'],
      ['lemon',  'gem',    'crown',  'bomb',   'skull'],
      ['orange', 'grape',  'lemon',  'coin',   'gem'],
    ], 10)
    expect(calculateGroupBonus(grid)).toBe(200)
  })
})

describe('calculateScore', () => {
  test('이펙트 없을 때 base + groupBonus = total', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'grape', 'coin'],
      ['lemon',  'gem',    'crown',  'bomb',  'skull'],
      ['orange', 'grape',  'lemon',  'coin',  'gem'],
    ], 10)
    const result = calculateScore(grid, [])
    expect(result.base).toBe(150)
    expect(result.groupBonus).toBe(30)
    expect(result.effectBonus).toBe(0)
    expect(result.total).toBe(180)
  })

  test('score_multiply 2배 이펙트 적용', () => {
    const grid = makeGrid([
      ['cherry', 'grape', 'lemon', 'orange', 'coin'],
      ['gem',    'crown', 'bomb',  'skull',  'cherry'],
      ['grape',  'lemon', 'orange','coin',   'gem'],
    ], 10)
    const effect: Effect = {
      type: 'score_multiply',
      value: 2,
      duration: 'next_spin',
      description: '2배',
    }
    const result = calculateScore(grid, [effect])
    expect(result.total).toBe(300) // 150 × 2
  })

  test('score_add 이펙트 적용', () => {
    const grid = makeGrid([
      ['cherry', 'grape', 'lemon', 'orange', 'coin'],
      ['gem',    'crown', 'bomb',  'skull',  'cherry'],
      ['grape',  'lemon', 'orange','coin',   'gem'],
    ], 10)
    const effect: Effect = {
      type: 'score_add',
      value: 50,
      duration: 'permanent',
      description: '+50',
    }
    const result = calculateScore(grid, [effect])
    expect(result.total).toBe(200) // 150 + 50
  })
})
