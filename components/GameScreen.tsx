'use client'

import { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { ScoreBoard } from './ScoreBoard'
import { SlotGrid } from './SlotGrid'
import { SpinButton } from './SpinButton'
import { CardPanel } from './CardPanel'
import type { ItemCard } from '@/types/card'

export function GameScreen() {
  const phase       = useGameStore((s) => s.phase)
  const score       = useGameStore((s) => s.score)
  const spinsLeft   = useGameStore((s) => s.spinsLeft)
  const round       = useGameStore((s) => s.round)
  const currentGrid = useGameStore((s) => s.currentGrid)
  const spin        = useGameStore((s) => s.spin)
  const selectCard  = useGameStore((s) => s.selectCard)
  const resetGame   = useGameStore((s) => s.resetGame)

  const handleSelectCard = useCallback(
    (card: ItemCard) => selectCard(card),
    [selectCard],
  )

  return (
    <div
      className="flex flex-col items-center min-h-screen px-4 pt-10 pb-6 sm:pt-14 sm:px-6"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="flex flex-col items-center gap-5 w-full max-w-sm">

        {/* ── Title ─────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-1 pt-2">
          <h1
            className="text-xl sm:text-2xl font-black tracking-[0.25em] uppercase neon-cyan"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            AGUMATCH
          </h1>
          <div
            className="h-px w-32"
            style={{
              background:
                'linear-gradient(to right, transparent, var(--neon-cyan), transparent)',
            }}
          />
        </div>

        {/* ── Scoreboard ────────────────────────────────── */}
        <ScoreBoard score={score} spinsLeft={spinsLeft} round={round} />

        {/* ── Slot grid ─────────────────────────────────── */}
        <div
          className="crt-screen rounded-2xl p-3 sm:p-4 arcade-border"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <SlotGrid grid={currentGrid} />
        </div>

        {/* ── Spin button ───────────────────────────────── */}
        <SpinButton phase={phase} onSpin={spin} />

        {/* ── Game over ─────────────────────────────────── */}
        <AnimatePresence>
          {phase === 'game_over' && (
            <motion.div
              className="flex flex-col items-center gap-4 text-center mt-2"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <p
                className="text-xs tracking-[0.3em] uppercase neon-pink"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                Game Over
              </p>
              <p
                className="text-5xl font-black tabular-nums neon-gold"
                style={{ fontFamily: 'var(--font-space-mono)' }}
              >
                {score.toLocaleString()}
              </p>
              <button
                onClick={resetGame}
                className="mt-1 px-8 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase font-bold transition-all duration-200"
                style={{
                  fontFamily:  'var(--font-orbitron)',
                  background:  'transparent',
                  color:       'var(--neon-cyan)',
                  border:      '1px solid var(--neon-cyan)',
                  boxShadow:   '0 0 12px var(--neon-cyan), inset 0 0 12px rgba(0,229,255,0.06)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.background  = 'rgba(0,229,255,0.1)'
                  el.style.boxShadow   = '0 0 24px var(--neon-cyan), inset 0 0 20px rgba(0,229,255,0.1)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.background  = 'transparent'
                  el.style.boxShadow   = '0 0 12px var(--neon-cyan), inset 0 0 12px rgba(0,229,255,0.06)'
                }}
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── Card panel — fixed overlay, outside flex flow ─ */}
      <CardPanel
        visible={phase === 'card_select'}
        onSelect={handleSelectCard}
      />
    </div>
  )
}
