import {
  getAdjacentSymbols,
  findLines,
  detectVShapes,
  isFullHouse,
  ROWS,
  COLS,
} from '@/lib/engine/grid'
import type { SlotSymbol } from '@/types/symbol'

function makeSymbol(type: SlotSymbol['type'], id = type): SlotSymbol {
  return { id, type, tier: 'L1', groupValue: 10 }
}

function makeGrid(types: string[][]): SlotSymbol[][] {
  return types.map((row) =>
    row.map((t) => makeSymbol(t as SlotSymbol['type'])),
  )
}

describe('getAdjacentSymbols', () => {
  const grid = makeGrid([
    ['cherry', 'clover',  'lemon',  'coin',  'gem'],
    ['crown',  'lucky7', 'skull',  'lemon', 'cherry'],
    ['clover',  'lemon',  'cherry', 'coin',  'gem'],
  ])

  test('중앙 셀은 4개 인접 심볼 반환', () => {
    const adj = getAdjacentSymbols(grid, 1, 2) // skull
    expect(adj).toHaveLength(4)
  })

  test('모서리 셀(0,0)은 2개 인접 심볼 반환', () => {
    const adj = getAdjacentSymbols(grid, 0, 0) // cherry
    expect(adj).toHaveLength(2)
  })

  test('가장자리 셀(0,2)은 3개 인접 심볼 반환', () => {
    const adj = getAdjacentSymbols(grid, 0, 2) // lemon
    expect(adj).toHaveLength(3)
  })
})

describe('findLines', () => {
  test('가로 3개 직선 탐지', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'clover', 'coin'],
      ['lemon',  'gem',    'crown',  'skull', 'lucky7'],
      ['clover',  'lemon',  'coin',   'gem',   'crown'],
    ])
    const lines = findLines(grid)
    expect(lines).toHaveLength(1)
    expect(lines[0].type).toBe('cherry')
    expect(lines[0].size).toBe(3)
  })

  test('가로 4개 직선 탐지', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'cherry', 'coin'],
      ['lemon',  'gem',    'crown',  'skull',  'lucky7'],
      ['clover',  'lemon',  'coin',   'gem',    'crown'],
    ])
    const lines = findLines(grid)
    expect(lines).toHaveLength(1)
    expect(lines[0].type).toBe('cherry')
    expect(lines[0].size).toBe(4)
  })

  test('가로 5개 전체 행 탐지', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'cherry', 'cherry'],
      ['lemon',  'gem',    'crown',  'skull',  'lucky7'],
      ['clover',  'lemon',  'coin',   'gem',    'crown'],
    ])
    const lines = findLines(grid)
    expect(lines).toHaveLength(1)
    expect(lines[0].size).toBe(5)
  })

  test('세로 3개 직선 탐지', () => {
    const grid = makeGrid([
      ['cherry', 'clover', 'lemon', 'coin', 'gem'],
      ['cherry', 'gem',   'crown', 'skull', 'lucky7'],
      ['cherry', 'lemon', 'coin',  'gem',   'crown'],
    ])
    const lines = findLines(grid)
    expect(lines).toHaveLength(1)
    expect(lines[0].type).toBe('cherry')
    expect(lines[0].size).toBe(3)
  })

  test('대각선(↘) 3개 직선 탐지', () => {
    const grid = makeGrid([
      ['cherry', 'clover', 'lemon', 'coin', 'gem'],
      ['lemon',  'cherry', 'crown', 'skull', 'lucky7'],
      ['clover',  'lemon',  'cherry', 'gem',  'crown'],
    ])
    const lines = findLines(grid)
    expect(lines).toHaveLength(1)
    expect(lines[0].type).toBe('cherry')
    expect(lines[0].size).toBe(3)
  })

  test('대각선(↙) 3개 직선 탐지', () => {
    const grid = makeGrid([
      ['clover',  'lemon', 'cherry', 'coin', 'gem'],
      ['lemon',  'cherry', 'crown', 'skull', 'lucky7'],
      ['cherry', 'lemon',  'coin',  'gem',   'crown'],
    ])
    const lines = findLines(grid)
    expect(lines).toHaveLength(1)
    expect(lines[0].type).toBe('cherry')
    expect(lines[0].size).toBe(3)
  })

  test('2개 직선은 탐지하지 않음', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'clover',  'lemon', 'coin'],
      ['gem',    'crown',  'lucky7', 'skull', 'lemon'],
      ['clover',  'lemon',  'cherry', 'coin',  'gem'],
    ])
    const lines = findLines(grid)
    expect(lines).toHaveLength(0)
  })

  test('독립된 두 가로 직선 각각 탐지', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'clover', 'clover'],
      ['lemon',  'coin',   'gem',    'crown', 'skull'],
      ['clover',  'clover',  'clover',  'coin',  'gem'],
    ])
    const lines = findLines(grid)
    expect(lines).toHaveLength(2)
    const types = lines.map((l) => l.type).sort()
    expect(types).toEqual(['cherry', 'clover'])
  })

  test('excludedCells가 있으면 해당 셀 제외 후 탐지', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'clover', 'coin'],
      ['lemon',  'gem',    'crown',  'skull', 'lucky7'],
      ['clover',  'lemon',  'coin',   'gem',   'crown'],
    ])
    const excluded = new Set(['0,0', '0,1', '0,2'])
    const lines = findLines(grid, excluded)
    expect(lines).toHaveLength(0)
  })
})

describe('detectVShapes', () => {
  test('V자(∨) 패턴 탐지', () => {
    // (0,0)(1,1)(2,2)(1,3)(0,4) 모두 cherry
    const grid = makeGrid([
      ['cherry', 'lemon',  'clover', 'coin',   'cherry'],
      ['clover',  'cherry', 'coin',  'cherry', 'lemon'],
      ['lemon',  'coin',   'cherry','clover',  'gem'],
    ])
    const vShapes = detectVShapes(grid)
    expect(vShapes).toHaveLength(1)
    expect(vShapes[0].type).toBe('cherry')
    expect(vShapes[0].size).toBe(5)
  })

  test('역V자(∧) 패턴 탐지', () => {
    // (2,0)(1,1)(0,2)(1,3)(2,4) 모두 clover
    const grid = makeGrid([
      ['lemon',  'coin',  'clover', 'cherry',  'lemon'],
      ['coin',   'clover', 'lemon', 'clover',   'coin'],
      ['clover',  'lemon', 'coin',  'cherry',  'clover'],
    ])
    const vShapes = detectVShapes(grid)
    expect(vShapes).toHaveLength(1)
    expect(vShapes[0].type).toBe('clover')
  })

  test('V자 패턴 없으면 빈 배열 반환', () => {
    const grid = makeGrid([
      ['cherry', 'clover',  'lemon', 'coin',  'gem'],
      ['crown',  'lucky7', 'skull', 'lemon', 'cherry'],
      ['clover',  'lemon',  'coin',  'gem',   'crown'],
    ])
    expect(detectVShapes(grid)).toHaveLength(0)
  })
})

describe('isFullHouse', () => {
  test('15개 전체 동일 심볼 → true', () => {
    const grid = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => makeSymbol('coin')),
    )
    expect(isFullHouse(grid)).toBe(true)
  })

  test('한 개라도 다른 심볼 → false', () => {
    const grid = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => makeSymbol('coin')),
    )
    grid[2][4] = makeSymbol('gem')
    expect(isFullHouse(grid)).toBe(false)
  })
})
