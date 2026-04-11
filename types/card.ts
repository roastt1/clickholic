import type { GameState } from './game'

// 카드 등급 (증강체 티켓 등급)
export type CardRarity = 'silver' | 'gold' | 'prism'

export const TIER_LABELS: Record<CardRarity, string> = {
  silver: 'Silver',
  gold: 'Gold',
  prism: 'Prism',
}

export interface ItemCard {
  id: string
  name: string
  description: string
  rarity: CardRarity
  set?: string        // 같은 set이면 1장만 획득 가능
  repeatable?: boolean // true면 이미 획득해도 다시 등장 가능
  cost: number
  apply: (state: GameState) => GameState
}
