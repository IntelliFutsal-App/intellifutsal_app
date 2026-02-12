import { useEffect, useState } from "react";
import { FaBrain, FaCheckCircle, FaChartLine, FaCalendarAlt } from "react-icons/fa";
import { Button, InlineLoading, Badge, BaseModal } from "@shared/components";
import type { TrainingAssignmentResponse, TrainingProgressResponse, TrainingPlanResponse } from "@features/training/types";
import { formatDate } from "@shared/utils/dateUtils";
import { trainingPlanService } from "@features/training/services/trainingPlanService";
import { trainingProgressService } from "@features/training/services/trainingProgressService";

interface TrainingDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignment: TrainingAssignmentResponse | null;
}

export const TrainingDetailsModal = ({ isOpen, onClose, assignment }: TrainingDetailsModalProps) => {
    const [plan, setPlan] = useState<TrainingPlanResponse | null>(null);
    const [progress, setProgress] = useState<TrainingProgressResponse[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !assignment) {
            setPlan(null);
            setProgress([]);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch plan details and progress in parallel
                const [planData, progressData] = await Promise.all([
                    trainingPlanService.findById(assignment.trainingPlanId),
                    trainingProgressService.findByAssignment(assignment.id),
                ]);

                setPlan(planData);
                setProgress(progressData);
            } catch (error) {
                console.error("Error al cargar detalles:", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [isOpen, assignment]);

    if (!assignment) return null;

    // Calculate overall progress
    const overallProgress = progress.length > 0
        ? Math.round(progress.reduce((acc, p) => acc + p.completionPercentage, 0) / progress.length)
        : 0;

    const latestProgress = progress.length > 0 ? progress[progress.length - 1] : null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalles del Entrenamiento"
            subtitle={`#${assignment.id}`}
            icon={FaBrain}
            iconColor="purple"
            maxWidth="2xl"
        >
            {loading ? (
                <div className="py-8">
                    <InlineLoading title="Cargando detalles..." description="Obteniendo información del plan" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Plan Info */}
                    {plan && (
                        <div className="bg-linear-to-br from-purple-50 to-purple-100/30 rounded-xl p-5 border border-purple-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{plan.title}</h3>
                            <p className="text-sm text-gray-700 mb-4">{plan.description}</p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {plan.difficulty && (
                                    <div className="bg-white rounded-lg p-3 text-center">
                                        <p className="text-xs text-gray-600 mb-1">Dificultad</p>
                                        <p className="text-sm font-bold text-gray-800">{plan.difficulty}</p>
                                    </div>
                                )}

                                {plan.durationMinutes && (
                                    <div className="bg-white rounded-lg p-3 text-center">
                                        <p className="text-xs text-gray-600 mb-1">Duración</p>
                                        <p className="text-sm font-bold text-gray-800">{plan.durationMinutes} min</p>
                                    </div>
                                )}

                                {plan.focusArea && (
                                    <div className="bg-white rounded-lg p-3 text-center">
                                        <p className="text-xs text-gray-600 mb-1">Área de enfoque</p>
                                        <p className="text-sm font-bold text-gray-800">{plan.focusArea}</p>
                                    </div>
                                )}

                                <div className="bg-white rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-600 mb-1">Tipo</p>
                                    <p className="text-sm font-bold text-gray-800">
                                        {plan.generatedByAi ? "IA" : "Manual"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Assignment Dates */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <FaCalendarAlt className="text-blue-500" />
                            Fechas de Asignación
                        </h3>

                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="space-y-2 text-sm">
                                {assignment.startDate && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Fecha de inicio:</span>
                                        <span className="font-semibold text-gray-800">
                                            {formatDate(new Date(assignment.startDate))}
                                        </span>
                                    </div>
                                )}

                                {assignment.endDate && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Fecha límite:</span>
                                        <span className="font-semibold text-gray-800">
                                            {formatDate(new Date(assignment.endDate))}
                                        </span>
                                    </div>
                                )}

                                {assignment.approvedAt && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Aprobado:</span>
                                        <span className="font-semibold text-green-700 flex items-center gap-1">
                                            <FaCheckCircle className="text-xs" />
                                            {formatDate(new Date(assignment.approvedAt))}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Progress Overview */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <FaChartLine className="text-green-500" />
                            Resumen de Progreso
                        </h3>

                        <div className="bg-linear-to-br from-green-50 to-green-100/30 rounded-xl p-5 border border-green-200">
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="bg-white rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-600 mb-1">Sesiones</p>
                                    <p className="text-2xl font-bold text-gray-800">{progress.length}</p>
                                </div>

                                <div className="bg-white rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-600 mb-1">Progreso Promedio</p>
                                    <p className="text-2xl font-bold text-green-700">{overallProgress}%</p>
                                </div>

                                <div className="bg-white rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-600 mb-1">Verificadas</p>
                                    <p className="text-2xl font-bold text-blue-700">
                                        {progress.filter((p) => p.coachVerified).length}
                                    </p>
                                </div>
                            </div>

                            {latestProgress && (
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs font-semibold text-gray-700 mb-2">Último Registro</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            {formatDate(new Date(latestProgress.progressDate))}
                                        </span>
                                        <span className="text-sm font-bold text-green-700">
                                            {latestProgress.completionPercentage}%
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress History */}
                    {progress.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-3">
                                Historial de Progreso ({progress.length})
                            </h3>

                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                                {progress
                                    .slice()
                                    .reverse()
                                    .map((p) => (
                                        <div
                                            key={p.id}
                                            className="p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {formatDate(new Date(p.progressDate))}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Completitud: {p.completionPercentage}%
                                                    </p>
                                                </div>

                                                {p.coachVerified && (
                                                    <Badge variant="success" className="shrink-0">
                                                        Verificado
                                                    </Badge>
                                                )}
                                            </div>

                                            {p.notes && (
                                                <p className="text-xs text-gray-600 mb-2 italic">"{p.notes}"</p>
                                            )}

                                            {p.verificationComment && (
                                                <div className="bg-blue-50 rounded-lg p-2 mt-2">
                                                    <p className="text-xs font-semibold text-blue-800 mb-1">
                                                        Comentario del Entrenador:
                                                    </p>
                                                    <p className="text-xs text-blue-700">"{p.verificationComment}"</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {progress.length === 0 && (
                        <div className="text-center py-8">
                            <div className="bg-gray-100 rounded-full p-6 w-fit mx-auto mb-4">
                                <FaChartLine className="text-gray-400 text-3xl" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600">Sin registros de progreso</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Aún no has registrado ninguna sesión de entrenamiento
                            </p>
                        </div>
                    )}

                    {/* Close Button */}
                    <div className="flex justify-end pt-2">
                        <Button variant="ghost" onClick={onClose}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            )}
        </BaseModal>
    );
};