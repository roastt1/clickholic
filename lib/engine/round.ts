/**
 * 라운드 기반 게임 진행 로직
 */

const ROUND_BASE_TARGET = 1000
const ROUND_SCALE_FACTOR = 1.5
const MIN_SPINS = 5
const MAX_SPINS = 10

/**
 * 라운드별 목표 점수 계산
 * Round 1: 1000, Round 2: 1500, Round 3: 2250, ...
 */
export function calculateRoundTarget(round: number): number {
  return Math.floor(ROUND_BASE_TARGET * Math.pow(ROUND_SCALE_FACTOR, round - 1))
}

/**
 * 라운드당 스핀 횟수 랜덤 결정 (5~10)
 */
export function getRandomSpinsInRound(): number {
  return Math.floor(Math.random() * (MAX_SPINS - MIN_SPINS + 1)) + MIN_SPINS
}
