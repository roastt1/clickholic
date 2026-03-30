'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { PatternBreakdown } from '@/types/game'

interface PatternRevealProps {
  pattern:     PatternBreakdown | null
  revealIndex: number
}

export function PatternReveal({ pattern, revealIndex }: PatternRevealProps) {
  return (
    <AnimatePresence mode="wait">
      {pattern && (
        <motion.div
          key={revealIndex}
          initial={{ opacity: 0, scale: 0.4, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -12 }}
          transition={{ type: 'spring', stiffness: 340, damping: 22, delay: 0.28 }}
          className="flex flex-col items-center gap-1 pointer-events-none select-none px-5 py-3 rounded-2xl"
          style={{
            background:   'rgba(8, 8, 24, 0.82)',
            backdropFilter: 'blur(8px)',
            border:       '1px solid rgba(0,229,255,0.25)',
            boxShadow:    '0 0 32px rgba(0,0,0,0.6)',
          }}
        >
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-orbitron)',
              color:      'var(--neon-cyan)',
            }}
          >
            {pattern.label}
          </span>
          <motion.span
            initial={{ scale: 0.6 }}
            animate={{ scale: [0.6, 1.15, 1] }}
            transition={{ duration: 0.35, times: [0, 0.6, 1], delay: 0.28 }}
            className="text-5xl font-black tabular-nums leading-none"
            style={{
              fontFamily: 'var(--font-space-mono)',
              color:      '#fbbf24',
              textShadow: '0 0 24px rgba(251,191,36,0.9), 0 0 48px rgba(251,191,36,0.5)',
            }}
          >
            +{pattern.score.toLocaleString()}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
