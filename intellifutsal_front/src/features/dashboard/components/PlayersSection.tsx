import { useState } from "react";
import { FaBrain, FaChartLine, FaCog, FaDumbbell, FaRunning, FaSearch, FaUsers } from "react-icons/fa";
import { useActiveTeam } from "@shared/hooks";
import { Badge, Button, InlineLoading, Input, Select } from "@shared/components";
import { DetailedPlayerCard } from "./DetailedPlayerCard";
import { StatCard, type ColorType } from "./StatCard";
import { EditPlayerModal } from "./EditPlayerModal";
import { PlayerAiAnalysisModal } from "./PlayerAiAnalysisModal";
import type { PlayerResponse } from "@features/player/types";
import { usePlayerManagement, usePlayersSection, useTeamOperations } from "../hooks";
import { TeamAiAnalysisModal } from "./TeamAiAnalysisModal";
import type { TeamResponse } from "@features/team/types";

export const PlayersSection = () => {
    const { activeTeamId, activeTeam } = useActiveTeam();
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerResponse | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAiAnalysisModalOpen, setIsAiAnalysisModalOpen] = useState(false);
    const [isTeamAiAnalysisModalOpen, setIsTeamAiAnalysisModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<TeamResponse | null>(null);

    const {
        loading,
        searchTerm,
        setSearchTerm,
        filterPosition,
        setFilterPosition,
        viewMode,
        setViewMode,
        filteredPlayers,
        positionOptions,
        stats,
        clearFilters,
        showEmptyByNoTeam,
        refreshPlayers,
    } = usePlayersSection(activeTeamId);

    const { updatePlayer, generateAiTrainingPlan } = usePlayerManagement({
        onPlayerUpdated: refreshPlayers,
        onPlanGenerated: () => {
        },
    });

    const handleOpenTeamAiAnalysis = () => {
        if (!activeTeam) return;
        setSelectedTeam(activeTeam);
        setIsTeamAiAnalysisModalOpen(true);
    };

    const handleOpenEdit = (player: PlayerResponse) => {
        setSelectedPlayer(player);
        setIsEditModalOpen(true);
    };

    const handleOpenAiAnalysis = (player: PlayerResponse) => {
        setSelectedPlayer(player);
        setIsAiAnalysisModalOpen(true);
    };

    const { generateAiTrainingPlanForTeam } = useTeamOperations({
        onPlanGenerated: () => {
        },
    });

    const foundLabel = filteredPlayers.length === 1 ? "jugador encontrado" : "jugadores encontrados";

    return (
        <>
            <div className="space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {[
                        {
                            icon: FaUsers,
                            label: "Total Jugadores",
                            value: stats.total.toString(),
                            color: "orange" as ColorType,
                        },
                        {
                            icon: FaRunning,
                            label: "Jugadores Activos",
                            value: stats.activeCount.toString(),
                            color: "green" as ColorType,
                        },
                        {
                            icon: FaChartLine,
                            label: "Edad Promedio",
                            value: `${stats.avgAge} años`,
                            color: "blue" as ColorType,
                        },
                        {
                            icon: FaDumbbell,
                            label: "IMC Promedio",
                            value: Number(stats.avgBmi).toFixed(1),
                            color: "purple" as ColorType,
                        },
                    ].map((stat, idx) => (
                        <StatCard key={idx} {...stat} />
                    ))}
                </div>

                {/* Filters + Actions */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Gestión de Jugadores
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {filteredPlayers.length} {foundLabel}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button
                                variant="primary"
                                size="sm"
                                icon={FaBrain}
                                iconPosition="left"
                                onClick={handleOpenTeamAiAnalysis}
                                disabled={!activeTeam}
                            >
                                Análisis Grupal
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por nombre o posición..."
                            leftIcon={FaSearch}
                        />

                        <Select
                            value={filterPosition}
                            onChange={(e) => setFilterPosition(e.target.value)}
                            options={positionOptions}
                            placeholder="Filtrar por posición"
                        />

                        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={
                                    viewMode === "grid"
                                        ? "bg-white shadow-md text-orange-600"
                                        : "text-gray-600"
                                }
                                onClick={() => setViewMode("grid")}
                                fullWidth
                            >
                                <div className="grid grid-cols-2 gap-1">
                                    <div className="w-2 h-2 bg-current rounded-sm" />
                                    <div className="w-2 h-2 bg-current rounded-sm" />
                                    <div className="w-2 h-2 bg-current rounded-sm" />
                                    <div className="w-2 h-2 bg-current rounded-sm" />
                                </div>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className={
                                    viewMode === "table"
                                        ? "bg-white shadow-md text-orange-600"
                                        : "text-gray-600"
                                }
                                onClick={() => setViewMode("table")}
                                fullWidth
                            >
                                <div className="space-y-1">
                                    <div className="w-6 h-0.5 bg-current rounded" />
                                    <div className="w-6 h-0.5 bg-current rounded" />
                                    <div className="w-6 h-0.5 bg-current rounded" />
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* No team */}
                {showEmptyByNoTeam && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-10 border border-gray-100 shadow-xl text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            No hay un equipo activo seleccionado
                        </h3>
                        <p className="text-gray-600">Selecciona un equipo para cargar sus jugadores.</p>
                    </div>
                )}

                {/* Loading */}
                {activeTeamId && loading && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 sm:p-12 border border-gray-100 shadow-xl text-center">
                        <InlineLoading
                            title="Cargando jugadores..."
                            description="Preparando tus métricas y análisis"
                        />
                    </div>
                )}

                {/* Content */}
                {activeTeamId && !loading && filteredPlayers.length > 0 && (
                    <>
                        {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                                {filteredPlayers.map((player) => (
                                    <DetailedPlayerCard
                                        key={player.id}
                                        player={player}
                                        onPlayerUpdated={refreshPlayers}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-[980px] w-full">
                                        <thead className="bg-linear-to-r from-gray-50 to-orange-50/30 border-b border-gray-200">
                                            <tr>
                                                {[
                                                    "Jugador",
                                                    "Posición",
                                                    "Edad",
                                                    "Altura/Peso",
                                                    "IMC",
                                                    "30m",
                                                    "Estado",
                                                    "Acciones",
                                                ].map((h) => (
                                                    <th
                                                        key={h}
                                                        className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                                                    >
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-200">
                                            {filteredPlayers.map((p) => {
                                                const fullName = `${p.firstName} ${p.lastName}`;
                                                return (
                                                    <tr
                                                        key={p.id}
                                                        className="hover:bg-orange-50/50 transition-colors"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=ea580c&color=fff&size=40`}
                                                                    alt={fullName}
                                                                    className="w-10 h-10 rounded-lg ring-2 ring-orange-200 object-cover"
                                                                />
                                                                <div className="min-w-0">
                                                                    <div className="font-semibold text-gray-800 truncate">
                                                                        {fullName}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        ID: {p.id}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            {p.position}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            {p.age}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            {p.height}m / {p.weight}kg
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                                                            {Number(p.bmi).toFixed(1)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            {p.thirtyMetersTime}s
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Badge
                                                                variant={p.status ? "success" : "neutral"}
                                                                className="w-fit"
                                                            >
                                                                {p.status ? "Activo" : "Inactivo"}
                                                            </Badge>
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="primary"
                                                                    size="xs"
                                                                    icon={FaBrain}
                                                                    iconPosition="left"
                                                                    onClick={() => handleOpenAiAnalysis(p)}
                                                                >
                                                                    IA
                                                                </Button>
                                                                <Button
                                                                    variant="secondary"
                                                                    size="xs"
                                                                    icon={FaCog}
                                                                    iconPosition="left"
                                                                    onClick={() => handleOpenEdit(p)}
                                                                >
                                                                    Ajustes
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Empty by filters */}
                {activeTeamId && !loading && filteredPlayers.length === 0 && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-gray-100 shadow-xl text-center">
                        <div className="bg-linear-to-br from-orange-100 to-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaSearch className="text-3xl text-orange-600" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron jugadores</h3>
                        <p className="text-gray-600 mb-6">Intenta ajustar los filtros de búsqueda</p>

                        <Button variant="primary" size="sm" onClick={clearFilters}>
                            Limpiar filtros
                        </Button>
                    </div>
                )}

            </div>
            <EditPlayerModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedPlayer(null);
                }}
                player={selectedPlayer}
                onUpdate={updatePlayer}
            />

            <PlayerAiAnalysisModal
                isOpen={isAiAnalysisModalOpen}
                onClose={() => {
                    setIsAiAnalysisModalOpen(false);
                    setSelectedPlayer(null);
                }}
                player={selectedPlayer}
                onGenerateTrainingPlan={generateAiTrainingPlan}
            />

            <TeamAiAnalysisModal
                isOpen={isTeamAiAnalysisModalOpen}
                onClose={() => {
                    setIsTeamAiAnalysisModalOpen(false);
                    setSelectedTeam(null);
                }}
                team={selectedTeam}
                onGenerateTrainingPlan={generateAiTrainingPlanForTeam}
            />
        </>
    );
};