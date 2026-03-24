'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import type { SlotSymbol } from '@/types/symbol'

const SYMBOL_CONFIG: Record<SlotSymbol['type'], { emoji: string; bg: string; ring: string }> = {
  cherry:     { emoji: '🍒', bg: 'bg-red-100 dark:bg-red-950',     ring: 'ring-red-400' },
  grape:      { emoji: '🍇', bg: 'bg-purple-100 dark:bg-purple-950', ring: 'ring-purple-400' },
  lemon:      { emoji: '🍋', bg: 'bg-yellow-100 dark:bg-yellow-950', ring: 'ring-yellow-400' },
  orange:     { emoji: '🍊', bg: 'bg-orange-100 dark:bg-orange-950', ring: 'ring-orange-400' },
  coin:       { emoji: '🪙', bg: 'bg-amber-100 dark:bg-amber-950',   ring: 'ring-amber-400' },
  gem:        { emoji: '💎', bg: 'bg-sky-100 dark:bg-sky-950',       ring: 'ring-sky-400' },
  crown:      { emoji: '👑', bg: 'bg-yellow-100 dark:bg-yellow-900', ring: 'ring-yellow-500' },
  bomb:       { emoji: '💣', bg: 'bg-zinc-200 dark:bg-zinc-800',     ring: 'ring-zinc-500' },
  skull:      { emoji: '💀', bg: 'bg-zinc-300 dark:bg-zinc-700',     ring: 'ring-zinc-600' },
  wildcard:   { emoji: '⭐', bg: 'bg-white dark:bg-zinc-900',        ring: 'ring-white' },
  multiplier: { emoji: '✖️', bg: 'bg-green-100 dark:bg-green-950',   ring: 'ring-green-400' },
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
  const config = SYMBOL_CONFIG[symbol.type]

  return (
    <motion.div
      className={[
        'flex items-center justify-center rounded-xl text-3xl',
        'w-14 h-14 select-none transition-shadow duration-200',
        config.bg,
        isHighlighted ? `ring-2 ${config.ring} shadow-lg scale-105` : 'ring-1 ring-black/10 dark:ring-white/10',
      ].join(' ')}
      initial={isSpinning ? { y: -80, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 18,
        delay: animationDelay,
      }}
    >
      {config.emoji}
    </motion.div>
  )
})
