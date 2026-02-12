import type { Role } from "@features/auth";
import type { TrainingPlanResponse } from "@features/training/types";
import { Badge, Button, StatTile, type BadgeVariant } from "@shared/components";
import { FaBrain, FaCheck, FaTimes } from "react-icons/fa";

interface TrainingPlanCardProps {
    plan: TrainingPlanResponse;
    role: Role;
    isActing?: boolean;
    onApprove?: (planId: number) => void;
    onReject?: (planId: number) => void;
    onViewDetails?: (planId: number) => void;
}

const STATUS_META: Record<
    string,
    { label: string; tone: "success" | "warning" | "danger" | "neutral" | "info" }
> = {
    PENDING_APPROVAL: { label: "Pendiente", tone: "warning" },
    APPROVED: { label: "Aprobado", tone: "success" },
    REJECTED: { label: "Rechazado", tone: "danger" },
    ARCHIVED: { label: "Archivado", tone: "neutral" },
    ACTIVE: { label: "Activo", tone: "info" },
    COMPLETED: { label: "Completado", tone: "success" },
};

const DIFFICULTY_META: Record<string, { label: string; tone: "success" | "warning" | "danger" }> = {
    EASY: { label: "Fácil", tone: "success" },
    MEDIUM: { label: "Media", tone: "warning" },
    HARD: { label: "Difícil", tone: "danger" },
};

export const TrainingPlanCard = ({ plan, role, isActing = false, onApprove, onReject, onViewDetails }: TrainingPlanCardProps) => {
    const status = STATUS_META[plan.status] || { label: plan.status, tone: "neutral" };
    const difficulty = plan.difficulty ? DIFFICULTY_META[plan.difficulty] || { label: plan.difficulty, tone: "warning" } : null;

    const showCoachActions = role === "COACH" && plan.status === "PENDING_APPROVAL";

    const handleCardClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest("button")) return;

        onViewDetails?.(plan.id);
    };

    return (
        <div
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative cursor-pointer"
            onClick={handleCardClick}
        >
            <div
                aria-hidden
                className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-orange-100 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-2 min-w-0 flex-wrap">
                            <h3 className="font-bold text-lg text-gray-800 truncate" title={plan.title}>
                                {plan.title}
                            </h3>

                            {plan.generatedByAi && (
                                <Badge variant="secondary" icon={FaBrain}>
                                    IA
                                </Badge>
                            )}
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2">{plan.description}</p>
                    </div>

                    <Badge variant={status.tone as BadgeVariant} className="shrink-0">
                        {status.label}
                    </Badge>
                </div>

                {/* Tiles (responsive) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {difficulty && (
                        <StatTile
                            label="Dificultad"
                            value={
                                <Badge variant={difficulty.tone} className="px-2 py-1 rounded-lg text-xs">
                                    {difficulty.label}
                                </Badge>
                            }
                        />
                    )}
                    {plan.durationMinutes && (
                        <StatTile label="Duración" value={`${plan.durationMinutes} min`} />
                    )}
                    {plan.focusArea && (
                        <StatTile label="Área" value={<span className="capitalize">{plan.focusArea}</span>} />
                    )}
                </div>

                {/* Approval Comment */}
                {plan.approvalComment && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Comentario:</p>
                        <p className="text-sm text-gray-700">{plan.approvalComment}</p>
                    </div>
                )}

                {/* Actions */}
                {showCoachActions && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                            variant="success"
                            icon={FaCheck}
                            iconPosition="left"
                            fullWidth
                            disabled={isActing}
                            loading={isActing}
                            onClick={() => onApprove?.(plan.id)}
                            size="xs"
                        >
                            Aprobar
                        </Button>

                        <Button
                            variant="danger"
                            icon={FaTimes}
                            iconPosition="left"
                            fullWidth
                            disabled={isActing}
                            onClick={() => onReject?.(plan.id)}
                            size="xs"
                        >
                            Rechazar
                        </Button>
                    </div>
                )}

                {/* Click hint */}
                <div className="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-center text-gray-500 italic">
                        Click para ver detalles completos
                    </p>
                </div>
            </div>
        </div>
    );
};