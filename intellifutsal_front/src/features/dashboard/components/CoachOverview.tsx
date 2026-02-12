import { useMemo } from "react";
import { FaBrain, FaCheck, FaClipboardList, FaDumbbell, FaTrophy, FaUsers } from "react-icons/fa";
import { useActiveTeam } from "@shared/hooks";
import { DonutChart, FunnelChart, HeatmapChart, HorizontalBarChart, InlineLoading, PositionPieChart, StatusBarChart, TrendChart } from "@shared/components";
import { PlayerCard } from "./PlayerCard";
import { StatCard, type ColorType } from "./StatCard";
import { useTeamPlayers } from "../hooks";
import { useCoachDashboard } from "../hooks/useCoachDashboard";
import { TeamActivityCards } from "./TeamActivityCards";

export const CoachOverview = () => {
    const { activeTeamId } = useActiveTeam();
    const { players, loading: isLoadingPlayers } = useTeamPlayers(activeTeamId);
    const { data: dashboardData, loading: isLoadingDashboard } = useCoachDashboard();

    const stats = useMemo(
        () => [
            {
                icon: FaUsers,
                label: "Jugadores Activos",
                value: String(dashboardData?.activePlayersCount ?? 0),
                trend: undefined,
                color: "orange" as ColorType,
            },
            {
                icon: FaDumbbell,
                label: "Asignaciones Activas",
                value: String(dashboardData?.activeAssignmentsCount ?? 0),
                trend: `${dashboardData?.completedAssignmentsCount ?? 0} completadas`,
                color: "blue" as ColorType,
            },
            {
                icon: FaClipboardList,
                label: "Solicitudes Pendientes",
                value: String(dashboardData?.pendingJoinRequestsCount ?? 0),
                color: "purple" as ColorType,
            },
            {
                icon: FaTrophy,
                label: "Tasa de Verificación",
                value: `${((dashboardData?.coachVerificationRate ?? 0)).toFixed(0)}%`,
                trend: `${dashboardData?.coachVerifiedCount ?? 0} verificados`,
                color: "green" as ColorType,
            },
        ],
        [dashboardData]
    );

    const recentActivity = useMemo(
        () => [
            {
                text: `${dashboardData?.progressTotalCount ?? 0} progresos registrados`,
                time: "Últimos 30 días",
                icon: FaBrain,
                color: "orange" as const,
            },
            {
                text: `${dashboardData?.activeAssignmentsCount ?? 0} planes activos en curso`,
                time: "Estado actual",
                icon: FaDumbbell,
                color: "blue" as const,
            },
            {
                text: `${dashboardData?.completedAssignmentsCount ?? 0} entrenamientos completados`,
                time: "Total histórico",
                icon: FaCheck,
                color: "green" as const,
            },
            {
                text: `${dashboardData?.activeTeamsCount ?? 0} equipos bajo gestión`,
                time: "Activos ahora",
                icon: FaUsers,
                color: "purple" as const,
            },
        ],
        [dashboardData]
    );

    const colorClasses = {
        orange: "from-orange-600 to-orange-700",
        blue: "from-blue-600 to-blue-700",
        green: "from-green-600 to-green-700",
        purple: "from-purple-600 to-purple-700",
    } as const;

    const isLoading = isLoadingDashboard || isLoadingPlayers;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <InlineLoading title="Cargando dashboard..." description="Preparando tus métricas y análisis" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            {/* Activity + Sessions */}
            <div className="w-full gap-6">
                {/* Activity */}
                <div className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-gray-100 shadow-xl">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Métricas Clave
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {recentActivity.map((a, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-4 bg-linear-to-r from-gray-50 to-orange-50/30 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
                            >
                                <div className={`bg-linear-to-br ${colorClasses[a.color]} p-3 rounded-xl shadow-md shrink-0`}>
                                    <a.icon className="text-white text-lg" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{a.text}</p>
                                    <p className="text-xs text-gray-500 mt-1">{a.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {dashboardData && (dashboardData.progressLast14Days.length > 0 || dashboardData.assignmentsLast14Days.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TrendChart
                        data={dashboardData.progressLast14Days}
                        title="Progreso de Entrenamientos (14 días)"
                        color="#ea580c"
                    />
                    <TrendChart
                        data={dashboardData.assignmentsLast14Days}
                        title="Nuevas Asignaciones (14 días)"
                        color="#2563eb"
                        showArea={false}
                    />
                </div>
            )}

            {dashboardData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {dashboardData.positionsDistribution.length > 0 && (
                        <PositionPieChart
                            data={dashboardData.positionsDistribution}
                            title="Distribución por Posición"
                        />
                    )}
                    {dashboardData.progressHeatmapDow.length > 0 && (
                        <HeatmapChart
                            data={dashboardData.progressHeatmapDow}
                            title="Actividad por Día de la Semana"
                        />
                    )}
                </div>
            )}

            {dashboardData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {dashboardData.trainingPlansByStatus.length > 0 && (
                        <StatusBarChart
                            data={dashboardData.trainingPlansByStatus}
                            title="Planes por Estado"
                            colorMap={{
                                PENDING_APPROVAL: "#f59e0b",
                                APPROVED: "#10b981",
                                REJECTED: "#ef4444",
                            }}
                        />
                    )}
                    {dashboardData.trainingPlansByOrigin.length > 0 && (
                        <DonutChart
                            data={dashboardData.trainingPlansByOrigin}
                            title="Origen de Planes"
                            colorMap={{
                                AI: "#ea580c",
                                MANUAL: "#2563eb",
                            }}
                        />
                    )}
                </div>
            )}

            {dashboardData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {dashboardData.trainingPlansByFocusArea.length > 0 && (
                        <HorizontalBarChart
                            data={dashboardData.trainingPlansByFocusArea}
                            title="Planes por Área de Enfoque"
                            color="#9333ea"
                        />
                    )}
                    {dashboardData.trainingPlansByDifficulty.length > 0 && (
                        <DonutChart
                            data={dashboardData.trainingPlansByDifficulty}
                            title="Dificultad de Planes"
                            colorMap={{
                                EASY: "#10b981",
                                MEDIUM: "#f59e0b",
                                HARD: "#ef4444",
                            }}
                        />
                    )}
                </div>
            )}

            {dashboardData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {dashboardData.assignmentsByStatus.length > 0 && (
                        <StatusBarChart
                            data={dashboardData.assignmentsByStatus}
                            title="Estado de Asignaciones"
                        />
                    )}
                    {dashboardData.joinRequestsFunnel.length > 0 && (
                        <FunnelChart
                            data={dashboardData.joinRequestsFunnel}
                            title="Embudo de Solicitudes"
                            conversionRate={dashboardData.joinRequestConversionRate}
                        />
                    )}
                </div>
            )}

            {/* Team Activity */}
            {dashboardData && dashboardData.teamActivity.length > 0 && (
                <TeamActivityCards data={dashboardData.teamActivity} title="Actividad por Equipo" />
            )}

            {/* Players */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-gray-100 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Jugadores Destacados
                    </h2>
                </div>

                {!activeTeamId ? (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
                        No tienes un equipo activo seleccionado.
                    </div>
                ) : isLoadingPlayers ? (
                    <InlineLoading title="Cargando jugadores..." description="Consultando el roster del equipo" />
                ) : players.length === 0 ? (
                    <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700">
                        Este equipo aún no tiene jugadores asignados.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {players.slice(0, 3).map((player) => (
                            <PlayerCard key={player.id} player={player} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};