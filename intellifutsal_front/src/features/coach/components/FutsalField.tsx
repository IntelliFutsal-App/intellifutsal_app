import { useMemo } from "react";
import { PlayerMarker } from "./PlayerMarker";
import type { PlayerFieldData } from "@features/ai-module";
import { FutsalSvg } from "@shared/ui";

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
                <FutsalSvg />

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