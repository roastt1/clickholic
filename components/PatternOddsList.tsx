"use client";

import React from "react";

const LINE_COLOR = "#00e5ff";
const DIAG_COLOR = "#00e5ff";
const VSHAPE_COLOR = "#f59e0b";
const JACKPOT_COLOR = "#e879f9";

// 3×5 도트 그리드: 활성 셀만 지정
function GridIcon({ active, color }: { active: [number, number][]; color: string }) {
    const activeSet = new Set(active.map(([r, c]) => `${r},${c}`));
    return (
        <div className="flex flex-col gap-1">
            {Array.from({ length: 3 }, (_, ri) => (
                <div key={ri} className="flex gap-1">
                    {Array.from({ length: 5 }, (_, ci) => {
                        const on = activeSet.has(`${ri},${ci}`);
                        return (
                            <div
                                key={ci}
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: 1,
                                    flexShrink: 0,
                                    background: on ? color : "rgba(255,255,255,0.08)",
                                    boxShadow: on ? `0 0 5px ${color}88` : "none",
                                }}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

// 15칸 전체
const ALL_CELLS: [number, number][] = Array.from({ length: 3 }, (_, r) =>
    Array.from({ length: 5 }, (_, c) => [r, c] as [number, number]),
).flat();

const ROWS: { renderIcon: () => React.ReactNode; label: string; detail: string; multiplier: number; color: string }[] =
    [
        {
            renderIcon: () => (
                <GridIcon
                    active={[
                        [0, 0],
                        [0, 1],
                        [0, 2],
                    ]}
                    color={LINE_COLOR}
                />
            ),
            label: "LINE",
            detail: "가로·세로 3개",
            multiplier: 1,
            color: LINE_COLOR,
        },
        {
            renderIcon: () => (
                <GridIcon
                    active={[
                        [0, 0],
                        [1, 1],
                        [2, 2],
                    ]}
                    color={DIAG_COLOR}
                />
            ),
            label: "DIAGONAL",
            detail: "대각선 ↘",
            multiplier: 1,
            color: DIAG_COLOR,
        },
        {
            renderIcon: () => (
                <GridIcon
                    active={[
                        [0, 4],
                        [1, 3],
                        [2, 2],
                    ]}
                    color={DIAG_COLOR}
                />
            ),
            label: "DIAGONAL",
            detail: "대각선 ↙",
            multiplier: 1,
            color: DIAG_COLOR,
        },
        {
            renderIcon: () => (
                <GridIcon
                    active={[
                        [0, 0],
                        [0, 1],
                        [0, 2],
                        [0, 3],
                    ]}
                    color={LINE_COLOR}
                />
            ),
            label: "LINE",
            detail: "가로·세로 4개",
            multiplier: 2,
            color: LINE_COLOR,
        },
        {
            renderIcon: () => (
                <GridIcon
                    active={[
                        [0, 0],
                        [0, 1],
                        [0, 2],
                        [0, 3],
                        [0, 4],
                    ]}
                    color={LINE_COLOR}
                />
            ),
            label: "LINE",
            detail: "가로·세로 5개",
            multiplier: 3,
            color: LINE_COLOR,
        },
        {
            renderIcon: () => (
                <GridIcon
                    active={[
                        [0, 0],
                        [0, 4],
                        [1, 1],
                        [1, 3],
                        [2, 2],
                    ]}
                    color={VSHAPE_COLOR}
                />
            ),
            label: "V-SHAPE",
            detail: "V자형",
            multiplier: 5,
            color: VSHAPE_COLOR,
        },
        {
            renderIcon: () => (
                <GridIcon
                    active={[
                        [2, 0],
                        [1, 1],
                        [0, 2],
                        [1, 3],
                        [2, 4],
                    ]}
                    color={VSHAPE_COLOR}
                />
            ),
            label: "V-SHAPE",
            detail: "뒤집어진 V자형",
            multiplier: 5,
            color: VSHAPE_COLOR,
        },
        {
            renderIcon: () => <GridIcon active={ALL_CELLS} color={JACKPOT_COLOR} />,
            label: "JACKPOT",
            detail: "잭팟",
            multiplier: 10,
            color: JACKPOT_COLOR,
        },
    ];

export function PatternOddsList() {
    return (
        <div className="flex flex-col gap-4">
            {ROWS.map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div style={{ width: 43, flexShrink: 0 }}>{row.renderIcon()}</div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <span
                            style={{
                                fontFamily: "var(--font-orbitron)",
                                fontSize: "0.68rem",
                                letterSpacing: "0.08em",
                                color: row.color,
                            }}
                        >
                            {row.label}
                        </span>
                        <span
                            style={{
                                fontSize: "0.63rem",
                                color: "rgba(255,255,255,0.6)",
                                fontFamily: "var(--font-space-mono)",
                            }}
                        >
                            {row.detail}
                        </span>
                    </div>
                    <span
                        className="text-sm font-bold tabular-nums px-2 py-1 rounded-md flex-shrink-0"
                        style={{
                            color: row.color,
                            background: `${row.color}18`,
                            border: `1px solid ${row.color}40`,
                            fontFamily: "var(--font-space-mono)",
                            boxShadow: `0 0 8px ${row.color}22`,
                        }}
                    >
                        ×{row.multiplier}
                    </span>
                </div>
            ))}
        </div>
    );
}
