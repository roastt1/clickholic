'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'

// 가장 늦게 멈추는 릴(4열) 종료 예상 시각 + 여유
// phase-1: 0.60 + 4×0.16 = 1.24s  +  spring ~0.45s  +  버퍼 0.15s = 1.84s
const SCORE_REVEAL_DELAY = 1850  // ms

interface ScoreBoardProps {
  score:     number   // 실제 점수 (표시는 딜레이 후)
  spinsLeft: number
  round:     number
}

export function ScoreBoard({ score, spinsLeft, round }: ScoreBoardProps) {
  const spinId    = useGameStore((s) => s.spinId)
  const scoreGain = useGameStore((s) => s.scoreGain)

  const [displayScore, setDisplayScore] = useState(score)
  const [flashGain,    setFlashGain]    = useState(0)

  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // 타이머 정리
    if (revealTimer.current) clearTimeout(revealTimer.current)
    if (hideTimer.current)   clearTimeout(hideTimer.current)

    if (spinId === 0) {
      // 게임 리셋: 타이머 없이 즉시 반영 (setTimeout 0으로 effect 직접 호출 회피)
      revealTimer.current = setTimeout(() => {
        setDisplayScore(0)
        setFlashGain(0)
      }, 0)
      return () => { if (revealTimer.current) clearTimeout(revealTimer.current) }
    }

    // 릴 애니메이션이 끝난 뒤 점수 반영
    revealTimer.current = setTimeout(() => {
      setDisplayScore(score)
      if (scoreGain > 0) {
        setFlashGain(scoreGain)
        hideTimer.current = setTimeout(() => setFlashGain(0), 1600)
      }
    }, SCORE_REVEAL_DELAY)

    return () => {
      if (revealTimer.current) clearTimeout(revealTimer.current)
      if (hideTimer.current)   clearTimeout(hideTimer.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinId])   // spinId 변경 시에만 — score/scoreGain은 항상 spinId와 함께 변함

  return (
    <div
      className="flex items-center justify-between w-full px-4 py-3 rounded-xl arcade-border"
      style={{ background: 'var(--bg-card)', fontFamily: 'var(--font-space-mono)' }}
    >
      {/* Score */}
      <div className="flex flex-col gap-0.5">
        <span
          className="text-[10px] tracking-[0.25em] uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Score
        </span>
        <div className="flex items-baseline gap-2">
          <AnimatePresence mode="wait">
            <motion.span
              key={displayScore}
              className="text-2xl sm:text-3xl font-bold tabular-nums neon-cyan"
              initial={{ y: -10, opacity: 0, scale: 0.92 }}
              animate={{ y: 0,   opacity: 1, scale: 1    }}
              transition={{ type: 'spring', stiffness: 360, damping: 22 }}
            >
              {displayScore.toLocaleString()}
            </motion.span>
          </AnimatePresence>

          {/* +N 플래시 */}
          <AnimatePresence>
            {flashGain > 0 && (
              <motion.span
                initial={{ opacity: 0, y: 6  }}
                animate={{ opacity: 1, y: 0  }}
                exit={{    opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                style={{
                  color:      'var(--neon-green)',
                  fontSize:   '0.85rem',
                  fontWeight: 700,
                  textShadow: '0 0 8px var(--neon-green)',
                }}
              >
                +{flashGain.toLocaleString()}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Spins + Round */}
      <div className="flex gap-5 text-right">
        <div className="flex flex-col gap-0.5 items-end">
          <span
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            Spins
          </span>
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color: spinsLeft <= 3 ? 'var(--neon-pink)' : 'var(--text-primary)' }}
          >
            {spinsLeft}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 items-end">
          <span
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            Round
          </span>
          <span className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {round}
          </span>
        </div>
      </div>
    </div>
  )
}
