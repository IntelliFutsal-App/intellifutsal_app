import { useMemo } from "react";
import { FaBrain, FaChartLine, FaCheck, FaTimes } from "react-icons/fa";
import type { SelectOption } from "@shared/components";
import { Button, Select } from "@shared/components";
import { useProfile } from "@shared/hooks";
import { TrainingRecommendationsCard } from "./TrainingRecommendationsCard";
import { PerformanceMetricsCard } from "./PerformanceMetricsCard";
import { PhysicalProfileCard } from "./PhysicalProfileCard";
import { PositionComparisonCard } from "./PositionComparisonCard";
import { useAIPlayerAnalysis, useTeamPlayers } from "../hooks";

export const AIAnalysisSection = () => {
    const { activeTeamId } = useProfile();

    const { players, activePlayers, loading: playersLoading } = useTeamPlayers(activeTeamId);

    const {
        selectedPlayerId,
        selectedPlayer,
        isAnalyzing,
        analysisData,
        analyzeByPlayerId,
        clear,
    } = useAIPlayerAnalysis(players);

    const selectDisabled = playersLoading || !activeTeamId || activePlayers.length === 0 || isAnalyzing;

    const selectPlaceholder = !activeTeamId
        ? "Selecciona un equipo primero"
        : playersLoading
            ? "Cargando jugadores..."
            : activePlayers.length === 0
                ? "No hay jugadores activos"
                : isAnalyzing
                    ? "Analizando..."
                    : "Seleccionar Jugador";

    const normalizePosition = (position: string) => {
        const pos = position.toLowerCase();

        if (pos.includes("pivot")) return "Pívot";
        if (pos.includes("winger")) return "Ala";
        if (pos.includes("fixo")) return "Poste";
        if (pos.includes("goalkeeper")) return "Portero";
        
        return position;
    }

    const playerOptions: SelectOption[] = useMemo(
        () =>
            activePlayers.map((p) => ({
                value: String(p.id),
                label: `${p.firstName} ${p.lastName} - ${normalizePosition(p.position)}`,
            })),
        [activePlayers]
    );

    return (
        <div className="space-y-6">
            {/* Header + controls */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start lg:items-center">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Análisis Inteligente con IA
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Obtén insights profundos sobre el rendimiento y potencial de tus jugadores
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,320px)_auto] gap-3 w-full lg:w-auto">
                        <Select
                            disabled={selectDisabled}
                            value={selectedPlayerId === "" ? "" : String(selectedPlayerId)}
                            placeholder={selectPlaceholder}
                            options={playerOptions}
                            onChange={(e) => {
                                const value = e.target.value;
                                const nextId = value ? Number(value) : "";
                                if (nextId !== "") void analyzeByPlayerId(nextId);
                            }}
                        />

                        {selectedPlayer && (
                            <Button
                                onClick={clear}
                                variant="secondary"
                                icon={FaTimes}
                                iconPosition="left"
                                disabled={isAnalyzing}
                                size="sm"
                                fullWidth
                                className="sm:w-auto"
                            >
                                Limpiar
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading */}
            {isAnalyzing && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-12 border border-gray-100 shadow-xl text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-orange-200 border-t-orange-600 mb-4" />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Analizando con IA...</h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Procesando datos antropométricos y generando recomendaciones
                    </p>
                </div>
            )}

            {/* Results */}
            {!isAnalyzing && analysisData && selectedPlayer && (
                <div className="space-y-6">
                    {/* Player header responsive */}
                    <div className="bg-linear-to-r from-orange-600 to-orange-700 rounded-2xl p-5 sm:p-6 text-white shadow-xl overflow-hidden relative">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPlayer.firstName)}+${encodeURIComponent(selectedPlayer.lastName)}&background=fff&color=ea580c&size=80`}
                                    alt={`${selectedPlayer.firstName} ${selectedPlayer.lastName}`}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl ring-4 ring-white/30 shadow-lg shrink-0"
                                />
                                <div className="min-w-0">
                                    <h3 className="text-xl sm:text-2xl font-bold truncate">
                                        {selectedPlayer.firstName} {selectedPlayer.lastName}
                                    </h3>
                                    <p className="text-orange-100 text-sm truncate">
                                        Posición Actual: {selectedPlayer.position}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl w-fit">
                                <p className="text-xs text-white/80">Análisis actualizado</p>
                                <p className="font-bold">Hoy</p>
                            </div>
                        </div>
                    </div>

                    <PositionComparisonCard currentPosition={selectedPlayer.position} aiPosition={analysisData.positionName} />

                    <PhysicalProfileCard
                        physicalName={analysisData.physicalName}
                        description={analysisData.generalAnalysis}
                        strengths={analysisData.strengths}
                        developmentAreas={analysisData.weaknesses}
                    />

                    <PerformanceMetricsCard metrics={analysisData.rawFeatures} />

                    <TrainingRecommendationsCard recommendations={analysisData.trainingRecommendations} />

                    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl overflow-hidden relative">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <FaChartLine className="mr-2 text-orange-600" />
                            Perfil de Rendimiento
                        </h3>
                        <div className="bg-linear-to-br from-gray-50 to-orange-50/30 rounded-xl p-5 sm:p-6 border border-gray-200">
                            <p className="text-gray-700 leading-relaxed">{analysisData.performanceProfile}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty */}
            {!isAnalyzing && !analysisData && !selectedPlayer && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-gray-100 shadow-xl text-center overflow-hidden relative">
                    <div className="bg-linear-to-br from-orange-100 to-orange-50 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <FaBrain className="text-4xl sm:text-5xl text-orange-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Análisis Inteligente con IA</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                        Selecciona un jugador para obtener un análisis completo de su perfil físico, posicional y recomendaciones personalizadas.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {["Análisis Posicional", "Perfil Físico", "Recomendaciones"].map((t) => (
                            <div key={t} className="flex items-center space-x-2 text-sm text-gray-600">
                                <FaCheck className="text-green-600" />
                                <span>{t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};