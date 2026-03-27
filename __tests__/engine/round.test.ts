import { calculateRoundTarget, getRandomSpinsInRound } from '@/lib/engine/round'

describe('calculateRoundTarget', () => {
  test('1라운드 목표는 1000', () => {
    expect(calculateRoundTarget(1)).toBe(1000)
  })

  test('2라운드 목표는 1500', () => {
    expect(calculateRoundTarget(2)).toBe(1500)
  })

  test('3라운드 목표는 2250', () => {
    expect(calculateRoundTarget(3)).toBe(2250)
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

describe('getRandomSpinsInRound', () => {
  test('5~10 범위 내 값 반환', () => {
    for (let i = 0; i < 50; i++) {
      const n = getRandomSpinsInRound()
      expect(n).toBeGreaterThanOrEqual(5)
      expect(n).toBeLessThanOrEqual(10)
    }
  })

  test('항상 정수 반환', () => {
    for (let i = 0; i < 20; i++) {
      expect(Number.isInteger(getRandomSpinsInRound())).toBe(true)
    }
  })
})
