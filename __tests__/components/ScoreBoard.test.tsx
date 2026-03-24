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

describe('ScoreBoard', () => {
  test('점수를 포맷팅해서 표시', () => {
    render(<ScoreBoard score={1500} spinsLeft={7} round={3} />)
    expect(screen.getByText('1,500')).toBeInTheDocument()
  })

  test('spinsLeft 표시', () => {
    render(<ScoreBoard score={0} spinsLeft={5} round={1} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  test('round 표시', () => {
    render(<ScoreBoard score={0} spinsLeft={10} round={4} />)
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  test('score=0 일 때 0 표시', () => {
    render(<ScoreBoard score={0} spinsLeft={10} round={1} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
