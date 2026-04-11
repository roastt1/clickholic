import type { ItemCard } from "@/types/card";

export const symbolRateCards: ItemCard[] = [
    {
        id: "skull-purge",
        name: "해골 제거",
        description: "💀 완전 제거",
        rarity: "gold",
        cost: 0,
        apply: (state) => ({
            ...state,
            activeEffects: [
                ...state.activeEffects,
                {
                    type: "symbol_rate_up",
                    value: -1,
                    duration: "permanent",
                    targetSymbol: "skull",
                    description: "💀 완전 제거",
                },
            ],
        }),
    },
    {
        id: "lemon-rate",
        name: "레몬 나무",
        description: "🍋 출현 확률 ×2",
        rarity: "silver",
        cost: 0,
        apply: (state) => ({
            ...state,
            activeEffects: [
                ...state.activeEffects,
                {
                    type: "symbol_rate_up",
                    value: 2,
                    duration: "permanent",
                    targetSymbol: "lemon",
                    description: "🍋 출현 확률 ×2",
                },
            ],
        }),
    },
    {
        id: "cherry-rate",
        name: "체리 과수원",
        description: "🍒 출현 확률 ×2",
        rarity: "silver",
        cost: 0,
        apply: (state) => ({
            ...state,
            activeEffects: [
                ...state.activeEffects,
                {
                    type: "symbol_rate_up",
                    value: 2,
                    duration: "permanent",
                    targetSymbol: "cherry",
                    description: "🍒 출현 확률 ×2",
                },
            ],
        }),
    },
    {
        id: "clover-rate",
        name: "클로버 농장",
        description: "🍀 출현 확률 ×2",
        rarity: "silver",
        cost: 0,
        apply: (state) => ({
            ...state,
            activeEffects: [
                ...state.activeEffects,
                {
                    type: "symbol_rate_up",
                    value: 2,
                    duration: "permanent",
                    targetSymbol: "clover",
                    description: "🍀 출현 확률 ×2",
                },
            ],
        }),
    },
    {
        id: "coin-rate",
        name: "코인 러시",
        description: "💴 출현 확률 ×2",
        rarity: "silver",
        cost: 0,
        apply: (state) => ({
            ...state,
            activeEffects: [
                ...state.activeEffects,
                {
                    type: "symbol_rate_up",
                    value: 2,
                    duration: "permanent",
                    targetSymbol: "coin",
                    description: "🪙 출현 확률 ×2",
                },
            ],
        }),
    },
    {
        id: "gem-rate",
        name: "보석 광산",
        description: "💎 출현 확률 ×3",
        rarity: "gold",
        cost: 0,
        apply: (state) => ({
            ...state,
            activeEffects: [
                ...state.activeEffects,
                {
                    type: "symbol_rate_up",
                    value: 3,
                    duration: "permanent",
                    targetSymbol: "gem",
                    description: "💎 출현 확률 ×3",
                },
            ],
        }),
    },
    {
        id: "crown-rate",
        name: "왕관 독점",
        description: "👑 출현 확률 ×3",
        rarity: "gold",
        cost: 0,
        apply: (state) => ({
            ...state,
            activeEffects: [
                ...state.activeEffects,
                {
                    type: "symbol_rate_up",
                    value: 3,
                    duration: "permanent",
                    targetSymbol: "crown",
                    description: "👑 출현 확률 ×3",
                },
            ],
        }),
    },
    {
        id: "lucky7-rate",
        name: "럭키 세븐 집착",
        description: "7️⃣ 출현 확률 ×4",
        rarity: "prism",
        cost: 0,
        apply: (state) => ({
            ...state,
            activeEffects: [
                ...state.activeEffects,
                {
                    type: "symbol_rate_up",
                    value: 4,
                    duration: "permanent",
                    targetSymbol: "lucky7",
                    description: "7️⃣ 출현 확률 ×4",
                },
            ],
        }),
    },
];
