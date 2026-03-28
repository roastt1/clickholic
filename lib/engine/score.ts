import type { SlotSymbol } from '@/types/symbol'
import type { SymbolType } from '@/types/symbol'
import type { Effect } from '@/types/effect'
import { findLines, detectVShapes, isFullHouse } from './grid'

export interface ScoreBreakdown {
  groupScore: number  // 연결 그룹 점수 합
  effectBonus: number
  total: number
}

// 직선 길이별 배율 (3→×1, 4→×2, 5→×3)
function getLineMultiplier(size: number): number {
  if (size >= 5) return 3
  if (size === 4) return 2
  return 1
}

/**
 * symbol_score_multiply 효과에서 특정 심볼의 점수 배수 계산
 * 같은 심볼에 여러 배수가 있으면 곱셈 적용
 */
export function getSymbolScoreMultiplier(type: SymbolType, effects: Effect[]): number {
  return effects
    .filter((e) => e.type === 'symbol_score_multiply' && e.targetSymbol === type)
    .reduce((acc, e) => acc * e.value, 1)
}

function sumGroupValues(
  grid: SlotSymbol[][],
  positions: Array<[number, number]>,
  effects: Effect[],
): number {
  return positions.reduce((sum, [r, c]) => {
    const symbol = grid[r][c]
    const multiplier = getSymbolScoreMultiplier(symbol.type, effects)
    return sum + symbol.groupValue * multiplier
  }, 0)
}

export function calculateGroupScore(grid: SlotSymbol[][], effects: Effect[] = []): number {
  // 풀 하우스: 15개 전체 동일 → ×10
  if (isFullHouse(grid)) {
    return grid.flat().reduce((sum, s) => {
      const multiplier = getSymbolScoreMultiplier(s.type, effects)
      return sum + s.groupValue * multiplier
    }, 0) * 10
  }

  // V자/역V자 탐지 → 해당 셀을 직선 탐지에서 제외해 중복 계산 방지
  const vShapes = detectVShapes(grid)
  const vShapeCells = new Set(
    vShapes.flatMap((v) => v.positions.map(([r, c]) => `${r},${c}`)),
  )

  // V자 셀을 제외한 직선 탐지
  const lines = findLines(grid, vShapeCells)

  const vScore = vShapes.reduce(
    (sum, v) => sum + sumGroupValues(grid, v.positions, effects) * 5,
    0,
  )

  const lineScore = lines.reduce(
    (sum, line) =>
      sum + sumGroupValues(grid, line.positions, effects) * getLineMultiplier(line.size),
    0,
  )

  return vScore + lineScore
}

export function calculateScore(
  grid: SlotSymbol[][],
  effects: Effect[],
): ScoreBreakdown {
  const groupScore = calculateGroupScore(grid, effects)

  // score_multiply는 순차 곱셈, effectBonus는 없음 (라운드 기반에서 score_add 제거)
  const multipliedTotal = effects
    .filter((e) => e.type === 'score_multiply')
    .reduce((acc, e) => acc * e.value, groupScore)

  const total = Math.floor(multipliedTotal)

  return { groupScore, effectBonus: 0, total }
}
