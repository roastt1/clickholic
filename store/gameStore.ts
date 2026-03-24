import { create } from 'zustand'
import type { GameState } from '@/types/game'
import type { ItemCard } from '@/types/card'
import { executeSpin } from '@/lib/engine/spin'
import { tickEffects } from '@/lib/engine/effects'
import { SYMBOL_POOL } from '@/lib/data/symbols'

const INITIAL_SPINS = 10

const INITIAL_STATE: GameState = {
  phase: 'idle',
  score: 0,
  spinsLeft: INITIAL_SPINS,
  deck: [],
  activeEffects: [],
  currentGrid: null,
  spinHistory: [],
  round: 1,
}

interface GameStore extends GameState {
  spin: () => void
  selectCard: (card: ItemCard) => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,

  spin: () => {
    const { phase, spinsLeft, activeEffects, spinHistory, score, round } = get()

    if (phase !== 'idle' || spinsLeft <= 0) return

    set({ phase: 'spinning' })

    const result = executeSpin(SYMBOL_POOL, activeEffects)
    const remainingEffects = tickEffects(activeEffects)
    const newSpinsLeft = spinsLeft - 1
    const newScore = score + result.score

    set({
      phase: newSpinsLeft === 0 ? 'game_over' : 'card_select',
      currentGrid: result.symbols,
      score: newScore,
      spinsLeft: newSpinsLeft,
      activeEffects: remainingEffects,
      spinHistory: [...spinHistory, result],
      round: round + 1,
    })
  },

  selectCard: (card: ItemCard) => {
    const { phase, score, spinsLeft, deck, activeEffects, currentGrid, spinHistory, round } = get()

    if (phase !== 'card_select') return

    const currentState: GameState = {
      phase, score, spinsLeft, deck, activeEffects, currentGrid, spinHistory, round,
    }

    const nextState = card.apply(currentState)

    set({
      ...nextState,
      deck: [...nextState.deck, card],
      phase: 'idle',
    })
  },

  resetGame: () => {
    set({ ...INITIAL_STATE })
  },
}))
