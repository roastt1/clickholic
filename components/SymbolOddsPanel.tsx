"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { SYMBOL_POOL } from "@/lib/data/symbols";
import { calculateSymbolOdds } from "@/lib/engine/odds";
import { getSymbolScoreMultiplier } from "@/lib/engine/score";
import type { SymbolType } from "@/types/symbol";
import type { Effect } from "@/types/effect";

const SYMBOL_META: Record<SymbolType, { emoji: string; label: string; neon: string }> = {
    skull: { emoji: "💀", label: "Skull", neon: "#6b7280" },
    lemon: { emoji: "🍋", label: "Lemon", neon: "#eab308" },
    cherry: { emoji: "🍒", label: "Cherry", neon: "#ff2d78" },
    clover: { emoji: "🍀", label: "Clover", neon: "#22c55e" },
    coin: { emoji: "💴", label: "Coin", neon: "#f59e0b" },
    gem: { emoji: "💎", label: "Gem", neon: "#00e5ff" },
    crown: { emoji: "👑", label: "Crown", neon: "#fbbf24" },
    lucky7: { emoji: "7️⃣", label: "Lucky7", neon: "#00ff88" },
};

const BASE_PCT = (1 / 8) * 100;

// 심볼 기본 점수 맵
const BASE_SCORE: Record<SymbolType, number> = Object.fromEntries(
    SYMBOL_POOL.map((s) => [s.type, s.groupValue]),
) as Record<SymbolType, number>;

// ── 심볼 목록 (데스크탑 패널 + 모바일 시트 공용) ───────────────────────────
function OddsList({
    odds,
    hasModifier,
    effects,
}: {
    odds: { type: SymbolType; pct: number }[];
    hasModifier: boolean;
    effects: Effect[];
}) {
    return (
        <>
            {odds.map(({ type, pct }) => {
                const { emoji, label, neon } = SYMBOL_META[type];
                const isRemoved = pct === 0;
                const isModified = hasModifier && Math.abs(pct - BASE_PCT) > 0.1;

                const baseScore = BASE_SCORE[type];
                const multiplier = getSymbolScoreMultiplier(type, effects);
                const effectiveScore = Math.round(baseScore * multiplier);
                const hasScoreBoost = multiplier !== 1;

                return (
                    <div key={type} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span style={{ fontSize: "1rem", lineHeight: 1, opacity: isRemoved ? 0.3 : 1 }}>
                                    {emoji}
                                </span>
                                <span
                                    className="text-xs"
                                    style={{
                                        color: isRemoved ? "var(--text-muted)" : "var(--text-primary)",
                                        opacity: isRemoved ? 0.4 : 1,
                                    }}
                                >
                                    {label}
                                </span>
                            </div>

                            <div className="flex flex-col items-end gap-0.5">
                                <div className="flex items-center gap-1">
                                    {isModified && !isRemoved && (
                                        <span
                                            className="text-[9px] font-bold"
                                            style={{ color: pct > BASE_PCT ? "var(--neon-green)" : "var(--neon-pink)" }}
                                        >
                                            {pct > BASE_PCT ? "▲" : "▼"}
                                        </span>
                                    )}
                                    {isRemoved && (
                                        <span className="text-[9px]" style={{ color: "var(--neon-pink)" }}>
                                            ✕
                                        </span>
                                    )}
                                    <span
                                        className="text-xs tabular-nums font-bold"
                                        style={{
                                            color: isRemoved
                                                ? "rgba(255,0,128,0.4)"
                                                : isModified
                                                  ? neon
                                                  : "var(--text-muted)",
                                            minWidth: "3.2ch",
                                            textAlign: "right",
                                        }}
                                    >
                                        {isRemoved ? "0%" : `${pct.toFixed(1)}%`}
                                    </span>
                                </div>
                                {/* 배당 점수 */}
                                <div className="flex items-center gap-1">
                                    {hasScoreBoost && !isRemoved ? (
                                        <>
                                            <span className="text-xs tabular-nums" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "line-through" }}>
                                                {baseScore}
                                            </span>
                                            <span className="text-xs tabular-nums font-bold" style={{ color: neon }}>
                                                {effectiveScore}pt
                                            </span>
                                            <span
                                                className="text-[9px] font-bold px-0.5 rounded"
                                                style={{ color: neon, background: `${neon}22` }}
                                            >
                                                ×{multiplier}
                                            </span>
                                        </>
                                    ) : (
                                        <span
                                            className="text-xs tabular-nums"
                                            style={{ color: isRemoved ? "rgba(255,0,128,0.4)" : "rgba(255,255,255,0.6)" }}
                                        >
                                            {baseScore}pt
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>


                        {/* 확률 바 */}
                        <div
                            className="w-full rounded-full overflow-hidden"
                            style={{ height: "3px", background: "rgba(255,255,255,0.06)" }}
                        >
                            <motion.div
                                className="h-full rounded-full"
                                style={{
                                    background: isRemoved ? "transparent" : neon,
                                    boxShadow: isRemoved || !isModified ? "none" : `0 0 6px ${neon}aa`,
                                }}
                                animate={{ width: `${pct}%` }}
                                initial={{ width: `${BASE_PCT}%` }}
                                transition={{ duration: 0.55, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                );
            })}
        </>
    );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export function SymbolOddsPanel() {
    const activeEffects = useGameStore((s) => s.activeEffects);
    const [sheetOpen, setSheetOpen] = useState(false);

    const odds = useMemo(() => calculateSymbolOdds(SYMBOL_POOL, activeEffects), [activeEffects]);

    const hasModifier = activeEffects.some((e) => e.type === "symbol_rate_up");

    return (
        <>
            {/* ── 데스크탑: 좌측 고정 패널 ───────────────────────────────────────── */}
            <div
                className="hidden lg:flex fixed left-5 top-1/2 flex-col gap-2.5 p-4 rounded-2xl"
                style={{
                    width: "190px",
                    transform: "translateY(-50%)",
                    background: "var(--bg-secondary)",
                    border: "1px solid rgba(0,229,255,0.14)",
                    boxShadow: "0 0 28px rgba(0,229,255,0.06)",
                    fontFamily: "var(--font-space-mono)",
                }}
            >
                <p
                    className="text-[10px] tracking-[0.38em] uppercase text-center"
                    style={{ color: "var(--neon-cyan)", fontFamily: "var(--font-orbitron)" }}
                >
                    Drop Odds
                </p>
                <div
                    className="h-px w-full"
                    style={{ background: "linear-gradient(to right, transparent, rgba(0,229,255,0.22), transparent)" }}
                />

                <OddsList odds={odds} hasModifier={hasModifier} effects={activeEffects} />

                <div className="pt-1 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-[10px] tabular-nums" style={{ color: "var(--text-muted)" }}>
                        base 12.5% / symbol
                    </span>
                </div>
            </div>

            {/* ── 모바일: FAB 버튼 ────────────────────────────────────────────────── */}
            <motion.button
                onClick={() => setSheetOpen(true)}
                className="lg:hidden fixed bottom-6 left-4 flex flex-col items-center justify-center gap-0.5 w-12 h-12 rounded-xl z-30"
                style={{
                    background: "var(--bg-card)",
                    border: "1px solid rgba(0,229,255,0.2)",
                    boxShadow: hasModifier ? "0 0 14px rgba(0,229,255,0.2)" : "none",
                    fontFamily: "var(--font-space-mono)",
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
            >
                <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>📊</span>
                <span className="text-[9px] font-bold" style={{ color: "var(--neon-cyan)" }}>
                    ODDS
                </span>
            </motion.button>

            {/* ── 모바일: 바텀 시트 ────────────────────────────────────────────────── */}
            <AnimatePresence>
                {sheetOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-40 lg:hidden"
                            style={{ background: "rgba(5,5,16,0.8)", backdropFilter: "blur(3px)" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSheetOpen(false)}
                        />

                        {/* 시트 */}
                        <motion.div
                            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-5 pt-5 pb-10 lg:hidden"
                            style={{
                                background: "var(--bg-secondary)",
                                borderTop: "1px solid rgba(0,229,255,0.2)",
                                boxShadow: "0 -8px 40px rgba(0,229,255,0.08)",
                                fontFamily: "var(--font-space-mono)",
                            }}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 32 }}
                        >
                            {/* 핸들 */}
                            <div
                                className="w-10 h-1 rounded-full mx-auto mb-5"
                                style={{ background: "rgba(0,229,255,0.25)" }}
                            />

                            {/* 헤더 */}
                            <div className="flex items-center justify-between mb-4">
                                <p
                                    className="text-xs tracking-[0.35em] uppercase"
                                    style={{ color: "var(--neon-cyan)", fontFamily: "var(--font-orbitron)" }}
                                >
                                    Drop Odds
                                </p>
                                <button
                                    onClick={() => setSheetOpen(false)}
                                    className="text-xs px-2 py-1 rounded-lg"
                                    style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.05)" }}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="flex flex-col gap-3">
                                <OddsList odds={odds} hasModifier={hasModifier} effects={activeEffects} />
                            </div>

                            <div
                                className="mt-4 text-center"
                                style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}
                            >
                                <span className="text-[10px] tabular-nums" style={{ color: "var(--text-muted)" }}>
                                    base 12.5% / symbol
                                </span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
