import { useState, useMemo } from "react";
import { FaChartLine, FaDumbbell, FaFire, FaTrophy } from "react-icons/fa";
import { InlineLoading, Select } from "@shared/components";
import { PlayerTrainingCard } from "./PlayerTrainingCard";
import { RecordProgressModal } from "./RecordProgressModal";
import { TrainingDetailsModal } from "./TrainingDetailsModal";
import { usePlayerTrainings } from "../hooks/usePlayerTrainings";
import type { TrainingAssignmentResponse } from "@features/training/types";
import { StatCard, type ColorType } from "./StatCard";

export const PlayerTrainingsSection = () => {
    const { assignments, loading, recordProgress } = usePlayerTrainings();
    const [selectedAssignment, setSelectedAssignment] = useState<TrainingAssignmentResponse | null>(null);
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("");

    const handleRecordProgress = (assignment: TrainingAssignmentResponse) => {
        setSelectedAssignment(assignment);
        setIsRecordModalOpen(true);
    };

    const handleViewDetails = (assignment: TrainingAssignmentResponse) => {
        setSelectedAssignment(assignment);
        setIsDetailsModalOpen(true);
    };

    const statusOptions = useMemo(
        () => [
            { value: "", label: "Todos los estados" },
            { value: "ACTIVE", label: "Activos" },
            { value: "COMPLETED", label: "Completados" },
            { value: "CANCELLED", label: "Cancelados" },
        ],
        []
    );

    const filteredAssignments = useMemo(() => {
        if (!filterStatus) return assignments;
        return assignments.filter((a) => a.status.toUpperCase() === filterStatus);
    }, [assignments, filterStatus]);

    const stats = useMemo(() => {
        const total = assignments.length;
        const active = assignments.filter((a) => a.status.toUpperCase() === "ACTIVE").length;
        const completed = assignments.filter((a) => a.status.toUpperCase() === "COMPLETED").length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return [
            {
                icon: FaDumbbell,
                label: "Total Entrenamientos",
                value: total.toString(),
                color: "orange" as ColorType,
            },
            {
                icon: FaFire,
                label: "Activos",
                value: active.toString(),
                color: "green" as ColorType,
            },
            {
                icon: FaTrophy,
                label: "Completados",
                value: completed.toString(),
                color: "blue" as ColorType,
            },
            {
                icon: FaChartLine,
                label: "Tasa de Completitud",
                value: `${completionRate}%`,
                color: "purple" as ColorType,
            },
        ];
    }, [assignments]);

    return (
        <>
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {stats.map((stat, idx) => (
                        <StatCard key={idx} {...stat} />
                    ))}
                </div>

                {/* Header */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Mis Entrenamientos
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {filteredAssignments.length}{" "}
                                {filteredAssignments.length === 1
                                    ? "entrenamiento asignado"
                                    : "entrenamientos asignados"}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="w-full sm:w-auto sm:min-w-[200px]">
                                <Select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    options={statusOptions}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 sm:p-12 border border-gray-100 shadow-xl text-center">
                        <InlineLoading
                            title="Cargando entrenamientos..."
                            description="Preparando tus planes de entrenamiento"
                        />
                    </div>
                ) : filteredAssignments.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 sm:p-12 border border-gray-100 shadow-xl text-center">
                        <div className="bg-linear-to-br from-purple-100 to-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaDumbbell className="text-3xl text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {filterStatus
                                ? "No hay entrenamientos con este estado"
                                : "No tienes entrenamientos asignados"}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {filterStatus
                                ? "Intenta cambiar el filtro para ver otros entrenamientos"
                                : "Tu entrenador te asignará planes de entrenamiento pronto"}
                        </p>

                        {filterStatus && (
                            <button
                                onClick={() => setFilterStatus("")}
                                className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                            >
                                Ver todos los entrenamientos
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {filteredAssignments.map((assignment) => (
                            <PlayerTrainingCard
                                key={assignment.id}
                                assignment={assignment}
                                onViewDetails={handleViewDetails}
                                onRecordProgress={handleRecordProgress}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <RecordProgressModal
                isOpen={isRecordModalOpen}
                onClose={() => {
                    setIsRecordModalOpen(false);
                    setSelectedAssignment(null);
                }}
                assignment={selectedAssignment}
                onRecord={recordProgress}
            />

            <TrainingDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedAssignment(null);
                }}
                assignment={selectedAssignment}
            />
        </>
    );
};