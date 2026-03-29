'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import type { SlotSymbol } from '@/types/symbol'

const SYMBOL_CONFIG: Record<SlotSymbol['type'], { emoji: string; neon: string }> = {
  skull:  { emoji: '💀', neon: '#6b7280' },
  lemon:  { emoji: '🍋', neon: '#eab308' },
  cherry: { emoji: '🍒', neon: '#ff2d78' },
  clover: { emoji: '🍀', neon: '#22c55e' },
  coin:   { emoji: '💴', neon: '#f59e0b' },
  gem:    { emoji: '💎', neon: '#00e5ff' },
  crown:  { emoji: '👑', neon: '#fbbf24' },
  lucky7: { emoji: '7️⃣',  neon: '#00ff88' },
}

interface SymbolCellProps {
  symbol: SlotSymbol
  isHighlighted?: boolean
  animationDelay?: number
  isSpinning?: boolean
}

export const SymbolCell = memo(function SymbolCell({
  symbol,
  isHighlighted = false,
  animationDelay = 0,
  isSpinning = false,
}: SymbolCellProps) {
  const { emoji, neon } = SYMBOL_CONFIG[symbol.type]

  return (
    <motion.div
      className="flex items-center justify-center rounded-xl text-2xl sm:text-3xl w-12 h-12 sm:w-14 sm:h-14 select-none"
      style={{
        background: isHighlighted
          ? `color-mix(in srgb, ${neon} 12%, #0c0c22)`
          : 'var(--bg-card)',
        border: `1px solid ${isHighlighted ? neon : 'var(--border-dim)'}`,
        boxShadow: isHighlighted
          ? `0 0 10px ${neon}99, 0 0 20px ${neon}44, inset 0 0 10px ${neon}15`
          : 'none',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease',
      }}
      initial={isSpinning ? { y: -80, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 18,
        delay: animationDelay,
      }}
    >
      {emoji}
    </motion.div>
  )
})
