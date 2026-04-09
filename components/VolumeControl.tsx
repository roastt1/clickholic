'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface VolumeControlProps {
  volume:   number
  onChange: (v: number) => void
}

function VolumeIcon({ volume }: { volume: number }) {
  if (volume === 0) return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  )
  if (volume < 0.5) return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
  )
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
  )
}

export function VolumeControl({ volume, onChange }: VolumeControlProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.08 }}
        className="w-12 h-12 flex flex-col items-center justify-center gap-0.5 rounded-xl"
        style={{
          color:      'var(--neon-cyan)',
          background: 'var(--bg-card)',
          border:     '1px solid rgba(0,229,255,0.2)',
          boxShadow:  open ? '0 0 12px rgba(0,229,255,0.15)' : 'none',
          cursor:     'pointer',
          transition: 'box-shadow 0.2s',
        }}
      >
        <VolumeIcon volume={volume} />
        <span
          className="text-[10px] font-bold tabular-nums"
          style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-space-mono)' }}
        >
          {Math.round(volume * 100)}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-14 flex flex-col items-center gap-2 px-3 py-3 rounded-xl"
            style={{
              background:     'rgba(8,8,24,0.95)',
              backdropFilter: 'blur(8px)',
              border:         '1px solid rgba(0,229,255,0.2)',
              boxShadow:      '0 4px 24px rgba(0,0,0,0.6)',
              zIndex:         50,
              width:          '2.75rem',
            }}
          >
            {/* 세로 슬라이더 */}
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => onChange(parseFloat(e.target.value))}
              style={{
                writingMode: 'vertical-lr' as React.CSSProperties['writingMode'],
                direction:   'rtl',
                width:       '4px',
                height:      '80px',
                cursor:      'pointer',
                accentColor: 'var(--neon-cyan)',
              }}
            />

            {/* 현재 상태 표시 */}
            <span
              className="text-[9px] tracking-wider uppercase"
              style={{
                width:      '100%',
                textAlign:  'center',
                color:      volume === 0 ? '#ff2d78' : 'var(--text-muted)',
                fontFamily: 'var(--font-orbitron)',
              }}
            >
              {volume === 0 ? 'OFF' : 'ON'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
