import { generateGrid, executeSpin } from '@/lib/engine/spin'
import { ROWS, COLS } from '@/lib/engine/grid'
import type { SlotSymbol } from '@/types/symbol'

function makeSymbol(type: SlotSymbol['type']): SlotSymbol {
  return { id: type, type, tier: 'L1', groupValue: 10 }
}

const symbolPool: SlotSymbol[] = [
  makeSymbol('cherry'),
  makeSymbol('grape'),
  makeSymbol('lemon'),
]

describe('generateGrid', () => {
  test(`항상 ${ROWS}×${COLS} 그리드 반환`, () => {
    const grid = generateGrid(symbolPool)
    expect(grid).toHaveLength(ROWS)
    grid.forEach((row) => expect(row).toHaveLength(COLS))
  })

  test('심볼 풀에 있는 타입만 포함', () => {
    const grid = generateGrid(symbolPool)
    const validTypes = symbolPool.map((s) => s.type)
    grid.flat().forEach((symbol) => {
      expect(validTypes).toContain(symbol.type)
    })
  })

  test('원본 symbolPool 심볼 객체를 직접 참조하지 않음 (불변)', () => {
    const grid = generateGrid(symbolPool)
    grid.flat().forEach((symbol) => {
      expect(symbolPool).not.toContain(symbol)
    })
  })

  test('빈 풀이면 에러', () => {
    expect(() => generateGrid([])).toThrow('symbolPool is empty')
  })
})

describe('executeSpin', () => {
  test('SpinResult의 symbols가 3×5', () => {
    const result = executeSpin(symbolPool, [])
    expect(result.symbols).toHaveLength(ROWS)
    result.symbols.forEach((row) => expect(row).toHaveLength(COLS))
  })

  test('score는 0 이상 (그룹 없으면 0, 있으면 양수)', () => {
    const result = executeSpin(symbolPool, [])
    expect(result.score).toBeGreaterThanOrEqual(0)
  })

  test('score_add 이펙트가 score에 반영', () => {
    const effect = { type: 'score_add' as const, value: 500, duration: 'permanent' as const, description: '+500' }
    const result = executeSpin(symbolPool, [effect])
    expect(result.score).toBeGreaterThanOrEqual(500)
  })

  test('bonuses에 score 관련 이펙트만 포함', () => {
    const scoreEffect = { type: 'score_multiply' as const, value: 2, duration: 'next_spin' as const, description: '2배' }
    const otherEffect = { type: 'deck_modify' as const, value: 1, duration: 'permanent' as const, description: 'deck' }
    const result = executeSpin(symbolPool, [scoreEffect, otherEffect])
    expect(result.bonuses).toHaveLength(1)
    expect(result.bonuses[0].type).toBe('score_multiply')
  })
})
