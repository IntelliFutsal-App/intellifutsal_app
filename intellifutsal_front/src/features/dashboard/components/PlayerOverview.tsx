import { useMemo } from "react";
import { FaBrain, FaCalendarAlt, FaChartLine, FaDumbbell, FaTrophy } from "react-icons/fa";
import { Button, ItemList, Badge } from "@shared/components";
import { StatCard, type ColorType } from "./StatCard";

type SessionVM = { name: string; progress: number; time: string };

export const PlayerOverview = () => {
    const stats = useMemo(
        () => [
            { icon: FaDumbbell, label: "Entrenamientos Activos", value: "3", color: "orange" as ColorType },
            { icon: FaChartLine, label: "Progreso General", value: "78%", trend: "+12%", color: "green" as ColorType },
            { icon: FaCalendarAlt, label: "Sesiones Completadas", value: "24", trend: "+4 esta semana", color: "blue" as ColorType },
            { icon: FaTrophy, label: "Objetivos Alcanzados", value: "8/10", color: "purple" as ColorType },
        ],
        []
    );

    const strengths = useMemo(() => ["Aceleración", "Potencia", "Salto Vertical"], []);
    const devAreas = useMemo(() => ["Resistencia Aeróbica", "Recuperación"], []);

    const nextSessions: SessionVM[] = useMemo(
        () => [
            { name: "Fuerza Explosiva", progress: 33, time: "16:00 - 17:30" },
            { name: "Técnica Individual", progress: 66, time: "17:00 - 18:30" },
            { name: "Resistencia", progress: 99, time: "18:00 - 19:30" },
        ],
        []
    );

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* IA Recent */}
                <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-gray-100 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Mi Análisis IA Reciente
                        </h2>

                        {/* shared Button */}
                        <Button variant="ghost" size="sm" className="px-0! hover:underline w-fit">
                            Ver completo
                        </Button>
                    </div>

                    <div className="bg-linear-to-br from-orange-50 via-orange-100/50 to-orange-50 rounded-2xl p-5 sm:p-8 mb-0 border border-orange-200/50 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-white/60 to-transparent rounded-full -mr-20 -mt-20" />

                        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 mb-6 min-w-0">
                            <div className="bg-linear-to-br from-orange-600 to-orange-700 p-4 rounded-2xl shadow-lg w-fit shrink-0">
                                <FaBrain className="text-white text-3xl" />
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <h3 className="font-bold text-lg sm:text-xl text-gray-800 truncate">
                                        Perfil: Atleta Explosivo
                                    </h3>
                                    <Badge variant="secondary" className="w-fit">
                                        actualizado
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">Actualizado hace 2 días</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                                {/* ✅ shared ItemList en modo chips */}
                                <ItemList title="Fortalezas" items={strengths} color="green" layout="chips" />
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                                <ItemList title="Áreas de Desarrollo" items={devAreas} color="orange" layout="chips" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next sessions */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                    <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
                        Próximas Sesiones
                    </h2>

                    <div className="space-y-3">
                        {nextSessions.map((s, i) => (
                            <div
                                key={i}
                                className="p-4 bg-linear-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-100 hover:shadow-md transition-all duration-300 group"
                            >
                                <div className="flex items-center justify-between gap-3 mb-3 min-w-0">
                                    <span className="text-sm font-bold text-gray-800 truncate">{s.name}</span>
                                    <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0">
                                        <FaCalendarAlt className="text-orange-600 text-sm" />
                                    </div>
                                </div>

                                <p className="text-xs text-gray-600 mb-3 font-medium">Hoy, {s.time}</p>

                                <div className="relative bg-white/80 rounded-full h-2.5 overflow-hidden shadow-inner">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-linear-to-r from-orange-600 to-orange-700 rounded-full transition-all duration-700 shadow-sm"
                                        style={{ width: `${Math.max(0, Math.min(100, s.progress))}%` }}
                                        aria-label={`Progreso ${s.progress}%`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};