import type { ItemCard } from '@/types/card'

export const symbolRateCards: ItemCard[] = [
  {
    id: 'lucky7-rate',
    name: '럭키 세븐 집착',
    description: '7️⃣ 출현 확률 +50%',
    rarity: 'rare',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'symbol_rate_up', value: 0.5, duration: 'permanent', targetSymbol: 'lucky7', description: '7️⃣ 출현 확률 +50%' },
      ],
    }),
  },
  {
    id: 'crown-rate',
    name: '왕관 독점',
    description: '👑 출현 확률 +60%',
    rarity: 'uncommon',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'symbol_rate_up', value: 0.6, duration: 'permanent', targetSymbol: 'crown', description: '👑 출현 확률 +60%' },
      ],
    }),
  },
  {
    id: 'gem-rate',
    name: '보석 광산',
    description: '💎 출현 확률 +70%',
    rarity: 'uncommon',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'symbol_rate_up', value: 0.7, duration: 'permanent', targetSymbol: 'gem', description: '💎 출현 확률 +70%' },
      ],
    }),
  },
  {
    id: 'coin-rate',
    name: '코인 러시',
    description: '🪙 출현 확률 +80%',
    rarity: 'common',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'symbol_rate_up', value: 0.8, duration: 'permanent', targetSymbol: 'coin', description: '🪙 출현 확률 +80%' },
      ],
    }),
  },
  {
    id: 'clover-rate',
    name: '클로버 농장',
    description: '🍀 출현 확률 +90%',
    rarity: 'common',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'symbol_rate_up', value: 0.9, duration: 'permanent', targetSymbol: 'clover', description: '🍀 출현 확률 +90%' },
      ],
    }),
  },
  {
    id: 'skull-purge',
    name: '해골 제거',
    description: '💀 출현 확률 -100% (완전 제거)',
    rarity: 'rare',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'symbol_rate_up', value: -1, duration: 'permanent', targetSymbol: 'skull', description: '💀 출현 확률 -100%' },
      ],
    }),
  },
]
