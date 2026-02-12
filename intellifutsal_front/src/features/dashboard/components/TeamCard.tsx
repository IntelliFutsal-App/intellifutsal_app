import type { CoachTeamResponse, TeamResponse } from "@features/team/types";
import { daysBetween, formatDate } from "@shared/utils/dateUtils";
import { useMemo } from "react";
import { FaBrain, FaCalendarAlt, FaTrophy, FaUsers } from "react-icons/fa";
import { Badge, Button, InfoTile } from "@shared/components";

interface TeamCardProps {
    team: TeamResponse;
    assignment: CoachTeamResponse;
    onViewPlayers: (team: TeamResponse) => void;
    onViewAiAnalysis: (team: TeamResponse) => void;
}

export const TeamCard = ({ team, assignment, onViewPlayers, onViewAiAnalysis }: TeamCardProps) => {
    const daysSinceAssignment = useMemo(() => {
        return daysBetween(new Date(assignment.assignmentDate), new Date());
    }, [assignment.assignmentDate]);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative">
            {/* Header */}
            <div className="bg-linear-to-br from-orange-600 to-orange-700 p-6 relative overflow-hidden">
                <div aria-hidden className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />

                <div className="relative">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                            <h3 className="font-bold text-white text-2xl mb-1 truncate" title={team.name}>
                                {team.name}
                            </h3>
                            <p className="text-orange-100 text-sm font-medium truncate" title={team.category}>
                                {team.category}
                            </p>
                        </div>

                        <Badge
                            variant={team.status ? "success" : "neutral"}
                            className="shrink-0 bg-white/15 text-white border border-white/20"
                        >
                            {team.status ? "Activo" : "Inactivo"}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-white/80 text-xs">
                        <FaCalendarAlt aria-hidden />
                        <span>Asignado hace {daysSinceAssignment} días</span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <InfoTile
                        title="Jugadores"
                        value={team.playerCount}
                        icon={FaUsers}
                        color="blue"
                        size="sm"
                    />
                    <InfoTile
                        title="Categoría"
                        value={team.category}
                        icon={FaTrophy}
                        color="purple"
                        size="sm"
                    />
                </div>

                {/* Info */}
                <div className="bg-linear-to-br from-gray-50 to-orange-50/30 rounded-xl p-4 mb-4 border border-gray-100">
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-600">Fecha de fundación:</span>
                            <span className="font-semibold text-gray-800 whitespace-nowrap">
                                {formatDate(new Date(team.createdAt))}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-600">Tu asignación:</span>
                            <span className="font-semibold text-gray-800 whitespace-nowrap">
                                {formatDate(new Date(assignment.assignmentDate))}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                        onClick={() => onViewPlayers(team)}
                        variant="primary"
                        icon={FaUsers}
                        iconPosition="left"
                        fullWidth
                        size="sm"
                    >
                        Jugadores
                    </Button>

                    <Button
                        onClick={() => onViewAiAnalysis(team)}
                        variant="secondary"
                        icon={FaBrain}
                        iconPosition="left"
                        fullWidth
                        size="sm"
                    >
                        Análisis IA
                    </Button>
                </div>
            </div>
        </div>
    );
};