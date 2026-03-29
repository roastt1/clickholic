"use client";

import { memo, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import type { SlotSymbol } from "@/types/symbol";
import { REEL_FAKE_COUNT } from "@/store/gameStore";

// ── 치수 상수 (skeleton과 통일: h-14 = 56px) ─────────────────────────────────
const CELL = 56;
const GAP = 8;
const STEP = CELL + GAP; // 64px per symbol slot
const REST_Y = -(REEL_FAKE_COUNT * STEP); // resting y: real symbols visible

// ── 스핀 타이밍 ───────────────────────────────────────────────────────────────
const PHASE1_BASE = 0.6; // phase-1 duration for column 0 (s)
const PHASE1_STAGGER = 0.16; // extra per column (s) — left-to-right stop order

// ── 심볼 설정 ─────────────────────────────────────────────────────────────────
const SYMBOL_DISPLAY: Record<SlotSymbol["type"], { emoji: string; neon: string }> = {
    skull: { emoji: "💀", neon: "#6b7280" },
    lemon: { emoji: "🍋", neon: "#eab308" },
    cherry: { emoji: "🍒", neon: "#ff2d78" },
    clover: { emoji: "🍀", neon: "#22c55e" },
    coin: { emoji: "💴", neon: "#f59e0b" },
    gem: { emoji: "💎", neon: "#00e5ff" },
    crown: { emoji: "👑", neon: "#fbbf24" },
    lucky7: { emoji: "7️⃣", neon: "#00ff88" },
};

interface ReelColumnProps {
    fakeSymbols: SlotSymbol[]; // REEL_FAKE_COUNT개 더미 심볼 (스토어 생성)
    finalSymbols: SlotSymbol[]; // 3개 실제 결과 심볼 (위→아래)
    highlighted: boolean[]; // [row0, row1, row2] 하이라이트 여부
    columnIndex: number; // 0–4: 스태거 기준
    spinId: number; // 스핀마다 증가 → 애니메이션 트리거
}

export const ReelColumn = memo(function ReelColumn({
    fakeSymbols,
    finalSymbols,
    highlighted,
    columnIndex,
    spinId,
}: ReelColumnProps) {
    const controls = useAnimation();
    const visibleH = 3 * CELL + 2 * GAP; // 184px
    const phase1Dur = PHASE1_BASE + columnIndex * PHASE1_STAGGER;
    const fastTarget = -(REEL_FAKE_COUNT * 0.78 * STEP); // phase-1 종착점

    // ── spinId 변경 시 릴 애니메이션 실행 ────────────────────────────────────
    useEffect(() => {
        if (spinId === 0) return;

        // Phase 1: 빠른 선형 스크롤 (심볼이 휙휙 지나감)
        controls.set({ y: 0 });
        controls
            .start({
                y: fastTarget,
                transition: { duration: phase1Dur, ease: "linear" },
            })
            .then(() =>
                // Phase 2: spring 감속 + 오버슈트 → "탁" 하고 멈추는 느낌
                controls.start({
                    y: REST_Y,
                    transition: {
                        type: "spring",
                        stiffness: 95,
                        damping: 13,
                        mass: 0.9,
                        velocity: -1800, // phase-1 종료 속도 이어받기 (px/s)
                        restDelta: 0.5,
                    },
                }),
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spinId]);

    const strip: SlotSymbol[] = [...fakeSymbols, ...finalSymbols];

    return (
        <div
            style={{
                width: CELL,
                height: visibleH,
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* 스크롤 스트립 */}
            <motion.div
                animate={controls}
                initial={{ y: REST_Y }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: GAP,
                }}
            >
                {strip.map((symbol, idx) => {
                    const isReal = idx >= REEL_FAKE_COUNT;
                    const rowIndex = idx - REEL_FAKE_COUNT;
                    const isHigh = isReal && highlighted[rowIndex];
                    const { emoji, neon } = SYMBOL_DISPLAY[symbol.type];

                    return (
                        <div
                            key={`${symbol.id}-${idx}`}
                            data-real={isReal ? "true" : undefined}
                            className="rounded-xl select-none"
                            style={{
                                width: CELL,
                                height: CELL,
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.875rem",
                                background: isHigh ? `color-mix(in srgb, ${neon} 12%, #0c0c22)` : "var(--bg-card)",
                                border: `1px solid ${isHigh ? neon : "var(--border-dim)"}`,
                                boxShadow: isHigh ? `0 0 10px ${neon}99, 0 0 20px ${neon}44` : "none",
                                transition: "box-shadow 0.3s, border-color 0.3s, background 0.3s",
                            }}
                        >
                            {emoji}
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
});
