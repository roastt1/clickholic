import type { Effect, EffectType } from '@/types/effect'

/**
 * 스핀 1회 후 effect 수명 감소, 만료된 effect 제거 (불변)
 */
export function tickEffects(effects: Effect[]): Effect[] {
  return effects.reduce<Effect[]>((acc, effect) => {
    if (effect.duration === 'permanent') {
      return [...acc, effect]
    }
    if (effect.duration === 'next_spin') {
      return acc // 제거
    }
    // number: 1 감소, 0이 되면 제거
    const remaining = (effect.duration as number) - 1
    if (remaining <= 0) return acc
    return [...acc, { ...effect, duration: remaining }]
  }, [])
}

export function addEffect(effects: Effect[], newEffect: Effect): Effect[] {
  return [...effects, newEffect]
}

export function filterEffectsByType(effects: Effect[], type: EffectType): Effect[] {
  return effects.filter((e) => e.type === type)
}
