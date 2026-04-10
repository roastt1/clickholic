import type { SlotSymbol } from '@/types/symbol'
import type { Effect } from '@/types/effect'
import type { SpinResult } from '@/types/game'
import { ROWS, COLS } from './grid'
import { calculateScore } from './score'

/**
 * symbol_rate_up 효과를 반영한 가중치 풀 생성
 * 기본 weight를 항상 반영하고, rate_up value만큼 추가 (음수면 감소, -1 이하면 제거)
 */
function buildWeightedPool(
  symbolPool: SlotSymbol[],
  effects: Effect[],
): SlotSymbol[] {
  const rateEffects = effects.filter((e) => e.type === 'symbol_rate_up')

  const weighted: SlotSymbol[] = []

  for (const symbol of symbolPool) {
    const bonus = rateEffects
      .filter((e) => e.targetSymbol === symbol.type)
      .reduce((acc, e) => acc + e.value, 0)

    const weight = (symbol.weight ?? 1) + bonus
    if (weight <= 0) continue // 확률 0 이하 → 풀에서 제거

    // 가중치를 소수점 첫째 자리 단위로 반올림 후 정수 개수로 변환
    // weight 1.0 → 10개, weight 1.5 → 15개, weight 0.5 → 5개
    const count = Math.max(1, Math.round(weight * 10))
    for (let i = 0; i < count; i++) {
      weighted.push(symbol)
    }
  }

  return weighted.length > 0 ? weighted : symbolPool
}

/**
 * luck 스탯 기반 클러스터링 그리드 생성
 *
 * 각 셀을 뽑을 때 지금까지 가장 많이 나온 심볼을 강제 선택할 확률을 부여.
 * clusterChance = min((luck / 100) * mostCommonFrequency, 0.5)
 *
 * luck=0 → 기존 동작과 동일 (clusterChance 항상 0)
 * luck=5, 최빈 심볼 3번 등장 → 15% 강제 확률 → 체감 가능
 * luck=10, 최빈 심볼 5번 등장 → 50% (상한) → 강한 클러스터링
 */
function generateGridWithLuck(pool: SlotSymbol[], luck: number): SlotSymbol[][] {
  const flat: SlotSymbol[] = []
  const frequency = new Map<string, number>()

  for (let i = 0; i < ROWS * COLS; i++) {
    let mostCommonType: string | null = null
    let maxFreq = 0

    for (const [type, freq] of frequency) {
      if (freq > maxFreq) {
        maxFreq = freq
        mostCommonType = type
      }
    }

    const clusterChance = mostCommonType
      ? Math.min((luck / 100) * maxFreq, 0.5)
      : 0

    let picked: SlotSymbol
    if (mostCommonType && Math.random() < clusterChance) {
      picked = pool.find((s) => s.type === mostCommonType) ?? pool[0]
    } else {
      picked = pool[Math.floor(Math.random() * pool.length)]
    }

    frequency.set(picked.type, (frequency.get(picked.type) ?? 0) + 1)
    flat.push({ ...picked })
  }

  return Array.from({ length: ROWS }, (_, row) =>
    flat.slice(row * COLS, (row + 1) * COLS),
  )
}

/**
 * 심볼 풀에서 랜덤하게 3×5 그리드 생성 (가중치 + luck 클러스터링 적용)
 */
export function generateGrid(
  symbolPool: SlotSymbol[],
  effects: Effect[] = [],
  luck = 0,
): SlotSymbol[][] {
  if (symbolPool.length === 0) {
    throw new Error('symbolPool is empty')
  }

  const pool = buildWeightedPool(symbolPool, effects)
  return generateGridWithLuck(pool, luck)
}

/**
 * 스핀 실행: 그리드 생성 → 점수 계산 → SpinResult 반환
 */
export function executeSpin(
  symbolPool: SlotSymbol[],
  effects: Effect[],
  luck = 0,
): SpinResult {
  const symbols = generateGrid(symbolPool, effects, luck)
  const breakdown = calculateScore(symbols, effects)

  return {
    symbols,
    score: breakdown.total,
    bonuses: effects.filter(
      (e) => e.type === 'score_multiply' || e.type === 'symbol_score_multiply',
    ),
    patternFlags:      breakdown.patternFlags,
    patternBreakdowns: breakdown.patternBreakdowns,
  }
}
