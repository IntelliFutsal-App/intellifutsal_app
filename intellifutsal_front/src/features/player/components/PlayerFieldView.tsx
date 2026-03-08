import { useMemo } from "react";
import type { AiApiPositionResponse } from "@features/ai-module";
import type { PlayerResponse } from "../types";
import { FutsalSvg } from "@shared/ui";

interface PlayerFieldViewProps {
    currentPlayer: PlayerResponse | null;
    teammates: PlayerResponse[];
    predictedPosition: AiApiPositionResponse | null;
    isCurrentPlayerAnalyzed: boolean;
}

const POSITION_COORDS: Record<string, { x: number; y: number }> = {
    PORTERO: { x: 10, y: 50 },
    POSTE: { x: 30, y: 50 },
    CIERRE: { x: 30, y: 50 },
    PIVOT: { x: 55, y: 50 },
    PÍVOT: { x: 55, y: 50 },
    ALA: { x: 45, y: 50 },
};

const SPREAD_OFFSETS: Record<string, Array<{ x: number; y: number }>> = {
    PORTERO: [{ x: 10, y: 50 }],
    POSTE: [{ x: 30, y: 35 }, { x: 30, y: 65 }],
    CIERRE: [{ x: 28, y: 35 }, { x: 28, y: 65 }],
    ALA: [{ x: 45, y: 22 }, { x: 45, y: 78 }, { x: 50, y: 35 }, { x: 50, y: 65 }],
    PIVOT: [{ x: 55, y: 50 }, { x: 58, y: 38 }, { x: 58, y: 62 }],
    PÍVOT: [{ x: 55, y: 50 }, { x: 58, y: 38 }, { x: 58, y: 62 }],
};

const DEFAULT_SPREAD = [
    { x: 25, y: 30 }, { x: 25, y: 70 }, { x: 40, y: 50 },
    { x: 50, y: 30 }, { x: 50, y: 70 }, { x: 35, y: 50 },
];

const normalizePosition = (pos?: string | null): string => {
    if (!pos) return "";
    const u = pos.toUpperCase();
    if (u.includes("PORTERO") || u.includes("ARQUERO") || u.includes("GOALKEEPER")) return "PORTERO";
    if (u.includes("PIVOT") || u.includes("PÍVOT")) return "PIVOT";
    if (u.includes("POSTE") || u.includes("FIXO")) return "POSTE";
    if (u.includes("CIERRE")) return "CIERRE";
    if (u.includes("ALA")) return "ALA";
    return u;
};

interface PlacedPlayer {
    id: number;
    name: string;
    initials: string;
    coords: { x: number; y: number };
    isSelf: boolean;
    positionLabel: string | null;
}

export const PlayerFieldView = ({
    currentPlayer,
    teammates,
    predictedPosition,
    isCurrentPlayerAnalyzed,
}: PlayerFieldViewProps) => {
    const placed = useMemo((): PlacedPlayer[] => {
        const result: PlacedPlayer[] = [];

        const counters: Record<string, number> = {};
        let defaultIdx = 0;

        teammates.forEach((p) => {
            const posKey = normalizePosition(p.position);
            const spreads = SPREAD_OFFSETS[posKey] ?? null;

            let coords: { x: number; y: number };
            if (spreads) {
                const idx = counters[posKey] ?? 0;
                coords = spreads[idx % spreads.length];
                counters[posKey] = idx + 1;
            } else {
                coords = DEFAULT_SPREAD[defaultIdx % DEFAULT_SPREAD.length];
                defaultIdx++;
            }

            result.push({
                id: p.id,
                name: `${p.firstName} ${p.lastName}`,
                initials: `${p.firstName[0]}${p.lastName[0]}`.toUpperCase(),
                coords,
                isSelf: false,
                positionLabel: p.position ?? null,
            });
        });

        if (currentPlayer) {
            let selfCoords: { x: number; y: number };
            let posLabel: string | null = null;

            if (isCurrentPlayerAnalyzed && predictedPosition) {
                const posKey = normalizePosition(predictedPosition.clusterName);
                posLabel = predictedPosition.clusterName;
                const base = POSITION_COORDS[posKey] ?? { x: 70, y: 50 };
                selfCoords = { x: Math.max(base.x, 55), y: base.y };
            } else {
                const posKey = normalizePosition(currentPlayer.position);
                posLabel = currentPlayer.position ?? null;
                selfCoords = POSITION_COORDS[posKey] ?? { x: 70, y: 50 };
            }

            result.push({
                id: currentPlayer.id,
                name: `${currentPlayer.firstName} ${currentPlayer.lastName}`,
                initials: `${currentPlayer.firstName[0]}${currentPlayer.lastName[0]}`.toUpperCase(),
                coords: selfCoords,
                isSelf: true,
                positionLabel: posLabel,
            });
        }

        return result;
    }, [currentPlayer, teammates, predictedPosition, isCurrentPlayerAnalyzed]);

    return (
        <div className="relative w-full bg-linear-to-br from-green-600 to-green-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: "56%" }}>
                <FutsalSvg />

                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 3%, rgba(0,0,0,0.1) 3%, rgba(0,0,0,0.1) 6%)`,
                        }}
                    />
                </div>

                <div className="absolute inset-0">
                    {placed.map((p) => (
                        <div
                            key={p.id}
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${p.coords.x}%`, top: `${p.coords.y}%` }}
                        >
                            {p.isSelf ? (
                                <div className="flex flex-col items-center gap-1">
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-40 scale-150" />
                                        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-orange-500 to-orange-600 border-2 border-white shadow-lg flex items-center justify-center">
                                            <span className="text-white font-black text-xs">{p.initials}</span>
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow">
                                            <span className="text-xs leading-none">★</span>
                                        </div>
                                    </div>
                                    <div className="bg-orange-600/90 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow whitespace-nowrap max-w-[72px] truncate">
                                        {p.name.split(" ")[0]}
                                        {isCurrentPlayerAnalyzed && p.positionLabel && (
                                            <span className="opacity-80"> · {p.positionLabel}</span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-blue-400 to-blue-500 border-2 border-white/70 shadow flex items-center justify-center">
                                        <span className="text-white font-bold text-[10px]">{p.initials}</span>
                                    </div>
                                    <div className="bg-blue-900/70 backdrop-blur-sm text-white/90 text-[8px] font-medium px-1 py-0.5 rounded-full shadow whitespace-nowrap max-w-[60px] truncate">
                                        {p.name.split(" ")[0]}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-2 right-3 flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-linear-to-br from-orange-500 to-orange-600 border border-white/60" />
                        <span className="text-white text-[10px] font-medium">Tú</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-linear-to-br from-blue-400 to-blue-500 border border-white/60" />
                        <span className="text-white text-[10px] font-medium">Compañeros</span>
                    </div>
                </div>
            </div>
        </div>
    );
};