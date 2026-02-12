import { useState, useMemo } from "react";
import { FaSearch, FaUsers, FaClipboardList } from "react-icons/fa";
import { InlineLoading, Input } from "@shared/components";
import { TeamSearchCard } from "./TeamSearchCard";
import { useFindTeams } from "../hooks/useFindTeams";
import { StatCard, type ColorType } from "./StatCard";

export const FindTeamsSection = () => {
    const { teams, myRequests, loading, loadingRequests, sendJoinRequest, cancelRequest, getRequestForTeam } =
        useFindTeams();

    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const filteredTeams = useMemo(() => {
        return teams.filter((team) => {
            const matchesSearch =
                !searchTerm ||
                team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                team.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = !categoryFilter || team.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [teams, searchTerm, categoryFilter]);

    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(teams.map((t) => t.category)));
        return uniqueCategories.sort();
    }, [teams]);

    const stats = useMemo(() => {
        const pendingRequests = myRequests.filter((r) => r.status === "PENDING").length;
        const approvedRequests = myRequests.filter((r) => r.status === "APPROVED").length;

        return [
            {
                icon: FaUsers,
                label: "Equipos Disponibles",
                value: teams.length.toString(),
                color: "blue" as ColorType,
            },
            {
                icon: FaClipboardList,
                label: "Solicitudes Pendientes",
                value: pendingRequests.toString(),
                color: "blue" as ColorType,
            },
            {
                icon: FaUsers,
                label: "Solicitudes Aprobadas",
                value: approvedRequests.toString(),
                color: "green" as ColorType,
            },
            {
                icon: FaSearch,
                label: "Resultados",
                value: filteredTeams.length.toString(),
                color: "purple" as ColorType,
            },
        ];
    }, [teams, myRequests, filteredTeams]);

    return (
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
                            Buscar Equipos
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {filteredTeams.length} equipo{filteredTeams.length !== 1 ? "s" : ""} disponible
                            {filteredTeams.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xl">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Buscar por nombre o categoría..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="sm:w-64">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filters */}
                    {(searchTerm || categoryFilter) && (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setCategoryFilter("");
                            }}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            {loading || loadingRequests ? (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 sm:p-12 border border-gray-100 shadow-xl text-center">
                    <InlineLoading
                        title="Cargando equipos..."
                        description="Buscando equipos disponibles"
                    />
                </div>
            ) : filteredTeams.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 sm:p-12 border border-gray-100 shadow-xl text-center">
                    <div className="bg-linear-to-br from-blue-100 to-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaUsers className="text-3xl text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {searchTerm || categoryFilter
                            ? "No se encontraron equipos"
                            : "No hay equipos disponibles"}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm || categoryFilter
                            ? "Intenta ajustar los filtros de búsqueda"
                            : "Actualmente no hay equipos activos buscando jugadores"}
                    </p>

                    {(searchTerm || categoryFilter) && (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setCategoryFilter("");
                            }}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {filteredTeams.map((team) => (
                        <TeamSearchCard
                            key={team.id}
                            team={team}
                            myRequest={getRequestForTeam(team.id)}
                            onSendRequest={sendJoinRequest}
                            onCancelRequest={cancelRequest}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};