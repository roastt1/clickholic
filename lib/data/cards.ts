import type { ItemCard } from '@/types/card'

export const CARD_POOL: ItemCard[] = [
  {
    id: 'golden-spin',
    name: '황금 스핀',
    description: '다음 스핀 점수 2배',
    rarity: 'rare',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'score_multiply', value: 2, duration: 'next_spin', description: '황금 스핀 2배' },
      ],
    }),
  },
  {
    id: 'bonus-coin',
    name: '보너스 코인',
    description: '즉시 +500점',
    rarity: 'uncommon',
    cost: 0,
    apply: (state) => ({ ...state, score: state.score + 500 }),
  },
  {
    id: 'extra-spin',
    name: '추가 스핀',
    description: '스핀 횟수 +1',
    rarity: 'uncommon',
    cost: 0,
    apply: (state) => ({ ...state, spinsLeft: state.spinsLeft + 1 }),
  },
  {
    id: 'lucky-streak',
    name: '럭키 스트릭',
    description: '3스핀 동안 매 스핀 +100점',
    rarity: 'rare',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'score_add', value: 100, duration: 3, description: '럭키 스트릭 +100' },
      ],
    }),
  },
  {
    id: 'jackpot',
    name: '잭팟',
    description: '즉시 +2000점',
    rarity: 'legendary',
    cost: 0,
    apply: (state) => ({ ...state, score: state.score + 2000 }),
  },
]
