'use client'

import { useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { ScoreBoard } from './ScoreBoard'
import { SlotGrid } from './SlotGrid'
import { SpinButton } from './SpinButton'
import { CardPanel } from './CardPanel'
import type { ItemCard } from '@/types/card'

export function GameScreen() {
  const phase      = useGameStore((s) => s.phase)
  const score      = useGameStore((s) => s.score)
  const spinsLeft  = useGameStore((s) => s.spinsLeft)
  const round      = useGameStore((s) => s.round)
  const currentGrid = useGameStore((s) => s.currentGrid)
  const spin       = useGameStore((s) => s.spin)
  const selectCard = useGameStore((s) => s.selectCard)
  const resetGame  = useGameStore((s) => s.resetGame)

  // spinning phase는 UI 애니메이션만 — 실제 결과는 이미 스토어에 있음
  const isSpinning = phase === 'spinning'

  const handleSelectCard = useCallback(
    (card: ItemCard) => selectCard(card),
    [selectCard],
  )

  // spinning 상태를 짧게 유지해 애니메이션이 재생되도록 함
  useEffect(() => {
    if (phase !== 'spinning') return
    // executeSpin은 동기 함수라 즉시 card_select로 전환됨
    // SymbolCell 애니메이션 duration(~0.6s) 동안만 spinning 표시
  }, [phase])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">

        {/* 타이틀 */}
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          AGUMATCH
        </h1>

        {/* 스코어보드 */}
        <ScoreBoard score={score} spinsLeft={spinsLeft} round={round} />

        {/* 슬롯 그리드 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
          <SlotGrid grid={currentGrid} isSpinning={isSpinning} />
        </div>

        {/* 스핀 버튼 */}
        <SpinButton phase={phase} onSpin={spin} />

        {/* 카드 패널 */}
        <CardPanel
          visible={phase === 'card_select'}
          onSelect={handleSelectCard}
        />

        {/* 게임 오버 */}
        <AnimatePresence>
          {phase === 'game_over' && (
            <motion.div
              className="flex flex-col items-center gap-3 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <p className="text-lg font-bold text-zinc-700 dark:text-zinc-300">
                최종 점수
              </p>
              <p className="text-4xl font-black text-zinc-900 dark:text-zinc-50">
                {score.toLocaleString()}
              </p>
              <button
                onClick={resetGame}
                className="mt-2 px-6 py-2 rounded-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 font-semibold text-sm hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
              >
                다시 하기
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
