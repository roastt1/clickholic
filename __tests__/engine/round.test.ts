import { calculateRoundTarget, getSpinsInRound, SPINS_PER_ROUND } from '@/lib/engine/round'

describe('calculateRoundTarget', () => {
  test('1라운드 목표는 20', () => {
    expect(calculateRoundTarget(1)).toBe(20)
  })

  test('2라운드 목표는 52 (누적: 20+32)', () => {
    expect(calculateRoundTarget(2)).toBe(52)
  })

  test('3라운드 목표는 103 (누적: 20+32+51)', () => {
    expect(calculateRoundTarget(3)).toBe(103)
  })

  test('라운드가 올라갈수록 목표가 증가', () => {
    const targets = [1, 2, 3, 4, 5].map(calculateRoundTarget)
    for (let i = 1; i < targets.length; i++) {
      expect(targets[i]).toBeGreaterThan(targets[i - 1])
    }
  })

  test('항상 정수 반환', () => {
    for (let r = 1; r <= 10; r++) {
      expect(Number.isInteger(calculateRoundTarget(r))).toBe(true)
    }
  })
})

describe('getSpinsInRound', () => {
  test(`항상 ${SPINS_PER_ROUND} 반환`, () => {
    expect(getSpinsInRound()).toBe(SPINS_PER_ROUND)
  })

  test('항상 정수 반환', () => {
    expect(Number.isInteger(getSpinsInRound())).toBe(true)
  })
})
