import { useGameStore } from '@/store/gameStore'
import type { GameState } from '@/types/game'
import type { ItemCard } from '@/types/card'

// 스토어를 각 테스트 전에 초기 상태로 리셋
beforeEach(() => {
  useGameStore.getState().resetGame()
})

describe('초기 상태', () => {
  test('phase는 idle', () => {
    expect(useGameStore.getState().phase).toBe('idle')
  })

  test('score는 0', () => {
    expect(useGameStore.getState().score).toBe(0)
  })

  test('spinsLeft는 10', () => {
    expect(useGameStore.getState().spinsLeft).toBe(10)
  })

  test('currentGrid는 null', () => {
    expect(useGameStore.getState().currentGrid).toBeNull()
  })
})

describe('spin()', () => {
  test('spin 후 phase가 card_select로 전환', () => {
    useGameStore.getState().spin()
    expect(useGameStore.getState().phase).toBe('card_select')
  })

  test('spin 후 currentGrid가 3×5 그리드', () => {
    useGameStore.getState().spin()
    const grid = useGameStore.getState().currentGrid
    expect(grid).not.toBeNull()
    expect(grid).toHaveLength(3)
    grid!.forEach((row) => expect(row).toHaveLength(5))
  })

  test('spin 후 score가 숫자', () => {
    useGameStore.getState().spin()
    expect(typeof useGameStore.getState().score).toBe('number')
  })

  test('spin 후 spinsLeft가 1 감소', () => {
    useGameStore.getState().spin()
    expect(useGameStore.getState().spinsLeft).toBe(9)
  })

  test('spin 후 spinHistory에 1개 추가', () => {
    useGameStore.getState().spin()
    expect(useGameStore.getState().spinHistory).toHaveLength(1)
  })

  test('idle이 아닐 때 spin은 무시', () => {
    useGameStore.getState().spin() // card_select 상태로 전환
    const scoreBefore = useGameStore.getState().score
    useGameStore.getState().spin() // 무시되어야 함
    expect(useGameStore.getState().score).toBe(scoreBefore)
  })

  test('마지막 spin 후 phase가 game_over', () => {
    // 9번 spin하여 spinsLeft=1 상태 만들기
    for (let i = 0; i < 9; i++) {
      useGameStore.setState({ phase: 'idle', spinsLeft: 10 - i })
      useGameStore.getState().spin()
    }
    useGameStore.setState({ phase: 'idle', spinsLeft: 1 })
    useGameStore.getState().spin()
    expect(useGameStore.getState().phase).toBe('game_over')
  })
})

describe('selectCard()', () => {
  test('카드 적용 후 phase가 idle로 전환', () => {
    useGameStore.getState().spin() // card_select 상태로 전환

    const card: ItemCard = {
      id: 'test-card',
      name: '테스트 카드',
      description: '점수 +100',
      rarity: 'common',
      cost: 0,
      apply: (state: GameState) => ({ ...state, score: state.score + 100 }),
    }

    useGameStore.getState().selectCard(card)
    expect(useGameStore.getState().phase).toBe('idle')
  })

  test('카드 효과가 score에 반영', () => {
    useGameStore.getState().spin()
    const scoreBefore = useGameStore.getState().score

    const card: ItemCard = {
      id: 'score-card',
      name: '점수 카드',
      description: '+100',
      rarity: 'common',
      cost: 0,
      apply: (state: GameState) => ({ ...state, score: state.score + 100 }),
    }

    useGameStore.getState().selectCard(card)
    expect(useGameStore.getState().score).toBe(scoreBefore + 100)
  })

  test('선택된 카드가 deck에 추가', () => {
    useGameStore.getState().spin()

    const card: ItemCard = {
      id: 'deck-card',
      name: '덱 카드',
      description: '',
      rarity: 'rare',
      cost: 0,
      apply: (state: GameState) => state,
    }

    useGameStore.getState().selectCard(card)
    expect(useGameStore.getState().deck).toHaveLength(1)
    expect(useGameStore.getState().deck[0].id).toBe('deck-card')
  })

  test('card_select가 아닐 때 selectCard는 무시', () => {
    const deckBefore = useGameStore.getState().deck
    const card: ItemCard = {
      id: 'ignored',
      name: '',
      description: '',
      rarity: 'common',
      cost: 0,
      apply: (state: GameState) => state,
    }
    useGameStore.getState().selectCard(card)
    expect(useGameStore.getState().deck).toEqual(deckBefore)
  })
})

describe('resetGame()', () => {
  test('spin 후 reset하면 초기 상태로 복귀', () => {
    useGameStore.getState().spin()
    useGameStore.getState().resetGame()

    const state = useGameStore.getState()
    expect(state.phase).toBe('idle')
    expect(state.score).toBe(0)
    expect(state.spinsLeft).toBe(10)
    expect(state.currentGrid).toBeNull()
    expect(state.deck).toHaveLength(0)
    expect(state.spinHistory).toHaveLength(0)
  })
})
