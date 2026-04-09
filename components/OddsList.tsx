"use client";

import { motion } from "framer-motion";
import { SYMBOL_POOL } from "@/lib/data/symbols";
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

const BASE_SCORE: Record<SymbolType, number> = Object.fromEntries(
    SYMBOL_POOL.map((s) => [s.type, s.groupValue]),
) as Record<SymbolType, number>;

export function OddsList({
    odds,
    baseOdds,
    hasModifier,
    effects,
}: {
    odds: { type: SymbolType; pct: number }[];
    baseOdds: Record<SymbolType, number>;
    hasModifier: boolean;
    effects: Effect[];
}) {
    return (
        <>
            {odds.map(({ type, pct }) => {
                const { emoji, label, neon } = SYMBOL_META[type];
                const isRemoved = pct === 0;
                const basePct = baseOdds[type] ?? 0;
                const isModified = hasModifier && Math.abs(pct - basePct) > 0.1;

                const baseScore = BASE_SCORE[type];
                const multiplier = getSymbolScoreMultiplier(type, effects);
                const effectiveScore = Math.round(baseScore * multiplier);
                const hasScoreBoost = multiplier !== 1;

                return (
                    <div key={type} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span style={{ fontSize: "1.25rem", lineHeight: 1, opacity: isRemoved ? 0.3 : 1 }}>
                                    {emoji}
                                </span>
                                <span
                                    className="text-sm"
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
                                            className="text-[13px] font-bold"
                                            style={{ color: pct > basePct ? "var(--neon-green)" : "var(--neon-pink)" }}
                                        >
                                            {pct > basePct ? "▲" : "▼"}
                                        </span>
                                    )}
                                    {isRemoved && (
                                        <span className="text-[13px]" style={{ color: "var(--neon-pink)" }}>
                                            ✕
                                        </span>
                                    )}
                                    <span
                                        className="text-sm tabular-nums font-bold"
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
                                            <span className="text-sm tabular-nums" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "line-through" }}>
                                                {baseScore}
                                            </span>
                                            <span className="text-sm tabular-nums font-bold" style={{ color: neon }}>
                                                {effectiveScore}pt
                                            </span>
                                            <span
                                                className="text-[13px] font-bold px-0.5 rounded"
                                                style={{ color: neon, background: `${neon}22` }}
                                            >
                                                ×{multiplier}
                                            </span>
                                        </>
                                    ) : (
                                        <span
                                            className="text-sm tabular-nums"
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
                            style={{ height: "4px", background: "rgba(255,255,255,0.06)" }}
                        >
                            <motion.div
                                className="h-full rounded-full"
                                style={{
                                    background: isRemoved ? "transparent" : neon,
                                    boxShadow: isRemoved || !isModified ? "none" : `0 0 6px ${neon}aa`,
                                }}
                                animate={{ width: `${pct}%` }}
                                initial={{ width: `${basePct}%` }}
                                transition={{ duration: 0.55, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                );
            })}
        </>
    );
}
