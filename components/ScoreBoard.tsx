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
    luck: number;
}

export function ScoreBoard({ score, roundTarget, spinsInRound, maxSpinsInRound, round, luck }: ScoreBoardProps) {
    const spinId = useGameStore((s) => s.spinId);
    const bonusSpinId = useGameStore((s) => s.bonusSpinId);
    const scoreGain = useGameStore((s) => s.scoreGain);
    const phase = useGameStore((s) => s.phase);
    const patternBreakdowns = useGameStore((s) => s.patternBreakdowns);
    const revealIndex = useGameStore((s) => s.revealIndex);

    const [displayScore, setDisplayScore] = useState(score);
    const [flashGain, setFlashGain] = useState(0);
    const [flashBonus, setFlashBonus] = useState(false);
    const [flashKey, setFlashKey] = useState(0);

    const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const bonusHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    function triggerFlash(gain: number) {
        setFlashGain(gain);
        setFlashKey((k) => k + 1);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setFlashGain(0), 1800);
    }

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
            if (scoreGain > 0) triggerFlash(scoreGain);
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

        setDisplayScore((prev) => prev + pattern.score);
        triggerFlash(pattern.score);

        return () => {
            if (hideTimer.current) clearTimeout(hideTimer.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, revealIndex]);

    // 보너스 스핀 발동 즉시 골드 하이라이트
    useEffect(() => {
        if (bonusSpinId === 0) return;

        if (bonusHideTimer.current) clearTimeout(bonusHideTimer.current);

        setFlashBonus(true);
        bonusHideTimer.current = setTimeout(() => setFlashBonus(false), 1600);

        return () => {
            if (bonusHideTimer.current) clearTimeout(bonusHideTimer.current);
        };
    }, [bonusSpinId]);

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
                        {/* 현재 점수 + 플래시 기준 컨테이너 */}
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={Math.floor(displayScore)}
                                    className="text-2xl sm:text-3xl font-bold tabular-nums neon-cyan"
                                    initial={{ y: -10, opacity: 0, scale: 0.92 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 360, damping: 22 }}
                                >
                                    {Math.floor(displayScore).toLocaleString()}
                                </motion.span>
                            </AnimatePresence>
                            {/* +N 플래시: 현재 점수 오른쪽 위에서 떠오르며 사라짐 */}
                            {flashGain > 0 && (
                                <motion.span
                                    key={flashKey}
                                    className="absolute pointer-events-none whitespace-nowrap tabular-nums"
                                    style={{
                                        top: "-0.25rem",
                                        left: "100%",
                                        paddingLeft: "0.3rem",
                                        color: "var(--neon-green)",
                                        fontSize: "0.8rem",
                                        fontWeight: 700,
                                        textShadow: "0 0 10px var(--neon-green)",
                                    }}
                                    initial={{ opacity: 1, y: 0 }}
                                    animate={{ opacity: 0, y: -22 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                >
                                    +{Math.floor(flashGain).toLocaleString()}
                                </motion.span>
                            )}
                        </div>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            / {roundTarget.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* 우측: 라운드 번호 + 스핀 잔여 + 행운 */}
                <div className="flex gap-4 text-right">
                    {luck > 0 && (
                        <div className="flex flex-col gap-0.5 items-end">
                            <span
                                className="text-[10px] tracking-[0.25em] uppercase"
                                style={{ color: "var(--text-muted)" }}
                            >
                                Luck
                            </span>
                            <span
                                className="text-lg font-bold tabular-nums"
                                style={{ color: "var(--neon-green)", textShadow: "0 0 8px var(--neon-green)" }}
                            >
                                +{luck}
                            </span>
                        </div>
                    )}
                    <div className="flex flex-col gap-0.5 items-end">
                        <span
                            className="text-[10px] tracking-[0.25em] uppercase"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Spins
                        </span>
                        <motion.span
                            className="text-lg font-bold tabular-nums"
                            animate={flashBonus ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            style={{
                                color: flashBonus
                                    ? "var(--neon-gold)"
                                    : spinsLeft <= 2
                                      ? "var(--neon-pink)"
                                      : "var(--text-primary)",
                                textShadow: flashBonus ? "0 0 12px var(--neon-gold)" : undefined,
                                transition: "color 0.2s, text-shadow 0.2s",
                            }}
                        >
                            {spinsLeft}
                        </motion.span>
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
