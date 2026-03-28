import type { SlotSymbol } from '@/types/symbol'

export const SYMBOL_POOL: SlotSymbol[] = [
  { id: 'skull',  type: 'skull',  tier: 'risk', groupValue: -10, weight: 0.3 },
  { id: 'lemon',  type: 'lemon',  tier: 'L1',   groupValue: 2,   weight: 1.8 },
  { id: 'cherry', type: 'cherry', tier: 'L2',   groupValue: 2,   weight: 1.8 },
  { id: 'clover', type: 'clover', tier: 'L3',   groupValue: 3,   weight: 1.5 },
  { id: 'coin',   type: 'coin',   tier: 'L4',   groupValue: 3,   weight: 1.5 },
  { id: 'gem',    type: 'gem',    tier: 'L5',   groupValue: 5,   weight: 1.2 },
  { id: 'crown',  type: 'crown',  tier: 'L6',   groupValue: 5,   weight: 1.2 },
  { id: 'lucky7', type: 'lucky7', tier: 'L7',   groupValue: 7,   weight: 0.7 },
]
