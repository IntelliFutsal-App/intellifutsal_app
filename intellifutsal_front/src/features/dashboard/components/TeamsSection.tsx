import { FaChartLine, FaPlus, FaRunning, FaUsers } from "react-icons/fa";
import { useMemo, useState } from "react";
import { TeamCard } from "./TeamCard";
import { StatCard, type ColorType } from "./StatCard";
import { CreateTeamModal } from "./CreateTeamModal";
import { TeamPlayersModal } from "./TeamPlayersModal";
import { TeamAiAnalysisModal } from "./TeamAiAnalysisModal";
import type { TeamResponse, CoachTeamResponse } from "@features/team/types";
import { useAuth, useProfile } from "@shared/hooks";
import { Button, InlineLoading } from "@shared/components";
import { useCoachTeams } from "../hooks";
import { useTeamsManagement } from "../hooks/useTeamsManagement";
import { useTeamOperations } from "../hooks/useTeamOperations";

type CoachTeamWithTeam = CoachTeamResponse & { team?: TeamResponse };

const TeamsGroup = ({
    title,
    dotClassName,
    items,
    onViewPlayers,
    onViewAiAnalysis,
}: {
    title: string;
    dotClassName: string;
    items: CoachTeamWithTeam[];
    onViewPlayers: (team: TeamResponse) => void;
    onViewAiAnalysis: (team: TeamResponse) => void;
}) => {
    if (items.length === 0) return null;

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${dotClassName}`} />
                {title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {items.map((assignment) => (
                    <TeamCard
                        key={assignment.id}
                        team={assignment.team!}
                        assignment={assignment}
                        onViewPlayers={onViewPlayers}
                        onViewAiAnalysis={onViewAiAnalysis}
                    />
                ))}
            </div>
        </div>
    );
};

export const TeamsSection = () => {
    const { user } = useAuth();
    const { activeTeamId, setActiveTeamId, profileState } = useProfile();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<TeamResponse | null>(null);
    const [isPlayersModalOpen, setIsPlayersModalOpen] = useState(false);
    const [isAiAnalysisModalOpen, setIsAiAnalysisModalOpen] = useState(false);

    const { coachTeamsData, isLoading, activeTeams, inactiveTeams } = useCoachTeams({
        userRole: user?.role,
        userPresent: !!user,
        activeTeamId,
        setActiveTeamId,
        profileState,
    });

    const { createTeam } = useTeamsManagement({
        onTeamCreated: () => {
            window.location.reload();
        },
    });

    const { generateAiTrainingPlanForTeam } = useTeamOperations({
        onPlanGenerated: () => {
        },
    });

    const handleViewPlayers = (team: TeamResponse) => {
        setSelectedTeam(team);
        setIsPlayersModalOpen(true);
    };

    const handleViewAiAnalysis = (team: TeamResponse) => {
        setSelectedTeam(team);
        setIsAiAnalysisModalOpen(true);
    };

    const handleManageAllPlayers = () => {
        if (selectedTeam) {
            setActiveTeamId(selectedTeam.id);
        }
    };

    const stats = useMemo(() => {
        const totalPlayers = activeTeams.reduce((acc, ct) => acc + (ct.team?.playerCount || 0), 0);
        const avgAge =
            activeTeams.length > 0
                ? Math.round(
                    activeTeams.reduce((acc, ct) => acc + (ct.team?.averageAge || 0), 0) /
                    activeTeams.length
                )
                : null;

        return [
            {
                icon: FaUsers,
                label: "Equipos Activos",
                value: activeTeams.length.toString(),
                color: "orange" as ColorType,
            },
            {
                icon: FaRunning,
                label: "Total Jugadores",
                value: totalPlayers.toString(),
                color: "blue" as ColorType,
            },
            {
                icon: FaChartLine,
                label: "Edad Promedio",
                value: avgAge == null ? "N/A" : `${avgAge} años`,
                color: "green" as ColorType,
            }
        ];
    }, [activeTeams]);

    return (
        <>
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {stats.map((stat, idx) => (
                        <StatCard key={idx} {...stat} />
                    ))}
                </div>

                {/* Header */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Mis Equipos
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Gestiona tus equipos asignados y monitorea su progreso
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button
                                variant="primary"
                                size="sm"
                                icon={FaPlus}
                                iconPosition="left"
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                Crear Equipo
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 sm:p-12 border border-gray-100 shadow-xl text-center">
                        <InlineLoading
                            title="Cargando equipos..."
                            description="Preparando tus métricas y análisis"
                        />
                    </div>
                ) : coachTeamsData.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 sm:p-12 border border-gray-100 shadow-xl text-center">
                        <div className="bg-linear-to-br from-orange-100 to-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaUsers className="text-3xl text-orange-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No tienes equipos asignados</h3>
                        <p className="text-gray-600 mb-6">
                            Comienza creando tu primer equipo o solicita ser asignado a uno existente
                        </p>

                        <Button
                            variant="primary"
                            size="sm"
                            icon={FaPlus}
                            iconPosition="left"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Crear Primer Equipo
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <TeamsGroup
                            title="Equipos Activos"
                            dotClassName="bg-green-500"
                            items={activeTeams}
                            onViewPlayers={handleViewPlayers}
                            onViewAiAnalysis={handleViewAiAnalysis}
                        />

                        <TeamsGroup
                            title="Equipos Inactivos"
                            dotClassName="bg-gray-400"
                            items={inactiveTeams}
                            onViewPlayers={handleViewPlayers}
                            onViewAiAnalysis={handleViewAiAnalysis}
                        />
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateTeamModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={createTeam}
            />

            <TeamPlayersModal
                isOpen={isPlayersModalOpen}
                onClose={() => {
                    setIsPlayersModalOpen(false);
                    setSelectedTeam(null);
                }}
                team={selectedTeam}
                onManageAll={handleManageAllPlayers}
            />

            <TeamAiAnalysisModal
                isOpen={isAiAnalysisModalOpen}
                onClose={() => {
                    setIsAiAnalysisModalOpen(false);
                    setSelectedTeam(null);
                }}
                team={selectedTeam}
                onGenerateTrainingPlan={generateAiTrainingPlanForTeam}
            />
        </>
    );
};