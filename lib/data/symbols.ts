import type { SlotSymbol } from '@/types/symbol'

export const SYMBOL_POOL: SlotSymbol[] = [
  // ── common ──────────────────────────────────────────────
  { id: 'cherry',     type: 'cherry',     rarity: 'common',   baseScore: 10 },
  { id: 'grape',      type: 'grape',      rarity: 'common',   baseScore: 10 },
  { id: 'lemon',      type: 'lemon',      rarity: 'common',   baseScore: 10 },
  { id: 'orange',     type: 'orange',     rarity: 'common',   baseScore: 10 },

  // ── uncommon ────────────────────────────────────────────
  { id: 'coin',       type: 'coin',       rarity: 'uncommon', baseScore: 25 },
  { id: 'bomb',       type: 'bomb',       rarity: 'uncommon', baseScore: 0  },
  { id: 'skull',      type: 'skull',      rarity: 'uncommon', baseScore: 0  },

  // ── rare ────────────────────────────────────────────────
  { id: 'gem',        type: 'gem',        rarity: 'rare',     baseScore: 50 },
  { id: 'wildcard',   type: 'wildcard',   rarity: 'rare',     baseScore: 30 },
  { id: 'multiplier', type: 'multiplier', rarity: 'rare',     baseScore: 20 },

  // ── legendary ───────────────────────────────────────────
  { id: 'crown',      type: 'crown',      rarity: 'legendary', baseScore: 100 },
]
