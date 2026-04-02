import type { ItemCard } from '@/types/card'

export const symbolScoreCards: ItemCard[] = [
  {
    id: 'lucky7-score',
    name: '전설의 도박사',
    description: '7️⃣ 점수 ×3',
    rarity: 'legendary',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'symbol_score_multiply', value: 3, duration: 'permanent', targetSymbol: 'lucky7', description: '7️⃣ 점수 ×3' },
      ],
    }),
  },
  {
    id: 'crown-score',
    name: '황금 왕관',
    description: '👑 점수 ×2',
    rarity: 'rare',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'symbol_score_multiply', value: 2, duration: 'permanent', targetSymbol: 'crown', description: '👑 점수 ×2' },
      ],
    }),
  },
  {
    id: 'gem-score',
    name: '보석 감정사',
    description: '💎 점수 ×2',
    rarity: 'rare',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'symbol_score_multiply', value: 2, duration: 'permanent', targetSymbol: 'gem', description: '💎 점수 ×2' },
      ],
    }),
  },
  {
    id: 'coin-score',
    name: '금화 연금술',
    description: '🪙 점수 ×2',
    rarity: 'uncommon',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'symbol_score_multiply', value: 2, duration: 'permanent', targetSymbol: 'coin', description: '🪙 점수 ×2' },
      ],
    }),
  },
  {
    id: 'cherry-score',
    name: '체리 폭탄',
    description: '🍒 점수 ×3',
    rarity: 'epic',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'symbol_score_multiply', value: 3, duration: 'permanent', targetSymbol: 'cherry', description: '🍒 점수 ×3' },
      ],
    }),
  },
  {
    id: 'clover-score',
    name: '클로버 행운',
    description: '🍀 점수 ×2',
    rarity: 'uncommon',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'symbol_score_multiply', value: 2, duration: 'permanent', targetSymbol: 'clover', description: '🍀 점수 ×2' },
      ],
    }),
  },
]
