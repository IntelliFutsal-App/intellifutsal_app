import { useCallback } from "react";
import { toast } from "react-toastify";
import { coachTeamService, teamService } from "../services";
import type { CreateTeamSchema } from "../schemas";

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
                throw error;
            }
        },
        [onTeamCreated]
    );

    return {
        createTeam,
    };
};