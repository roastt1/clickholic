import type { SlotSymbol } from '@/types/symbol'
import type { Effect } from '@/types/effect'
import { findConnectedGroups } from './grid'

export interface ScoreBreakdown {
  base: number
  groupBonus: number
  effectBonus: number
  total: number
}

// 연결 개수별 배율
const GROUP_MULTIPLIERS: Record<number, number> = {
  3: 2,
  4: 3,
}
const GROUP_MULTIPLIER_MAX = 5 // 5개 이상

function getGroupMultiplier(size: number): number {
  return GROUP_MULTIPLIERS[size] ?? GROUP_MULTIPLIER_MAX
}

export function calculateBaseScore(grid: SlotSymbol[][]): number {
  return grid.flat().reduce((sum, symbol) => sum + symbol.baseScore, 0)
}

export function calculateGroupBonus(grid: SlotSymbol[][]): number {
  const groups = findConnectedGroups(grid)

  return groups.reduce((bonus, group) => {
    // 그룹 내 심볼 baseScore 합 × 배율로 추가 보너스 계산
    const groupBaseScore = group.positions.reduce(
      (sum, [row, col]) => sum + grid[row][col].baseScore,
      0,
    )
    const multiplier = getGroupMultiplier(group.size)
    return bonus + groupBaseScore * (multiplier - 1) // 기본 점수에서 추가되는 부분만
  }, 0)
}

export function calculateScore(
  grid: SlotSymbol[][],
  effects: Effect[],
): ScoreBreakdown {
  const base = calculateBaseScore(grid)
  const groupBonus = calculateGroupBonus(grid)
  const subtotal = base + groupBonus

  let effectBonus = 0
  let multipliedTotal = subtotal

  for (const effect of effects) {
    if (effect.type === 'score_multiply') {
      multipliedTotal = multipliedTotal * effect.value
    } else if (effect.type === 'score_add') {
      effectBonus += effect.value
    }
  }

  const total = Math.floor(multipliedTotal + effectBonus)

  return { base, groupBonus, effectBonus, total }
}
