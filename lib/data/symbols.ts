import type { SlotSymbol } from '@/types/symbol'

export const SYMBOL_POOL: SlotSymbol[] = [
  { id: 'skull',  type: 'skull',  tier: 'risk', groupValue: -20 },
  { id: 'lemon',  type: 'lemon',  tier: 'L1',   groupValue: 10  },
  { id: 'cherry', type: 'cherry', tier: 'L2',   groupValue: 20  },
  { id: 'grape',  type: 'grape',  tier: 'L3',   groupValue: 35  },
  { id: 'coin',   type: 'coin',   tier: 'L4',   groupValue: 60  },
  { id: 'gem',    type: 'gem',    tier: 'L5',   groupValue: 90  },
  { id: 'crown',  type: 'crown',  tier: 'L6',   groupValue: 130 },
  { id: 'lucky7', type: 'lucky7', tier: 'L7',   groupValue: 200 },
]
