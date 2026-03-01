import { useMemo } from "react";
import { FaClipboardList, FaTrophy } from "react-icons/fa";
import { Button } from "@shared/components";
import type { ReactNode } from "react";

interface TrainingRecommendationsCardProps {
    recommendations: string[];
    onApply?: (index: number) => void;
    onApplyAll?: () => void;
    renderItem?: (item: { text: string; index: number }) => ReactNode;
}

export const TrainingRecommendationsCard = ({
    recommendations,
    onApply,
    onApplyAll,
    renderItem,
}: TrainingRecommendationsCardProps) => {
    const hasRecommendations = recommendations && recommendations.length > 0;

    const items = useMemo(
        () => (recommendations ?? []).map((text, i) => ({ text, index: i })),
        [recommendations]
    );

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl group overflow-hidden relative">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaClipboardList className="mr-2 text-orange-600" />
                Plan de Entrenamiento Recomendado
            </h3>

            {!hasRecommendations ? (
                <div className="py-8 text-center text-gray-600">
                    No hay recomendaciones en este momento.
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map(({ text, index }) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-4 bg-linear-to-r from-gray-50 to-orange-50/30 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="w-8 h-8 shrink-0 bg-linear-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform duration-300">
                                {index + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                                {/* Allow consumer to override rendering per item */}
                                {renderItem ? (
                                    <div>{renderItem({ text, index })}</div>
                                ) : (
                                    <p className="text-sm text-gray-700 font-medium wrap-break-word">{text}</p>
                                )}
                            </div>

                            {/* optional per-item CTA */}
                            {onApply && (
                                <div className="shrink-0">
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={() => onApply(index)}
                                        className="px-3 py-1.5"
                                    >
                                        Aplicar
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 bg-linear-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-start space-x-3">
                    <FaTrophy className="text-blue-600 text-lg mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 mb-1">Consejo del Entrenador</p>
                        <p className="text-xs text-gray-700">
                            Este plan está diseñado específicamente para tu perfil físico. Mantén una progresión gradual,
                            prioriza la técnica y asegúrate de descansar adecuadamente entre sesiones.
                        </p>
                    </div>

                    {/* Apply all CTA if provided */}
                    {onApplyAll && (
                        <div className="ml-4 hidden sm:block">
                            <Button variant="primary" size="sm" onClick={onApplyAll}>
                                Aplicar todo
                            </Button>
                        </div>
                    )}
                </div>

                {/* mobile CTA placed below text for small screens */}
                {onApplyAll && (
                    <div className="mt-4 sm:hidden">
                        <Button variant="primary" size="sm" fullWidth onClick={onApplyAll}>
                            Aplicar todo
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};