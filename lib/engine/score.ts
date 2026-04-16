import type { SlotSymbol } from '@/types/symbol'
import type { SymbolType } from '@/types/symbol'
import type { Effect } from '@/types/effect'
import type { PatternBreakdown } from '@/types/game'
import { findLines, detectVShapes, isFullHouse } from './grid'

export interface ScoreBreakdown {
  groupScore: number  // 연결 그룹 점수 합
  effectBonus: number
  total: number
  patternFlags: {
    hasFullHouse: boolean
    hasVShape: boolean
    lineCount: number
  }
  patternBreakdowns: PatternBreakdown[]
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

interface GroupScoreResult {
  total: number
  breakdowns: PatternBreakdown[]
}

export function calculateGroupScore(grid: SlotSymbol[][], effects: Effect[] = []): GroupScoreResult {
  const fullHouseBreakdowns: PatternBreakdown[] = []

  // 풀 하우스: 15개 전체 동일 → ×10 보너스 (다른 패턴 계산도 계속 진행)
  if (isFullHouse(grid)) {
    const score = grid.flat().reduce((sum, s) => {
      const multiplier = getSymbolScoreMultiplier(s.type, effects)
      return sum + s.groupValue * multiplier
    }, 0) * 10

    const allPositions: Array<[number, number]> = Array.from(
      { length: 3 * 5 },
      (_, i) => [Math.floor(i / 5), i % 5] as [number, number],
    )

    fullHouseBreakdowns.push({ type: 'fullhouse', positions: allPositions, score, label: 'JACKPOT ×10' })
  }

  // 모든 패턴 독립 계산 — V자 셀 제외 없이 직선 탐지
  const vShapes = detectVShapes(grid)
  const lines = findLines(grid)

  const lineBreakdowns: PatternBreakdown[] = lines.map((line) => {
    const mult = getLineMultiplier(line.size)
    return {
      type:      'line' as const,
      positions: line.positions,
      score:     sumGroupValues(grid, line.positions, effects) * mult,
      label:     mult === 1 ? 'LINE' : `LINE ×${mult}`,
    }
  })

  const vBreakdowns: PatternBreakdown[] = vShapes.map((v) => ({
    type:      'vshape' as const,
    positions: v.positions,
    score:     sumGroupValues(grid, v.positions, effects) * 5,
    label:     'V-SHAPE ×5',
  }))

  // 점수 낮은 순 정렬 후 JACKPOT은 맨 마지막 (빌드업 효과)
  const otherBreakdowns = [...lineBreakdowns, ...vBreakdowns].sort((a, b) => a.score - b.score)
  const breakdowns = [...otherBreakdowns, ...fullHouseBreakdowns]

  const total = breakdowns.reduce((sum, b) => sum + b.score, 0)

  return { total, breakdowns }
}

export function calculateScore(
  grid: SlotSymbol[][],
  effects: Effect[],
): ScoreBreakdown {
  const { total: groupScore, breakdowns } = calculateGroupScore(grid, effects)

  // score_multiply는 순차 곱셈
  const scoreMultiplier = effects
    .filter((e) => e.type === 'score_multiply')
    .reduce((acc, e) => acc * e.value, 1)

  // 패턴별 점수에 배수 반영 (소수점 유지 — floor는 UI 표시 시점에만)
  const scaledBreakdowns = breakdowns.map((b) => ({
    ...b,
    score: b.score * scoreMultiplier,
  }))

  // total도 소수점 유지: 누적 시 반올림 손실 방지
  const total = groupScore * scoreMultiplier

  const patternFlags = {
    hasFullHouse: breakdowns.some((b) => b.type === 'fullhouse'),
    hasVShape:    breakdowns.some((b) => b.type === 'vshape'),
    lineCount:    breakdowns.filter((b) => b.type === 'line').length,
  }

  return { groupScore, effectBonus: 0, total, patternFlags, patternBreakdowns: scaledBreakdowns }
}
