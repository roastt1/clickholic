import { create } from 'zustand'
import type { GameState } from '@/types/game'
import type { ItemCard } from '@/types/card'
import type { SlotSymbol } from '@/types/symbol'
import { executeSpin } from '@/lib/engine/spin'
import { tickEffects } from '@/lib/engine/effects'
import { SYMBOL_POOL } from '@/lib/data/symbols'
import { CARD_POOL } from '@/lib/data/cards'

const STRIP_TYPES: SlotSymbol['type'][] = [
  'cherry', 'grape', 'lemon', 'coin', 'gem', 'crown', 'lucky7', 'skull',
]
export const REEL_FAKE_COUNT = 22

function pickOfferedCards(): ItemCard[] {
  return [...CARD_POOL].sort(() => Math.random() - 0.5).slice(0, 3)
}

function makeSpinStrips(): SlotSymbol[][] {
  return Array.from({ length: 5 }, () =>
    Array.from({ length: REEL_FAKE_COUNT }, (_, i) => {
      const type = STRIP_TYPES[Math.floor(Math.random() * STRIP_TYPES.length)]
      return { id: `fake-${i}-${type}`, type, tier: 'L1' as const, groupValue: 10 }
    })
  )
}

const INITIAL_SPINS = 10

const INITIAL_STATE: GameState = {
  phase:        'idle',
  score:        0,
  spinsLeft:    INITIAL_SPINS,
  deck:         [],
  activeEffects:[],
  currentGrid:  null,
  spinHistory:  [],
  round:        1,
  offeredCards: [],
  spinId:       0,
  spinStrips:   null,
  scoreGain:    0,
}

interface GameStore extends GameState {
  spin: () => void
  selectCard: (card: ItemCard) => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,

  spin: () => {
    const { phase, spinsLeft, activeEffects, spinHistory, score, round, spinId } = get()

    if (phase !== 'idle' || spinsLeft <= 0) return

    set({ phase: 'spinning' })

    const result          = executeSpin(SYMBOL_POOL, activeEffects)
    const remainingEffects = tickEffects(activeEffects)
    const newSpinsLeft    = spinsLeft - 1
    const newScore        = score + result.score
    const nextPhase       = newSpinsLeft === 0 ? 'game_over' : 'card_select'

    set({
      phase:          nextPhase,
      currentGrid:    result.symbols,
      score:          newScore,
      spinsLeft:      newSpinsLeft,
      activeEffects:  remainingEffects,
      spinHistory:    [...spinHistory, result],
      round:          round + 1,
      offeredCards:   nextPhase === 'card_select' ? pickOfferedCards() : [],
      spinId:         spinId + 1,
      spinStrips:     makeSpinStrips(),
      scoreGain:      result.score,
    })
  },

  selectCard: (card: ItemCard) => {
    const { phase, score, spinsLeft, deck, activeEffects, currentGrid, spinHistory, round, offeredCards, spinId, spinStrips } = get()

    if (phase !== 'card_select') return

    const { scoreGain } = get()
    const currentState: GameState = {
      phase, score, spinsLeft, deck, activeEffects, currentGrid,
      spinHistory, round, offeredCards, spinId, spinStrips, scoreGain,
    }

    const nextState = card.apply(currentState)

    set({
      ...nextState,
      deck:  [...nextState.deck, card],
      phase: 'idle',
    })
  },

  resetGame: () => {
    set({ ...INITIAL_STATE })
  },
}))
