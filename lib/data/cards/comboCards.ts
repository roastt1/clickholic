import type { ItemCard } from "@/types/card";

export const comboCards: ItemCard[] = [
    // ── 전체 점수 배수 (등급 오름차순) ─────────────────────────────
    {
        id: "coin-flip",
        name: "동전 던지기",
        description: "모든 점수 ×1.1",
        rarity: "silver",
        repeatable: true,
        cost: 0,
        apply: (state) => ({
            ...state,
            activeEffects: [
                ...state.activeEffects,
                { type: "score_multiply", value: 1.1, duration: "permanent", description: "모든 점수 ×1.1" },
            ],
        }),
    },
    {
        id: "golden-roulette",
        name: "황금 룰렛",
        description: "모든 점수 ×1.2",
        rarity: "gold",
        repeatable: true,
        cost: 0,
        apply: (state) => ({
            ...state,
            activeEffects: [
                ...state.activeEffects,
                { type: "score_multiply", value: 1.2, duration: "permanent", description: "모든 점수 ×1.2" },
            ],
        }),
    },
    {
        id: "grand-jackpot",
        name: "그랜드 잭팟",
        description: "모든 점수 ×2",
        rarity: "prism",
        cost: 0,
        apply: (state) => ({
            ...state,
            activeEffects: [
                ...state.activeEffects,
                { type: "score_multiply", value: 2, duration: "permanent", description: "모든 점수 ×2" },
            ],
        }),
    },
    {
        id: "infinite-crystal",
        name: "무한의 크리스탈",
        description: "모든 점수 ×1.3",
        rarity: "prism",
        repeatable: true,
        cost: 0,
        apply: (state) => ({
            ...state,
            activeEffects: [
                ...state.activeEffects,
                { type: "score_multiply", value: 1.3, duration: "permanent", description: "모든 점수 ×1.3" },
            ],
        }),
    },

    // ── 심볼 콤보 (심볼 순서: crown → lucky7) ──────────────────────
    {
        id: "crown-rate-score",
        name: "왕관의 영광",
        description: "👑 출현 확률 ×2 & 점수 ×2",
        rarity: "prism",
        cost: 0,
        apply: (state) => ({
            ...state,
            activeEffects: [
                ...state.activeEffects,
                {
                    type: "symbol_rate_up",
                    value: 2,
                    duration: "permanent",
                    targetSymbol: "crown",
                    description: "👑 출현 확률 ×2",
                },
                {
                    type: "symbol_score_multiply",
                    value: 2,
                    duration: "permanent",
                    targetSymbol: "crown",
                    description: "👑 점수 ×2",
                },
            ],
        }),
    },
    {
        id: "lucky7-rate-score",
        name: "럭키 세븐 마스터",
        description: "7️⃣ 출현 확률 ×2 & 점수 ×2",
        rarity: "prism",
        cost: 0,
        apply: (state) => ({
            ...state,
            activeEffects: [
                ...state.activeEffects,
                {
                    type: "symbol_rate_up",
                    value: 2,
                    duration: "permanent",
                    targetSymbol: "lucky7",
                    description: "7️⃣ 출현 확률 ×2",
                },
                {
                    type: "symbol_score_multiply",
                    value: 2,
                    duration: "permanent",
                    targetSymbol: "lucky7",
                    description: "7️⃣ 점수 ×2",
                },
            ],
        }),
    },
];
