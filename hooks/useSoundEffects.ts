'use client'

import useSound from 'use-sound'

export function useSoundEffects(masterVolume: number) {
  const v = masterVolume

  const [playSpinStart]   = useSound('/sounds/spin-start.wav',   { volume: v * 0.6 })
  const [playReelTick]    = useSound('/sounds/reel-tick.wav',    { volume: v * 1.0 })
  const [playMatchLine]   = useSound('/sounds/match-line.wav',   { volume: v * 1.0 })
  const [playMatchVShape] = useSound('/sounds/match-vshape.wav', { volume: v * 0.7 })
  const [playJackpot]     = useSound('/sounds/jackpot.wav',      { volume: v * 0.8 })
  const [playRoundClear]  = useSound('/sounds/round-clear.wav',  { volume: v * 0.7 })
  const [playGameOver]    = useSound('/sounds/game-over.wav',    { volume: v * 0.7 })

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
