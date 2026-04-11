import type { ItemCard } from '@/types/card'

export const extraSpinCards: ItemCard[] = [
  {
    id: 'extra-spin-silver',
    name: '실버티켓',
    description: '매 스핀마다 20% 확률로 추가 스핀 1회',
    rarity: 'silver',
    set: 'ticket',
    cost: 0,
    apply: (state) => ({ ...state, extraSpinChance: state.extraSpinChance + 0.20 }),
  },
  {
    id: 'extra-spin-gold',
    name: '골드티켓',
    description: '매 스핀마다 30% 확률로 추가 스핀 1회',
    rarity: 'gold',
    set: 'ticket',
    cost: 0,
    apply: (state) => ({ ...state, extraSpinChance: state.extraSpinChance + 0.30 }),
  },
  {
    id: 'extra-spin-prism',
    name: '프리즘티켓',
    description: '매 스핀마다 40% 확률로 추가 스핀 1회',
    rarity: 'prism',
    set: 'ticket',
    cost: 0,
    apply: (state) => ({ ...state, extraSpinChance: state.extraSpinChance + 0.40 }),
  },
]
