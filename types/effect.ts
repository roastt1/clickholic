import type { SymbolType } from './symbol'

export type EffectType =
  | 'score_multiply'        // 전체 점수 배수
  | 'symbol_rate_up'        // 특정 심볼 출현 확률 증가 (value = 추가 가중치)
  | 'symbol_score_multiply' // 특정 심볼 점수 배수 (targetSymbol 필수)

export interface Effect {
  type: EffectType
  value: number
  duration: 'permanent' | number // permanent = 영구, number = 남은 스핀 횟수
  targetSymbol?: SymbolType
  description: string
}
