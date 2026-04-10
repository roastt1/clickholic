"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameScreen } from "@/hooks/useGameScreen";
import { ScoreBoard } from "./ScoreBoard";
import { SlotGrid } from "./SlotGrid";
import { SpinButton } from "./SpinButton";
import { CardPanel } from "./CardPanel";
import { AugmentVault } from "./AugmentVault";
import { VolumeControl } from "./VolumeControl";
import { SymbolOddsPanel } from "./SymbolOddsPanel";
import { PatternReveal } from "./PatternReveal";

export function GameScreen() {
    const {
        phase, score, roundScore, roundTarget,
        spinsInRound, maxSpinsInRound, round, luck,
        currentGrid, revealIndex, resetGame,
        volume, setVolume,
        handleSpin, handleReelStop, handleSelectItem,
        revealHighlight, currentPattern,
    } = useGameScreen();

    return (
        <div
            className="flex flex-col items-center min-h-screen px-4 pt-10 pb-6 sm:pt-14 sm:px-6"
            style={{ background: "var(--bg-primary)" }}
        >
            <div className="flex flex-col items-center gap-5 w-full max-w-sm">
                {/* ── Title + 버튼 ─────────────────────────────── */}
                <div className="flex items-center justify-between w-full pt-2">
                    <VolumeControl volume={volume} onChange={setVolume} />
                    <div className="flex flex-col items-center gap-1">
                        <h1
                            className="text-xl sm:text-2xl font-black tracking-[0.25em] uppercase neon-cyan"
                            style={{ fontFamily: "var(--font-orbitron)" }}
                        >
                            CLICKHOLIC
                        </h1>
                        <div
                            className="h-px w-32"
                            style={{
                                background: "linear-gradient(to right, transparent, var(--neon-cyan), transparent)",
                            }}
                        />
                    </div>
                    <AugmentVault />
                </div>

                {/* ── Scoreboard ────────────────────────────────── */}
                <ScoreBoard
                    score={score}
                    roundTarget={roundTarget}
                    spinsInRound={spinsInRound}
                    maxSpinsInRound={maxSpinsInRound}
                    round={round}
                    luck={luck}
                />

                {/* ── Slot grid + Pattern reveal overlay ────────── */}
                <div className="relative">
                    <div
                        className="crt-screen rounded-2xl p-3 sm:p-4 arcade-border"
                        style={{ background: "var(--bg-secondary)" }}
                    >
                        <SlotGrid grid={currentGrid} onReelStop={handleReelStop} overrideHighlight={revealHighlight} />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <PatternReveal pattern={currentPattern} revealIndex={revealIndex} />
                    </div>
                </div>

                {/* ── Spin button ───────────────────────────────── */}
                <SpinButton phase={phase} onSpin={handleSpin} />

                {/* ── Game over ─────────────────────────────────── */}
                <AnimatePresence>
                    {phase === "game_over" && (
                        <motion.div
                            className="flex flex-col items-center gap-4 text-center mt-2"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                            <p
                                className="text-xs tracking-[0.3em] uppercase neon-pink"
                                style={{ fontFamily: "var(--font-orbitron)" }}
                            >
                                Game Over
                            </p>
                            <p
                                className="text-[11px] tabular-nums"
                                style={{ color: "var(--text-muted)", fontFamily: "var(--font-space-mono)" }}
                            >
                                목표 {roundTarget.toLocaleString()} pts / 달성 {score.toLocaleString()} pts
                            </p>
                            <p
                                className="text-5xl font-black tabular-nums neon-gold"
                                style={{ fontFamily: "var(--font-space-mono)" }}
                            >
                                {score.toLocaleString()}
                            </p>
                            <button
                                onClick={resetGame}
                                className="mt-1 px-8 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase font-bold transition-all duration-200"
                                style={{
                                    fontFamily: "var(--font-orbitron)",
                                    background: "transparent",
                                    color: "var(--neon-cyan)",
                                    border: "1px solid var(--neon-cyan)",
                                    boxShadow: "0 0 12px var(--neon-cyan), inset 0 0 12px rgba(0,229,255,0.06)",
                                }}
                                onMouseEnter={(e) => {
                                    const el = e.currentTarget;
                                    el.style.background = "rgba(0,229,255,0.1)";
                                    el.style.boxShadow = "0 0 24px var(--neon-cyan), inset 0 0 20px rgba(0,229,255,0.1)";
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.currentTarget;
                                    el.style.background = "transparent";
                                    el.style.boxShadow = "0 0 12px var(--neon-cyan), inset 0 0 12px rgba(0,229,255,0.06)";
                                }}
                            >
                                Play Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Symbol odds panel — fixed left ────────────── */}
            <SymbolOddsPanel />

            {/* ── Round clear panel — fixed overlay ─────────── */}
            <CardPanel
                visible={phase === "round_clear"}
                onSelect={handleSelectItem}
                roundScore={roundScore}
                roundTarget={roundTarget}
            />
        </div>
    );
}
