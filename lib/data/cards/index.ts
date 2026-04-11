import { symbolRateCards } from './symbolRateCards'
import { symbolScoreCards } from './symbolScoreCards'
import { comboCards } from './comboCards'
import { luckCards } from './luckCards'
import { extraSpinCards } from './extraSpinCards'
import type { CardRarity, ItemCard } from '@/types/card'

const ALL_CARDS: ItemCard[] = [
  ...symbolRateCards,
  ...symbolScoreCards,
  ...comboCards,
  ...luckCards,
  ...extraSpinCards,
]

export const SILVER_POOL = ALL_CARDS.filter((c) => c.rarity === 'silver')
export const GOLD_POOL   = ALL_CARDS.filter((c) => c.rarity === 'gold')
export const PRISM_POOL  = ALL_CARDS.filter((c) => c.rarity === 'prism')

export const TIER_POOLS: Record<CardRarity, ItemCard[]> = {
  silver: SILVER_POOL,
  gold:   GOLD_POOL,
  prism:  PRISM_POOL,
}

// 하위 호환성
export const AUGMENT_POOL = ALL_CARDS
export const CARD_POOL    = ALL_CARDS
