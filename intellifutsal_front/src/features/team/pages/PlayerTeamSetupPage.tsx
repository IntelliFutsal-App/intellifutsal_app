import { useNavigate } from "react-router-dom";
import { FiSearch, FiSend, FiUsers } from "react-icons/fi";
import { Button, InlineLoading, Input } from "@shared/components";
import type { TeamResponse } from "../types";
import { usePlayerTeamSetup } from "../hooks/usePlayerTeamSetup";

const TeamRow = ({
    team,
    onRequest,
    disabled,
    loading,
}: {
    team: TeamResponse;
    onRequest: () => void;
    disabled: boolean;
    loading: boolean;
}) => {
    return (
        <div className="p-5 sm:p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-orange-500 hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                        {team.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Categoría: <span className="font-medium">{team.category}</span>
                    </p>
                </div>

                <div className="sm:shrink-0">
                    <Button
                        onClick={onRequest}
                        variant="primary"
                        size="md"
                        loading={loading}
                        icon={FiSend}
                        iconPosition="left"
                        disabled={disabled}
                        fullWidth
                        className="sm:w-auto"
                    >
                        Solicitar unión
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const PlayerTeamSetupPage = () => {
    const navigate = useNavigate();

    const {
        filteredTeams,
        searchTerm,
        setSearchTerm,
        isLoading,
        sendingRequestTeamId,
        sendJoinRequest,
        canSendRequest,
    } = usePlayerTeamSetup();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-display font-bold text-gray-900">
                    Únete a un Equipo
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Busca y solicita unirte a un equipo para comenzar a entrenar
                </p>
            </div>

            {/* Search */}
            <div className="mb-6">
                <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o categoría..."
                    leftIcon={FiSearch}
                />
            </div>

            {/* Teams List */}
            {isLoading ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                    <InlineLoading title="Cargando equipos..." description="Preparando tus métricas y análisis" />
                </div>
            ) : filteredTeams.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
                    <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-700 font-semibold">No se encontraron equipos</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {searchTerm.trim()
                            ? "Prueba con otro término de búsqueda."
                            : "Aún no hay equipos disponibles para solicitar."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredTeams.map((team) => (
                        <TeamRow
                            key={team.id}
                            team={team}
                            loading={sendingRequestTeamId === team.id}
                            disabled={!canSendRequest(team.id)}
                            onRequest={async () => {
                                const res = await sendJoinRequest(team.id);
                                if (res?.ok) navigate("/dashboard");
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Skip */}
            <div className="mt-8 flex justify-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/dashboard")}
                    className="px-0!"
                >
                    Omitir por ahora
                </Button>
            </div>
        </div>
    );
};

export default PlayerTeamSetupPage;