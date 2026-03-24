import type { SlotSymbol } from '@/types/symbol'
import type { Effect } from '@/types/effect'
import { findConnectedGroups } from './grid'

export interface ScoreBreakdown {
  groupScore: number  // 연결 그룹 점수 합 (음수 가능)
  effectBonus: number
  total: number
}

// 연결 개수별 배율 (3→×1, 4→×2, 5+→×4)
const GROUP_SIZE_MULTIPLIERS: Record<number, number> = {
  3: 1,
  4: 2,
}
const GROUP_SIZE_MULTIPLIER_MAX = 4 // 5개 이상

function getSizeMultiplier(size: number): number {
  return GROUP_SIZE_MULTIPLIERS[size] ?? GROUP_SIZE_MULTIPLIER_MAX
}

export function calculateGroupScore(grid: SlotSymbol[][]): number {
  const groups = findConnectedGroups(grid)

  return groups.reduce((total, group) => {
    const groupValueSum = group.positions.reduce(
      (sum, [row, col]) => sum + grid[row][col].groupValue,
      0,
    )
    return total + groupValueSum * getSizeMultiplier(group.size)
  }, 0)
}

export function calculateScore(
  grid: SlotSymbol[][],
  effects: Effect[],
): ScoreBreakdown {
  const groupScore = calculateGroupScore(grid)

  // score_multiply는 순차 곱셈 (2×후 3× = 6×), score_add는 곱셈 후 합산
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
