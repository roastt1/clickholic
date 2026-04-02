import { symbolRateCards } from './symbolRateCards'
import { symbolScoreCards } from './symbolScoreCards'
import { comboCards } from './comboCards'

export const AUGMENT_POOL = [
  ...symbolRateCards,
  ...symbolScoreCards,
  ...comboCards,
]

// 하위 호환성: 기존 CARD_POOL 이름 유지
export const CARD_POOL = AUGMENT_POOL
