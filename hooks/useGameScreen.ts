"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import type { ItemCard } from "@/types/card";

export function useGameScreen() {
    const phase = useGameStore((s) => s.phase);
    const score = useGameStore((s) => s.score);
    const roundScore = useGameStore((s) => s.roundScore);
    const roundTarget = useGameStore((s) => s.roundTarget);
    const spinsInRound = useGameStore((s) => s.spinsInRound);
    const maxSpinsInRound = useGameStore((s) => s.maxSpinsInRound);
    const round = useGameStore((s) => s.round);
    const currentGrid = useGameStore((s) => s.currentGrid);
    const spinId = useGameStore((s) => s.spinId);
    const patternBreakdowns = useGameStore((s) => s.patternBreakdowns);
    const revealIndex = useGameStore((s) => s.revealIndex);
    const spin = useGameStore((s) => s.spin);
    const startReveal = useGameStore((s) => s.startReveal);
    const advanceReveal = useGameStore((s) => s.advanceReveal);
    const selectItem = useGameStore((s) => s.selectItem);
    const resetGame = useGameStore((s) => s.resetGame);

    const [volume, setVolume] = useState(0.8);
    const { playSpinStart, playReelTick, playMatchLine, playMatchVShape, playJackpot, playRoundClear, playGameOver } =
        useSoundEffects(volume);

    const handleSpin = useCallback(() => {
        playSpinStart();
        spin();
    }, [playSpinStart, spin]);

    const reelStopCountRef = useRef(0);

    useEffect(() => {
        reelStopCountRef.current = 0;
    }, [spinId]);

    const handleReelStop = useCallback(
        (_: number) => {
            playReelTick();
            reelStopCountRef.current++;
            if (reelStopCountRef.current >= 5) {
                reelStopCountRef.current = 0;
                startReveal();
            }
        },
        [playReelTick, startReveal],
    );

    useEffect(() => {
        if (phase !== "revealing") return;
        const current = patternBreakdowns[revealIndex];
        if (!current) return;
        if (current.type === "fullhouse") playJackpot();
        else if (current.type === "vshape") playMatchVShape();
        else playMatchLine();
        const isJackpotSpin = patternBreakdowns.some((b) => b.type === "fullhouse");
        const delay = isJackpotSpin ? 450 : 600;
        const timer = setTimeout(advanceReveal, delay);
        return () => clearTimeout(timer);
    }, [phase, revealIndex, patternBreakdowns, playJackpot, playMatchVShape, playMatchLine, advanceReveal]);

    useEffect(() => {
        if (phase === "round_clear") playRoundClear();
        if (phase === "game_over") playGameOver();
    }, [phase, playRoundClear, playGameOver]);

    const revealHighlight = useMemo(() => {
        if (phase === "spinning") return new Set<string>();
        if (phase !== "revealing") return undefined;
        const current = patternBreakdowns[revealIndex];
        if (!current) return undefined;
        const positions = new Set<string>();
        for (const [r, c] of current.positions) {
            positions.add(`${r}-${c}`);
        }
        return positions;
    }, [phase, patternBreakdowns, revealIndex]);

    const handleSelectItem = useCallback((card: ItemCard) => selectItem(card), [selectItem]);
    const currentPattern = phase === "revealing" ? (patternBreakdowns[revealIndex] ?? null) : null;

    return {
        phase,
        score,
        roundScore,
        roundTarget,
        spinsInRound,
        maxSpinsInRound,
        round,
        currentGrid,
        revealIndex,
        resetGame,
        volume,
        setVolume,
        handleSpin,
        handleReelStop,
        handleSelectItem,
        revealHighlight,
        currentPattern,
    };
}
