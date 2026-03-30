"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";

// 가장 늦게 멈추는 릴(4열) 종료 예상 시각 + 여유
const SCORE_REVEAL_DELAY = 1850; // ms

interface ScoreBoardProps {
    score: number;
    roundTarget: number;
    spinsInRound: number;
    maxSpinsInRound: number;
    round: number;
}

export function ScoreBoard({ score, roundTarget, spinsInRound, maxSpinsInRound, round }: ScoreBoardProps) {
    const spinId = useGameStore((s) => s.spinId);
    const scoreGain = useGameStore((s) => s.scoreGain);
    const phase = useGameStore((s) => s.phase);
    const patternBreakdowns = useGameStore((s) => s.patternBreakdowns);
    const revealIndex = useGameStore((s) => s.revealIndex);

    const [displayScore, setDisplayScore] = useState(score);
    const [flashGain, setFlashGain] = useState(0);

    const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 스핀 시작: displayScore를 스핀 전 값으로 고정, 패턴 없으면 SCORE_REVEAL_DELAY 후 일괄 업데이트
    useEffect(() => {
        if (revealTimer.current) clearTimeout(revealTimer.current);
        if (hideTimer.current) clearTimeout(hideTimer.current);

        if (spinId === 0) {
            setDisplayScore(0);
            setFlashGain(0);
            return;
        }

        // 스핀 전 점수로 고정 (패턴별 reveal이 하나씩 올릴 예정)
        const preSpinScore = score - scoreGain;
        setDisplayScore(preSpinScore);
        setFlashGain(0);

        if (patternBreakdowns.length > 0) return; // 패턴별 revealIndex effect에서 처리

        // 패턴 없는 스핀: 릴 정지 후 일괄 업데이트
        revealTimer.current = setTimeout(() => {
            setDisplayScore(score);
            if (scoreGain > 0) {
                setFlashGain(scoreGain);
                hideTimer.current = setTimeout(() => setFlashGain(0), 1600);
            }
        }, SCORE_REVEAL_DELAY);

        return () => {
            if (revealTimer.current) clearTimeout(revealTimer.current);
            if (hideTimer.current) clearTimeout(hideTimer.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spinId]);

    // 패턴 공개 시 해당 패턴의 점수만큼 증가 + flash
    useEffect(() => {
        if (phase !== "revealing") return;

        const pattern = patternBreakdowns[revealIndex];
        if (!pattern) return;

        if (hideTimer.current) clearTimeout(hideTimer.current);

        setDisplayScore((prev) => prev + pattern.score);
        setFlashGain(pattern.score);
        hideTimer.current = setTimeout(() => setFlashGain(0), 1600);

        return () => {
            if (hideTimer.current) clearTimeout(hideTimer.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, revealIndex]);

    const progressPct = Math.min(100, Math.floor((displayScore / roundTarget) * 100));
    const spinsLeft = maxSpinsInRound - spinsInRound;

    return (
        <div
            className="flex flex-col w-full gap-2 px-4 py-3 rounded-xl arcade-border"
            style={{ background: "var(--bg-card)", fontFamily: "var(--font-space-mono)" }}
        >
            {/* 상단: 라운드 점수 / 목표 */}
            <div className="flex items-end justify-between">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: "var(--text-muted)" }}>
                        Score
                    </span>
                    <div className="flex items-baseline gap-2">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={displayScore}
                                className="text-2xl sm:text-3xl font-bold tabular-nums neon-cyan"
                                initial={{ y: -10, opacity: 0, scale: 0.92 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 360, damping: 22 }}
                            >
                                {displayScore.toLocaleString()}
                            </motion.span>
                        </AnimatePresence>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            / {roundTarget.toLocaleString()}
                        </span>
                        {/* +N 플래시 */}
                        <AnimatePresence>
                            {flashGain > 0 && (
                                <motion.span
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    style={{
                                        color: "var(--neon-green)",
                                        fontSize: "0.85rem",
                                        fontWeight: 700,
                                        textShadow: "0 0 8px var(--neon-green)",
                                    }}
                                >
                                    +{flashGain.toLocaleString()}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* 우측: 라운드 번호 + 스핀 잔여 */}
                <div className="flex gap-4 text-right">
                    <div className="flex flex-col gap-0.5 items-end">
                        <span
                            className="text-[10px] tracking-[0.25em] uppercase"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Spins
                        </span>
                        <span
                            className="text-lg font-bold tabular-nums"
                            style={{ color: spinsLeft <= 2 ? "var(--neon-pink)" : "var(--text-primary)" }}
                        >
                            {spinsLeft}
                        </span>
                    </div>
                    <div className="flex flex-col gap-0.5 items-end">
                        <span
                            className="text-[10px] tracking-[0.25em] uppercase"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Round
                        </span>
                        <span className="text-lg font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
                            {round}
                        </span>
                    </div>
                </div>
            </div>

            {/* 목표 점수 프로그레스 바 */}
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div
                    className="h-full rounded-full"
                    style={{
                        background:
                            progressPct >= 100
                                ? "var(--neon-green)"
                                : progressPct >= 60
                                  ? "var(--neon-cyan)"
                                  : "var(--neon-pink)",
                        boxShadow: `0 0 8px ${progressPct >= 100 ? "var(--neon-green)" : "var(--neon-cyan)"}`,
                    }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}
