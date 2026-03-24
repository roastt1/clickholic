import { getAdjacentSymbols, findConnectedGroups, ROWS, COLS } from '@/lib/engine/grid'
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
    ['cherry', 'grape',  'lemon',  'coin',  'gem'],
    ['crown',  'lucky7', 'skull',  'lemon', 'cherry'],
    ['grape',  'lemon',  'cherry', 'coin',  'gem'],
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

describe('findConnectedGroups', () => {
  test('연결된 같은 심볼 3개 → 그룹 1개 반환', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'grape',  'gem'],
      ['lemon',  'coin',   'gem',    'crown',  'skull'],
      ['skull',  'lemon',  'grape',  'coin',   'gem'],
    ])
    const groups = findConnectedGroups(grid)
    expect(groups).toHaveLength(1)
    expect(groups[0].type).toBe('cherry')
    expect(groups[0].size).toBe(3)
  })

  test('연결된 심볼 2개는 그룹으로 인정하지 않음', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'grape',  'lemon', 'coin'],
      ['gem',    'crown',  'lucky7', 'skull', 'lemon'],
      ['grape',  'lemon',  'cherry', 'coin',  'gem'],
    ])
    const groups = findConnectedGroups(grid)
    expect(groups).toHaveLength(0)
  })

  test('ㄴ자 모양 4개 연결도 1그룹으로 탐지', () => {
    const grid = makeGrid([
      ['cherry', 'grape',  'lemon',  'coin',  'gem'],
      ['cherry', 'cherry', 'lemon',  'crown', 'skull'],
      ['skull',  'cherry', 'grape',  'coin',  'gem'],
    ])
    const groups = findConnectedGroups(grid)
    expect(groups).toHaveLength(1)
    expect(groups[0].type).toBe('cherry')
    expect(groups[0].size).toBe(4)
  })

  test('독립된 두 그룹(각 3개)은 별도로 탐지', () => {
    const grid = makeGrid([
      ['cherry', 'cherry', 'cherry', 'grape', 'grape'],
      ['lemon',  'coin',   'gem',    'grape', 'skull'],
      ['skull',  'lucky7', 'lemon',  'coin',  'gem'],
    ])
    const groups = findConnectedGroups(grid)
    expect(groups).toHaveLength(2)
    const types = groups.map((g) => g.type).sort()
    expect(types).toEqual(['cherry', 'grape'])
  })

  test('그리드 전체가 같은 심볼이면 1그룹(size=15)', () => {
    const grid = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => makeSymbol('coin')),
    )
    const groups = findConnectedGroups(grid)
    expect(groups).toHaveLength(1)
    expect(groups[0].size).toBe(15)
  })
})
