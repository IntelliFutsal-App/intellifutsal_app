import { useCallback } from "react";
import { toast } from "react-toastify";
import { coachTeamService, teamService } from "@features/team/services";
import type { CreateTeamSchema } from "@features/team/schemas/createTeamSchema";

interface UseTeamsManagementProps {
    onTeamCreated?: () => void;
}

export const useTeamsManagement = ({ onTeamCreated }: UseTeamsManagementProps = {}) => {
    const createTeam = useCallback(
        async (data: CreateTeamSchema) => {
            try {
                const team = await teamService.create({
                    name: data.name,
                    category: data.category,
                });

                await coachTeamService.create({
                    teamId: team.id,
                    assignmentDate: new Date().toISOString().split("T")[0],
                });

                toast.success("Equipo creado exitosamente");

                onTeamCreated?.();
            } catch (error) {
                console.error("Error al crear equipo:", error);
                toast.error("Error al crear el equipo");
                throw error;
            }
        },
        [onTeamCreated]
    );

    return {
        createTeam,
    };
};