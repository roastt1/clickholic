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

export function AugmentVault() {
  const deck        = useGameStore((s) => s.deck)
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* 보관함 버튼 */}
      <motion.button
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center gap-0.5 w-12 h-12 rounded-xl"
        style={{
          background: 'var(--bg-card)',
          border:     '1px solid rgba(0,229,255,0.2)',
          boxShadow:  deck.length > 0 ? '0 0 12px rgba(0,229,255,0.15)' : 'none',
          cursor:     'pointer',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>🎒</span>
        <span
          className="text-[10px] font-bold tabular-nums"
          style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-space-mono)' }}
        >
          {deck.length}
        </span>
      </motion.button>

      {/* 모달 */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(5,5,16,0.8)', backdropFilter: 'blur(3px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />

            {/* 모달 패널 */}
            <motion.div
              className="fixed inset-x-4 top-1/2 z-50 rounded-2xl px-4 py-5 max-h-[70vh] overflow-y-auto"
              style={{
                background:  'var(--bg-secondary)',
                border:      '1px solid rgba(0,229,255,0.2)',
                boxShadow:   '0 0 40px rgba(0,229,255,0.1)',
                translateY:  '-50%',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <p
                  className="text-xs tracking-[0.3em] uppercase"
                  style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-orbitron)' }}
                >
                  보유 증강체
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="text-xs px-2 py-1 rounded-lg"
                  style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)' }}
                >
                  ✕
                </button>
              </div>

              {deck.length === 0 ? (
                <p
                  className="text-center text-xs py-6"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-space-mono)' }}
                >
                  아직 획득한 증강체가 없습니다
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {deck.map((card, i) => {
                    const neon = RARITY_NEON[card.rarity]
                    return (
                      <motion.div
                        key={`${card.id}-${i}`}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl"
                        style={{
                          background: 'var(--bg-card)',
                          border:     `1px solid ${neon}44`,
                        }}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <div className="flex flex-col gap-0.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[9px] font-bold tracking-[0.2em] uppercase"
                              style={{ color: neon, fontFamily: 'var(--font-orbitron)' }}
                            >
                              {TIER_LABELS[card.rarity]}
                            </span>
                          </div>
                          <span
                            className="text-sm font-bold"
                            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-orbitron)' }}
                          >
                            {card.name}
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-space-mono)' }}
                          >
                            {card.description}
                          </span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
