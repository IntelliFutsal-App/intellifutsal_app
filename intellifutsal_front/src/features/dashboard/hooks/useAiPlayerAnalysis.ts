import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { PlayerResponse } from "@features/player/types";
import type { AiApiAnalyzeResponse } from "@features/ai-module/types";
import { aiApiService } from "@features/ai-module/services/aiService";

export const useAIPlayerAnalysis = (players: PlayerResponse[]) => {
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | "">("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisData, setAnalysisData] = useState<AiApiAnalyzeResponse | null>(null);

    const analyzeRequestIdRef = useRef(0);

    const selectedPlayer = useMemo(() => {
        if (selectedPlayerId === "") return null;
        return players.find((p) => p.id === selectedPlayerId) ?? null;
    }, [players, selectedPlayerId]);

    const clear = useCallback(() => {
        analyzeRequestIdRef.current += 1;
        setSelectedPlayerId("");
        setAnalysisData(null);
        setIsAnalyzing(false);
    }, []);

    const analyzeByPlayerId = useCallback(
        async (playerId: number) => {
            const requestId = ++analyzeRequestIdRef.current;

            setIsAnalyzing(true);
            setSelectedPlayerId(playerId);
            setAnalysisData(null);

            try {
                const data = await aiApiService.analyze(playerId);

                if (requestId !== analyzeRequestIdRef.current) return;

                if (!data?.success) {
                    toast.error("La IA no pudo generar el análisis");
                    setAnalysisData(null);
                    return;
                }

                setAnalysisData(data);
            } catch (error) {
                if (requestId !== analyzeRequestIdRef.current) return;

                console.error("Error al analizar jugador con IA:", error);
                toast.error("Error al generar el análisis IA");
                setAnalysisData(null);
            } finally {
                if (requestId === analyzeRequestIdRef.current) {
                    setIsAnalyzing(false);
                }
            }
        },
        []
    );

    return {
        selectedPlayerId,
        setSelectedPlayerId,
        selectedPlayer,
        isAnalyzing,
        analysisData,
        analyzeByPlayerId,
        clear,
    };
};