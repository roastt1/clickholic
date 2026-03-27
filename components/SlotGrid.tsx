'use client'

import { useMemo } from 'react'
import type { SlotSymbol } from '@/types/symbol'
import { findLines } from '@/lib/engine/grid'
import { useGameStore, REEL_FAKE_COUNT } from '@/store/gameStore'
import { ReelColumn } from './ReelColumn'

// grid=null일 때 표시할 정적 더미 스트립 (Math.random 없이 결정론적으로 생성)
const FALLBACK_TYPES: SlotSymbol['type'][] = [
  'cherry', 'grape', 'lemon', 'coin', 'gem', 'crown', 'lucky7', 'skull',
]
const FALLBACK_STRIPS: SlotSymbol[][] = Array.from({ length: 5 }, (_, col) =>
  Array.from({ length: REEL_FAKE_COUNT }, (_, i) => ({
    id:         `fallback-${col}-${i}`,
    type:       FALLBACK_TYPES[(col + i) % FALLBACK_TYPES.length],
    tier:       'L1' as const,
    groupValue: 10,
  }))
)

interface SlotGridProps {
  grid:       SlotSymbol[][] | null
  isSpinning?: boolean  // kept for API compatibility, animation is store-driven
}

export function SlotGrid({ grid }: SlotGridProps) {
  const spinId     = useGameStore((s) => s.spinId)
  const spinStrips = useGameStore((s) => s.spinStrips)
  const finishSpin = useGameStore((s) => s.finishSpin)

  const highlightedPositions = useMemo(() => {
    if (!grid) return new Set<string>()
    const groups    = findLines(grid)
    const positions = new Set<string>()
    for (const group of groups) {
      for (const [row, col] of group.positions) {
        positions.add(`${row}-${col}`)
      }
    }
    return positions
  }, [grid])

  // ── 스켈레톤 (grid=null) ───────────────────────────────────────────────────
  if (!grid) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }, (_, row) => (
          <div key={row} className="flex gap-2">
            {Array.from({ length: 5 }, (_, col) => (
              <div
                key={col}
                className="w-14 h-14 rounded-xl"
                style={{
                  background: 'var(--bg-card)',
                  border:     '1px solid var(--border-dim)',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  // ── 실제 그리드: 열 기반 릴 렌더링 ──────────────────────────────────────
  const effectiveStrips = spinStrips ?? FALLBACK_STRIPS

  return (
    <div className="flex gap-2">
      {Array.from({ length: 5 }, (_, colIdx) => {
        const finalSymbols = [grid[0][colIdx], grid[1][colIdx], grid[2][colIdx]]
        const highlighted  = [
          highlightedPositions.has(`0-${colIdx}`),
          highlightedPositions.has(`1-${colIdx}`),
          highlightedPositions.has(`2-${colIdx}`),
        ]
        return (
          <ReelColumn
            key={colIdx}
            fakeSymbols={effectiveStrips[colIdx]}
            finalSymbols={finalSymbols}
            highlighted={highlighted}
            columnIndex={colIdx}
            spinId={spinId}
            onSpinComplete={colIdx === 4 ? finishSpin : undefined}
          />
        )
      })}
    </div>
  )
}
