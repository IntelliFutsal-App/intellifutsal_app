import { useEffect, useState } from "react";
import { FaBrain, FaUser, FaCheckCircle, FaTimesCircle, FaArchive, FaInfoCircle, FaClock, FaDumbbell } from "react-icons/fa";
import type { Role } from "@features/auth";
import type { TrainingPlanResponse } from "@features/training/types";
import { Badge, BaseModal, Button, type BadgeVariant, type IconColorType } from "@shared/components";
import { trainingPlanService } from "@features/training/services/trainingPlanService";
import type { IconType } from "react-icons";

interface TrainingPlanDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    planId: number | null;
    role: Role;
    onApprove?: (planId: number) => void;
    onReject?: (planId: number) => void;
    onArchive?: (planId: number) => void;
}

const STATUS_META: Record<
    string,
    { label: string; tone: "success" | "warning" | "danger" | "neutral" | "info"; icon: IconType }
> = {
    PENDING_APPROVAL: { label: "Pendiente de Aprobación", tone: "warning", icon: FaClock },
    APPROVED: { label: "Aprobado", tone: "success", icon: FaCheckCircle },
    REJECTED: { label: "Rechazado", tone: "danger", icon: FaTimesCircle },
    ARCHIVED: { label: "Archivado", tone: "neutral", icon: FaArchive },
    ACTIVE: { label: "Activo", tone: "info", icon: FaDumbbell },
    COMPLETED: { label: "Completado", tone: "success", icon: FaCheckCircle },
};

const DIFFICULTY_META: Record<string, { label: string; tone: "success" | "warning" | "danger" }> = {
    EASY: { label: "Fácil", tone: "success" },
    MEDIUM: { label: "Media", tone: "warning" },
    HARD: { label: "Difícil", tone: "danger" },
};

const formatDate = (date: Date | null | undefined) => {
    if (!date) return "No disponible";
    return new Date(date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const TrainingPlanDetailModal = ({
    isOpen,
    onClose,
    planId,
    role,
    onApprove,
    onReject,
    onArchive,
}: TrainingPlanDetailModalProps) => {
    const [plan, setPlan] = useState<TrainingPlanResponse | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !planId) {
            setPlan(null);
            return;
        }

        const fetchPlan = async () => {
            try {
                setLoading(true);
                const data = await trainingPlanService.findById(planId);
                setPlan(data);
            } catch (error) {
                console.error("Error al cargar plan:", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchPlan();
    }, [isOpen, planId]);

    const status = plan
        ? STATUS_META[plan.status] || { label: plan.status, tone: "neutral" as const, icon: FaInfoCircle }
        : null;
    const difficulty = plan?.difficulty ? DIFFICULTY_META[plan.difficulty] : null;

    const canApprove = role === "COACH" && plan?.status === "PENDING_APPROVAL";
    const canArchive = role === "COACH" && plan?.status !== "ARCHIVED";

    const iconColor: IconColorType = status?.tone === "success"
        ? "green"
        : status?.tone === "warning"
            ? "amber"
            : status?.tone === "danger"
                ? "red"
                : "blue";

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={plan?.title || "Cargando..."}
            subtitle={
                plan ? (
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                        {plan.generatedByAi && (
                            <Badge variant="secondary" icon={FaBrain} className="text-xs">
                                IA
                            </Badge>
                        )}
                        {status && (
                            <Badge variant={status.tone as BadgeVariant} className="text-xs">
                                {status.label}
                            </Badge>
                        )}
                    </div>
                ) : null
            }
            icon={status?.icon}
            iconColor={iconColor as IconColorType}
            maxWidth="3xl"
        >
            {loading ? (
                <div className="py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600 mb-4" />
                    <p className="text-gray-600">Cargando detalles...</p>
                </div>
            ) : plan ? (
                <div className="space-y-6">
                    {/* Description */}
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            Descripción
                        </label>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200">
                            {plan.description}
                        </p>
                    </div>

                    {/* Main Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {difficulty && (
                            <div className="bg-linear-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                                <p className="text-xs font-semibold text-gray-500 mb-2">Dificultad</p>
                                <Badge variant={difficulty.tone} className="text-sm">
                                    {difficulty.label}
                                </Badge>
                            </div>
                        )}

                        {plan.durationMinutes && (
                            <div className="bg-linear-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                                <p className="text-xs font-semibold text-gray-500 mb-2">Duración</p>
                                <p className="text-lg font-bold text-gray-800">{plan.durationMinutes} minutos</p>
                            </div>
                        )}

                        {plan.focusArea && (
                            <div className="bg-linear-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                                <p className="text-xs font-semibold text-gray-500 mb-2">Área de Enfoque</p>
                                <p className="text-lg font-bold text-gray-800 capitalize">{plan.focusArea}</p>
                            </div>
                        )}

                        {plan.clusterId && (
                            <div className="bg-linear-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                                <p className="text-xs font-semibold text-gray-500 mb-2">Cluster ID</p>
                                <p className="text-lg font-bold text-gray-800">{plan.clusterId}</p>
                            </div>
                        )}
                    </div>

                    {/* Metadata Section */}
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            Metadata
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">Creado</p>
                                <p className="text-sm font-semibold text-gray-800">{formatDate(plan.createdAt)}</p>
                            </div>

                            {plan.updatedAt && (
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1">Actualizado</p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {formatDate(plan.updatedAt)}
                                    </p>
                                </div>
                            )}

                            {plan.approvedAt && (
                                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                    <p className="text-xs text-green-700 mb-1">Aprobado</p>
                                    <p className="text-sm font-semibold text-green-800">
                                        {formatDate(plan.approvedAt)}
                                    </p>
                                </div>
                            )}

                            {plan.rejectedAt && (
                                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                                    <p className="text-xs text-red-700 mb-1">Rechazado</p>
                                    <p className="text-sm font-semibold text-red-800">
                                        {formatDate(plan.rejectedAt)}
                                    </p>
                                </div>
                            )}

                            {plan.createdByCoachId && (
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                    <p className="text-xs text-blue-700 mb-1 flex items-center gap-1">
                                        <FaUser className="text-xs" />
                                        Creado por Coach
                                    </p>
                                    <p className="text-sm font-semibold text-blue-800">
                                        ID: {plan.createdByCoachId}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Approval Comment */}
                    {plan.approvalComment && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <h3 className="text-sm font-bold text-amber-800 mb-2">Comentario de Revisión</h3>
                            <p className="text-sm text-amber-900">{plan.approvalComment}</p>
                        </div>
                    )}

                    {/* Actions */}
                    {(canApprove || canArchive) && (
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex justify-center items-center  gap-3">
                                {canApprove && (
                                    <>
                                        <Button
                                            variant="success"
                                            icon={FaCheckCircle}
                                            iconPosition="left"
                                            fullWidth
                                            onClick={() => {
                                                onApprove?.(plan.id);
                                                onClose();
                                            }}
                                        >
                                            Aprobar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            icon={FaTimesCircle}
                                            iconPosition="left"
                                            fullWidth
                                            onClick={() => {
                                                onReject?.(plan.id);
                                                onClose();
                                            }}
                                        >
                                            Rechazar
                                        </Button>
                                    </>
                                )}
                                {canArchive && (
                                    <Button
                                        variant="ghost"
                                        icon={FaArchive}
                                        iconPosition="left"
                                        fullWidth
                                        onClick={() => {
                                            onArchive?.(plan.id);
                                            onClose();
                                        }}
                                    >
                                        Archivar
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="py-8 text-center">
                    <p className="text-gray-600">No se pudo cargar el plan</p>
                </div>
            )}
        </BaseModal>
    );
};