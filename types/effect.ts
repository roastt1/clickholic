import type { SymbolType } from './symbol'

export type EffectType =
  | 'score_multiply'
  | 'score_add'
  | 'symbol_transform'
  | 'deck_modify'
  | 'spin_bonus'

export interface Effect {
  type: EffectType
  value: number
  duration: 'permanent' | 'next_spin' | number // number = 남은 스핀 횟수
  targetSymbol?: SymbolType
  description: string
}
