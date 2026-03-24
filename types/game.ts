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
  offeredCards: ItemCard[]           // card_select 페이즈에서 제시되는 카드 3장
  spinId: number                     // 스핀마다 증가 — 릴 애니메이션 트리거용
  spinStrips: SlotSymbol[][] | null  // 5열 × FAKE_COUNT개 더미 심볼 (릴 스트립)
  scoreGain: number                  // 마지막 스핀에서 얻은 점수 (점수 플래시용)
}
