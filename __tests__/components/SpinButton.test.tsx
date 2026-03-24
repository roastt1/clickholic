/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SpinButton } from '@/components/SpinButton'

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

describe('SpinButton', () => {
  test('idle 상태에서 SPIN 텍스트 표시', () => {
    render(<SpinButton phase="idle" onSpin={jest.fn()} />)
    expect(screen.getByRole('button', { name: 'SPIN' })).toBeInTheDocument()
  })

  test('idle 상태에서 버튼 활성화', () => {
    render(<SpinButton phase="idle" onSpin={jest.fn()} />)
    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  test('card_select 상태에서 버튼 비활성화', () => {
    render(<SpinButton phase="card_select" onSpin={jest.fn()} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  test('game_over 상태에서 버튼 비활성화', () => {
    render(<SpinButton phase="game_over" onSpin={jest.fn()} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  test('idle에서 클릭 시 onSpin 1회 호출', () => {
    const onSpin = jest.fn()
    render(<SpinButton phase="idle" onSpin={onSpin} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onSpin).toHaveBeenCalledTimes(1)
  })

  test('비활성 상태에서 클릭해도 onSpin 미호출', () => {
    const onSpin = jest.fn()
    render(<SpinButton phase="card_select" onSpin={onSpin} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onSpin).not.toHaveBeenCalled()
  })

  test('game_over 상태에서 GAME OVER 텍스트 표시', () => {
    render(<SpinButton phase="game_over" onSpin={jest.fn()} />)
    expect(screen.getByText('GAME OVER')).toBeInTheDocument()
  })

  test('card_select 상태에서 ... 텍스트 표시', () => {
    render(<SpinButton phase="card_select" onSpin={jest.fn()} />)
    expect(screen.getByText('...')).toBeInTheDocument()
  })
})
