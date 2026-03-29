import { useGameStore } from '@/store/gameStore'
import type { GameState } from '@/types/game'
import type { ItemCard } from '@/types/card'

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

  test('roundScore는 0', () => {
    expect(useGameStore.getState().roundScore).toBe(0)
  })

  test('spinsInRound는 0', () => {
    expect(useGameStore.getState().spinsInRound).toBe(0)
  })

  test('roundTarget은 20 (1라운드)', () => {
    expect(useGameStore.getState().roundTarget).toBe(20)
  })

  test('maxSpinsInRound는 7 (고정)', () => {
    expect(useGameStore.getState().maxSpinsInRound).toBe(7)
  })

  test('currentGrid는 null', () => {
    expect(useGameStore.getState().currentGrid).toBeNull()
  })
})

describe('spin()', () => {
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

  test('spin 후 spinsInRound가 1 증가', () => {
    useGameStore.getState().spin()
    expect(useGameStore.getState().spinsInRound).toBe(1)
  })

  test('spin 후 spinHistory에 1개 추가', () => {
    useGameStore.getState().spin()
    expect(useGameStore.getState().spinHistory).toHaveLength(1)
  })

  test('idle이 아닐 때 spin은 무시', () => {
    // maxSpinsInRound를 1로 설정하면 첫 spin 직후 round_clear 혹은 game_over
    useGameStore.setState({ maxSpinsInRound: 1, roundTarget: -9999 })
    useGameStore.getState().spin() // round_clear 상태
    const scoreBefore = useGameStore.getState().score
    useGameStore.getState().spin() // 무시되어야 함
    expect(useGameStore.getState().score).toBe(scoreBefore)
  })

  test('마지막 spin에서 목표 달성 시 round_clear', () => {
    // maxSpinsInRound=1, roundTarget=0 → 항상 클리어
    useGameStore.setState({ maxSpinsInRound: 1, roundTarget: -9999 })
    useGameStore.getState().spin()
    expect(useGameStore.getState().phase).toBe('round_clear')
  })

  test('마지막 spin에서 목표 미달 시 game_over', () => {
    // maxSpinsInRound=1, roundTarget=매우 큰 수 → 항상 실패
    useGameStore.setState({ maxSpinsInRound: 1, roundTarget: 9_999_999 })
    useGameStore.getState().spin()
    expect(useGameStore.getState().phase).toBe('game_over')
  })

  test('마지막 spin 전에는 idle 유지', () => {
    useGameStore.setState({ maxSpinsInRound: 3, spinsInRound: 0, roundTarget: -9999 })
    useGameStore.getState().spin()
    expect(useGameStore.getState().phase).toBe('idle')
    useGameStore.getState().spin()
    expect(useGameStore.getState().phase).toBe('idle')
  })
})

describe('selectItem()', () => {
  function toRoundClear() {
    useGameStore.setState({ maxSpinsInRound: 1, roundTarget: -9999 })
    useGameStore.getState().spin()
  }

  test('증강체 선택 후 phase가 idle로 전환', () => {
    toRoundClear()

    const item: ItemCard = {
      id: 'test-item',
      name: '테스트 증강체',
      description: '효과 없음',
      rarity: 'common',
      cost: 0,
      apply: (state: GameState) => state,
    }

    useGameStore.getState().selectItem(item)
    expect(useGameStore.getState().phase).toBe('idle')
  })

  test('증강체 선택 후 라운드 번호 증가', () => {
    toRoundClear()
    const roundBefore = useGameStore.getState().round

    const item: ItemCard = {
      id: 'round-item',
      name: '',
      description: '',
      rarity: 'common',
      cost: 0,
      apply: (state: GameState) => state,
    }

    useGameStore.getState().selectItem(item)
    expect(useGameStore.getState().round).toBe(roundBefore + 1)
  })

  test('증강체 선택 후 roundScore가 0으로 리셋', () => {
    toRoundClear()

    const item: ItemCard = {
      id: 'reset-item',
      name: '',
      description: '',
      rarity: 'common',
      cost: 0,
      apply: (state: GameState) => state,
    }

    useGameStore.getState().selectItem(item)
    expect(useGameStore.getState().roundScore).toBe(0)
  })

  test('선택된 증강체가 deck에 추가', () => {
    toRoundClear()

    const item: ItemCard = {
      id: 'deck-item',
      name: '덱 테스트',
      description: '',
      rarity: 'rare',
      cost: 0,
      apply: (state: GameState) => state,
    }

    useGameStore.getState().selectItem(item)
    expect(useGameStore.getState().deck).toHaveLength(1)
    expect(useGameStore.getState().deck[0].id).toBe('deck-item')
  })

  test('round_clear가 아닐 때 selectItem은 무시', () => {
    const deckBefore = useGameStore.getState().deck
    const item: ItemCard = {
      id: 'ignored',
      name: '',
      description: '',
      rarity: 'common',
      cost: 0,
      apply: (state: GameState) => state,
    }
    useGameStore.getState().selectItem(item)
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
    expect(state.roundScore).toBe(0)
    expect(state.spinsInRound).toBe(0)
    expect(state.currentGrid).toBeNull()
    expect(state.deck).toHaveLength(0)
    expect(state.spinHistory).toHaveLength(0)
    expect(state.round).toBe(1)
    expect(state.roundTarget).toBe(20)
  })
})
