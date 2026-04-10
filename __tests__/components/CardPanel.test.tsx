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

const MOCK_ITEMS: ItemCard[] = [
  { id: 'item-a', name: '럭키 세븐 집착', description: '7️⃣ 출현 확률 +50%', rarity: 'rare',      cost: 0, apply: (s) => s },
  { id: 'item-b', name: '황금 왕관',      description: '👑 점수 ×2',          rarity: 'rare',      cost: 0, apply: (s) => s },
  { id: 'item-c', name: '코인 러시',      description: '🪙 출현 확률 +80%',   rarity: 'uncommon',  cost: 0, apply: (s) => s },
]

jest.mock('@/store/gameStore', () => ({
  useGameStore: (selector: (s: { offeredItems: ItemCard[] }) => unknown) =>
    selector({ offeredItems: MOCK_ITEMS }),
}))

describe('CardPanel', () => {
  test('visible=false 이면 아무것도 렌더링하지 않음', () => {
    render(<CardPanel visible={false} onSelect={jest.fn()} roundScore={500} roundTarget={1000} />)
    expect(screen.queryByText('증강체를 선택하세요')).not.toBeInTheDocument()
  })

  test('visible=true 이면 라운드 클리어 메시지 표시', () => {
    render(<CardPanel visible={true} onSelect={jest.fn()} roundScore={1200} roundTarget={1000} />)
    expect(screen.getByText('Round Clear!')).toBeInTheDocument()
  })

  // "화면 보기" 토글 버튼(aria-label 있음)을 제외한 카드 버튼만 반환
  function getCardButtons() {
    return screen.getAllByRole('button').filter((b) => !b.hasAttribute('aria-label'))
  }

  test('visible=true 이면 증강체 버튼 3개 렌더링', () => {
    render(<CardPanel visible={true} onSelect={jest.fn()} roundScore={1200} roundTarget={1000} />)
    expect(getCardButtons()).toHaveLength(3)
  })

  test('증강체 클릭 시 onSelect 1회 호출', () => {
    const onSelect = jest.fn()
    render(<CardPanel visible={true} onSelect={onSelect} roundScore={1200} roundTarget={1000} />)
    fireEvent.click(getCardButtons()[0])
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  test('onSelect에 id를 가진 카드 객체 전달', () => {
    const onSelect = jest.fn()
    render(<CardPanel visible={true} onSelect={onSelect} roundScore={1200} roundTarget={1000} />)
    fireEvent.click(getCardButtons()[0])
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: expect.any(String) }),
    )
  })

  test('visible이 false→true로 바뀌면 증강체 3개 표시', () => {
    const { rerender } = render(<CardPanel visible={false} onSelect={jest.fn()} roundScore={0} roundTarget={1000} />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)

    rerender(<CardPanel visible={true} onSelect={jest.fn()} roundScore={1200} roundTarget={1000} />)
    expect(getCardButtons()).toHaveLength(3)
  })
})
