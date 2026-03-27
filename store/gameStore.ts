import { create } from 'zustand'
import type { GameState } from '@/types/game'
import type { ItemCard } from '@/types/card'
import type { SlotSymbol } from '@/types/symbol'
import { executeSpin } from '@/lib/engine/spin'
import { tickEffects } from '@/lib/engine/effects'
import { calculateRoundTarget, getRandomSpinsInRound } from '@/lib/engine/round'
import { SYMBOL_POOL } from '@/lib/data/symbols'
import { AUGMENT_POOL } from '@/lib/data/cards'

const STRIP_TYPES: SlotSymbol['type'][] = [
  'cherry', 'grape', 'lemon', 'coin', 'gem', 'crown', 'lucky7', 'skull',
]
export const REEL_FAKE_COUNT = 22

function pickOfferedItems(): ItemCard[] {
  return [...AUGMENT_POOL].sort(() => Math.random() - 0.5).slice(0, 3)
}

function makeSpinStrips(): SlotSymbol[][] {
  return Array.from({ length: 5 }, () =>
    Array.from({ length: REEL_FAKE_COUNT }, (_, i) => {
      const type = STRIP_TYPES[Math.floor(Math.random() * STRIP_TYPES.length)]
      return { id: `fake-${i}-${type}`, type, tier: 'L1' as const, groupValue: 10 }
    })
  )
}

const INITIAL_STATE: GameState = {
  phase:           'idle',
  score:           0,
  roundScore:      0,
  roundTarget:     calculateRoundTarget(1),
  spinsInRound:    0,
  maxSpinsInRound: getRandomSpinsInRound(),
  deck:            [],
  activeEffects:   [],
  currentGrid:     null,
  spinHistory:     [],
  round:           1,
  offeredItems:    [],
  spinId:          0,
  spinStrips:      null,
  scoreGain:       0,
  pendingPhase:    null,
}

interface GameStore extends GameState {
  spin: () => void
  finishSpin: () => void
  selectItem: (card: ItemCard) => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,

  spin: () => {
    const {
      phase, activeEffects, spinHistory, score,
      roundScore, spinsInRound, maxSpinsInRound, roundTarget,
      spinId,
    } = get()

    if (phase !== 'idle') return

    const result           = executeSpin(SYMBOL_POOL, activeEffects)
    const remainingEffects = tickEffects(activeEffects)
    const newRoundScore    = roundScore + result.score
    const newScore         = score + result.score
    const newSpinsInRound  = spinsInRound + 1
    const isLastSpin       = newSpinsInRound >= maxSpinsInRound

    let nextPhase: GameState['phase']
    if (isLastSpin) {
      nextPhase = newRoundScore >= roundTarget ? 'round_clear' : 'game_over'
    } else {
      nextPhase = 'idle'
    }

    // phase는 'spinning'으로 유지 — finishSpin() 호출 시 nextPhase로 전환
    set({
      phase:         'spinning',
      pendingPhase:  nextPhase,
      currentGrid:   result.symbols,
      score:         newScore,
      roundScore:    newRoundScore,
      spinsInRound:  newSpinsInRound,
      activeEffects: remainingEffects,
      spinHistory:   [...spinHistory, result],
      offeredItems:  nextPhase === 'round_clear' ? pickOfferedItems() : [],
      spinId:        spinId + 1,
      spinStrips:    makeSpinStrips(),
      scoreGain:     result.score,
    })
  },

  finishSpin: () => {
    const { phase, pendingPhase } = get()
    if (phase !== 'spinning' || !pendingPhase) return
    set({ phase: pendingPhase, pendingPhase: null })
  },

  selectItem: (card: ItemCard) => {
    const state = get()
    if (state.phase !== 'round_clear') return

    const nextRound = state.round + 1
    const nextState = card.apply(state)

    set({
      ...nextState,
      deck:            [...nextState.deck, card],
      phase:           'idle',
      round:           nextRound,
      roundScore:      0,
      spinsInRound:    0,
      maxSpinsInRound: getRandomSpinsInRound(),
      roundTarget:     calculateRoundTarget(nextRound),
      offeredItems:    [],
    })
  },

  resetGame: () => {
    set({
      ...INITIAL_STATE,
      roundTarget:     calculateRoundTarget(1),
      maxSpinsInRound: getRandomSpinsInRound(),
    })
  },
}))
