import type { SlotSymbol } from './symbol'
import type { Effect } from './effect'
import type { ItemCard } from './card'

export type GamePhase =
  | 'idle'
  | 'spinning'
  | 'scoring'
  | 'card_select'
  | 'game_over'

export interface SpinResult {
  symbols: SlotSymbol[][] // 2D [row][col], 3행 5열
  score: number
  bonuses: Effect[]
}

export interface GameState {
  phase: GamePhase
  score: number
  spinsLeft: number
  deck: ItemCard[]
  activeEffects: Effect[]
  currentGrid: SlotSymbol[][] | null // 2D [row][col], null = 스핀 전
  spinHistory: SpinResult[]
  round: number
}
