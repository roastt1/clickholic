import type { ItemCard } from '@/types/card'

export const luckCards: ItemCard[] = [
  {
    id: 'rabbit-foot',
    name: '토끼 발',
    description: '행운 +2 (슬롯 클러스터링 확률 소폭 증가)',
    rarity: 'common',
    cost: 0,
    apply: (state) => ({ ...state, luck: state.luck + 2 }),
  },
  {
    id: 'four-leaf-clover',
    name: '네잎 클로버',
    description: '행운 +3 (슬롯 클러스터링 확률 증가)',
    rarity: 'uncommon',
    cost: 0,
    apply: (state) => ({ ...state, luck: state.luck + 3 }),
  },
  {
    id: 'lucky-star',
    name: '행운의 별',
    description: '행운 +5 (슬롯 클러스터링 확률 대폭 증가)',
    rarity: 'rare',
    cost: 0,
    apply: (state) => ({ ...state, luck: state.luck + 5 }),
  },
]
