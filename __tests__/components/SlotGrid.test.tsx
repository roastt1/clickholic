/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SlotGrid } from '@/components/SlotGrid'
import type { SlotSymbol } from '@/types/symbol'

jest.mock('framer-motion', () => {
  const React = require('react')
  const makeMotion = (tag: string) =>
    React.forwardRef(({ children, initial, animate, exit, transition, variants, whileHover, whileTap, ...props }: any, ref: any) =>
      React.createElement(tag, { ...props, ref }, children)
    )
  return {
    motion: new Proxy({}, { get: (_, tag: string) => makeMotion(tag) }),
    AnimatePresence: ({ children }: any) => children,
    useAnimation: () => ({
      set:   jest.fn(),
      start: jest.fn().mockResolvedValue(undefined),
    }),
  }
})

jest.mock('@/store/gameStore', () => ({
  useGameStore: (selector: (s: { spinId: number; spinStrips: null }) => unknown) =>
    selector({ spinId: 0, spinStrips: null }),
  REEL_FAKE_COUNT: 22,
}))

function makeSymbol(type: SlotSymbol['type']): SlotSymbol {
  return { id: type, type, tier: 'L1', groupValue: 10 }
}

function makeGrid(types: SlotSymbol['type'][][]): SlotSymbol[][] {
  return types.map((row) => row.map(makeSymbol))
}

const TEST_GRID = makeGrid([
  ['cherry', 'clover',  'lemon',  'coin',  'gem'],
  ['crown',  'lucky7', 'skull',  'lemon', 'cherry'],
  ['clover',  'lemon',  'cherry', 'coin',  'gem'],
])

describe('SlotGrid', () => {
  describe('grid=null (스켈레톤)', () => {
    test('3행을 렌더링', () => {
      const { container } = render(<SlotGrid grid={null} />)
      const rows = container.firstChild?.childNodes
      expect(rows).toHaveLength(3)
    })

    test('각 행에 5개 셀 렌더링 (총 15개)', () => {
      const { container } = render(<SlotGrid grid={null} />)
      const cells = container.querySelectorAll('.rounded-xl')
      expect(cells).toHaveLength(15)
    })
  })

  describe('grid 있음 (실제 심볼)', () => {
    test('실제 심볼 셀 15개 렌더링', () => {
      const { container } = render(<SlotGrid grid={TEST_GRID} />)
      const realCells = container.querySelectorAll('[data-real="true"]')
      expect(realCells).toHaveLength(15)
    })

    test('isSpinning prop 전달해도 에러 없이 렌더링', () => {
      expect(() => render(<SlotGrid grid={TEST_GRID} isSpinning={true} />)).not.toThrow()
    })

    test('isSpinning 없이 렌더링', () => {
      expect(() => render(<SlotGrid grid={TEST_GRID} />)).not.toThrow()
    })
  })
})
