import { useMemo, useState } from "react";
import { FaClipboardList, FaDumbbell, FaSearch } from "react-icons/fa";
import { Button, DataTable, Input, Badge, InlineLoading } from "@shared/ui";
import { StatCard, type ColorType } from "./StatCard";
import { formatStringDate } from "@shared/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTrainingsManagement } from "../hooks";
import { mapAssignmentStatusToEs, mapOriginToEs, mapPlanStatusToEs, planDecisionSchema, type PlanDecisionSchema, type TrainingAssignmentResponse, type TrainingPlanResponse } from "@features/training";
import { AssignmentProgressModal, PlanDecisionModal } from "@features/admin";

type Tab = "plans" | "assignments";

const planStatusVariant = (status: string) => {
    switch (status) {
        case "PENDING_APPROVAL": return "warning";
        case "APPROVED": return "success";
        case "REJECTED": return "danger";
        case "ARCHIVED": return "primary";
        default: return "primary";
    }
};

const assignmentStatusVariant = (status: string) => {
    switch (status) {
        case "ACTIVE": return "success";
        case "COMPLETED": return "primary";
        case "CANCELLED": return "danger";
        case "PENDING": return "warning";
        default: return "primary";
    }
};

export const TrainingsManagementSection = () => {
    const {
        plans,
        assignments,
        progress,
        plansStats,
        assignmentsStats,
        isLoadingPlans,
        isLoadingAssignments,
        isLoadingProgress,
        isActing,
        activeTeamId,
        activeAssignmentId,
        setAssignmentsTeamFilter,
        loadProgressByAssignment,
        clearProgress,
        approvePlan,
        rejectPlan,
        archivePlan,
        activateAssignment,
        cancelAssignment,
    } = useTrainingsManagement();

    const [tab, setTab] = useState<Tab>("plans");

    // Search
    const [searchPlans,] = useState("");
    const [searchAssignments, setSearchAssignments] = useState("");

    // Team picker (simple numeric input)
    const [teamIdInput, setTeamIdInput] = useState<string>("");

    // Decision modal
    const [decisionMode, setDecisionMode] = useState<"approve" | "reject">("approve");
    const [decisionPlan, setDecisionPlan] = useState<TrainingPlanResponse | null>(null);

    const decisionForm = useForm<PlanDecisionSchema>({
        resolver: zodResolver(planDecisionSchema),
        defaultValues: { approvalComment: "" },
        mode: "onSubmit",
    });

    const openApprove = (plan: TrainingPlanResponse) => {
        decisionForm.reset({ approvalComment: "" });
        setDecisionMode("approve");
        setDecisionPlan(plan);
    };

    const openReject = (plan: TrainingPlanResponse) => {
        decisionForm.reset({ approvalComment: "" });
        setDecisionMode("reject");
        setDecisionPlan(plan);
    };

    const closeDecision = () => {
        setDecisionPlan(null);
        decisionForm.reset({ approvalComment: "" });
    };

    const submitDecision = async (data: PlanDecisionSchema) => {
        if (!decisionPlan) return;

        const comment = data.approvalComment?.trim() || undefined;

        if (decisionMode === "approve") {
            await approvePlan(decisionPlan.id, comment);
        } else {
            await rejectPlan(decisionPlan.id, comment);
        }

        closeDecision();
    };

    const activeTeamIdNumber = useMemo(() => {
        const n = Number(activeTeamId);
        return Number.isFinite(n) && n > 0 ? n : null;
    }, [activeTeamId]);

    const filteredAssignments = useMemo(() => {
        const teamId = activeTeamIdNumber;

        return assignments.filter((a) => {
            if (!teamId) return true;

            const rowTeamId = a.teamId == null ? null : Number(a.teamId);
            return rowTeamId === teamId;
        });
    }, [assignments, activeTeamIdNumber]);

    // Plans columns
    const planColumns = useMemo(
        () => [
            { header: "ID", accessor: "id" as const, width: "80px" },
            { header: "Título", accessor: "title" as const },
            {
                header: "Origen",
                accessor: (p: TrainingPlanResponse) => (
                    <Badge variant={p.generatedByAi ? "warning" : "primary"} className="w-fit">
                        {mapOriginToEs(p.generatedByAi)}
                    </Badge>
                ),
            },
            {
                header: "Estado",
                accessor: (p: TrainingPlanResponse) => (
                    <Badge variant={planStatusVariant(p.status)} className="w-fit">
                        {mapPlanStatusToEs(p.status)}
                    </Badge>
                ),
            },
            {
                header: "Creado",
                accessor: (p: TrainingPlanResponse) => formatStringDate(p.createdAt as unknown as string),
            },
        ],
        []
    );

    // Assignments columns
    const assignmentColumns = useMemo(
        () => [
            { header: "ID", accessor: "id" as const, width: "80px" },
            { header: "Plan", accessor: (a: TrainingAssignmentResponse) => `#${a.trainingPlanId}` },
            { header: "Jugador", accessor: (a: TrainingAssignmentResponse) => (a.playerId ? `#${a.playerId}` : "—") },
            { header: "Equipo", accessor: (a: TrainingAssignmentResponse) => (a.teamId ? `#${a.teamId}` : "—") },
            {
                header: "Estado",
                accessor: (a: TrainingAssignmentResponse) => (
                    <Badge variant={assignmentStatusVariant(a.status)} className="w-fit">
                        {mapAssignmentStatusToEs(a.status)}
                    </Badge>
                ),
            },
            {
                header: "Inicio",
                accessor: (a: TrainingAssignmentResponse) =>
                    a.startDate ? formatStringDate(a.startDate as unknown as string) : "—",
            },
            {
                header: "Fin",
                accessor: (a: TrainingAssignmentResponse) =>
                    a.endDate ? formatStringDate(a.endDate as unknown as string) : "—",
            },
        ],
        []
    );

    const statCards = useMemo(
        () => [
            {
                icon: FaDumbbell,
                label: "Planes Totales",
                value: String(plansStats.total),
                trend: `${plansStats.pending} pendientes`,
                color: "orange" as ColorType,
            },
            {
                icon: FaDumbbell,
                label: "Planes Aprobados",
                value: String(plansStats.approved),
                trend: `${plansStats.rejected} rechazados`,
                color: "blue" as ColorType,
            },
            {
                icon: FaClipboardList,
                label: "Asignaciones (equipo)",
                value: String(assignmentsStats.total),
                trend: `${assignmentsStats.active} activas`,
                color: "green" as ColorType,
            },
            {
                icon: FaClipboardList,
                label: "Completadas",
                value: String(assignmentsStats.completed),
                trend: `${assignmentsStats.cancelled} canceladas`,
                color: "purple" as ColorType,
            },
        ],
        [plansStats, assignmentsStats]
    );

    const isLoading = isLoadingPlans;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <InlineLoading title="Cargando entrenamientos..." description="Preparando la información" />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((s, i) => (
                        <StatCard key={i} {...s} />
                    ))}
                </div>

                {/* Header + Tabs */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Gestión de Entrenamientos
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Administra los planes y asignaciones de entrenamiento
                            </p>

                            {/* Segmented tabs */}
                            <div className="mt-4 inline-flex rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setTab("plans")}
                                    className={`px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${tab === "plans"
                                        ? "bg-linear-to-r from-orange-500 to-orange-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    Planes
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setTab("assignments")}
                                    className={`px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${tab === "assignments"
                                        ? "bg-linear-to-r from-orange-500 to-orange-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    Asignaciones
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant="primary" className="w-fit">
                                {tab === "plans" ? `${plans.length} planes` : `${assignments.length} asignaciones`}
                            </Badge>
                        </div>
                    </div>
                </div>

                {tab === "assignments" && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-xl">
                        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                            {/* Search */}
                            <div className="relative flex-1 max-w-xl">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <Input
                                    placeholder="Buscar por planId / playerId / teamId / status..."
                                    value={searchAssignments}
                                    onChange={(e) => setSearchAssignments(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Right controls */}
                            <div className="flex flex-wrap items-center gap-2 justify-between">
                                {/* Active filter chip */}
                                {activeTeamIdNumber ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAssignmentsTeamFilter(null);
                                            setTeamIdInput("");
                                        }}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-orange-200 bg-orange-50 text-orange-900 text-xs font-semibold hover:bg-orange-100 transition-colors"
                                        title="Quitar filtro"
                                    >
                                        Equipo: #{activeTeamIdNumber}
                                        <span className="text-orange-700">✕</span>
                                    </button>
                                ) : null}

                                {/* Compact filter input */}
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={teamIdInput}
                                        onChange={(e) => setTeamIdInput(e.target.value)}
                                        placeholder="Team ID"
                                        className="w-28"
                                    />

                                    <Button
                                        disabled={isActing || !teamIdInput}
                                        onClick={() => {
                                            const id = Number(teamIdInput);
                                            if (!Number.isFinite(id) || id <= 0) return;
                                            setAssignmentsTeamFilter(id);
                                        }}
                                    >
                                        Filtrar
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {isLoadingAssignments ? (
                            <div className="mt-3">
                                <InlineLoading title="Cargando asignaciones..." description="Consultando información" />
                            </div>
                        ) : null}
                    </div>
                )}

                {/* Tables */}
                {tab === "plans" ? (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                        <DataTable
                            data={plans}
                            columns={planColumns}
                            getRowId={(p) => p.id}
                            getRowLabel={(p) => `#${p.id} — ${p.title}`}
                            searchTerm={searchPlans}
                            searchKeys={["title", "status"]}
                            isDeleting={isActing}
                            customActions={(p) => (
                                <div className="flex gap-2">
                                    {p.status === "PENDING_APPROVAL" ? (
                                        <>
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                disabled={isActing}
                                                onClick={() => openApprove(p)}
                                            >
                                                Aprobar
                                            </Button>
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                disabled={isActing}
                                                onClick={() => openReject(p)}
                                            >
                                                Rechazar
                                            </Button>
                                        </>
                                    ) : null}

                                    {p.status !== "ARCHIVED" ? (
                                        <Button
                                            size="xs"
                                            variant="primary"
                                            disabled={isActing}
                                            onClick={() => void archivePlan(p.id)}
                                        >
                                            Archivar
                                        </Button>
                                    ) : null}
                                </div>
                            )}
                        />
                    </div>
                ) : (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                        {isLoadingAssignments ? (
                            <div className="p-8">
                                <InlineLoading title="Cargando asignaciones..." description="Consultando equipo" />
                            </div>
                        ) : (
                            <DataTable
                                data={filteredAssignments}
                                columns={assignmentColumns}
                                getRowId={(a) => a.id}
                                getRowLabel={(a) => `#${a.id} (Plan:${a.trainingPlanId})`}
                                searchTerm={searchAssignments}
                                searchKeys={["trainingPlanId", "playerId", "teamId", "status"]}
                                isDeleting={isActing}
                                customActions={(a) => (
                                    <div className="flex gap-2">
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            disabled={isActing}
                                            onClick={() => void loadProgressByAssignment(a.id)}
                                        >
                                            Ver progreso
                                        </Button>

                                        {a.status !== "ACTIVE" ? (
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                disabled={isActing}
                                                onClick={() => void activateAssignment(a.id)}
                                            >
                                                Activar
                                            </Button>
                                        ) : null}

                                        {a.status !== "CANCELLED" ? (
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                disabled={isActing}
                                                onClick={() => void cancelAssignment(a.id)}
                                            >
                                                Cancelar
                                            </Button>
                                        ) : null}
                                    </div>
                                )}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Approve/Reject */}
            <PlanDecisionModal
                isOpen={decisionPlan !== null}
                onClose={closeDecision}
                form={decisionForm}
                onSubmit={submitDecision}
                isLoading={isActing}
                planTitle={decisionPlan?.title}
                mode={decisionMode}
            />

            {/* Progress viewer */}
            <AssignmentProgressModal
                isOpen={activeAssignmentId !== null}
                onClose={() => clearProgress()}
                isLoading={isLoadingProgress}
                assignmentId={activeAssignmentId}
                progress={progress}
            />
        </>
    );
};