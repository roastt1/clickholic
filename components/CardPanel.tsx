"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import type { ItemCard } from "@/types/card";

const RARITY_NEON: Record<ItemCard["rarity"], string> = {
    common: "#4a5080",
    uncommon: "#00ff88",
    rare: "#00e5ff",
    legendary: "#ffd700",
};

const RARITY_LABEL_COLOR: Record<ItemCard["rarity"], string> = {
    common: "#4a5080",
    uncommon: "#00ff88",
    rare: "#00e5ff",
    legendary: "#ffd700",
};

interface CardPanelProps {
    visible: boolean;
    onSelect: (card: ItemCard) => void;
}

export function CardPanel({ visible, onSelect }: CardPanelProps) {
    const offeredCards = useGameStore((s) => s.offeredCards);

    return (
        <AnimatePresence>
            {visible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-40"
                        style={{ background: "rgba(5, 5, 16, 0.75)", backdropFilter: "blur(2px)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Bottom sheet */}
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-4 pt-4 pb-30"
                        style={{
                            background: "var(--bg-secondary)",
                            borderTop: "1px solid rgba(0,229,255,0.2)",
                            boxShadow: "0 -8px 40px rgba(0,229,255,0.08), 0 -2px 0 rgba(0,229,255,0.15)",
                        }}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 32 }}
                    >
                        {/* Handle */}
                        <div
                            className="w-10 h-1 rounded-full mx-auto mb-3"
                            style={{ background: "rgba(0,229,255,0.25)" }}
                        />

                        <p
                            className="text-[10px] tracking-[0.3em] uppercase text-center mb-4"
                            style={{ color: "var(--text-muted)", fontFamily: "var(--font-orbitron)" }}
                        >
                            선택하세요
                        </p>

                        <div className="flex gap-3 w-full">
                            {offeredCards.map((card, i) => {
                                const neon = RARITY_NEON[card.rarity];
                                return (
                                    <motion.button
                                        key={card.id}
                                        onClick={() => onSelect(card)}
                                        className="flex flex-col items-start gap-2 flex-1 px-3 py-4 rounded-2xl text-left"
                                        style={{
                                            background: "var(--bg-card)",
                                            border: `1px solid ${neon}66`,
                                            boxShadow: `0 0 14px ${neon}22`,
                                        }}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 24 }}
                                        whileHover={{
                                            scale: 1.04,
                                            boxShadow: `0 0 24px ${neon}55, inset 0 0 20px ${neon}0d`,
                                        }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <span
                                            className="text-[10px] font-bold tracking-[0.2em] uppercase"
                                            style={{
                                                color: RARITY_LABEL_COLOR[card.rarity],
                                                fontFamily: "var(--font-orbitron)",
                                            }}
                                        >
                                            {card.rarity}
                                        </span>
                                        <span
                                            className="text-sm font-bold leading-tight"
                                            style={{ color: "var(--text-primary)", fontFamily: "var(--font-orbitron)" }}
                                        >
                                            {card.name}
                                        </span>
                                        <span
                                            className="text-xs leading-snug"
                                            style={{ color: "var(--text-muted)", fontFamily: "var(--font-space-mono)" }}
                                        >
                                            {card.description}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
