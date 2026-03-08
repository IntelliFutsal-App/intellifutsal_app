import { useMemo, useState } from "react";
import { FaCalendarAlt, FaChartLine, FaCheckCircle, FaDumbbell, FaFilter, FaTrophy } from "react-icons/fa";
import { InlineLoading, TrendChart } from "@shared/ui";
import { StatCard, type ColorType } from "./StatCard";
import { ProgressAssignmentCard, usePlayerProgress } from "@features/training";

type FilterStatus = "ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED";

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
    { value: "ALL", label: "Todos" },
    { value: "ACTIVE", label: "Activos" },
    { value: "COMPLETED", label: "Completados" },
    { value: "CANCELLED", label: "Cancelados" },
];

export const PlayerProgressSection = () => {
    const { enriched, loading, stats } = usePlayerProgress();
    const [filter, setFilter] = useState<FilterStatus>("ALL");

    const filtered = useMemo(() => {
        if (filter === "ALL") return enriched;
        return enriched.filter((e) => e.assignment.status === filter);
    }, [enriched, filter]);

    const trendData = useMemo(() => {
        const byDate: Record<string, number> = {};

        enriched.forEach(({ progress }) => {
            progress.forEach((p) => {
                const date = new Date(p.progressDate).toISOString().split("T")[0];
                byDate[date] = (byDate[date] ?? 0) + 1;
            });
        });

        return Object.entries(byDate)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, count]) => ({ date, count }));
    }, [enriched]);

    const statCards = useMemo(
        () => [
            {
                icon: FaDumbbell,
                label: "Planes Activos",
                value: stats.active.length.toString(),
                color: "orange" as ColorType,
            },
            {
                icon: FaChartLine,
                label: "Progreso Promedio",
                value: `${stats.avgOverall}%`,
                trend: "Planes activos",
                color: "blue" as ColorType,
            },
            {
                icon: FaCalendarAlt,
                label: "Sesiones Registradas",
                value: stats.totalSessions.toString(),
                trend: `${stats.totalVerified} verificadas`,
                color: "green" as ColorType,
            },
            {
                icon: FaTrophy,
                label: "Planes Completados",
                value: stats.completed.length.toString(),
                color: "purple" as ColorType,
            },
        ],
        [stats]
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <InlineLoading title="Cargando tu progreso..." description="Recopilando tus datos de entrenamiento" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {statCards.map((s, i) => (
                    <StatCard key={i} {...s} />
                ))}
            </div>

            {/* TrendChart */}
            {trendData.length > 0 && (
                <TrendChart
                    data={trendData}
                    title="Actividad de Registro de Progreso"
                    color="#3b82f6"
                    height={220}
                    showArea
                />
            )}

            {/* Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Mis Planes de Entrenamiento
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {filtered.length} plan{filtered.length !== 1 ? "es" : ""} · {filter === "ALL" ? "todos" : filter.toLowerCase()}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <FaFilter className="text-gray-400 text-xs shrink-0" />
                        {FILTER_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setFilter(opt.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${filter === opt.value
                                        ? "bg-orange-600 text-white shadow-sm"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 border border-gray-100 shadow-xl text-center">
                    <div className="bg-linear-to-br from-orange-100 to-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaDumbbell className="text-orange-600 text-2xl" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {filter === "ALL" ? "Sin planes asignados" : `Sin planes ${filter.toLowerCase()}s`}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {filter === "ALL"
                            ? "Tu entrenador aún no te ha asignado ningún plan."
                            : "No hay planes con este estado. Prueba con otro filtro."}
                    </p>
                    {filter !== "ALL" && (
                        <button
                            onClick={() => setFilter("ALL")}
                            className="mt-4 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                        >
                            Ver todos
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {filtered.map((data) => (
                        <ProgressAssignmentCard key={data.assignment.id} data={data} />
                    ))}
                </div>
            )}

            {stats.totalSessions > 0 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="bg-linear-to-br from-green-600 to-green-700 p-3 rounded-xl">
                            <FaCheckCircle className="text-white text-lg" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-800">Verificaciones del Coach</h3>
                            <p className="text-xs text-gray-500">{stats.totalVerified} de {stats.totalSessions} sesiones verificadas</p>
                        </div>
                    </div>

                    <div className="relative bg-gray-100 rounded-full h-3 overflow-hidden mb-3">
                        <div
                            className="absolute top-0 left-0 h-full bg-linear-to-r from-green-500 to-green-600 rounded-full transition-all duration-700"
                            style={{
                                width: `${stats.totalSessions > 0 ? Math.round((stats.totalVerified / stats.totalSessions) * 100) : 0}%`,
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xl font-black text-gray-800">{stats.totalSessions}</p>
                            <p className="text-xs text-gray-500">Total sesiones</p>
                        </div>
                        <div>
                            <p className="text-xl font-black text-green-700">{stats.totalVerified}</p>
                            <p className="text-xs text-gray-500">Verificadas</p>
                        </div>
                        <div>
                            <p className="text-xl font-black text-orange-600">
                                {stats.totalSessions > 0
                                    ? `${Math.round((stats.totalVerified / stats.totalSessions) * 100)}%`
                                    : "0%"}
                            </p>
                            <p className="text-xs text-gray-500">Tasa</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};