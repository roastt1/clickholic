import type { SlotSymbol, SymbolType } from '@/types/symbol'

export const ROWS = 3
export const COLS = 5

export interface ConnectedGroup {
  type: SymbolType
  positions: Array<[number, number]> // [row, col]
  size: number
}

/**
 * 상하좌우 인접한 심볼 반환 (경계 자동 처리)
 */
const ADJACENT_DIRS: Array<[number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

export function getAdjacentSymbols(
  grid: SlotSymbol[][],
  row: number,
  col: number,
): SlotSymbol[] {
  return ADJACENT_DIRS
    .map(([dr, dc]) => grid[row + dr]?.[col + dc])
    .filter((s): s is SlotSymbol => s !== undefined)
}

/**
 * 직선 스캔 방향 (각 방향의 반대는 시작점 계산으로 자동 처리)
 */
const LINE_SCAN_DIRS: Array<[number, number]> = [
  [0, 1],   // 가로 →
  [1, 0],   // 세로 ↓
  [1, 1],   // 대각선 ↘
  [1, -1],  // 대각선 ↙
]

/**
 * V자/역V자 패턴 좌표 (3×5 그리드 기준 정확히 2가지)
 *
 * ∨ (V자):          ∧ (역V자):
 * X _ _ _ X         _ _ X _ _
 * _ X _ X _         _ X _ X _
 * _ _ X _ _         X _ _ _ X
 */
const V_PATTERNS: Array<Array<[number, number]>> = [
  [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]], // ∨
  [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4]], // ∧
]

/**
 * 같은 심볼의 직선(가로/세로/대각선) 3개 이상 연결을 모두 탐지.
 * excludedCells 에 포함된 셀은 스캔에서 제외.
 */
export function findLines(
  grid: SlotSymbol[][],
  excludedCells: Set<string> = new Set(),
): ConnectedGroup[] {
  const lines: ConnectedGroup[] = []

  for (const [dr, dc] of LINE_SCAN_DIRS) {
    for (let startRow = 0; startRow < ROWS; startRow++) {
      for (let startCol = 0; startCol < COLS; startCol++) {
        // 이전 셀이 그리드 안에 있으면 중간 지점 → 시작점 아님
        const prevRow = startRow - dr
        const prevCol = startCol - dc
        if (
          prevRow >= 0 && prevRow < ROWS &&
          prevCol >= 0 && prevCol < COLS
        ) continue

        // 이 방향의 직선을 따라 같은 타입의 연속 구간을 수집
        let r = startRow
        let c = startCol
        let currentType: SymbolType | null = null
        let currentPositions: Array<[number, number]> = []

        while (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
          const cellKey = `${r},${c}`

          if (!excludedCells.has(cellKey) && grid[r][c].type === currentType) {
            currentPositions.push([r, c])
          } else {
            if (currentPositions.length >= 3) {
              lines.push({
                type: currentType!,
                positions: [...currentPositions],
                size: currentPositions.length,
              })
            }
            if (!excludedCells.has(cellKey)) {
              currentType = grid[r][c].type
              currentPositions = [[r, c]]
            } else {
              currentType = null
              currentPositions = []
            }
          }

          r += dr
          c += dc
        }

        if (currentPositions.length >= 3) {
          lines.push({
            type: currentType!,
            positions: currentPositions,
            size: currentPositions.length,
          })
        }
      }
    }
  }

  return lines
}

/**
 * V자/역V자 특수 패턴 탐지.
 * 5개 셀이 정확히 V 또는 역V 형태를 이루면 반환.
 */
export function detectVShapes(grid: SlotSymbol[][]): ConnectedGroup[] {
  const result: ConnectedGroup[] = []

  for (const pattern of V_PATTERNS) {
    const [r0, c0] = pattern[0]
    const type = grid[r0][c0].type
    if (pattern.every(([r, c]) => grid[r][c].type === type)) {
      result.push({ type, positions: pattern, size: 5 })
    }
  }

  return result
}

/**
 * 풀 하우스: 15개 심볼이 모두 동일한 타입인지 확인
 */
export function isFullHouse(grid: SlotSymbol[][]): boolean {
  const flat = grid.flat()
  const type = flat[0].type
  return flat.every((s) => s.type === type)
}
