/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ScoreBoard } from '@/components/ScoreBoard'

jest.mock('framer-motion', () => {
  const React = require('react')
  const makeMotion = (tag: string) =>
    React.forwardRef(({ children, initial, animate, exit, transition, variants, whileHover, whileTap, ...props }: any, ref: any) =>
      React.createElement(tag, { ...props, ref }, children)
    )
  return {
    motion: new Proxy({}, { get: (_, tag: string) => makeMotion(tag) }),
    AnimatePresence: ({ children }: any) => children,
  }
})

jest.mock('@/store/gameStore', () => ({
  useGameStore: (selector: (s: {
    spinId: number; scoreGain: number;
    phase: string; patternBreakdowns: unknown[]; revealIndex: number
  }) => unknown) =>
    selector({ spinId: 1, scoreGain: 0, phase: 'idle', patternBreakdowns: [], revealIndex: 0 }),
}))

const DEFAULT_PROPS = {
  score:           0,
  roundTarget:     1000,
  spinsInRound:    0,
  maxSpinsInRound: 7,
  round:           1,
}

describe('ScoreBoard', () => {
  test('누적 점수 표시 (10의 자리 반올림)', () => {
    render(<ScoreBoard {...DEFAULT_PROPS} score={750} />)
    expect(screen.getByText('750')).toBeInTheDocument()
  })

  test('목표 점수 표시 (10의 자리 반올림)', () => {
    render(<ScoreBoard {...DEFAULT_PROPS} roundTarget={2000} />)
    expect(screen.getByText(/2,000/)).toBeInTheDocument()
  })

  test('남은 스핀 표시', () => {
    render(<ScoreBoard {...DEFAULT_PROPS} spinsInRound={3} maxSpinsInRound={7} />)
    expect(screen.getByText('4')).toBeInTheDocument() // 7 - 3 = 4
  })

  test('라운드 번호 표시', () => {
    render(<ScoreBoard {...DEFAULT_PROPS} round={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  test('score=0 일 때 0 표시', () => {
    render(<ScoreBoard {...DEFAULT_PROPS} score={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
