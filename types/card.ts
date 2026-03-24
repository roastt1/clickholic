import type { GameState } from './game'

// 카드 희귀도 (심볼 티어와 별개)
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'legendary'

export interface ItemCard {
  id: string
  name: string
  description: string
  rarity: CardRarity
  cost: number
  apply: (state: GameState) => GameState
}
