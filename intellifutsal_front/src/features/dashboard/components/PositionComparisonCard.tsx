import { FaArrowRight, FaBrain, FaCheck, FaRunning, FaTrophy } from "react-icons/fa";
import { Badge, InfoTile } from "@shared/components";

interface PositionComparisonCardProps {
    currentPosition: string;
    aiPosition: string;
}

export const PositionComparisonCard = ({ currentPosition, aiPosition }: PositionComparisonCardProps) => {
    const isMatch = currentPosition === aiPosition;

    return (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl group overflow-hidden relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <FaBrain className="mr-2 text-orange-600" />
                    Análisis Posicional
                </h3>

                <Badge variant="secondary">{isMatch ? "POSICIÓN ÓPTIMA" : "RECOMENDACIÓN IA"}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <InfoTile
                    title="Posición Actual"
                    value={currentPosition}
                    icon={FaRunning}
                    color="blue"
                    size="md"
                />

                <div className="flex justify-center items-center">
                    {isMatch ? (
                        <div className="text-center">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                <FaCheck className="text-white text-xl sm:text-2xl" />
                            </div>
                            <p className="text-sm font-semibold text-green-600">¡Posición Óptima!</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <FaArrowRight className="text-orange-600 text-3xl mx-auto mb-2 animate-pulse" />
                            <p className="text-sm font-semibold text-orange-600">Cambio sugerido</p>
                        </div>
                    )}
                </div>

                <InfoTile
                    title="Posición Recomendada IA"
                    value={aiPosition}
                    icon={FaBrain}
                    color="orange"
                    size="md"
                />
            </div>

            {!isMatch && (
                <div className="mt-6 bg-linear-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-start gap-3">
                        <FaTrophy className="text-orange-600 text-xl mt-0.5 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 mb-1">Sugerencia del Sistema</p>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Basado en las características físicas y antropométricas, la IA sugiere considerar{" "}
                                <span className="font-bold text-orange-600" title={aiPosition}>
                                    {aiPosition}
                                </span>{" "}
                                como posición óptima para maximizar el rendimiento.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};