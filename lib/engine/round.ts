/**
 * 라운드 기반 게임 진행 로직
 */

const ROUND_BASE_TARGET = 20
const ROUND_SCALE_FACTOR = 1.6
export const SPINS_PER_ROUND = 7

/**
 * 라운드별 누적 목표 점수 (모든 라운드 목표의 합산)
 * 점수는 라운드를 넘어 중첩 누적되므로, 클리어 기준도 누적 합계로 판정
 * R1: 20, R2: 52, R3: 103, R4: 184, R5: 315 ...
 */
export function calculateRoundTarget(round: number): number {
  let cumulative = 0
  for (let r = 1; r <= round; r++) {
    cumulative += Math.floor(ROUND_BASE_TARGET * Math.pow(ROUND_SCALE_FACTOR, r - 1))
  }
  return cumulative
}

/**
 * 라운드당 고정 스핀 횟수
 */
export function getSpinsInRound(): number {
  return SPINS_PER_ROUND
}
