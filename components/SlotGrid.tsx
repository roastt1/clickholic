'use client'

import { useMemo } from 'react'
import type { SlotSymbol } from '@/types/symbol'
import { findLines } from '@/lib/engine/grid'
import { SymbolCell } from './SymbolCell'

interface SlotGridProps {
  grid: SlotSymbol[][] | null
  isSpinning?: boolean
}

export function SlotGrid({ grid, isSpinning = false }: SlotGridProps) {
  const highlightedPositions = useMemo(() => {
    if (!grid) return new Set<string>()
    const groups = findLines(grid)
    const positions = new Set<string>()
    for (const group of groups) {
      for (const [row, col] of group.positions) {
        positions.add(`${row}-${col}`)
      }
    }
    return positions
  }, [grid])

  if (!grid) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }, (_, row) => (
          <div key={row} className="flex gap-2">
            {Array.from({ length: 5 }, (_, col) => (
              <div
                key={col}
                className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 ring-1 ring-black/10 dark:ring-white/10"
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-2">
          {row.map((symbol, colIdx) => (
            <SymbolCell
              key={`${rowIdx}-${colIdx}`}
              symbol={symbol}
              isHighlighted={highlightedPositions.has(`${rowIdx}-${colIdx}`)}
              isSpinning={isSpinning}
              animationDelay={isSpinning ? colIdx * 0.05 : 0}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
