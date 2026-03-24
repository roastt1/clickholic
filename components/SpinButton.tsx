'use client'

import { motion } from 'framer-motion'
import type { GamePhase } from '@/types/game'

interface SpinButtonProps {
  phase: GamePhase
  onSpin: () => void
}

const PHASE_LABEL: Record<GamePhase, string> = {
  idle:        'SPIN',
  spinning:    '...',
  scoring:     '...',
  card_select: '카드를 선택하세요',
  game_over:   'GAME OVER',
}

export function SpinButton({ phase, onSpin }: SpinButtonProps) {
  const isDisabled = phase !== 'idle'

  return (
    <motion.button
      onClick={onSpin}
      disabled={isDisabled}
      className={[
        'w-40 h-12 rounded-full font-bold tracking-widest text-sm transition-colors',
        isDisabled
          ? 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
          : 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 cursor-pointer hover:bg-zinc-700 dark:hover:bg-zinc-200',
      ].join(' ')}
      whileTap={isDisabled ? {} : { scale: 0.95 }}
    >
      {PHASE_LABEL[phase]}
    </motion.button>
  )
}
