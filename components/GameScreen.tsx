'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import { ScoreBoard } from './ScoreBoard'
import { SlotGrid } from './SlotGrid'
import { SpinButton } from './SpinButton'
import { CardPanel } from './CardPanel'
import { AugmentVault } from './AugmentVault'
import { VolumeControl } from './VolumeControl'
import { SymbolOddsPanel } from './SymbolOddsPanel'
import { PatternReveal } from './PatternReveal'
import type { ItemCard } from '@/types/card'

export function GameScreen() {
  const phase              = useGameStore((s) => s.phase)
  const score              = useGameStore((s) => s.score)
  const roundScore         = useGameStore((s) => s.roundScore)
  const roundTarget        = useGameStore((s) => s.roundTarget)
  const spinsInRound       = useGameStore((s) => s.spinsInRound)
  const maxSpinsInRound    = useGameStore((s) => s.maxSpinsInRound)
  const round              = useGameStore((s) => s.round)
  const currentGrid        = useGameStore((s) => s.currentGrid)
  const spinId             = useGameStore((s) => s.spinId)
  const patternBreakdowns  = useGameStore((s) => s.patternBreakdowns)
  const revealIndex        = useGameStore((s) => s.revealIndex)
  const spin               = useGameStore((s) => s.spin)
  const startReveal        = useGameStore((s) => s.startReveal)
  const advanceReveal      = useGameStore((s) => s.advanceReveal)
  const selectItem         = useGameStore((s) => s.selectItem)
  const resetGame          = useGameStore((s) => s.resetGame)

  const [volume, setVolume] = useState(0.8)

  const {
    playSpinStart,
    playReelTick,
    playMatchLine,
    playMatchVShape,
    playJackpot,
    playRoundClear,
    playGameOver,
  } = useSoundEffects(volume)

  // 스핀 버튼 클릭 → 클릭음 + 스핀 실행
  const handleSpin = useCallback(() => {
    playSpinStart()
    spin()
  }, [playSpinStart, spin])

  // 릴 정지 카운터 — 5개 모두 멈추면 startReveal() 호출
  const reelStopCountRef = useRef(0)

  // 새 스핀 시작 시 카운터 초기화
  useEffect(() => {
    reelStopCountRef.current = 0
  }, [spinId])

  const handleReelStop = useCallback((_: number) => {
    playReelTick()
    reelStopCountRef.current++
    if (reelStopCountRef.current >= 5) {
      reelStopCountRef.current = 0
      startReveal()
    }
  }, [playReelTick, startReveal])

  // revealing 페이즈: 패턴 사운드 재생 + 자동 진행
  useEffect(() => {
    if (phase !== 'revealing') return

    const current = patternBreakdowns[revealIndex]
    if (!current) return

    if (current.type === 'fullhouse')     playJackpot()
    else if (current.type === 'vshape')   playMatchVShape()
    else                                  playMatchLine()

    const timer = setTimeout(advanceReveal, 1200)
    return () => clearTimeout(timer)
  }, [phase, revealIndex, patternBreakdowns, playJackpot, playMatchVShape, playMatchLine, advanceReveal])

  // 페이즈 전환 사운드 (round_clear, game_over)
  useEffect(() => {
    if (phase === 'round_clear') playRoundClear()
    if (phase === 'game_over')   playGameOver()
  }, [phase, playRoundClear, playGameOver])

  // 하이라이트 제어:
  //   spinning  → 빈 Set (릴 도는 중 하이라이트 없음)
  //   revealing → 현재 패턴 셀만
  //   idle 등   → undefined (SlotGrid 기본 findLines 사용)
  const revealHighlight = useMemo(() => {
    if (phase === 'spinning') return new Set<string>()
    if (phase !== 'revealing') return undefined
    const current = patternBreakdowns[revealIndex]
    if (!current) return undefined
    const positions = new Set<string>()
    for (const [r, c] of current.positions) {
      positions.add(`${r}-${c}`)
    }
    return positions
  }, [phase, patternBreakdowns, revealIndex])

  const handleSelectItem = useCallback(
    (card: ItemCard) => selectItem(card),
    [selectItem],
  )

  const currentPattern = phase === 'revealing' ? patternBreakdowns[revealIndex] ?? null : null

  return (
    <div
      className="flex flex-col items-center min-h-screen px-4 pt-10 pb-6 sm:pt-14 sm:px-6"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="flex flex-col items-center gap-5 w-full max-w-sm">

        {/* ── Title + 버튼 ─────────────────────────────── */}
        <div className="flex items-center justify-between w-full pt-2">
          <VolumeControl volume={volume} onChange={setVolume} />
          <div className="flex flex-col items-center gap-1">
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
          <AugmentVault />
        </div>

        {/* ── Scoreboard ────────────────────────────────── */}
        <ScoreBoard
          score={score}
          roundTarget={roundTarget}
          spinsInRound={spinsInRound}
          maxSpinsInRound={maxSpinsInRound}
          round={round}
        />

        {/* ── Slot grid + Pattern reveal overlay ────────── */}
        <div className="relative">
          <div
            className="crt-screen rounded-2xl p-3 sm:p-4 arcade-border"
            style={{ background: 'var(--bg-secondary)' }}
          >
            <SlotGrid
              grid={currentGrid}
              onReelStop={handleReelStop}
              overrideHighlight={revealHighlight}
            />
          </div>

          {/* 패턴 강조 팝업 — 그리드 중앙 오버레이 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <PatternReveal pattern={currentPattern} revealIndex={revealIndex} />
          </div>
        </div>

        {/* ── Spin button ───────────────────────────────── */}
        <SpinButton phase={phase} onSpin={handleSpin} />

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
                className="text-[11px] tabular-nums"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-space-mono)' }}
              >
                목표 {Math.round(roundTarget / 10) * 10} pts / 달성 {score.toLocaleString()} pts
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
                  fontFamily: 'var(--font-orbitron)',
                  background: 'transparent',
                  color:      'var(--neon-cyan)',
                  border:     '1px solid var(--neon-cyan)',
                  boxShadow:  '0 0 12px var(--neon-cyan), inset 0 0 12px rgba(0,229,255,0.06)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.background = 'rgba(0,229,255,0.1)'
                  el.style.boxShadow  = '0 0 24px var(--neon-cyan), inset 0 0 20px rgba(0,229,255,0.1)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.background = 'transparent'
                  el.style.boxShadow  = '0 0 12px var(--neon-cyan), inset 0 0 12px rgba(0,229,255,0.06)'
                }}
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── Symbol odds panel — fixed left ────────────── */}
      <SymbolOddsPanel />

      {/* ── Round clear panel — fixed overlay ─────────── */}
      <CardPanel
        visible={phase === 'round_clear'}
        onSelect={handleSelectItem}
        roundScore={roundScore}
        roundTarget={roundTarget}
      />
    </div>
  )
}
