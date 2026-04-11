'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import type { ItemCard } from '@/types/card'
import { TIER_LABELS } from '@/types/card'

const RARITY_NEON: Record<ItemCard['rarity'], string> = {
  silver: '#c0c8d8',
  gold:   '#ffd700',
  prism:  '#e879f9',
}

// 프리즘 등급 배경 그라디언트
const PRISM_GRADIENT = 'linear-gradient(135deg, #e879f922 0%, #818cf822 50%, #34d39922 100%)'

interface CardPanelProps {
  visible:     boolean
  onSelect:    (card: ItemCard) => void
  roundScore:  number
  roundTarget: number
}

export function CardPanel({ visible, onSelect, roundScore, roundTarget }: CardPanelProps) {
  const offeredItems = useGameStore((s) => s.offeredItems)
  // minimized resets to false on each mount (AnimatePresence unmounts on exit)
  const [minimized, setMinimized] = useState(false)

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* ── Full overlay (카드 선택) ─────────────────────── */}
          <AnimatePresence>
            {!minimized && (
              <motion.div
                key="overlay"
                className="fixed inset-0 z-50 flex flex-col items-center justify-center"
                style={{ background: 'rgba(5, 5, 16, 0.78)', backdropFilter: 'blur(10px)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                {/* ── Header ──────────────────────────────────── */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.3 }}
                >
                  <p
                    className="text-xs tracking-[0.35em] uppercase mb-1"
                    style={{ color: 'var(--neon-green)', fontFamily: 'var(--font-orbitron)' }}
                  >
                    Round Clear!
                  </p>
                  <p
                    className="text-[11px] tabular-nums"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-space-mono)' }}
                  >
                    {roundScore.toLocaleString()} / {Math.round(roundTarget / 10) * 10} pts
                  </p>
                  <p
                    className="text-[10px] tracking-[0.3em] uppercase mt-2"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-orbitron)' }}
                  >
                    증강체를 선택하세요
                  </p>
                </motion.div>

                {/* ── Tier Badge ──────────────────────────────── */}
                {offeredItems.length > 0 && (() => {
                  const tier = offeredItems[0].rarity
                  const neon = RARITY_NEON[tier]
                  return (
                    <motion.div
                      className="mb-4 px-5 py-1.5 rounded-full text-[11px] font-bold tracking-[0.25em] uppercase"
                      style={{
                        color:      neon,
                        border:     `1px solid ${neon}66`,
                        boxShadow:  `0 0 18px ${neon}33`,
                        fontFamily: 'var(--font-orbitron)',
                        background: tier === 'prism' ? PRISM_GRADIENT : `${neon}11`,
                      }}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {TIER_LABELS[tier]}
                    </motion.div>
                  )
                })()}

                {/* ── Cards ───────────────────────────────────── */}
                <div className="flex gap-4 px-4 w-full max-w-3xl justify-center">
                  {offeredItems.map((card, i) => {
                    const neon = RARITY_NEON[card.rarity]
                    const isPrism = card.rarity === 'prism'
                    return (
                      <motion.button
                        key={card.id}
                        onClick={() => onSelect(card)}
                        className="flex flex-col items-start gap-3 flex-1 max-w-[200px] min-h-[220px] px-4 py-5 rounded-2xl text-left cursor-pointer"
                        style={{
                          background: isPrism ? PRISM_GRADIENT : 'var(--bg-card)',
                          border:     `1px solid ${neon}66`,
                          boxShadow:  `0 0 20px ${neon}22`,
                        }}
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.12, type: 'spring', stiffness: 280, damping: 24 }}
                        whileHover={{
                          scale:       1.05,
                          boxShadow:   `0 0 36px ${neon}55, inset 0 0 24px ${neon}0d`,
                          borderColor: `${neon}cc`,
                        }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span
                          className="text-[10px] font-bold tracking-[0.2em] uppercase"
                          style={{ color: neon, fontFamily: 'var(--font-orbitron)' }}
                        >
                          {TIER_LABELS[card.rarity]}
                        </span>
                        <span
                          className="text-sm font-bold leading-tight"
                          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-orbitron)' }}
                        >
                          {card.name}
                        </span>
                        <span
                          className="text-xs leading-snug"
                          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-space-mono)' }}
                        >
                          {card.description}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* ── 토글 버튼 (항상 하단 고정) ────────────────────── */}
          <motion.div
            className="fixed bottom-6 left-1/2 z-50"
            style={{ x: '-50%' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, type: 'spring', stiffness: 320, damping: 26 }}
          >
            <motion.button
              onClick={() => setMinimized((v) => !v)}
              aria-pressed={minimized}
              aria-label={minimized ? '증강체 선택 화면으로 돌아가기' : '게임 화면 보기'}
              className="px-6 py-2.5 rounded-full text-[11px] tracking-[0.2em] uppercase font-bold"
              style={{
                fontFamily: 'var(--font-orbitron)',
                background: minimized ? 'rgba(0,229,255,0.1)'        : 'rgba(0,255,136,0.08)',
                color:      minimized ? 'var(--neon-cyan)'            : 'var(--neon-green)',
                border:     minimized ? '1px solid rgba(0,229,255,0.4)' : '1px solid rgba(0,255,136,0.35)',
                boxShadow:  minimized ? '0 0 20px rgba(0,229,255,0.2)' : '0 0 14px rgba(0,255,136,0.15)',
                cursor:     'pointer',
              }}
              whileHover={{
                scale:     1.06,
                boxShadow: minimized ? '0 0 30px rgba(0,229,255,0.35)' : '0 0 24px rgba(0,255,136,0.3)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              {minimized ? '증강체 선택으로 돌아가기' : '화면 보기'}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
