import { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { AiApiAnalyzeResponse } from "../types";
import { aiApiService } from "../services";
import type { PlayerResponse } from "@features/player";
import { isPlayerProfileCompleteForAI, getMissingPlayerAIFields } from "@features/player";

export const usePlayerSelfAnalysis = (playerId: number | null, player?: PlayerResponse | null) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisData, setAnalysisData] = useState<AiApiAnalyzeResponse | null>(null);
    const requestIdRef = useRef(0);

    const analyze = useCallback(async () => {
        if (!playerId) {
            toast.error("No se pudo identificar tu perfil de jugador");
            return;
        }

        if (player && !isPlayerProfileCompleteForAI(player)) {
            const missing = getMissingPlayerAIFields(player);
            toast.warn(`Completa tu perfil para usar el análisis IA. Faltan: ${missing.join(", ")}`);
            return;
        }

        const requestId = ++requestIdRef.current;
        setIsAnalyzing(true);
        setAnalysisData(null);

        try {
            const data = await aiApiService.analyze(playerId);

            if (requestId !== requestIdRef.current) return;

            if (!data?.success) {
                toast.error("La IA no pudo generar el análisis");
                return;
            }

            setAnalysisData(data);
        } catch (error) {
            if (requestId !== requestIdRef.current) return;
            console.error("Error al analizar con IA:", error);
        } finally {
            if (requestId === requestIdRef.current) setIsAnalyzing(false);
        }
    }, [playerId, player]);

    const clear = useCallback(() => {
        requestIdRef.current += 1;
        setAnalysisData(null);
        setIsAnalyzing(false);
    }, []);

    return { isAnalyzing, analysisData, analyze, clear };
};