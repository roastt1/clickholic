/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CardPanel } from '@/components/CardPanel'
import type { ItemCard } from '@/types/card'

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

const MOCK_CARDS: ItemCard[] = [
  { id: 'card-a', name: '추가 스핀', description: '스핀 +1', rarity: 'common',    apply: (s) => s },
  { id: 'card-b', name: '황금 스핀', description: '점수 2배', rarity: 'rare',     apply: (s) => s },
  { id: 'card-c', name: '보너스',   description: '+500점',   rarity: 'uncommon', apply: (s) => s },
]

jest.mock('@/store/gameStore', () => ({
  useGameStore: (selector: (s: { offeredCards: ItemCard[] }) => unknown) =>
    selector({ offeredCards: MOCK_CARDS }),
}))

describe('CardPanel', () => {
  test('visible=false 이면 아무것도 렌더링하지 않음', () => {
    render(<CardPanel visible={false} onSelect={jest.fn()} />)
    expect(screen.queryByText('선택하세요')).not.toBeInTheDocument()
  })

  test('visible=true 이면 안내 텍스트 표시', () => {
    render(<CardPanel visible={true} onSelect={jest.fn()} />)
    expect(screen.getByText('선택하세요')).toBeInTheDocument()
  })

  test('visible=true 이면 카드 버튼 3개 렌더링', () => {
    render(<CardPanel visible={true} onSelect={jest.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  test('카드 클릭 시 onSelect 1회 호출', () => {
    const onSelect = jest.fn()
    render(<CardPanel visible={true} onSelect={onSelect} />)
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  test('onSelect에 id를 가진 카드 객체 전달', () => {
    const onSelect = jest.fn()
    render(<CardPanel visible={true} onSelect={onSelect} />)
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: expect.any(String) }),
    )
  })

  test('visible이 false→true로 바뀌면 새 카드 3장 표시', () => {
    const { rerender } = render(<CardPanel visible={false} onSelect={jest.fn()} />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)

    rerender(<CardPanel visible={true} onSelect={jest.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })
})
