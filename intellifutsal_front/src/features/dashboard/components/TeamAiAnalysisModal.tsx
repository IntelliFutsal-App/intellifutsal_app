import { useEffect, useState } from "react";
import { FaBrain, FaChartLine, FaCheckCircle, FaExclamationTriangle, FaDumbbell } from "react-icons/fa";
import { BaseModal, Button, InlineLoading } from "@shared/components";
import type { TeamResponse } from "@features/team/types";
import type { PlayerResponse } from "@features/player/types";
import { playerService } from "@features/player/services/playerService";

interface TeamAiAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    team: TeamResponse | null;
    onGenerateTrainingPlan: (teamId: number) => Promise<void>;
}

export const TeamAiAnalysisModal = ({
    isOpen,
    onClose,
    team,
    onGenerateTrainingPlan,
}: TeamAiAnalysisModalProps) => {
    const [players, setPlayers] = useState<PlayerResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (!isOpen || !team) {
            setPlayers([]);
            return;
        }

        const fetchPlayers = async () => {
            try {
                setLoading(true);
                const data = await playerService.findByTeamId(team.id);
                setPlayers(data);
            } catch (error) {
                console.error("Error al cargar jugadores:", error);
                setPlayers([]);
            } finally {
                setLoading(false);
            }
        };

        void fetchPlayers();
    }, [isOpen, team]);

    const handleGeneratePlan = async () => {
        if (!team) return;

        try {
            setIsGenerating(true);
            await onGenerateTrainingPlan(team.id);
            onClose();
        } catch (error) {
            console.error("Error al generar plan:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!team) return null;

    const activePlayers = players.filter((p) => p.status);
    const avgAge =
        players.length > 0 ? Math.round(players.reduce((acc, p) => acc + p.age, 0) / players.length) : 0;
    const avgSpeed =
        players.length > 0
            ? players.reduce((acc, p) => acc + Number(p.thirtyMetersTime), 0) / players.length
            : 0;
    const avgEndurance =
        players.length > 0
            ? players.reduce((acc, p) => acc + Number(p.thousandMetersTime), 0) / players.length
            : 0;
    const avgBmi =
        players.length > 0 ? players.reduce((acc, p) => acc + Number(p.bmi), 0) / players.length : 0;

    const speedAnalysis = avgSpeed < 4.8 ? "excelente" : avgSpeed < 5.2 ? "buena" : "necesita mejorar";
    const enduranceAnalysis =
        avgEndurance < 260 ? "excelente" : avgEndurance < 320 ? "buena" : "necesita mejorar";
    const bmiAnalysis = avgBmi >= 20 && avgBmi <= 24 ? "óptimo" : "revisar";

    const positionCounts = players.reduce((acc, p) => {
        acc[p.position] = (acc[p.position] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Análisis Grupal con IA"
            subtitle={team.name}
            icon={FaBrain}
            iconColor="purple"
            maxWidth="2xl"
        >
            {loading ? (
                <div className="py-8">
                    <InlineLoading title="Analizando equipo..." description="Procesando métricas grupales" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Team Overview */}
                    <div className="bg-linear-to-br from-purple-50 to-purple-100/30 rounded-xl p-5 border border-purple-200">
                        <div className="grid grid-cols-4 gap-3 mb-4">
                            <div className="bg-white rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-600 mb-1">Jugadores</p>
                                <p className="text-lg font-bold text-gray-800">{players.length}</p>
                                <p className="text-xs text-green-600">{activePlayers.length} activos</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-600 mb-1">Edad Prom.</p>
                                <p className="text-lg font-bold text-gray-800">{avgAge}</p>
                                <p className="text-xs text-gray-500">años</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-600 mb-1">Categoría</p>
                                <p className="text-sm font-bold text-gray-800">{team.category}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-600 mb-1">IMC Prom.</p>
                                <p className="text-lg font-bold text-gray-800">{avgBmi.toFixed(1)}</p>
                            </div>
                        </div>

                        {/* Position Distribution */}
                        <div className="bg-white rounded-lg p-3">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Distribución por Posición</p>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(positionCounts).map(([position, count]) => (
                                    <span
                                        key={position}
                                        className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
                                    >
                                        {position}: {count}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Performance Analysis */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <FaChartLine className="text-blue-500" />
                            Análisis de Rendimiento Grupal
                        </h3>

                        <div className="space-y-2">
                            <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-200">
                                <div
                                    className={`mt-0.5 ${speedAnalysis === "excelente"
                                            ? "text-green-500"
                                            : speedAnalysis === "buena"
                                                ? "text-amber-500"
                                                : "text-red-500"
                                        }`}
                                >
                                    {speedAnalysis === "excelente" ? (
                                        <FaCheckCircle />
                                    ) : (
                                        <FaExclamationTriangle />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800">Velocidad Promedio (30m)</p>
                                    <p className="text-xs text-gray-600">
                                        {avgSpeed.toFixed(2)}s - Rendimiento grupal {speedAnalysis}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-200">
                                <div
                                    className={`mt-0.5 ${enduranceAnalysis === "excelente"
                                            ? "text-green-500"
                                            : enduranceAnalysis === "buena"
                                                ? "text-amber-500"
                                                : "text-red-500"
                                        }`}
                                >
                                    {enduranceAnalysis === "excelente" ? (
                                        <FaCheckCircle />
                                    ) : (
                                        <FaExclamationTriangle />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800">
                                        Resistencia Promedio (1000m)
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {avgEndurance.toFixed(0)}s - Resistencia grupal {enduranceAnalysis}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-200">
                                <div
                                    className={`mt-0.5 ${bmiAnalysis === "óptimo" ? "text-green-500" : "text-amber-500"
                                        }`}
                                >
                                    {bmiAnalysis === "óptimo" ? <FaCheckCircle /> : <FaExclamationTriangle />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800">
                                        Composición Corporal Promedio
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        IMC {avgBmi.toFixed(1)} - Índice grupal {bmiAnalysis}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Recommendation */}
                    <div className="bg-linear-to-r from-orange-50 to-orange-100/30 border border-orange-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <FaDumbbell className="text-orange-600 text-xl mt-1" />
                            <div>
                                <h4 className="text-sm font-bold text-orange-900 mb-2">
                                    Generar Plan de Entrenamiento Grupal
                                </h4>
                                <p className="text-xs text-orange-800 mb-3">
                                    La IA analizará las métricas de <strong>{team.name}</strong> y creará un plan de
                                    entrenamiento grupal optimizado que se adapta a las necesidades del equipo,
                                    considerando la distribución de posiciones y el rendimiento promedio.
                                </p>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    icon={FaBrain}
                                    iconPosition="left"
                                    onClick={handleGeneratePlan}
                                    loading={isGenerating}
                                    disabled={isGenerating || players.length === 0}
                                >
                                    {isGenerating ? "Generando..." : "Generar Plan Grupal con IA"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-xs text-blue-800">
                            <span className="font-bold">Análisis detallado:</span> El plan grupal considerará las
                            fortalezas y debilidades del equipo, la distribución de posiciones, y creará ejercicios
                            que beneficien al conjunto sin descuidar las necesidades individuales.
                        </p>
                    </div>

                    {/* Close Button */}
                    <div className="flex justify-end">
                        <Button variant="ghost" onClick={onClose} disabled={isGenerating}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            )}
        </BaseModal>
    );
};