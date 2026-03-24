import { tickEffects, addEffect, filterEffectsByType } from '@/lib/engine/effects'
import type { Effect } from '@/types/effect'

function makeEffect(
  type: Effect['type'],
  duration: Effect['duration'],
  value = 1,
): Effect {
  return { type, value, duration, description: 'test' }
}

describe('tickEffects', () => {
  test('permanent 이펙트는 유지', () => {
    const effects = [makeEffect('score_multiply', 'permanent', 2)]
    const result = tickEffects(effects)
    expect(result).toHaveLength(1)
    expect(result[0].duration).toBe('permanent')
  })

  test('next_spin 이펙트는 제거', () => {
    const effects = [makeEffect('score_add', 'next_spin', 50)]
    const result = tickEffects(effects)
    expect(result).toHaveLength(0)
  })

  test('number duration: 2 → 1로 감소', () => {
    const effects = [makeEffect('score_multiply', 2, 2)]
    const result = tickEffects(effects)
    expect(result).toHaveLength(1)
    expect(result[0].duration).toBe(1)
  })

  test('number duration: 1 → 0이 되면 제거', () => {
    const effects = [makeEffect('score_multiply', 1, 2)]
    const result = tickEffects(effects)
    expect(result).toHaveLength(0)
  })

  test('원본 배열 불변 유지', () => {
    const effects = [makeEffect('score_add', 2, 50)]
    tickEffects(effects)
    expect(effects[0].duration).toBe(2)
  })
})

describe('addEffect', () => {
  test('이펙트 추가 후 길이 +1', () => {
    const effects = [makeEffect('score_add', 'permanent')]
    const newEffect = makeEffect('score_multiply', 'next_spin', 2)
    const result = addEffect(effects, newEffect)
    expect(result).toHaveLength(2)
  })

  test('원본 배열 불변 유지', () => {
    const effects = [makeEffect('score_add', 'permanent')]
    addEffect(effects, makeEffect('score_multiply', 'next_spin'))
    expect(effects).toHaveLength(1)
  })
})

describe('filterEffectsByType', () => {
  test('특정 타입만 필터링', () => {
    const effects = [
      makeEffect('score_multiply', 'permanent', 2),
      makeEffect('score_add', 'permanent', 50),
      makeEffect('score_multiply', 'next_spin', 3),
    ]
    const result = filterEffectsByType(effects, 'score_multiply')
    expect(result).toHaveLength(2)
    expect(result.every((e) => e.type === 'score_multiply')).toBe(true)
  })
})
