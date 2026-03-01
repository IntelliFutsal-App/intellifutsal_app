import { useMemo } from "react";
import { FaUsers, FaChalkboardTeacher, FaRunning, FaDumbbell, FaClock, FaCheckCircle, FaBrain, FaShieldAlt } from "react-icons/fa";
import { DonutChart, InlineLoading } from "@shared/components";
import { StatCard, type ColorType } from "./StatCard";
import { useAdminDashboard } from "../hooks";

export const AdminOverview = () => {
    const { stats, loading } = useAdminDashboard();

    const topStats = useMemo(() => {
        if (!stats) return [];
        return [
            { icon: FaUsers, label: "Usuarios Totales", value: stats.users.total.toString(), trend: `${stats.users.active} activos`, color: "orange" as ColorType },
            { icon: FaChalkboardTeacher, label: "Entrenadores", value: stats.coaches.active.toString(), trend: `${stats.coaches.avgExpYears} años exp. prom.`, color: "blue" as ColorType },
            { icon: FaRunning, label: "Jugadores Activos", value: stats.players.active.toString(), trend: `${stats.players.avgAge} años prom.`, color: "green" as ColorType },
            { icon: FaShieldAlt, label: "Equipos Activos", value: stats.teams.active.toString(), trend: `${stats.teams.avgPlayersPerTeam} jugadores/equipo`, color: "purple" as ColorType },
        ];
    }, [stats]);

    const usersByRoleData = useMemo(() => {
        if (!stats) return [];
        return [
            { key: "Entrenadores", count: stats.users.coaches },
            { key: "Jugadores", count: stats.users.players },
        ];
    }, [stats]);

    const plansByOriginData = useMemo(() => {
        if (!stats) return [];
        return [
            { key: "IA", count: stats.plans.ai },
            { key: "Manual", count: stats.plans.manual },
        ];
    }, [stats]);

    const plansByStatusData = useMemo(() => {
        if (!stats) return [];
        return [
            { key: "Pendientes", count: stats.plans.pending },
            { key: "Aprobados", count: stats.plans.approved },
        ];
    }, [stats]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <InlineLoading title="Cargando panel de administración..." description="Recopilando métricas del sistema" />
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {topStats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>
            
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Panel de Administración
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">Vista general del estado del sistema</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DonutChart
                    data={usersByRoleData}
                    title="Usuarios por Rol"
                    colorMap={{ Entrenadores: "#ea580c", Jugadores: "#16a34a" }}
                />
                <DonutChart
                    data={plansByOriginData}
                    title="Planes de Entrenamiento por Origen"
                    colorMap={{ IA: "#9333ea", Manual: "#2563eb" }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DonutChart
                    data={plansByStatusData}
                    title="Estado de Planes de Entrenamiento"
                    colorMap={{ Pendientes: "#f59e0b", Aprobados: "#10b981" }}
                />

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaDumbbell className="text-orange-600" />
                        Métricas Detalladas
                    </h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-linear-to-br from-blue-50 to-blue-100/30 rounded-xl p-3 border border-blue-200">
                                <p className="text-xs text-blue-600 mb-1">Usuarios Activos</p>
                                <p className="text-2xl font-black text-blue-700">{stats.users.active}</p>
                            </div>
                            <div className="bg-linear-to-br from-orange-50 to-orange-100/30 rounded-xl p-3 border border-orange-200">
                                <p className="text-xs text-orange-600 mb-1">Usuarios Inactivos</p>
                                <p className="text-2xl font-black text-orange-700">{stats.users.total - stats.users.active}</p>
                            </div>
                        </div>

                        {stats.users.pendingCoaches > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <FaClock className="text-amber-600 text-sm" />
                                    <p className="text-xs font-bold text-amber-900">Entrenadores Pendientes</p>
                                </div>
                                <p className="text-lg font-black text-amber-700">{stats.users.pendingCoaches}</p>
                                <p className="text-xs text-amber-600 mt-1">Requieren aprobación</p>
                            </div>
                        )}

                        <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Total Planes:</span>
                                <span className="font-bold text-gray-800">{stats.plans.total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 flex items-center gap-1">
                                    <FaBrain className="text-purple-500 text-xs" /> Generados por IA:
                                </span>
                                <span className="font-bold text-purple-700">{stats.plans.ai}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 flex items-center gap-1">
                                    <FaCheckCircle className="text-green-500 text-xs" /> Aprobados:
                                </span>
                                <span className="font-bold text-green-700">{stats.plans.approved}</span>
                            </div>
                            {stats.plans.pending > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500 flex items-center gap-1">
                                        <FaClock className="text-amber-500 text-xs" /> Pendientes:
                                    </span>
                                    <span className="font-bold text-amber-700">{stats.plans.pending}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen Global</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-linear-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-100">
                        <p className="text-3xl font-black text-gray-800">{stats.users.total}</p>
                        <p className="text-xs text-gray-500 mt-1">Usuarios Registrados</p>
                    </div>
                    <div className="text-center p-3 bg-linear-to-br from-gray-50 to-orange-50/30 rounded-xl border border-gray-100">
                        <p className="text-3xl font-black text-gray-800">{stats.teams.total}</p>
                        <p className="text-xs text-gray-500 mt-1">Equipos Totales</p>
                    </div>
                    <div className="text-center p-3 bg-linear-to-br from-gray-50 to-green-50/30 rounded-xl border border-gray-100">
                        <p className="text-3xl font-black text-gray-800">{stats.teams.totalPlayersInTeams}</p>
                        <p className="text-xs text-gray-500 mt-1">Jugadores en Equipos</p>
                    </div>
                    <div className="text-center p-3 bg-linear-to-br from-gray-50 to-purple-50/30 rounded-xl border border-gray-100">
                        <p className="text-3xl font-black text-gray-800">{stats.plans.total}</p>
                        <p className="text-xs text-gray-500 mt-1">Planes Creados</p>
                    </div>
                </div>
            </div>
        </div>
    );
};