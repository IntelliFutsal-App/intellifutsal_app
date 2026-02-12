import { useState } from "react";
import { aiApiService } from "@features/ai-module/services/aiService";
import type { AiApiPhysicalResponse, AiApiPositionResponse } from "@features/ai-module/types";
import type { PlayerResponse } from "@features/player/types";

export interface PlayerFieldData {
    id: number;
    name: string;
    position: AiApiPositionResponse | null;
    physical: AiApiPhysicalResponse | null;
    loading: boolean;
    error: string | null;
}

export const useTeamFieldAnalysis = (teamId: number | null, players: PlayerResponse[]) => {
    const [playersData, setPlayersData] = useState<PlayerFieldData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeTeam = async () => {
        if (!teamId || players.length === 0) return;

        setLoading(true);
        setError(null);

        const initialData: PlayerFieldData[] = players.map(p => ({
            id: p.id,
            name: `${p.firstName} ${p.lastName}`,
            position: null,
            physical: null,
            loading: true,
            error: null,
        }));

        setPlayersData(initialData);

        try {
            const results = await Promise.allSettled(
                players.map(async (player) => {
                    const [positionResult, physicalResult] = await Promise.allSettled([
                        aiApiService.predictPosition(player.id),
                        aiApiService.predictPhysical(player.id),
                    ]);

                    return {
                        id: player.id,
                        name: `${player.firstName} ${player.lastName}`,
                        position: positionResult.status === 'fulfilled' ? positionResult.value : null,
                        physical: physicalResult.status === 'fulfilled' ? physicalResult.value : null,
                        loading: false,
                        error: positionResult.status === 'rejected' || physicalResult.status === 'rejected'
                            ? 'Error al analizar jugador'
                            : null,
                    };
                })
            );

            const processedData = results.map(result =>
                result.status === 'fulfilled' ? result.value : null
            ).filter(Boolean) as PlayerFieldData[];

            setPlayersData(processedData);
        } catch (err) {
            setError('Error al analizar el equipo');
            console.error('Error analyzing team:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        playersData,
        loading,
        error,
        analyzeTeam,
    };
};