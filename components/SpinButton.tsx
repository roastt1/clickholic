'use client'

import { motion } from 'framer-motion'
import type { GamePhase } from '@/types/game'

interface SpinButtonProps {
  phase:  GamePhase
  onSpin: () => void
}

const PHASE_LABEL: Record<GamePhase, string> = {
  idle:        'SPIN',
  spinning:    '...',
  revealing:   '...',
  round_clear: '...',
  game_over:   'GAME OVER',
}

export function SpinButton({ phase, onSpin }: SpinButtonProps) {
  const isDisabled = phase !== 'idle'
  const label      = PHASE_LABEL[phase]

  return (
    <motion.button
      onClick={onSpin}
      disabled={isDisabled}
      className="w-44 h-12 rounded-full font-black tracking-[0.25em] text-sm uppercase"
      style={{
        fontFamily: 'var(--font-orbitron)',
        background: 'transparent',
        color:      isDisabled ? 'var(--text-muted)' : 'var(--neon-cyan)',
        border:     `1px solid ${isDisabled ? 'var(--border-dim)' : 'var(--neon-cyan)'}`,
        boxShadow:  isDisabled
          ? 'none'
          : '0 0 16px var(--neon-cyan), 0 0 32px rgba(0,229,255,0.3), inset 0 0 16px rgba(0,229,255,0.06)',
        cursor:     isDisabled ? 'not-allowed' : 'pointer',
        animation:  isDisabled ? 'none' : 'spin-cycle 2.5s ease-in-out infinite',
      }}
      whileTap={isDisabled ? {} : { scale: 0.94 }}
      whileHover={isDisabled ? {} : { scale: 1.04 }}
    >
      {label}
    </motion.button>
  )
}
