import { FaBrain, FaCheck, FaChartLine, FaRedo } from "react-icons/fa";
import { Button, InlineLoading } from "@shared/components";
import { useProfile } from "@shared/hooks";
import { PhysicalProfileCard, PositionComparisonCard, type PlayerResponse } from "@features/player";
import { usePlayerSelfAnalysis } from "@features/ai-module";
import { TrainingRecommendationsCard } from "@features/training";
import { PerformanceMetricsCard } from "./PerformanceMetricsCard";
import { mapPositionToEs } from '../../../shared/utils/positionUtils';

export const PlayerAIAnalysisSection = () => {
    const { profileState } = useProfile();

    const player = profileState?.profile as PlayerResponse ?? null;
    const playerId = player?.id ?? null;

    const { isAnalyzing, analysisData, analyze, clear } = usePlayerSelfAnalysis(playerId);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Mi Análisis con IA
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Descubre tu perfil físico, posición ideal y recomendaciones personalizadas
                        </p>
                    </div>

                    <div className="flex gap-3 shrink-0">
                        {analysisData && (
                            <Button
                                onClick={clear}
                                variant="secondary"
                                size="sm"
                                iconPosition="left"
                                disabled={isAnalyzing}
                            >
                                Limpiar
                            </Button>
                        )}
                        <Button
                            onClick={analyze}
                            disabled={isAnalyzing || !playerId}
                            icon={analysisData ? FaRedo : FaBrain}
                            iconPosition="left"
                            variant="primary"
                        >
                            {isAnalyzing
                                ? "Analizando..."
                                : analysisData
                                    ? "Reanalizar"
                                    : "Analizar Mi Perfil"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Loading */}
            {isAnalyzing && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-gray-100 shadow-xl text-center">
                    <InlineLoading
                        title="Analizando tu perfil con IA..."
                        description="Procesando tus datos antropométricos y generando recomendaciones personalizadas"
                    />
                </div>
            )}

            {!isAnalyzing && analysisData && player && (
                <div className="space-y-6">
                    {/* Player header */}
                    <div className="bg-linear-to-r from-orange-600 to-orange-700 rounded-2xl p-5 sm:p-6 text-white shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
                        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(player.firstName)}+${encodeURIComponent(player.lastName)}&background=fff&color=ea580c&size=80`}
                                    alt={`${player.firstName} ${player.lastName}`}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl ring-4 ring-white/30 shadow-lg shrink-0"
                                />
                                <div className="min-w-0">
                                    <h3 className="text-xl sm:text-2xl font-bold truncate">
                                        {player.firstName} {player.lastName}
                                    </h3>
                                    <p className="text-orange-100 text-sm mt-0.5">
                                        Posición actual: <span className="font-semibold">{mapPositionToEs(player.position)}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl w-fit shrink-0">
                                <p className="text-xs text-white/80">Análisis actualizado</p>
                                <p className="font-bold text-sm">Hoy</p>
                            </div>
                        </div>
                    </div>

                    <PositionComparisonCard
                        currentPosition={mapPositionToEs(player.position)}
                        aiPosition={analysisData.positionName}
                    />

                    <PhysicalProfileCard
                        physicalName={analysisData.physicalName}
                        description={analysisData.generalAnalysis}
                        strengths={analysisData.strengths}
                        developmentAreas={analysisData.weaknesses}
                    />

                    <PerformanceMetricsCard metrics={analysisData.rawFeatures} />

                    <TrainingRecommendationsCard recommendations={analysisData.trainingRecommendations} />

                    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl overflow-hidden relative">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaChartLine className="text-orange-600" />
                            Perfil de Rendimiento
                        </h3>
                        <div className="bg-linear-to-br from-gray-50 to-orange-50/30 rounded-xl p-5 sm:p-6 border border-gray-200">
                            <p className="text-gray-700 leading-relaxed">{analysisData.performanceProfile}</p>
                        </div>
                    </div>
                </div>
            )}

            {!isAnalyzing && !analysisData && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-gray-100 shadow-xl text-center overflow-hidden relative">
                    <div className="bg-linear-to-br from-orange-100 to-orange-50 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <FaBrain className="text-4xl sm:text-5xl text-orange-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                        Descubre tu Perfil Ideal
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto text-sm sm:text-base">
                        Nuestra IA analizará tus métricas físicas para identificar tu posición natural,
                        perfil atlético y un plan de desarrollo personalizado.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        {["Análisis Posicional", "Perfil Físico", "Recomendaciones de Entrenamiento"].map((t) => (
                            <div key={t} className="flex items-center gap-2 text-sm text-gray-600">
                                <FaCheck className="text-green-600 shrink-0" />
                                <span>{t}</span>
                            </div>
                        ))}
                    </div>

                    {!playerId && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 max-w-md mx-auto">
                            No se encontró tu perfil de jugador. Asegúrate de tener un perfil completo.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};