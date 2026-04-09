"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { SYMBOL_POOL } from "@/lib/data/symbols";
import { calculateSymbolOdds } from "@/lib/engine/odds";
import type { SymbolType } from "@/types/symbol";
import { OddsList } from "./OddsList";
import { PatternOddsList } from "./PatternOddsList";

type Tab = "odds" | "patterns";

const TAB_LABELS: Record<Tab, string> = { odds: "ODDS", patterns: "PATTERNS" };

export function SymbolOddsPanel() {
    const activeEffects = useGameStore((s) => s.activeEffects);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("odds");

    const odds = useMemo(() => calculateSymbolOdds(SYMBOL_POOL, activeEffects), [activeEffects]);
    const baseOdds = useMemo(() => {
        const base = calculateSymbolOdds(SYMBOL_POOL, []);
        return Object.fromEntries(base.map((o) => [o.type, o.pct])) as Record<SymbolType, number>;
    }, []);

    const hasModifier = activeEffects.some((e) => e.type === "symbol_rate_up");

    const tabBar = (
        <div className="flex gap-1 w-full">
            {(["odds", "patterns"] as Tab[]).map((tab) => {
                const active = activeTab === tab;
                return (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="flex-1 py-1 rounded-lg transition-all duration-200"
                        style={{
                            fontFamily: "var(--font-orbitron)",
                            fontSize: "0.5rem",
                            letterSpacing: "0.12em",
                            color: active ? "var(--neon-cyan)" : "var(--text-muted)",
                            background: active ? "rgba(0,229,255,0.08)" : "transparent",
                            border: `1px solid ${active ? "rgba(0,229,255,0.3)" : "rgba(255,255,255,0.06)"}`,
                            boxShadow: active ? "0 0 8px rgba(0,229,255,0.12)" : "none",
                        }}
                    >
                        {TAB_LABELS[tab]}
                    </button>
                );
            })}
        </div>
    );

    // 두 탭을 같은 grid 셀에 겹쳐 렌더링 → 컨테이너 높이 = max(두 탭 높이) 로 항상 고정
    const panelContent = (
        <div style={{ display: "grid" }}>
            <div
                style={{
                    gridRow: 1,
                    gridColumn: 1,
                    opacity: activeTab === "odds" ? 1 : 0,
                    pointerEvents: activeTab === "odds" ? "auto" : "none",
                    transition: "opacity 0.15s",
                }}
            >
                <OddsList odds={odds} baseOdds={baseOdds} hasModifier={hasModifier} effects={activeEffects} />
            </div>
            <div
                style={{
                    gridRow: 1,
                    gridColumn: 1,
                    opacity: activeTab === "patterns" ? 1 : 0,
                    pointerEvents: activeTab === "patterns" ? "auto" : "none",
                    transition: "opacity 0.15s",
                }}
            >
                <PatternOddsList />
            </div>
        </div>
    );

    return (
        <>
            {/* ── 데스크탑: 좌측 고정 패널 ───────────────────────────────────────── */}
            <div
                className="hidden lg:flex fixed left-5 top-1/2 flex-col gap-2.5 p-4 rounded-2xl"
                style={{
                    width: "248px",
                    transform: "translateY(-50%)",
                    background: "var(--bg-secondary)",
                    border: "1px solid rgba(0,229,255,0.14)",
                    boxShadow: "0 0 28px rgba(0,229,255,0.06)",
                    fontFamily: "var(--font-space-mono)",
                }}
            >
                {tabBar}
                <div
                    className="h-px w-full"
                    style={{ background: "linear-gradient(to right, transparent, rgba(0,229,255,0.22), transparent)" }}
                />
                {panelContent}
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
                    {TAB_LABELS[activeTab]}
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
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex-1">{tabBar}</div>
                                <button
                                    onClick={() => setSheetOpen(false)}
                                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold"
                                    style={{
                                        color: "rgba(255,255,255,0.7)",
                                        background: "rgba(255,255,255,0.1)",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                            {panelContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
