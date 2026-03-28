import type { SlotSymbol } from '@/types/symbol'
import type { Effect } from '@/types/effect'
import type { SpinResult } from '@/types/game'
import { ROWS, COLS } from './grid'
import { calculateScore } from './score'

/**
 * symbol_rate_up 효과를 반영한 가중치 풀 생성
 * 기본 가중치 1.0, rate_up value만큼 추가 (음수면 감소, -1 이하면 제거)
 */
function buildWeightedPool(
  symbolPool: SlotSymbol[],
  effects: Effect[],
): SlotSymbol[] {
  const rateEffects = effects.filter((e) => e.type === 'symbol_rate_up')

  if (rateEffects.length === 0) return symbolPool

  const weighted: SlotSymbol[] = []

  for (const symbol of symbolPool) {
    const bonus = rateEffects
      .filter((e) => e.targetSymbol === symbol.type)
      .reduce((acc, e) => acc + e.value, 0)

    const weight = (symbol.weight ?? 1) + bonus
    if (weight <= 0) continue // 확률 0 이하 → 풀에서 제거

    // 가중치를 소수점 첫째 자리 단위로 반올림 후 정수 개수로 변환
    // weight 1.0 → 10개, weight 1.5 → 15개, weight 0.5 → 5개
    const count = Math.max(1, Math.round(weight * 10))
    for (let i = 0; i < count; i++) {
      weighted.push(symbol)
    }
  }

  return weighted.length > 0 ? weighted : symbolPool
}

/**
 * 심볼 풀에서 랜덤하게 3×5 그리드 생성 (가중치 적용)
 */
export function generateGrid(
  symbolPool: SlotSymbol[],
  effects: Effect[] = [],
): SlotSymbol[][] {
  if (symbolPool.length === 0) {
    throw new Error('symbolPool is empty')
  }

  const pool = buildWeightedPool(symbolPool, effects)

  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => {
      const index = Math.floor(Math.random() * pool.length)
      return { ...pool[index] }
    }),
  )
}

/**
 * 스핀 실행: 그리드 생성 → 점수 계산 → SpinResult 반환
 */
export function executeSpin(
  symbolPool: SlotSymbol[],
  effects: Effect[],
): SpinResult {
  const symbols = generateGrid(symbolPool, effects)
  const breakdown = calculateScore(symbols, effects)

  return {
    symbols,
    score: breakdown.total,
    bonuses: effects.filter(
      (e) => e.type === 'score_multiply' || e.type === 'symbol_score_multiply',
    ),
  }
}
