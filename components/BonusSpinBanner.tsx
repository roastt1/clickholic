"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";

const BANNER_HOLD_MS = 2000;

export function BonusSpinBanner() {
    const bonusSpinId = useGameStore((s) => s.bonusSpinId);
    const [visible, setVisible] = useState(false);

    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (bonusSpinId === 0) return;

        if (hideTimer.current) clearTimeout(hideTimer.current);

        setTimeout(() => setVisible(true), 0);
        hideTimer.current = setTimeout(() => setVisible(false), BANNER_HOLD_MS);

        return () => {
            if (hideTimer.current) clearTimeout(hideTimer.current);
        };
    }, [bonusSpinId]);

    return (
        <div className="w-full flex justify-center pointer-events-none" style={{ height: "2.5rem" }}>
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ y: -16, opacity: 0, scale: 0.88 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -12, opacity: 0, scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 360, damping: 22 }}
                        className="flex items-center gap-2 px-5 py-1.5 rounded-full arcade-border"
                        style={{
                            background: "var(--bg-card)",
                            color: "var(--neon-gold)",
                            fontFamily: "var(--font-space-mono)",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            textShadow: "0 0 10px var(--neon-gold)",
                            boxShadow: "0 0 16px color-mix(in srgb, var(--neon-gold) 40%, transparent)",
                        }}
                    >
                        🎫 추가 스핀!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
