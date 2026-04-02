import type { ItemCard } from '@/types/card'

export const comboCards: ItemCard[] = [
  {
    id: 'grand-jackpot',
    name: '그랜드 잭팟',
    description: '모든 점수 ×1.5',
    rarity: 'legendary',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'score_multiply', value: 1.5, duration: 'permanent', description: '모든 점수 ×1.5' },
      ],
    }),
  },
  {
    id: 'lucky7-rate-score',
    name: '럭키 세븐 마스터',
    description: '7️⃣ 출현 확률 +30% & 점수 ×2',
    rarity: 'legendary',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'symbol_rate_up', value: 0.3, duration: 'permanent', targetSymbol: 'lucky7', description: '7️⃣ 출현 확률 +30%' },
        { type: 'symbol_score_multiply', value: 2, duration: 'permanent', targetSymbol: 'lucky7', description: '7️⃣ 점수 ×2' },
      ],
    }),
  },
  {
    id: 'crown-rate-score',
    name: '왕관의 영광',
    description: '👑 출현 확률 +40% & 점수 ×2',
    rarity: 'epic',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'symbol_rate_up', value: 0.4, duration: 'permanent', targetSymbol: 'crown', description: '👑 출현 확률 +40%' },
        { type: 'symbol_score_multiply', value: 2, duration: 'permanent', targetSymbol: 'crown', description: '👑 점수 ×2' },
      ],
    }),
  },
]
