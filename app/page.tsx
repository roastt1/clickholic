'use client'

import dynamic from 'next/dynamic'

const GameScreen = dynamic(() =>
  import('@/components/GameScreen').then(m => m.GameScreen),
  { ssr: false, loading: () => null }
)

export default function Home() {
  return <GameScreen />
}
