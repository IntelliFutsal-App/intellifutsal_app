import { useState } from "react";
import { FaBrain, FaChartLine, FaDumbbell, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { BaseModal, Button } from "@shared/ui";
import type { PlayerResponse } from "@features/player";
import { mapPositionToEs } from "@shared/utils";

interface PlayerAiAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    player: PlayerResponse | null;
    onGenerateTrainingPlan: (playerId: number) => Promise<void>;
}

export const PlayerAiAnalysisModal = ({
    isOpen,
    onClose,
    player,
    onGenerateTrainingPlan,
}: PlayerAiAnalysisModalProps) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGeneratePlan = async () => {
        if (!player) return;

        try {
            setIsGenerating(true);
            await onGenerateTrainingPlan(player.id);
            onClose();
        } catch (error) {
            console.error("Error al generar plan:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!player) return null;

    const fullName = `${player.firstName} ${player.lastName}`;
    const bmi = player.bmi != null ? Number(player.bmi) : null;

    const speedAnalysis = player.thirtyMetersTime != null
        ? (player.thirtyMetersTime < 4.5 ? "excelente" : player.thirtyMetersTime < 5.0 ? "buena" : "necesita mejorar")
        : null;
    const enduranceAnalysis = player.thousandMetersTime != null
        ? (player.thousandMetersTime < 240 ? "excelente" : player.thousandMetersTime < 300 ? "buena" : "necesita mejorar")
        : null;
    const bmiAnalysis = bmi != null
        ? (bmi >= 18.5 && bmi <= 24.9 ? "óptimo" : bmi < 18.5 ? "bajo peso" : "sobrepeso")
        : null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Análisis con IA"
            subtitle={fullName}
            icon={FaBrain}
            iconColor="purple"
            maxWidth="2xl"
        >
            <div className="space-y-6">
                {/* Player Summary */}
                <div className="bg-linear-to-br from-purple-50 to-purple-100/30 rounded-xl p-5 border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=7c3aed&color=fff`}
                            alt={fullName}
                            className="w-16 h-16 rounded-xl ring-4 ring-purple-200"
                        />
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">{fullName}</h3>
                            <p className="text-sm text-purple-700 font-medium">
                                {mapPositionToEs(player.position)} • {player.age} años
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-600 mb-1">Altura</p>
                            <p className="text-sm font-bold text-gray-800">{player.height != null ? `${player.height}m` : "—"}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-600 mb-1">Peso</p>
                            <p className="text-sm font-bold text-gray-800">{player.weight != null ? `${player.weight}kg` : "—"}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-600 mb-1">IMC</p>
                            <p className="text-sm font-bold text-gray-800">{bmi != null ? bmi.toFixed(1) : "—"}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Analysis */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <FaChartLine className="text-blue-500" />
                        Análisis Rápido
                    </h3>

                    <div className="space-y-2">
                        {speedAnalysis != null && (
                        <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-200">
                            <div className={`mt-0.5 ${speedAnalysis === "excelente" ? "text-green-500" : speedAnalysis === "buena" ? "text-amber-500" : "text-red-500"}`}>
                                {speedAnalysis === "excelente" ? <FaCheckCircle /> : <FaExclamationTriangle />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800">Velocidad (30m)</p>
                                <p className="text-xs text-gray-600">
                                    {player.thirtyMetersTime}s - Rendimiento {speedAnalysis}
                                </p>
                            </div>
                        </div>
                        )}

                        {enduranceAnalysis != null && (
                        <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-200">
                            <div className={`mt-0.5 ${enduranceAnalysis === "excelente" ? "text-green-500" : enduranceAnalysis === "buena" ? "text-amber-500" : "text-red-500"}`}>
                                {enduranceAnalysis === "excelente" ? <FaCheckCircle /> : <FaExclamationTriangle />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800">Resistencia (1000m)</p>
                                <p className="text-xs text-gray-600">
                                    {player.thousandMetersTime}s - Resistencia {enduranceAnalysis}
                                </p>
                            </div>
                        </div>
                        )}

                        {bmiAnalysis != null && bmi != null && (
                        <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-200">
                            <div className={`mt-0.5 ${bmiAnalysis === "óptimo" ? "text-green-500" : "text-amber-500"}`}>
                                {bmiAnalysis === "óptimo" ? <FaCheckCircle /> : <FaExclamationTriangle />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800">Composición Corporal</p>
                                <p className="text-xs text-gray-600">
                                    IMC {bmi.toFixed(1)} - Índice {bmiAnalysis}
                                </p>
                            </div>
                        </div>
                        )}

                        {speedAnalysis == null && enduranceAnalysis == null && bmiAnalysis == null && (
                            <p className="text-sm text-gray-500 italic">No hay métricas suficientes para el análisis rápido.</p>
                        )}
                    </div>
                </div>

                {/* AI Recommendation */}
                <div className="bg-linear-to-r from-orange-50 to-orange-100/30 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <FaDumbbell className="text-orange-600 text-xl mt-1" />
                        <div>
                            <h4 className="text-sm font-bold text-orange-900 mb-2">
                                Generar Plan de Entrenamiento Personalizado
                            </h4>
                            <p className="text-xs text-orange-800 mb-3">
                                La IA analizará todas las métricas de <strong>{player.firstName}</strong> y creará un
                                plan de entrenamiento optimizado para mejorar su rendimiento en las áreas que más lo
                                necesitan.
                            </p>
                            <Button
                                variant="primary"
                                size="sm"
                                icon={FaBrain}
                                iconPosition="left"
                                onClick={handleGeneratePlan}
                                loading={isGenerating}
                                disabled={isGenerating}
                            >
                                {isGenerating ? "Generando..." : "Generar Plan con IA"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs text-blue-800">
                        <span className="font-bold">Análisis detallado:</span> El plan generado considerará la
                        posición, edad, métricas físicas y rendimiento del jugador para crear entrenamientos
                        específicos y progresivos.
                    </p>
                </div>

                {/* Close Button */}
                <div className="flex justify-end">
                    <Button variant="ghost" onClick={onClose} disabled={isGenerating} iconPosition="left">
                        Cerrar
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
};