'use client'

import { useCallback, useRef } from 'react'

type OscType = OscillatorType

function tone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  vol = 0.25,
  type: OscType = 'sine',
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, startTime)
  gain.gain.setValueAtTime(vol, startTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null
    if (!ctxRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Ctx = window.AudioContext ?? (window as any).webkitAudioContext
      if (!Ctx) return null
      ctxRef.current = new Ctx()
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  // 스핀 버튼 클릭음 - 짧고 날카로운 펀치
  const playSpinStart = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    tone(ctx, 440, t,        0.06, 0.35, 'square')
    tone(ctx, 220, t + 0.05, 0.10, 0.2,  'square')
  }, [getCtx])

  // 릴 정지 틱음 - 기계적 클릭
  const playReelTick = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    tone(ctx, 800, t,        0.04, 0.25, 'square')
    tone(ctx, 400, t + 0.03, 0.06, 0.15, 'square')
  }, [getCtx])

  // 3+ 직선 매칭음 - 3음 상승
  const playMatchLine = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    // C5 → E5 → G5
    tone(ctx, 523, t,        0.15, 0.28)
    tone(ctx, 659, t + 0.13, 0.15, 0.28)
    tone(ctx, 784, t + 0.26, 0.22, 0.32)
  }, [getCtx])

  // V-Shape 보너스음 - 4음 상승 팡파레
  const playMatchVShape = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    // C5 → E5 → G5 → C6
    tone(ctx, 523,  t,        0.12, 0.3)
    tone(ctx, 659,  t + 0.11, 0.12, 0.3)
    tone(ctx, 784,  t + 0.22, 0.12, 0.3)
    tone(ctx, 1047, t + 0.33, 0.3,  0.35)
  }, [getCtx])

  // 풀 하우스 잭팟음 - 화려한 9음 팡파레
  const playJackpot = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    // C5 E5 G5 C6 E6 C6 G5 C6 E6 - 슬롯머신 잭팟 팡파레
    const notes = [523, 659, 784, 1047, 1319, 1047, 784, 1047, 1319]
    const durs  = [0.1,  0.1, 0.1, 0.1,  0.1,  0.08, 0.08, 0.1, 0.4]
    let offset = 0
    notes.forEach((freq, i) => {
      tone(ctx, freq, t + offset, durs[i] + 0.1, 0.35)
      offset += durs[i]
    })
  }, [getCtx])

  // 라운드 클리어음 - 4음 승리 징글
  const playRoundClear = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    // C5 → G5 → E6 → C6
    tone(ctx, 523,  t,        0.15, 0.3)
    tone(ctx, 784,  t + 0.14, 0.15, 0.3)
    tone(ctx, 1319, t + 0.28, 0.15, 0.3)
    tone(ctx, 1047, t + 0.42, 0.45, 0.35)
  }, [getCtx])

  // 게임 오버음 - 하강 슬픈 멜로디
  const playGameOver = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    // G4 → E4 → C4
    tone(ctx, 392, t,        0.25, 0.3)
    tone(ctx, 330, t + 0.22, 0.25, 0.3)
    tone(ctx, 262, t + 0.44, 0.55, 0.3)
  }, [getCtx])

  return {
    playSpinStart,
    playReelTick,
    playMatchLine,
    playMatchVShape,
    playJackpot,
    playRoundClear,
    playGameOver,
  }
}
