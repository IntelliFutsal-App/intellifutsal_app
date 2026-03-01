import { useState } from "react";
import type { AiApiPhysicalResponse, AiApiPositionResponse } from "../types";
import { aiApiService } from "../services";

export interface PlayerSelfAnalysis {
    position: AiApiPositionResponse | null;
    physical: AiApiPhysicalResponse | null;
    loading: boolean;
    analyzed: boolean;
    error: string | null;
}

export interface TeammateSummary {
    id: number;
    name: string;
    position: string | null;
}

export const usePlayerFieldView = (
    currentPlayerId: number | null,
) => {
    const [selfAnalysis, setSelfAnalysis] = useState<PlayerSelfAnalysis>({
        position: null,
        physical: null,
        loading: false,
        analyzed: false,
        error: null,
    });

    const analyzeMyself = async () => {
        if (!currentPlayerId) return;

        setSelfAnalysis({ position: null, physical: null, loading: true, analyzed: false, error: null });

        try {
            const [positionResult, physicalResult] = await Promise.allSettled([
                aiApiService.predictPosition(currentPlayerId),
                aiApiService.predictPhysical(currentPlayerId),
            ]);

            setSelfAnalysis({
                position: positionResult.status === "fulfilled" ? positionResult.value : null,
                physical: physicalResult.status === "fulfilled" ? physicalResult.value : null,
                loading: false,
                analyzed: true,
                error:
                    positionResult.status === "rejected" && physicalResult.status === "rejected"
                        ? "Error al analizar tu perfil"
                        : null,
            });
        } catch (err) {
            console.error("Error al analizar jugador:", err);
            setSelfAnalysis({
                position: null,
                physical: null,
                loading: false,
                analyzed: false,
                error: "Error inesperado al analizar tu perfil",
            });
        }
    };

    const reset = () => {
        setSelfAnalysis({ position: null, physical: null, loading: false, analyzed: false, error: null });
    };

    return {
        selfAnalysis,
        analyzeMyself,
        reset,
    };
};