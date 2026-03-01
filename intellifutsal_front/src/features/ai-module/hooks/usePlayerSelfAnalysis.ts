import { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { AiApiAnalyzeResponse } from "../types";
import { aiApiService } from "../services";

export const usePlayerSelfAnalysis = (playerId: number | null) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisData, setAnalysisData] = useState<AiApiAnalyzeResponse | null>(null);
    const requestIdRef = useRef(0);

    const analyze = useCallback(async () => {
        if (!playerId) {
            toast.error("No se pudo identificar tu perfil de jugador");
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
            toast.error("Error al generar el análisis IA");
        } finally {
            if (requestId === requestIdRef.current) setIsAnalyzing(false);
        }
    }, [playerId]);

    const clear = useCallback(() => {
        requestIdRef.current += 1;
        setAnalysisData(null);
        setIsAnalyzing(false);
    }, []);

    return { isAnalyzing, analysisData, analyze, clear };
};