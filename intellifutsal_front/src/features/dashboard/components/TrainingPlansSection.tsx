import type { Role } from "@features/auth";
import { Button, InlineLoading } from "@shared/components";
import { useCallback, useMemo, useState } from "react";
import { FaBrain, FaPlus, FaFilter } from "react-icons/fa";
import { TrainingPlanCard } from "./TrainingPlanCard";
import { GenerateAiPlanModal } from "./GenerateAiPlanModal";
import { CreateManualPlanModal } from "./CreateManualPlanModal";
import { ApproveRejectPlanModal } from "./ApproveRejectPlanModal";
import { TrainingPlanDetailModal } from "./TrainingPlanDetailModal";
import { AssignPlanModal } from "./AssignPlanModal";
import { useTrainingPlans } from "../hooks/useTrainingPlans";
import { useProfile } from "@shared/hooks";
import type { ApproveRejectPlanSchema, CreateManualTrainingPlanSchema } from "@features/training/schemas";

interface TrainingPlansSectionProps {
    role: Role;
}

type FilterStatus = "all" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "ACTIVE";

export const TrainingPlansSection = ({ role }: TrainingPlansSectionProps) => {
    const { activeTeamId } = useProfile();
    const {
        plans,
        loading,
        actingPlanId,
        assignPlan,
        approvePlan,
        rejectPlan,
        archivePlan,
        createManualPlan,
        createAiPlanForPlayer,
        createAiPlanForTeam,
    } = useTrainingPlans();

    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [detailModalPlanId, setDetailModalPlanId] = useState<number | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [planToAssign, setPlanToAssign] = useState<{ planId: number; teamId: number | null } | null>(null);
    const [approveRejectModal, setApproveRejectModal] = useState<{
        isOpen: boolean;
        planId: number;
        planTitle: string;
        action: "approve" | "reject";
    }>({
        isOpen: false,
        planId: 0,
        planTitle: "",
        action: "approve",
    });

    const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

    const canManage = role === "COACH";

    const filteredPlans = useMemo(() => {
        if (filterStatus === "all") return plans;
        return plans.filter((p) => p.status === filterStatus);
    }, [plans, filterStatus]);

    const stats = useMemo(() => {
        const total = plans.length;
        const pending = plans.filter((p) => p.status === "PENDING_APPROVAL").length;
        const approved = plans.filter((p) => p.status === "APPROVED").length;
        const aiGenerated = plans.filter((p) => p.generatedByAi).length;

        return { total, pending, approved, aiGenerated };
    }, [plans]);

    const handleGenerateAi = useCallback(
        async (target: "player" | "team", id: number) => {
            if (target === "player") {
                await createAiPlanForPlayer(id);
            } else {
                await createAiPlanForTeam(id);
            }
        },
        [createAiPlanForPlayer, createAiPlanForTeam]
    );

    const handleCreateManual = useCallback(
        async (data: CreateManualTrainingPlanSchema) => {
            await createManualPlan(data);
        },
        [createManualPlan]
    );

    const handleOpenApprove = useCallback((planId: number, planTitle: string) => {
        setApproveRejectModal({
            isOpen: true,
            planId,
            planTitle,
            action: "approve",
        });
    }, []);

    const handleOpenReject = useCallback((planId: number, planTitle: string) => {
        setApproveRejectModal({
            isOpen: true,
            planId,
            planTitle,
            action: "reject",
        });
    }, []);

    const handleConfirmApproveReject = useCallback(
        async (data: ApproveRejectPlanSchema) => {
            if (approveRejectModal.action === "approve") {
                await approvePlan(approveRejectModal.planId, data);

                setPlanToAssign({
                    planId: approveRejectModal.planId,
                    teamId: activeTeamId || null,
                });
                setIsAssignModalOpen(true);
            } else {
                await rejectPlan(approveRejectModal.planId, data);
            }
        },
        [approveRejectModal, approvePlan, rejectPlan, activeTeamId]
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <InlineLoading title="Cargando planes..." description="Obteniendo planes de entrenamiento" />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Planes de Entrenamiento
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {stats.total} {stats.total === 1 ? "plan" : "planes"} • {stats.aiGenerated} generados con
                                IA • {stats.pending} pendientes
                            </p>
                        </div>

                        {canManage && (
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    icon={FaBrain}
                                    iconPosition="left"
                                    fullWidth
                                    onClick={() => setIsAiModalOpen(true)}
                                >
                                    Generar con IA
                                </Button>

                                <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={FaPlus}
                                    iconPosition="left"
                                    fullWidth
                                    onClick={() => setIsManualModalOpen(true)}
                                >
                                    Crear Manual
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-lg">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            <FaFilter className="text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700">Filtrar:</span>
                        </div>
                        {[
                            { value: "all" as const, label: "Todos" },
                            { value: "PENDING_APPROVAL" as const, label: "Pendientes" },
                            { value: "APPROVED" as const, label: "Aprobados" },
                            { value: "ACTIVE" as const, label: "Activos" },
                            { value: "REJECTED" as const, label: "Rechazados" },
                        ].map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setFilterStatus(filter.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${filterStatus === filter.value
                                        ? "bg-orange-500 text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Empty State */}
                {filteredPlans.length === 0 && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border border-gray-100 shadow-xl text-center">
                        <div className="bg-gray-100 rounded-full p-6 w-fit mx-auto mb-4">
                            <FaBrain className="text-gray-400 text-4xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            No hay planes {filterStatus !== "all" && "con este filtro"}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {canManage
                                ? "Comienza creando un plan manual o genera uno con IA"
                                : "Los planes aparecerán aquí cuando estén disponibles"}
                        </p>
                        {canManage && (
                            <div className="flex gap-3 justify-center">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    icon={FaBrain}
                                    iconPosition="left"
                                    onClick={() => setIsAiModalOpen(true)}
                                >
                                    Generar con IA
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={FaPlus}
                                    iconPosition="left"
                                    onClick={() => setIsManualModalOpen(true)}
                                >
                                    Crear Manual
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Plans Grid */}
                {filteredPlans.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {filteredPlans.map((plan) => (
                            <TrainingPlanCard
                                key={plan.id}
                                plan={plan}
                                role={role}
                                isActing={actingPlanId === plan.id}
                                onApprove={(planId) => handleOpenApprove(planId, plan.title)}
                                onReject={(planId) => handleOpenReject(planId, plan.title)}
                                onViewDetails={setDetailModalPlanId}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <GenerateAiPlanModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                onGenerate={handleGenerateAi}
            />

            <CreateManualPlanModal
                isOpen={isManualModalOpen}
                onClose={() => setIsManualModalOpen(false)}
                onCreate={handleCreateManual}
            />

            <ApproveRejectPlanModal
                isOpen={approveRejectModal.isOpen}
                onClose={() =>
                    setApproveRejectModal({ isOpen: false, planId: 0, planTitle: "", action: "approve" })
                }
                planTitle={approveRejectModal.planTitle}
                action={approveRejectModal.action}
                onConfirm={handleConfirmApproveReject}
            />

            <TrainingPlanDetailModal
                isOpen={detailModalPlanId !== null}
                onClose={() => setDetailModalPlanId(null)}
                planId={detailModalPlanId}
                role={role}
                onApprove={(planId) => {
                    handleOpenApprove(planId, filteredPlans.find((p) => p.id === planId)?.title || "");
                }}
                onReject={(planId) => {
                    handleOpenReject(planId, filteredPlans.find((p) => p.id === planId)?.title || "");
                }}
                onArchive={archivePlan}
            />

            {/* Assignment Modal - Opens after approving a plan */}
            <AssignPlanModal
                isOpen={isAssignModalOpen}
                onClose={() => {
                    setIsAssignModalOpen(false);
                    setPlanToAssign(null);
                }}
                planId={planToAssign?.planId || null}
                teamId={planToAssign?.teamId || null}
                onAssign={assignPlan}
            />
        </>
    );
};