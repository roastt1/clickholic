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
const DIRECTIONS: Array<[number, number]> = [
  [-1, 0], // 위
  [1, 0],  // 아래
  [0, -1], // 왼쪽
  [0, 1],  // 오른쪽
]

export function getAdjacentSymbols(
  grid: SlotSymbol[][],
  row: number,
  col: number,
): SlotSymbol[] {
  return DIRECTIONS
    .map(([dr, dc]) => grid[row + dr]?.[col + dc])
    .filter((s): s is SlotSymbol => s !== undefined)
}

/**
 * BFS로 같은 타입의 인접 심볼 그룹을 모두 탐색
 * 3개 이상인 그룹만 반환
 */
export function findConnectedGroups(grid: SlotSymbol[][]): ConnectedGroup[] {
  const visited = Array.from({ length: ROWS }, () => new Array(COLS).fill(false))
  const groups: ConnectedGroup[] = []

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (visited[row][col]) continue

      const symbol = grid[row][col]
      const positions = bfs(grid, visited, row, col, symbol.type)

      if (positions.length >= 3) {
        groups.push({ type: symbol.type, positions, size: positions.length })
      }
    }
  }

  return groups
}

function bfs(
  grid: SlotSymbol[][],
  visited: boolean[][],
  startRow: number,
  startCol: number,
  targetType: SymbolType,
): Array<[number, number]> {
  const queue: Array<[number, number]> = [[startRow, startCol]]
  const positions: Array<[number, number]> = []
  visited[startRow][startCol] = true

  while (queue.length > 0) {
    const next = queue.shift()
    if (!next) break
    const [row, col] = next
    positions.push([row, col])

    for (const [dr, dc] of DIRECTIONS) {
      const nr = row + dr
      const nc = col + dc

      if (
        nr >= 0 && nr < ROWS &&
        nc >= 0 && nc < COLS &&
        !visited[nr][nc] &&
        grid[nr][nc].type === targetType
      ) {
        visited[nr][nc] = true
        queue.push([nr, nc])
      }
    }
  }

  return positions
}
