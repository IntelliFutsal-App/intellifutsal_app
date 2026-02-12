import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiSearch, FiUsers, FiArrowLeft } from "react-icons/fi";
import { Button, Input, Badge, InlineLoading } from "@shared/components";
import { useJoinExistingTeamList } from "../hooks/useJoinExistingTeamList";

interface JoinExistingTeamListProps {
    onBack: () => void;
}

export const JoinExistingTeamList = ({ onBack }: JoinExistingTeamListProps) => {
    const navigate = useNavigate();

    const {
        filteredTeams,
        searchTerm,
        setSearchTerm,
        isLoading,
        joiningTeamId,
        joinTeam,
    } = useJoinExistingTeamList();

    const handleJoin = useCallback(
        async (teamId: number) => {
            const res = await joinTeam(teamId);
            if (res?.ok) navigate("/dashboard");
        },
        [joinTeam, navigate]
    );

    const hasTeams = filteredTeams.length > 0;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    icon={FiArrowLeft}
                    iconPosition="left"
                    onClick={onBack}
                    className="px-0!"
                >
                    Volver
                </Button>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-display font-bold text-gray-900">
                    Unirse a Equipo Existente
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Busca y únete a un equipo ya registrado en la plataforma
                </p>
            </div>

            {/* Search */}
            <div className="mb-6">
                <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o categoría..."
                    leftIcon={FiSearch}
                    disabled={isLoading}
                />
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="text-center py-12">
                    <InlineLoading title="Cargando equipos..." description="Preparando tus métricas y análisis" />
                </div>
            ) : !hasTeams ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                    <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No se encontraron equipos</p>
                    <p className="text-sm text-gray-400">
                        {searchTerm
                            ? "Intenta con otro término de búsqueda"
                            : "Sé el primero en crear un equipo"}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredTeams.map((team) => (
                        <div
                            key={team.id}
                            className="p-5 sm:p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-orange-500 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-3 mb-2 min-w-0">
                                        <div className="p-2 bg-orange-50 rounded-lg shrink-0">
                                            <FiUsers className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                                            {team.name}
                                        </h3>
                                    </div>

                                    <div className="sm:ml-12">
                                        {/* ✅ shared Badge (si tu Badge soporta tones/variants nuevos) */}
                                        <Badge variant="neutral">{team.category}</Badge>
                                    </div>
                                </div>

                                <div className="sm:shrink-0">
                                    <Button
                                        onClick={() => handleJoin(team.id)}
                                        variant="primary"
                                        size="md"
                                        loading={joiningTeamId === team.id}
                                        icon={FiCheck}
                                        iconPosition="left"
                                        disabled={joiningTeamId !== null}
                                        fullWidth
                                    >
                                        Unirme
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Info Box */}
            {hasTeams && !isLoading && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-800">
                        <strong>Nota:</strong> Al unirte a un equipo existente, podrás gestionar
                        jugadores y entrenamientos junto con otros entrenadores del equipo.
                    </p>
                </div>
            )}
        </div>
    );
};