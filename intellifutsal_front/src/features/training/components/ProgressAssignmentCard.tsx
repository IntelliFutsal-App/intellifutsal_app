import { useState } from "react";
import { FaBrain, FaCalendarAlt, FaChartLine, FaCheckCircle, FaClock, FaDumbbell, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Badge } from "@shared/ui";
import type { EnrichedAssignment } from "../hooks";

interface ProgressAssignmentCardProps {
    data: EnrichedAssignment;
}

const STATUS_MAP: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "danger" }> = {
    ACTIVE: { label: "Activo", variant: "success" },
    PENDING: { label: "Pendiente", variant: "warning" },
    COMPLETED: { label: "Completado", variant: "secondary" },
    CANCELLED: { label: "Cancelado", variant: "danger" },
};

const DIFFICULTY_COLOR: Record<string, string> = {
    EASY: "text-green-700 bg-green-100",
    MEDIUM: "text-amber-700 bg-amber-100",
    HARD: "text-red-700 bg-red-100",
};

const progressColor = (pct: number) => {
    if (pct >= 80) return "from-green-500 to-green-600";
    if (pct >= 50) return "from-orange-500 to-orange-600";
    return "from-red-400 to-red-500";
};

export const ProgressAssignmentCard = ({ data }: ProgressAssignmentCardProps) => {
    const { assignment, plan, progress, latestCompletion, avgCompletion, sessionCount, verifiedCount, daysRemaining } = data;
    const [expanded, setExpanded] = useState(false);

    const status = STATUS_MAP[assignment.status] ?? { label: assignment.status, variant: "secondary" as const };
    const isActive = assignment.status === "ACTIVE";

    return (
        <div className={`bg-white rounded-2xl border shadow-xl transition-all duration-300 group overflow-hidden relative border-gray-100`}>
            {/* Header */}
            <div className={`p-5 sm:p-6 bg-linear-to-br from-gray-50 to-white`}>
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant={status.variant}>{status.label}</Badge>
                            {plan?.generatedByAi && (
                                <Badge variant="secondary" icon={FaBrain} className="text-purple-700 bg-purple-100 border-purple-200">
                                    IA
                                </Badge>
                            )}
                            {plan?.difficulty && (
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_COLOR[plan.difficulty] ?? "text-gray-600 bg-gray-100"}`}>
                                    {plan.difficulty === "EASY" ? "Fácil" : plan.difficulty === "MEDIUM" ? "Media" : "Alta"}
                                </span>
                            )}
                        </div>
                        <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate">
                            {plan?.title ?? `Plan #${assignment.trainingPlanId}`}
                        </h3>
                        {plan?.focusArea && (
                            <p className="text-xs text-gray-500 mt-0.5">{plan.focusArea}</p>
                        )}
                    </div>

                    <div className={`p-3 rounded-xl shrink-0 ${isActive ? "bg-orange-100" : "bg-gray-100"}`}>
                        <FaDumbbell className={`text-lg ${isActive ? "text-orange-600" : "text-gray-500"}`} />
                    </div>
                </div>

                <div className="mb-3">
                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5">
                        <span>Último progreso registrado</span>
                        <span className="text-gray-800">{latestCompletion}%</span>
                    </div>
                    <div className="relative bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                            className={`absolute top-0 left-0 h-full bg-linear-to-r ${progressColor(latestCompletion)} rounded-full transition-all duration-700`}
                            style={{ width: `${latestCompletion}%` }}
                        />
                    </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-xl p-2.5 border border-gray-100">
                        <p className="text-lg font-black text-gray-800">{sessionCount}</p>
                        <p className="text-[10px] text-gray-500 leading-tight">Sesiones</p>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 border border-gray-100">
                        <p className="text-lg font-black text-gray-800">{avgCompletion}%</p>
                        <p className="text-[10px] text-gray-500 leading-tight">Promedio</p>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 border border-gray-100">
                        <p className="text-lg font-black text-green-700">{verifiedCount}</p>
                        <p className="text-[10px] text-gray-500 leading-tight">Verificadas</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
                    {assignment.startDate && (
                        <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-blue-400 shrink-0" />
                            Inicio: {new Date(assignment.startDate).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
                        </span>
                    )}
                    {assignment.endDate && (
                        <span className="flex items-center gap-1">
                            <FaClock className={`shrink-0 ${daysRemaining !== null && daysRemaining <= 7 && isActive ? "text-red-400" : "text-gray-400"}`} />
                            {isActive && daysRemaining !== null
                                ? daysRemaining === 0
                                    ? "¡Vence hoy!"
                                    : `${daysRemaining} día${daysRemaining !== 1 ? "s" : ""} restante${daysRemaining !== 1 ? "s" : ""}`
                                : `Fin: ${new Date(assignment.endDate).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}`}
                        </span>
                    )}
                    {plan?.durationMinutes && (
                        <span className="flex items-center gap-1">
                            <FaChartLine className="text-purple-400 shrink-0" />
                            {plan.durationMinutes} min
                        </span>
                    )}
                </div>
            </div>

            {progress.length > 0 && (
                <>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full px-5 py-3 flex items-center justify-between text-sm font-semibold text-gray-600 hover:bg-gray-50 border-t border-gray-100 transition-colors"
                    >
                        <span>Historial de sesiones ({progress.length})</span>
                        {expanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                    </button>

                    {expanded && (
                        <div className="px-5 pb-5 space-y-2 max-h-72 overflow-y-auto">
                            {progress.map((entry) => (
                                <div key={entry.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-500">
                                                {new Date(entry.progressDate).toLocaleDateString("es-CO", {
                                                    day: "2-digit", month: "short", year: "numeric"
                                                })}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                {entry.coachVerified && (
                                                    <FaCheckCircle className="text-green-500 text-xs" title="Verificado por coach" />
                                                )}
                                                <span className="text-xs font-bold text-gray-800">{entry.completionPercentage}%</span>
                                            </div>
                                        </div>
                                        <div className="relative bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className={`absolute top-0 left-0 h-full bg-linear-to-r ${progressColor(entry.completionPercentage)} rounded-full`}
                                                style={{ width: `${entry.completionPercentage}%` }}
                                            />
                                        </div>
                                        {entry.notes && (
                                            <p className="text-[11px] text-gray-500 mt-1.5 italic">"{entry.notes}"</p>
                                        )}
                                        {entry.coachVerified && entry.verificationComment && (
                                            <p className="text-[11px] text-green-700 mt-1 font-medium">
                                                Coach: "{entry.verificationComment}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {progress.length === 0 && isActive && (
                <div className="px-5 py-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">
                        Aún no has registrado sesiones para este plan.
                        Ve a <span className="font-semibold text-orange-600">Mis Entrenamientos</span> para registrar tu progreso.
                    </p>
                </div>
            )}
        </div>
    );
};