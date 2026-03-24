export type SymbolType =
  | 'cherry'
  | 'grape'
  | 'lemon'
  | 'orange'
  | 'coin'
  | 'gem'
  | 'crown'
  | 'bomb'
  | 'skull'
  | 'wildcard'
  | 'multiplier'

export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary'

export interface SymbolInteraction {
  targetType: SymbolType
  multiplier: number
  description: string
}

export interface SlotSymbol {
  id: string
  type: SymbolType
  rarity: Rarity
  baseScore: number
  interactions?: SymbolInteraction[]
}
