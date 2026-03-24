'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ScoreBoardProps {
  score: number
  spinsLeft: number
  round: number
}

export function ScoreBoard({ score, spinsLeft, round }: ScoreBoardProps) {
  return (
    <div className="flex items-center justify-between w-full px-1">
      <div className="flex flex-col">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Score</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={score}
            className="text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50"
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {score.toLocaleString()}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex gap-6 text-right">
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Spins</span>
          <span className="text-xl font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
            {spinsLeft}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Round</span>
          <span className="text-xl font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
            {round}
          </span>
        </div>
      </div>
    </div>
  )
}
