import { useCallback } from "react";
import { toast } from "react-toastify";
import { trainingAssignmentService, trainingPlanService } from "../services";
import { playerService } from "@features/player";

interface UseTeamOperationsProps {
    onPlanGenerated?: () => void;
}

export const useTeamOperations = ({ onPlanGenerated }: UseTeamOperationsProps = {}) => {
    const generateAiTrainingPlanForTeam = useCallback(
        async (teamId: number) => {
            try {
                const plan = await trainingPlanService.createFromAiForTeam(teamId);

                const approvedPlan = await trainingPlanService.approve(plan.id, {
                    approvalComment: "Plan grupal generado y aprobado automáticamente por IA",
                });

                const players = await playerService.findByTeamId(teamId);

                const startDate = new Date();
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + 30);

                const assignmentPromises = players.map(async (player) => {
                    const assignment = await trainingAssignmentService.create({
                        trainingPlanId: approvedPlan.id,
                        playerId: player.id,
                        teamId: teamId,
                        startDate: startDate,
                        endDate: endDate,
                    });

                    return trainingAssignmentService.activate(assignment.id);
                });

                await Promise.all(assignmentPromises);

                toast.success(
                    `Plan grupal generado y asignado a ${players.length} jugador${players.length !== 1 ? "es" : ""}`
                );
                onPlanGenerated?.();
            } catch (error) {
                console.error("Error al generar plan grupal con IA:", error);
                throw error;
            }
        },
        [onPlanGenerated]
    );

    return {
        generateAiTrainingPlanForTeam,
    };
};