import type { SlotSymbol } from '@/types/symbol'
import type { Effect } from '@/types/effect'
import { findLines, detectVShapes, isFullHouse } from './grid'

export interface ScoreBreakdown {
  groupScore: number  // 연결 그룹 점수 합 (음수 가능)
  effectBonus: number
  total: number
}

// 직선 길이별 배율 (3→×1, 4→×2, 5→×3)
function getLineMultiplier(size: number): number {
  if (size >= 5) return 3
  if (size === 4) return 2
  return 1 // 3개
}

function sumGroupValues(
  grid: SlotSymbol[][],
  positions: Array<[number, number]>,
): number {
  return positions.reduce((sum, [r, c]) => sum + grid[r][c].groupValue, 0)
}

export function calculateGroupScore(grid: SlotSymbol[][]): number {
  // 풀 하우스: 15개 전체 동일 → ×10
  if (isFullHouse(grid)) {
    return grid.flat().reduce((sum, s) => sum + s.groupValue, 0) * 10
  }

  // V자/역V자 탐지 → 해당 셀을 직선 탐지에서 제외해 중복 계산 방지
  const vShapes = detectVShapes(grid)
  const vShapeCells = new Set(
    vShapes.flatMap((v) => v.positions.map(([r, c]) => `${r},${c}`)),
  )

  // V자 셀을 제외한 직선 탐지
  const lines = findLines(grid, vShapeCells)

  const vScore = vShapes.reduce(
    (sum, v) => sum + sumGroupValues(grid, v.positions) * 5,
    0,
  )

  const lineScore = lines.reduce(
    (sum, line) =>
      sum + sumGroupValues(grid, line.positions) * getLineMultiplier(line.size),
    0,
  )

  return vScore + lineScore
}

export function calculateScore(
  grid: SlotSymbol[][],
  effects: Effect[],
): ScoreBreakdown {
  const groupScore = calculateGroupScore(grid)

  // score_multiply는 순차 곱셈, score_add는 곱셈 후 합산
  const { multipliedTotal, effectBonus } = effects.reduce(
    (acc, effect) => {
      if (effect.type === 'score_multiply') {
        return { ...acc, multipliedTotal: acc.multipliedTotal * effect.value }
      }
      if (effect.type === 'score_add') {
        return { ...acc, effectBonus: acc.effectBonus + effect.value }
      }
      return acc
    },
    { multipliedTotal: groupScore, effectBonus: 0 },
  )

  const total = Math.floor(multipliedTotal + effectBonus)

  return { groupScore, effectBonus, total }
}
