import type { ItemCard } from '@/types/card'

export const AUGMENT_POOL: ItemCard[] = [
  // ── 출현 확률 증가 (symbol_rate_up) ───────────────────────────────
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
    id: 'grape-rate',
    name: '포도 농장',
    description: '🍇 출현 확률 +90%',
    rarity: 'common',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'symbol_rate_up', value: 0.9, duration: 'permanent', targetSymbol: 'grape', description: '🍇 출현 확률 +90%' },
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

  // ── 점수 배수 (symbol_score_multiply) ─────────────────────────────
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
    id: 'grape-score',
    name: '포도주 숙성',
    description: '🍇 점수 ×2',
    rarity: 'uncommon',
    cost: 0,
    apply: (state) => ({
      ...state,
      activeEffects: [
        ...state.activeEffects,
        { type: 'symbol_score_multiply', value: 2, duration: 'permanent', targetSymbol: 'grape', description: '🍇 점수 ×2' },
      ],
    }),
  },

  // ── 전체 점수 배수 (score_multiply) ────────────────────────────────
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

// 하위 호환성: 기존 CARD_POOL 이름 유지
export const CARD_POOL = AUGMENT_POOL
