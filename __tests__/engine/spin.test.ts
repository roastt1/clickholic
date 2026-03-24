import { generateGrid, executeSpin } from '@/lib/engine/spin'
import { ROWS, COLS } from '@/lib/engine/grid'
import type { SlotSymbol } from '@/types/symbol'

function makeSymbol(type: SlotSymbol['type']): SlotSymbol {
  return { id: type, type, rarity: 'common', baseScore: 10 }
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

  test('score는 양수', () => {
    const result = executeSpin(symbolPool, [])
    expect(result.score).toBeGreaterThan(0)
  })
})
