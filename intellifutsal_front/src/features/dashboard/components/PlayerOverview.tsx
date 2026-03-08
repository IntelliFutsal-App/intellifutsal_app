import { useMemo } from "react";
import { FaBrain, FaCalendarAlt, FaChartLine, FaDumbbell, FaFire, FaTrophy, FaUsers, FaClock, FaCheckCircle, FaRunning } from "react-icons/fa";
import { DonutChart, HeatmapChart, InlineLoading, StatusBarChart, TrendChart } from "@shared/ui";
import { StatCard, type ColorType } from "./StatCard";
import { usePlayerDashboard } from "../hooks";

export const PlayerOverview = () => {
    const { data, loading } = usePlayerDashboard();

    const stats = useMemo(() => {
        if (!data) return [];
        return [
            {
                icon: FaDumbbell,
                label: "Entrenamientos Activos",
                value: data.activeAssignmentsCount.toString(),
                trend: `${data.completedAssignmentsCount} completados`,
                color: "orange" as ColorType,
            },
            {
                icon: FaChartLine,
                label: "Progreso Promedio (30d)",
                value: `${Math.round(data.avgCompletionLast30Days)}%`,
                color: "blue" as ColorType,
            },
            {
                icon: FaCalendarAlt,
                label: "Sesiones Registradas",
                value: data.progressTotalCount.toString(),
                trend: `${data.coachVerifiedCount} verificadas`,
                color: "green" as ColorType,
            },
            {
                icon: FaTrophy,
                label: "Equipos Activos",
                value: data.activeTeamsCount.toString(),
                trend: `${data.pendingJoinRequestsCount} solicitudes`,
                color: "purple" as ColorType,
            },
        ];
    }, [data]);

    const recentActivity = useMemo(() => {
        if (!data) return [];
        return [
            {
                text: `${data.progressTotalCount} sesiones de progreso registradas`,
                time: "Últimos 30 días",
                icon: FaBrain,
                color: "orange" as const,
            },
            {
                text: `${data.activeAssignmentsCount} planes de entrenamiento activos`,
                time: "Estado actual",
                icon: FaDumbbell,
                color: "blue" as const,
            },
            {
                text: `${data.coachVerifiedCount} sesiones verificadas por el coach`,
                time: `${Math.round(data.coachVerificationRate)}% tasa de verificación`,
                icon: FaCheckCircle,
                color: "green" as const,
            },
            {
                text: `Racha actual de ${data.streakDays} día${data.streakDays !== 1 ? "s" : ""} consecutivos`,
                time: data.streakDays >= 7 ? "¡Increíble constancia! 🏆" : data.streakDays > 0 ? "¡Sigue así! 🔥" : "¡Empieza hoy!",
                icon: FaFire,
                color: "purple" as const,
            },
        ];
    }, [data]);

    const colorClasses = {
        orange: "from-orange-600 to-orange-700",
        blue: "from-blue-600 to-blue-700",
        green: "from-green-600 to-green-700",
        purple: "from-purple-600 to-purple-700",
    } as const;

    const assignmentsStatusData = useMemo(() => data?.assignmentsByStatus ?? [], [data]);

    const joinRequestsDonutData = useMemo(
        () => (data?.joinRequestsByStatus ?? []).map((r) => ({ key: r.status, count: r.count })),
        [data]
    );

    const weeklyBarData = useMemo(
        () =>
            (data?.completionByWeekLast8Weeks ?? []).map((w) => ({
                status: w.week.replace("W", "S"),
                count: Math.round(w.value),
            })),
        [data]
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <InlineLoading title="Cargando tu panel..." description="Preparando tus estadísticas" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            {/* Key Metrics */}
            <div className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-gray-100 shadow-xl">
                <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
                    Métricas Clave
                </h2>
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

            {/* TrendChart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrendChart
                    data={data.progressLast30Days}
                    title="Sesiones Registradas (30 días)"
                    color="#3b82f6"
                    height={280}
                    showArea
                />

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-gray-800">Mis Equipos</h2>
                        <div className="bg-linear-to-br from-orange-100 to-orange-50 p-3 rounded-xl">
                            <FaUsers className="text-orange-600 text-lg" />
                        </div>
                    </div>

                    {data.teams.length > 0 ? (
                        <div className="space-y-3">
                            {data.teams.map((team) => (
                                <div
                                    key={team.id}
                                    className="flex items-center gap-4 p-4 bg-linear-to-r from-gray-50 to-orange-50/30 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
                                >
                                    <div className="bg-linear-to-br from-orange-600 to-orange-700 p-3 rounded-xl shadow-md shrink-0">
                                        <FaUsers className="text-white text-lg" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{team.name}</p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                            <span>{team.category}</span>
                                            <span className="flex items-center gap-1">
                                                <FaRunning className="text-orange-500" />
                                                {team.playerCount}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaClock className="text-blue-400" />
                                                {team.averageAge} años
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-center">
                            <div className="bg-gray-100 rounded-full p-6 mb-4">
                                <FaUsers className="text-gray-400 text-2xl" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600">Sin equipos aún</p>
                            <p className="text-xs text-gray-500 mt-1">Busca equipos y envía solicitudes para unirte</p>
                        </div>
                    )}

                    {data.pendingJoinRequestsCount > 0 && (
                        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
                            <p className="text-xs text-amber-800">
                                <span className="font-bold">
                                    {data.pendingJoinRequestsCount} solicitud{data.pendingJoinRequestsCount !== 1 ? "es" : ""} pendiente{data.pendingJoinRequestsCount !== 1 ? "s" : ""}
                                </span>{" "}de unirse a equipo
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* StatusBarChart + DonutChart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {assignmentsStatusData.length > 0 && (
                    <StatusBarChart
                        data={assignmentsStatusData}
                        title="Estado de Mis Entrenamientos"
                    />
                )}
                {joinRequestsDonutData.length > 0 && (
                    <DonutChart
                        data={joinRequestsDonutData}
                        title="Solicitudes de Equipo por Estado"
                        colorMap={{
                            PENDING: "#f59e0b",
                            APPROVED: "#10b981",
                            REJECTED: "#ef4444",
                            CANCELLED: "#6b7280",
                        }}
                    />
                )}
            </div>

            {/* HeatmapChart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.progressHeatmapDow.length > 0 && (
                    <HeatmapChart
                        data={data.progressHeatmapDow}
                        title="Actividad por Día de la Semana"
                    />
                )}
                {weeklyBarData.length > 0 && (
                    <StatusBarChart
                        data={weeklyBarData}
                        title="Completitud Promedio — Últimas 8 Semanas (%)"
                        colorMap={Object.fromEntries(weeklyBarData.map((w) => [w.status, "#a855f7"]))}
                    />
                )}
            </div>
        </div>
    );
};