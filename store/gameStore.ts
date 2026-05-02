import { create } from "zustand";
import type { GameState } from "@/types/game";
import type { ItemCard } from "@/types/card";
import type { SlotSymbol } from "@/types/symbol";
import { executeSpin } from "@/lib/engine/spin";
import { tickEffects } from "@/lib/engine/effects";
import { calculateRoundTarget, getSpinsInRound } from "@/lib/engine/round";
import { SYMBOL_POOL } from "@/lib/data/symbols";
import { TIER_POOLS } from "@/lib/data/cards";
import type { CardRarity } from "@/types/card";

const STRIP_TYPES: SlotSymbol["type"][] = ["cherry", "clover", "lemon", "coin", "gem", "crown", "lucky7", "skull"];
export const REEL_FAKE_COUNT = 22;

function pickTier(): CardRarity {
    const roll = Math.random();
    if (roll < 0.4) return "silver";
    if (roll < 0.8) return "gold";
    return "prism";
}

function pickOfferedItems(deck: ItemCard[]): ItemCard[] {
    const ownedIds = new Set(deck.filter((c) => !c.repeatable).map((c) => c.id));
    const ownedSets = new Set(deck.filter((c) => c.set).map((c) => c.set as string));

    const tier = pickTier();
    const pool = TIER_POOLS[tier];

    const nonRepeatable = pool.filter((c) => !c.repeatable && !ownedIds.has(c.id) && !(c.set && ownedSets.has(c.set)));

    // 비반복 카드가 3장 이상이면 그 중에서만 제시
    if (nonRepeatable.length >= 3) {
        return [...nonRepeatable].sort(() => Math.random() - 0.5).slice(0, 3);
    }

    // 2장 이하 남으면 반복 카드로 나머지 채움
    const repeatable = pool.filter((c) => c.repeatable);
    const shuffledNonRep = [...nonRepeatable].sort(() => Math.random() - 0.5);
    const shuffledRep = [...repeatable].sort(() => Math.random() - 0.5);
    return [...shuffledNonRep, ...shuffledRep].slice(0, 3);
}

function makeSpinStrips(): SlotSymbol[][] {
    return Array.from({ length: 5 }, () =>
        Array.from({ length: REEL_FAKE_COUNT }, (_, i) => {
            const type = STRIP_TYPES[Math.floor(Math.random() * STRIP_TYPES.length)];
            return { id: `fake-${i}-${type}`, type, tier: "L1" as const, groupValue: 10 };
        }),
    );
}

const INITIAL_STATE: GameState = {
    phase: "idle",
    score: 0,
    roundScore: 0,
    roundTarget: calculateRoundTarget(1),
    spinsInRound: 0,
    maxSpinsInRound: getSpinsInRound(),
    deck: [],
    luck: 0,
    extraSpinChance: 0,
    activeEffects: [],
    currentGrid: null,
    spinHistory: [],
    round: 1,
    offeredItems: [],
    spinId: 0,
    bonusSpinId: 0,
    spinStrips: null,
    scoreGain: 0,
    patternBreakdowns: [],
    revealIndex: 0,
    pendingPhase: "idle",
};

interface GameStore extends GameState {
    spin: () => void;
    startReveal: () => void;
    advanceReveal: () => void;
    selectItem: (card: ItemCard) => void;
    resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
    ...INITIAL_STATE,

    spin: () => {
        const {
            phase,
            activeEffects,
            spinHistory,
            score,
            roundScore,
            spinsInRound,
            maxSpinsInRound,
            roundTarget,
            spinId,
            bonusSpinId,
            luck,
            extraSpinChance,
            deck,
        } = get();

        if (phase !== "idle") return;

        set({ phase: "spinning" });

        const result = executeSpin(SYMBOL_POOL, activeEffects, luck);
        const remainingEffects = tickEffects(activeEffects);
        const newRoundScore = roundScore + result.score;
        const newScore = score + result.score;
        const newSpinsInRound = spinsInRound + 1;
        const bonusSpin = extraSpinChance > 0 && Math.random() < extraSpinChance ? 1 : 0;
        const newMaxSpins = maxSpinsInRound + bonusSpin;
        const isLastSpin = newSpinsInRound >= newMaxSpins;

        let pendingPhase: "idle" | "round_clear" | "game_over";
        if (isLastSpin) {
            pendingPhase = newScore >= roundTarget ? "round_clear" : "game_over";
        } else {
            pendingPhase = "idle";
        }

        set({
            phase: "spinning", // startReveal()이 호출될 때까지 유지
            currentGrid: result.symbols,
            score: newScore,
            roundScore: newRoundScore,
            spinsInRound: newSpinsInRound,
            activeEffects: remainingEffects,
            spinHistory: [...spinHistory, result],
            maxSpinsInRound: newMaxSpins,
            offeredItems: pendingPhase === "round_clear" ? pickOfferedItems(deck) : [],
            spinId: spinId + 1,
            bonusSpinId: bonusSpin > 0 ? bonusSpinId + 1 : bonusSpinId,
            spinStrips: makeSpinStrips(),
            scoreGain: result.score,
            patternBreakdowns: result.patternBreakdowns,
            revealIndex: 0,
            pendingPhase,
        });
    },

    // 모든 릴이 멈춘 후 GameScreen에서 호출
    startReveal: () => {
        const { patternBreakdowns, pendingPhase } = get();
        if (patternBreakdowns.length === 0) {
            set({ phase: pendingPhase });
        } else {
            set({ phase: "revealing", revealIndex: 0 });
        }
    },

    // 자동 타이머로 다음 패턴으로 이동
    advanceReveal: () => {
        const { revealIndex, patternBreakdowns, pendingPhase } = get();
        if (revealIndex < patternBreakdowns.length - 1) {
            set({ revealIndex: revealIndex + 1 });
        } else {
            set({ phase: pendingPhase, patternBreakdowns: [] });
        }
    },

    selectItem: (card: ItemCard) => {
        const state = get();
        if (state.phase !== "round_clear") return;

        const nextRound = state.round + 1;
        const nextState = card.apply(state);

        set({
            ...nextState,
            deck: [...nextState.deck, card],
            phase: "idle",
            round: nextRound,
            roundScore: 0,
            spinsInRound: 0,
            maxSpinsInRound: getSpinsInRound(),
            roundTarget: calculateRoundTarget(nextRound),
            offeredItems: [],
        });
    },

    resetGame: () => {
        set({
            ...INITIAL_STATE,
            roundTarget: calculateRoundTarget(1),
            maxSpinsInRound: getSpinsInRound(),
        });
    },
}));
