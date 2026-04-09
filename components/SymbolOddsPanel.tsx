"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { SYMBOL_POOL } from "@/lib/data/symbols";
import { calculateSymbolOdds } from "@/lib/engine/odds";
import type { SymbolType } from "@/types/symbol";
import { OddsList } from "./OddsList";

export function SymbolOddsPanel() {
    const activeEffects = useGameStore((s) => s.activeEffects);
    const [sheetOpen, setSheetOpen] = useState(false);

    const odds = useMemo(() => calculateSymbolOdds(SYMBOL_POOL, activeEffects), [activeEffects]);
    const baseOdds = useMemo(() => {
        const base = calculateSymbolOdds(SYMBOL_POOL, []);
        return Object.fromEntries(base.map((o) => [o.type, o.pct])) as Record<SymbolType, number>;
    }, []);

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
                <OddsList odds={odds} baseOdds={baseOdds} hasModifier={hasModifier} effects={activeEffects} />
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
                        <motion.div
                            className="fixed inset-0 z-40 lg:hidden"
                            style={{ background: "rgba(5,5,16,0.8)", backdropFilter: "blur(3px)" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSheetOpen(false)}
                        />
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
                            <div
                                className="w-10 h-1 rounded-full mx-auto mb-5"
                                style={{ background: "rgba(0,229,255,0.25)" }}
                            />
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
                                <OddsList odds={odds} baseOdds={baseOdds} hasModifier={hasModifier} effects={activeEffects} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
