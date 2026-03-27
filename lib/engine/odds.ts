import type { SlotSymbol, SymbolType } from '@/types/symbol'
import type { Effect } from '@/types/effect'

export interface SymbolOdds {
  type: SymbolType
  pct:  number
}

/**
 * symbol_rate_up 효과를 반영해 각 심볼의 출현 확률(%) 계산
 * buildWeightedPool과 동일한 알고리즘 사용
 */
export function calculateSymbolOdds(
  symbolPool: SlotSymbol[],
  effects: Effect[],
): SymbolOdds[] {
  const rateEffects = effects.filter((e) => e.type === 'symbol_rate_up')

  const entries = symbolPool.map((symbol) => {
    const bonus = rateEffects
      .filter((e) => e.targetSymbol === symbol.type)
      .reduce((acc, e) => acc + e.value, 0)

    const weight = 1 + bonus
    const count  = weight <= 0 ? 0 : Math.max(1, Math.round(weight * 10))

    return { type: symbol.type, count }
  })

  const total = entries.reduce((sum, e) => sum + e.count, 0)

  return entries.map((e) => ({
    type: e.type,
    pct:  total > 0 ? (e.count / total) * 100 : 0,
  }))
}
