import type { Rarity } from './symbol'
import type { GameState } from './game'

export interface ItemCard {
  id: string
  name: string
  description: string
  rarity: Rarity
  cost: number
  apply: (state: GameState) => GameState
}
