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
    const effects = [makeEffect('symbol_rate_up', 2, 50)]
    tickEffects(effects)
    expect(effects[0].duration).toBe(2)
  })

  test('permanent + number 혼합 시 permanent만 남음 (number=1이면 제거)', () => {
    const effects = [
      makeEffect('score_multiply', 'permanent', 2),
      makeEffect('symbol_score_multiply', 1, 3),
    ]
    const result = tickEffects(effects)
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('score_multiply')
  })
})

describe('addEffect', () => {
  test('이펙트 추가 후 길이 +1', () => {
    const effects = [makeEffect('score_multiply', 'permanent')]
    const newEffect = makeEffect('symbol_rate_up', 'permanent', 2)
    const result = addEffect(effects, newEffect)
    expect(result).toHaveLength(2)
  })

  test('원본 배열 불변 유지', () => {
    const effects = [makeEffect('score_multiply', 'permanent')]
    addEffect(effects, makeEffect('symbol_score_multiply', 'permanent'))
    expect(effects).toHaveLength(1)
  })
})

describe('filterEffectsByType', () => {
  test('특정 타입만 필터링', () => {
    const effects = [
      makeEffect('score_multiply', 'permanent', 2),
      makeEffect('symbol_rate_up', 'permanent', 50),
      makeEffect('score_multiply', 'permanent', 3),
    ]
    const result = filterEffectsByType(effects, 'score_multiply')
    expect(result).toHaveLength(2)
    expect(result.every((e) => e.type === 'score_multiply')).toBe(true)
  })
})
