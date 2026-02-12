import { FaCheck, FaUsers } from "react-icons/fa";
import type { TeamMiniResponse } from "@features/dashboard/types";
import { BaseModal } from "@shared/components";
import { useAuth } from "@shared/hooks";

interface TeamSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    teams: TeamMiniResponse[];
    activeTeamId: number | null;
    onSelectTeam: (teamId: number) => void;
}

export const TeamSelectorModal = ({
    isOpen,
    onClose,
    teams,
    activeTeamId,
    onSelectTeam,
}: TeamSelectorModalProps) => {
    const { user } = useAuth();
    const handleSelectTeam = (teamId: number) => {
        onSelectTeam(teamId);
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Seleccionar Equipo"
            subtitle={`${teams.length} ${teams.length === 1 ? "equipo disponible" : "equipos disponibles"}`}
            icon={FaUsers}
            iconColor="orange"
            maxWidth="md"
            position="top"
            footer={
                <p className="text-xs text-gray-500 text-center">
                    El equipo seleccionado se aplicará a todas las secciones del dashboard
                </p>
            }
        >
            {teams.length === 0 ? (
                <div className="text-center py-8">
                    <div className="bg-gray-100 rounded-full p-6 w-fit mx-auto mb-4">
                        <FaUsers className="text-gray-400 text-3xl" />
                    </div>
                    <p className="text-sm font-semibold text-gray-600">No tienes equipos asignados</p>
                    <p className="text-xs text-gray-500 mt-1">Contacta con tu administrador</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {teams.map((team) => {
                        const isActive = team.id === activeTeamId;

                        return (
                            <button
                                key={team.id}
                                onClick={() => handleSelectTeam(team.id)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${isActive
                                        ? "bg-linear-to-r from-orange-50 to-orange-100/50 border-orange-500 shadow-md"
                                        : "bg-white border-gray-200 hover:border-orange-300 hover:shadow-sm"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3
                                                className={`font-bold truncate ${isActive ? "text-orange-900" : "text-gray-800"
                                                    }`}
                                            >
                                                {team.name}
                                            </h3>
                                            {isActive && (
                                                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                                                    ACTIVO
                                                </span>
                                            )}
                                        </div>
                                        <div className={"flex items-center gap-3 text-xs text-gray-600" + (user?.role === "PLAYER" ? " hidden" : "")}>
                                            <span className="bg-gray-100 px-2 py-1 rounded-md font-medium">
                                                {team.category}
                                            </span>
                                            <span>
                                                {team.playerCount}{" "}
                                                {team.playerCount === 1 ? "jugador" : "jugadores"}
                                            </span>
                                            <span>Edad promedio: {team.averageAge}</span>
                                        </div>
                                    </div>
                                    {isActive && (
                                        <div className="bg-orange-500 p-2 rounded-full shrink-0">
                                            <FaCheck className="text-white text-sm" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </BaseModal>
    );
};