import { generateGrid, executeSpin } from '@/lib/engine/spin'
import { ROWS, COLS } from '@/lib/engine/grid'
import { calculateSymbolOdds } from '@/lib/engine/odds'
import type { SlotSymbol } from '@/types/symbol'

function makeSymbol(type: SlotSymbol['type'], weight?: number): SlotSymbol {
  return { id: type, type, tier: 'L1', groupValue: 10, ...(weight !== undefined && { weight }) }
}

const symbolPool: SlotSymbol[] = [
  makeSymbol('cherry'),
  makeSymbol('clover'),
  makeSymbol('lemon'),
]

describe('generateGrid', () => {
  test(`항상 ${ROWS}×${COLS} 그리드 반환`, () => {
    const grid = generateGrid(symbolPool)
    expect(grid).toHaveLength(ROWS)
    grid.forEach((row) => expect(row).toHaveLength(COLS))
  })

  test('심볼 풀에 있는 타입만 포함', () => {
    const grid = generateGrid(symbolPool)
    const validTypes = symbolPool.map((s) => s.type)
    grid.flat().forEach((symbol) => {
      expect(validTypes).toContain(symbol.type)
    })
  })

  test('원본 symbolPool 심볼 객체를 직접 참조하지 않음 (불변)', () => {
    const grid = generateGrid(symbolPool)
    grid.flat().forEach((symbol) => {
      expect(symbolPool).not.toContain(symbol)
    })
  })

  test('빈 풀이면 에러', () => {
    expect(() => generateGrid([])).toThrow('symbolPool is empty')
  })

  test('이펙트 없이 기본 weight가 확률에 반영됨', () => {
    // heavy(weight=3.0)가 light(weight=0.1)보다 훨씬 자주 나와야 함
    const heavySymbol = makeSymbol('cherry', 3.0)
    const lightSymbol = makeSymbol('clover', 0.1)
    const pool = [heavySymbol, lightSymbol]

    let heavyCount = 0
    let lightCount = 0
    const TRIALS = 1000
    for (let i = 0; i < TRIALS; i++) {
      const grid = generateGrid(pool, [])
      grid.flat().forEach((s) => {
        if (s.type === 'cherry') heavyCount++
        else if (s.type === 'clover') lightCount++
      })
    }
    // heavy는 light보다 통계적으로 유의미하게 많아야 함 (기대 비율 약 30:1)
    expect(heavyCount).toBeGreaterThan(lightCount * 5)
  })

  test('이펙트 없을 때 calculateSymbolOdds와 실제 스핀 확률 순서 일치', () => {
    const pool = [
      makeSymbol('cherry', 1.8),
      makeSymbol('clover', 1.5),
      makeSymbol('lucky7', 0.7),
      makeSymbol('skull', 0.3),
    ]

    // odds.ts가 예측하는 확률 순서
    const oddsResult = calculateSymbolOdds(pool, [])
    const oddsRanked = [...oddsResult].sort((a, b) => b.pct - a.pct).map((o) => o.type)

    // 실제 스핀 통계
    const counts: Record<string, number> = {}
    pool.forEach((s) => { counts[s.type] = 0 })
    const TRIALS = 2000
    for (let i = 0; i < TRIALS; i++) {
      generateGrid(pool, []).flat().forEach((s) => { counts[s.type]++ })
    }
    const statsRanked = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([type]) => type)

    // 1위와 꼴찌가 일치해야 함 (통계적으로 가장 안정적인 비교)
    expect(statsRanked[0]).toBe(oddsRanked[0])
    expect(statsRanked[statsRanked.length - 1]).toBe(oddsRanked[oddsRanked.length - 1])
  })

  test('symbol_rate_up 효과로 특정 심볼 비율 증가', () => {
    // cherry에 매우 높은 가중치를 주면 대부분 cherry로 채워짐
    const effects = [
      { type: 'symbol_rate_up' as const, value: 100, duration: 'permanent' as const, targetSymbol: 'cherry' as const, description: 'cherry 확률 ↑' },
    ]
    const grid = generateGrid(symbolPool, effects)
    const cherryCount = grid.flat().filter((s) => s.type === 'cherry').length
    // 매우 높은 가중치 → cherry가 절반 이상 차지해야 함
    expect(cherryCount).toBeGreaterThan(7)
  })
})

describe('luck 클러스터링', () => {
  const pool = [makeSymbol('cherry', 1.0), makeSymbol('clover', 1.0)]

  // 그리드에서 가장 많이 등장한 심볼 개수 반환
  function maxSymbolCount(grid: ReturnType<typeof generateGrid>): number {
    const counts: Record<string, number> = {}
    grid.flat().forEach((s) => { counts[s.type] = (counts[s.type] ?? 0) + 1 })
    return Math.max(...Object.values(counts))
  }

  // n회 시행 평균 maxSymbolCount
  function avgMaxCount(luck: number, trials = 400): number {
    let sum = 0
    for (let i = 0; i < trials; i++) sum += maxSymbolCount(generateGrid(pool, [], luck))
    return sum / trials
  }

  test('luck=0: clusterChance 항상 0 → 기존 동작 유지 (평균 최빈 심볼 10개 미만)', () => {
    // 등가중치 2심볼, 15셀 → 기대 최빈 ~9
    expect(avgMaxCount(0)).toBeLessThan(10)
  })

  test('luck=50: 최빈 심볼 빈도가 luck=0보다 유의미하게 높음 (클러스터링 체감)', () => {
    const avg0  = avgMaxCount(0)
    const avg50 = avgMaxCount(50)
    // luck=50이면 클러스터링으로 최빈 심볼 평균 빈도가 1.5개 이상 증가해야 함
    expect(avg50).toBeGreaterThan(avg0 + 1.5)
  })

  test('luck 파라미터 생략 시 기본값 0으로 정상 동작', () => {
    expect(() => generateGrid(pool, [])).not.toThrow()
    const grid = generateGrid(pool, [])
    expect(grid).toHaveLength(ROWS)
    grid.forEach((row) => expect(row).toHaveLength(COLS))
  })

  test('luck=100: clusterChance 상한 0.5 준수 → 전체 동일 그리드는 드물어야 함', () => {
    let allSameCount = 0
    const TRIALS = 300
    for (let i = 0; i < TRIALS; i++) {
      if (maxSymbolCount(generateGrid(pool, [], 100)) === 15) allSameCount++
    }
    // 상한 75% 제약으로 인해 15셀 전부 동일은 30% 미만이어야 함
    expect(allSameCount / TRIALS).toBeLessThan(0.3)
  })

  test('executeSpin luck 파라미터 전달 → score 정상 계산', () => {
    const singlePool = [makeSymbol('cherry')]
    const result = executeSpin(singlePool, [], 10)
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.symbols).toHaveLength(ROWS)
  })
})

describe('executeSpin', () => {
  test('SpinResult의 symbols가 3×5', () => {
    const result = executeSpin(symbolPool, [])
    expect(result.symbols).toHaveLength(ROWS)
    result.symbols.forEach((row) => expect(row).toHaveLength(COLS))
  })

  test('score는 0 이상', () => {
    const result = executeSpin(symbolPool, [])
    expect(result.score).toBeGreaterThanOrEqual(0)
  })

  test('score_multiply 이펙트가 score에 반영', () => {
    // 3개짜리 cherry 라인이 나올 수 있도록 단일 심볼 풀 사용
    const singlePool: SlotSymbol[] = [makeSymbol('cherry')]
    const effect = { type: 'score_multiply' as const, value: 2, duration: 'permanent' as const, description: '2배' }
    const noEffect = executeSpin(singlePool, [])
    const withEffect = executeSpin(singlePool, [effect])
    // 배수 적용 버전은 기본 버전의 2배여야 함
    expect(withEffect.score).toBe(noEffect.score * 2)
  })

  test('bonuses에 score_multiply 이펙트 포함', () => {
    const scoreEffect = { type: 'score_multiply' as const, value: 2, duration: 'permanent' as const, description: '2배' }
    const result = executeSpin(symbolPool, [scoreEffect])
    expect(result.bonuses.some((b) => b.type === 'score_multiply')).toBe(true)
  })
})
