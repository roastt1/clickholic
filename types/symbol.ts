export type SymbolType =
  | 'skull'
  | 'lemon'
  | 'cherry'
  | 'grape'
  | 'coin'
  | 'gem'
  | 'crown'
  | 'lucky7'

// Risk = 감점 요소, L1~L7 = 가치 단계
export type SymbolTier = 'risk' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7'

export interface SymbolInteraction {
  targetType: SymbolType
  multiplier: number
  description: string
}

export interface SlotSymbol {
  id: string
  type: SymbolType
  tier: SymbolTier
  groupValue: number          // 연결 그룹에 포함될 때만 적용 (음수 가능)
  interactions?: SymbolInteraction[]
}
