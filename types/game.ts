import type { SlotSymbol } from './symbol'
import type { Effect } from './effect'
import type { ItemCard } from './card'

export type GamePhase =
  | 'idle'
  | 'spinning'
  | 'round_clear'
  | 'game_over'

export interface SpinResult {
  symbols: SlotSymbol[][] // 2D [row][col], 3행 5열
  score: number
  bonuses: Effect[]
}

export interface GameState {
  phase: GamePhase
  score: number           // 전체 누적 점수 (모든 라운드 합산)
  roundScore: number      // 현재 라운드 누적 점수 (라운드 초기화 시 리셋)
  roundTarget: number     // 현재 라운드 목표 점수
  spinsInRound: number    // 현재 라운드 사용한 스핀 수
  maxSpinsInRound: number // 현재 라운드 최대 스핀 수 (5~10 랜덤)
  deck: ItemCard[]        // 획득한 증강체 목록
  activeEffects: Effect[]
  currentGrid: SlotSymbol[][] | null
  spinHistory: SpinResult[]
  round: number
  offeredItems: ItemCard[]  // round_clear 페이즈에서 제시되는 증강체 3개
  spinId: number            // 스핀마다 증가 — 릴 애니메이션 트리거용
  spinStrips: SlotSymbol[][] | null
  scoreGain: number         // 마지막 스핀에서 얻은 점수 (점수 플래시용)
}
