import type { SlotSymbol } from '@/types/symbol'
import type { Effect } from '@/types/effect'
import type { SpinResult } from '@/types/game'
import { ROWS, COLS } from './grid'
import { calculateScore } from './score'

/**
 * 심볼 풀에서 랜덤하게 3×5 그리드 생성
 */
export function generateGrid(symbolPool: SlotSymbol[]): SlotSymbol[][] {
  if (symbolPool.length === 0) {
    throw new Error('symbolPool is empty')
  }

  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => {
      const index = Math.floor(Math.random() * symbolPool.length)
      return { ...symbolPool[index] } // 불변: 복사본 반환
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
  const symbols = generateGrid(symbolPool)
  const breakdown = calculateScore(symbols, effects)

  return {
    symbols,
    score: breakdown.total,
    bonuses: effects.filter(
      (e) => e.type === 'score_multiply' || e.type === 'score_add',
    ),
  }
}
