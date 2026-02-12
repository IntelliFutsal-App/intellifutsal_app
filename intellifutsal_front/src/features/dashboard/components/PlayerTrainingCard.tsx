import { useMemo } from "react";
import { FaBrain, FaCalendarAlt, FaClock, FaDumbbell, FaFire, FaCheckCircle } from "react-icons/fa";
import { Badge, Button } from "@shared/components";
import type { TrainingAssignmentResponse } from "@features/training/types";
import { formatDate, daysBetween } from "@shared/utils/dateUtils";

interface PlayerTrainingCardProps {
    assignment: TrainingAssignmentResponse;
    onViewDetails: (assignment: TrainingAssignmentResponse) => void;
    onRecordProgress: (assignment: TrainingAssignmentResponse) => void;
}

const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
        case "ACTIVE":
            return { variant: "success" as const, label: "Activo", color: "bg-green-500" };
        case "CANCELLED":
            return { variant: "neutral" as const, label: "Cancelado", color: "bg-gray-500" };
        case "COMPLETED":
            return { variant: "info" as const, label: "Completado", color: "bg-blue-500" };
        default:
            return { variant: "warning" as const, label: "Pendiente", color: "bg-amber-500" };
    }
};

export const PlayerTrainingCard = ({
    assignment,
    onViewDetails,
    onRecordProgress,
}: PlayerTrainingCardProps) => {
    const statusInfo = getStatusInfo(assignment.status);

    const daysRemaining = useMemo(() => {
        if (!assignment.endDate) return null;
        return daysBetween(new Date(), new Date(assignment.endDate));
    }, [assignment.endDate]);

    const isExpired = daysRemaining !== null && daysRemaining < 0;
    const isActive = assignment.status.toUpperCase() === "ACTIVE";

    return (
        <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative">
            {/* Header */}
            <div className="bg-linear-to-br from-orange-600 to-orange-700 relative overflow-hidden p-5 sm:p-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />

                <div className="relative">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-white text-lg sm:text-xl mb-1 line-clamp-2">
                                Entrenamiento #{assignment.id}
                            </h3>
                            {assignment.startDate && (
                                <p className="text-purple-100 text-xs sm:text-sm">
                                    Inicio: {formatDate(new Date(assignment.startDate))}
                                </p>
                            )}
                        </div>

                        <Badge
                            variant={statusInfo.variant}
                            className="shrink-0 bg-white/15 text-white border border-white/20"
                        >
                            {statusInfo.label}
                        </Badge>
                    </div>

                    {assignment.endDate && (
                        <div className="flex items-center gap-2 text-white/80 text-xs">
                            <FaCalendarAlt />
                            <span>
                                {isExpired
                                    ? `Expiró hace ${Math.abs(daysRemaining!)} días`
                                    : `${daysRemaining} días restantes`}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6">
                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-linear-to-br from-blue-50 to-blue-100/30 rounded-xl p-3 border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                            <FaClock className="text-blue-600 text-sm" />
                            <p className="text-xs font-semibold text-blue-700">Duración</p>
                        </div>
                        <p className="text-sm font-bold text-gray-800">
                            Plan de entrenamiento
                        </p>
                    </div>

                    <div className="bg-linear-to-br from-orange-50 to-orange-100/30 rounded-xl p-3 border border-orange-200">
                        <div className="flex items-center gap-2 mb-1">
                            <FaFire className="text-orange-600 text-sm" />
                            <p className="text-xs font-semibold text-orange-700">Estado</p>
                        </div>
                        <p className="text-sm font-bold text-gray-800">
                            {isActive ? "En curso" : statusInfo.label}
                        </p>
                    </div>
                </div>

                {/* Dates */}
                <div className="bg-linear-to-br from-gray-50 to-purple-50/30 rounded-xl p-4 mb-4 border border-gray-100">
                    <div className="space-y-2 text-sm">
                        {assignment.startDate && (
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-gray-600">Fecha de inicio:</span>
                                <span className="font-semibold text-gray-800">
                                    {formatDate(new Date(assignment.startDate))}
                                </span>
                            </div>
                        )}

                        {assignment.endDate && (
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-gray-600">Fecha límite:</span>
                                <span className="font-semibold text-gray-800">
                                    {formatDate(new Date(assignment.endDate))}
                                </span>
                            </div>
                        )}

                        {assignment.approvedAt && (
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-gray-600">Aprobado:</span>
                                <span className="font-semibold text-green-700 flex items-center gap-1">
                                    <FaCheckCircle className="text-xs" />
                                    {formatDate(new Date(assignment.approvedAt))}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                        onClick={() => onViewDetails(assignment)}
                        variant="primary"
                        icon={FaBrain}
                        iconPosition="left"
                        fullWidth
                        size="sm"
                    >
                        Ver Detalles
                    </Button>

                    <Button
                        onClick={() => onRecordProgress(assignment)}
                        variant="secondary"
                        icon={FaDumbbell}
                        iconPosition="left"
                        fullWidth
                        size="sm"
                        disabled={!isActive}
                    >
                        Registrar Progreso
                    </Button>
                </div>
            </div>
        </div>
    );
};