import { useMemo } from "react";
import type { PlayerFieldData } from "../hooks/useTeamFieldAnalysis";
import { PlayerMarker } from "./PlayerMarker";

interface FutsalFieldProps {
    players: PlayerFieldData[];
    onPlayerClick?: (player: PlayerFieldData) => void;
}

const extractPositionFromDescription = (description: string): string => {
    const upper = description.toUpperCase();

    if (upper.includes("'ALA'") || upper.includes('ALA')) return 'ALA';
    if (upper.includes("'PÍVOT'") || upper.includes('PÍVOT') || upper.includes('PIVOT')) return 'PIVOT';
    if (upper.includes("'POSTE'") || upper.includes('POSTE') || upper.includes('FIXO')) return 'POSTE';
    if (upper.includes("'ARQUERO'") || upper.includes('ARQUERO') || upper.includes('PORTERO') || upper.includes('GOALKEEPER')) return 'PORTERO';

    return description;
};

const FIELD_POSITIONS: Record<string, { x: number; y: number }> = {
    PORTERO: { x: 10, y: 50 },
    POSTE: { x: 30, y: 50 },
    PIVOT: { x: 50, y: 50 },
    ALA: { x: 45, y: 50 },
};

interface PlayerWithCoords extends PlayerFieldData {
    fieldCoords: { x: number; y: number };
}

export const FutsalField = ({ players, onPlayerClick }: FutsalFieldProps) => {
    const playersWithCoords = useMemo(() => {
        return players.map((player, index): PlayerWithCoords => {
            if (!player.position?.clusterName) {
                const defaultPositions = [
                    { x: 10, y: 50 },
                    { x: 30, y: 35 },
                    { x: 30, y: 65 },
                    { x: 45, y: 25 },
                    { x: 45, y: 75 },
                    { x: 50, y: 50 },
                ];
                return {
                    ...player,
                    fieldCoords: defaultPositions[index % defaultPositions.length] || { x: 50, y: 50 },
                };
            }

            const positionName = extractPositionFromDescription(player.position.clusterName);
            const basePosition = FIELD_POSITIONS[positionName];

            if (!basePosition) {
                return {
                    ...player,
                    fieldCoords: FIELD_POSITIONS.PIVOT,
                };
            }

            return {
                ...player,
                fieldCoords: basePosition,
            };
        });
    }, [players]);

    const positionedPlayers = useMemo(() => {
        const grouped: Record<string, PlayerWithCoords[]> = {};

        playersWithCoords.forEach(player => {
            const key = `${player.fieldCoords.x}-${player.fieldCoords.y}`;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(player);
        });

        const distributed: Array<PlayerWithCoords & { finalCoords: { x: number; y: number } }> = [];

        Object.values(grouped).forEach(groupPlayers => {
            const firstPlayerPosition = groupPlayers[0].position?.clusterName;
            const positionName = firstPlayerPosition
                ? extractPositionFromDescription(firstPlayerPosition)
                : 'PIVOT';

            if (groupPlayers.length === 1) {
                distributed.push({
                    ...groupPlayers[0],
                    finalCoords: groupPlayers[0].fieldCoords,
                });
            } else if (positionName === 'ALA') {
                groupPlayers.forEach((player, index) => {
                    const positions = [
                        { x: 45, y: 25 },
                        { x: 45, y: 75 },
                        { x: 48, y: 40 },
                        { x: 48, y: 60 },
                    ];
                    distributed.push({
                        ...player,
                        finalCoords: positions[index % positions.length],
                    });
                });
            } else if (positionName === 'CIERRE') {
                groupPlayers.forEach((player, index) => {
                    const positions = [
                        { x: 30, y: 35 },
                        { x: 30, y: 65 },
                        { x: 28, y: 50 },
                    ];
                    distributed.push({
                        ...player,
                        finalCoords: positions[index % positions.length],
                    });
                });
            } else if (positionName === 'PIVOT') {
                groupPlayers.forEach((player, index) => {
                    const positions = [
                        { x: 50, y: 50 },
                        { x: 52, y: 40 },
                        { x: 52, y: 60 },
                    ];
                    distributed.push({
                        ...player,
                        finalCoords: positions[index % positions.length],
                    });
                });
            } else if (positionName === 'PORTERO') {
                groupPlayers.forEach((player, index) => {
                    const positions = [
                        { x: 10, y: 50 },
                        { x: 10, y: 40 },
                        { x: 10, y: 60 },
                    ];
                    distributed.push({
                        ...player,
                        finalCoords: positions[index % positions.length],
                    });
                });
            } else {
                groupPlayers.forEach((player, index) => {
                    const total = groupPlayers.length;
                    const angle = (index * 360) / total;
                    const radius = 8;

                    const offsetX = radius * Math.cos((angle * Math.PI) / 180);
                    const offsetY = radius * Math.sin((angle * Math.PI) / 180);

                    distributed.push({
                        ...player,
                        finalCoords: {
                            x: Math.max(5, Math.min(95, player.fieldCoords.x + offsetX)),
                            y: Math.max(5, Math.min(95, player.fieldCoords.y + offsetY)),
                        },
                    });
                });
            }
        });

        return distributed;
    }, [playersWithCoords]);

    return (
        <div className="relative w-full bg-linear-to-br from-green-600 to-green-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: '56%' }}>
                {/* Field markings */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 90" preserveAspectRatio="none">
                    {/* Outer boundary */}
                    <rect x="2" y="2" width="156" height="86" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />

                    {/* Center line */}
                    <line x1="80" y1="2" x2="80" y2="88" stroke="white" strokeWidth="0.5" opacity="0.8" />

                    {/* Center circle */}
                    <circle cx="80" cy="45" r="8" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />
                    <circle cx="80" cy="45" r="0.8" fill="white" opacity="0.8" />

                    {/* Left goal area */}
                    <path d="M 2 30 L 12 30 L 12 60 L 2 60" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />
                    <path d="M 2 38 L 7 38 L 7 52 L 2 52" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />

                    {/* Right goal area */}
                    <path d="M 158 30 L 148 30 L 148 60 L 158 60" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />
                    <path d="M 158 38 L 153 38 L 153 52 L 158 52" fill="none" stroke="white" strokeWidth="0.5" opacity="0.8" />

                    {/* Penalty spots */}
                    <circle cx="15" cy="45" r="0.8" fill="white" opacity="0.8" />
                    <circle cx="145" cy="45" r="0.8" fill="white" opacity="0.8" />

                    {/* Corner arcs */}
                    <path d="M 2 2 Q 4 2 4 4" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
                    <path d="M 2 88 Q 4 88 4 86" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
                    <path d="M 158 2 Q 156 2 156 4" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
                    <path d="M 158 88 Q 156 88 156 86" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />

                    {/* Substitution zones */}
                    <line x1="75" y1="2" x2="75" y2="5" stroke="white" strokeWidth="0.5" opacity="0.6" />
                    <line x1="85" y1="2" x2="85" y2="5" stroke="white" strokeWidth="0.5" opacity="0.6" />
                </svg>

                {/* Grass pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{
                        backgroundImage: `repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 3%,
                            rgba(0,0,0,0.1) 3%,
                            rgba(0,0,0,0.1) 6%
                        )`,
                    }} />
                </div>

                {/* Players */}
                <div className="absolute inset-0">
                    {positionedPlayers.map((player) => (
                        <PlayerMarker
                            key={player.id}
                            player={player}
                            position={player.finalCoords}
                            onClick={() => onPlayerClick?.(player)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};