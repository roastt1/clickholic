'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ItemCard } from '@/types/card'
import { CARD_POOL } from '@/lib/data/cards'

const RARITY_STYLE: Record<ItemCard['rarity'], string> = {
  common:    'border-zinc-300 dark:border-zinc-600',
  uncommon:  'border-green-400 dark:border-green-500',
  rare:      'border-sky-400 dark:border-sky-500',
  legendary: 'border-yellow-400 dark:border-yellow-500',
}

const RARITY_LABEL: Record<ItemCard['rarity'], string> = {
  common:    '',
  uncommon:  'text-green-500',
  rare:      'text-sky-500',
  legendary: 'text-yellow-500',
}

interface CardPanelProps {
  visible: boolean
  onSelect: (card: ItemCard) => void
}

export function CardPanel({ visible, onSelect }: CardPanelProps) {
  const offeredCards = useMemo(() => {
    if (!visible) return []
    const shuffled = [...CARD_POOL].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="flex flex-col items-center gap-4 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 tracking-wide">
            카드를 선택하세요
          </p>
          <div className="flex gap-3">
            {offeredCards.map((card, i) => (
              <motion.button
                key={card.id}
                onClick={() => onSelect(card)}
                className={[
                  'flex flex-col items-start gap-1 w-36 p-3 rounded-2xl',
                  'bg-white dark:bg-zinc-900 border-2 text-left',
                  'hover:shadow-md transition-shadow duration-150',
                  RARITY_STYLE[card.rarity],
                ].join(' ')}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 280, damping: 22 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className={`text-xs font-semibold uppercase tracking-widest ${RARITY_LABEL[card.rarity]}`}>
                  {card.rarity}
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                  {card.name}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">
                  {card.description}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
