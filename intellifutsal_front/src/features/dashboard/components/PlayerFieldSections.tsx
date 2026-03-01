import { useState } from "react";
import { FaBrain, FaFutbol, FaPlay, FaUsers } from "react-icons/fa";
import { Button, InlineLoading } from "@shared/components";
import { useProfile, useActiveTeam } from "@shared/hooks";
import { PlayerFieldView, PlayerInfoPanel, useTeamPlayers, type PlayerResponse } from "@features/player";
import { usePlayerFieldView } from "@features/ai-module";

export const PlayerFieldSection = () => {
    const { profileState } = useProfile();
    const { activeTeamId, activeTeam } = useActiveTeam();

    const currentPlayer = profileState?.profile as PlayerResponse ?? null;
    const currentPlayerId = currentPlayer?.id ?? null;

    const { players: allPlayers, loading: isLoadingPlayers } = useTeamPlayers(activeTeamId);

    const teammates = allPlayers.filter((p) => p.id !== currentPlayerId);

    const { selfAnalysis, analyzeMyself, reset } = usePlayerFieldView(
        currentPlayerId,
    );

    const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);

    const hasAnalysis = selfAnalysis.analyzed;
    const isAnalyzing = selfAnalysis.loading;

    const handleAnalyze = async () => {
        setShowAnalysisPanel(true);
        await analyzeMyself();
    };

    const handleReset = () => {
        reset();
        setShowAnalysisPanel(false);
    };

    if (isLoadingPlayers) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <InlineLoading title="Cargando equipo..." description="Obteniendo información del equipo" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Mi Posición en el Campo
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {activeTeam?.name ?? "Sin equipo"} · {teammates.length + (currentPlayer ? 1 : 0)} jugadores
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {hasAnalysis && (
                            <Button
                                onClick={() => setShowAnalysisPanel(!showAnalysisPanel)}
                                variant="outline"
                                icon={FaBrain}
                                iconPosition="left"
                                className={
                                    showAnalysisPanel
                                        ? "bg-linear-to-r from-purple-600 to-purple-700 text-white border-transparent hover:shadow-purple-500/50"
                                        : "bg-white text-gray-700 hover:shadow-xl border-gray-200"
                                }
                            >
                                {showAnalysisPanel ? "Ver Campo" : "Ver Mi Análisis"}
                            </Button>
                        )}

                        <Button
                            onClick={isAnalyzing ? undefined : hasAnalysis ? handleReset : handleAnalyze}
                            disabled={isAnalyzing || !currentPlayerId}
                            icon={hasAnalysis ? FaPlay : FaBrain}
                            iconPosition="left"
                            variant="primary"
                        >
                            {isAnalyzing
                                ? "Analizando..."
                                : hasAnalysis
                                    ? "Reanalizar"
                                    : "Analizar Mi Perfil"}
                        </Button>
                    </div>
                </div>
            </div>

            {!activeTeamId ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
                    <FaUsers className="text-yellow-500 text-3xl mx-auto mb-3" />
                    <p className="text-yellow-800 font-semibold">No tienes un equipo activo.</p>
                    <p className="text-yellow-700 text-sm mt-1">
                        Únete a un equipo para ver tu posición en el campo junto a tus compañeros.
                    </p>
                </div>
            ) : !currentPlayer ? (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                    <p className="text-gray-700 font-medium">No se pudo cargar tu perfil de jugador.</p>
                </div>
            ) : isAnalyzing ? (
                <div className="flex items-center justify-center min-h-[50vh]">
                    <InlineLoading
                        title="Analizando tu perfil..."
                        description="La IA está prediciendo tu posición y perfil físico ideal"
                    />
                </div>
            ) : !hasAnalysis ? (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 flex items-center gap-3 group overflow-hidden relative">
                        <FaBrain className="text-blue-500 shrink-0" />
                        <p className="text-sm text-blue-800">
                            Puedes ver a tus compañeros en el campo según su posición declarada.{" "}
                            <span className="font-semibold">
                                Pulsa "Analizar Mi Perfil" para descubrir tu posición y perfil físico con IA.
                            </span>
                        </p>
                    </div>

                    <PlayerFieldView
                        currentPlayer={currentPlayer}
                        teammates={teammates}
                        predictedPosition={null}
                        isCurrentPlayerAnalyzed={false}
                    />

                    {teammates.length === 0 && (
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-xl text-center">
                            <div className="bg-linear-to-br from-orange-100 to-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaFutbol className="text-4xl text-orange-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Eres el primer jugador</h3>
                            <p className="text-sm text-gray-600">
                                Tu equipo aún no tiene otros jugadores. ¡Invítalos a unirse!
                            </p>
                        </div>
                    )}
                </div>
            ) : showAnalysisPanel ? (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3">
                        <PlayerFieldView
                            currentPlayer={currentPlayer}
                            teammates={teammates}
                            predictedPosition={selfAnalysis.position}
                            isCurrentPlayerAnalyzed
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <PlayerInfoPanel
                            mode="self"
                            position={selfAnalysis.position}
                            physical={selfAnalysis.physical}
                            onReanalyze={handleAnalyze}
                        />
                    </div>
                </div>
            ) : (
                <PlayerFieldView
                    currentPlayer={currentPlayer}
                    teammates={teammates}
                    predictedPosition={selfAnalysis.position}
                    isCurrentPlayerAnalyzed
                />
            )}

            {/* Error */}
            {selfAnalysis.error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
                    {selfAnalysis.error}
                </div>
            )}
        </div>
    );
};