import { playerService, type UpdatePlayerSchema } from "@features/player";
import { trainingAssignmentService, trainingPlanService } from "@features/training";
import { useCallback } from "react";
import { toast } from "react-toastify";

interface UsePlayerManagementProps {
    onPlayerUpdated?: () => void;
    onPlanGenerated?: () => void;
}

export const usePlayerManagement = ({ onPlayerUpdated, onPlanGenerated }: UsePlayerManagementProps = {}) => {
    const updatePlayer = useCallback(
        async (data: UpdatePlayerSchema) => {
            try {
                await playerService.update(data);
                toast.success("Jugador actualizado exitosamente");
                onPlayerUpdated?.();
            } catch (error) {
                console.error("Error al actualizar jugador:", error);
                toast.error("Error al actualizar el jugador");
                throw error;
            }
        },
        [onPlayerUpdated]
    );

    const generateAiTrainingPlan = useCallback(
        async (playerId: number) => {
            try {
                const plan = await trainingPlanService.createFromAiForPlayer(playerId);

                const approvedPlan = await trainingPlanService.approve(plan.id, {
                    approvalComment: "Plan generado y aprobado automáticamente por IA",
                });

                const startDate = new Date();
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + 30);

                const assignment = await trainingAssignmentService.create({
                    trainingPlanId: approvedPlan.id,
                    playerId: playerId,
                    startDate: startDate,
                    endDate: endDate,
                });

                await trainingAssignmentService.activate(assignment.id);

                toast.success("Plan generado, aprobado y asignado con IA");
                onPlanGenerated?.();
            } catch (error) {
                console.error("Error al generar plan con IA:", error);
                toast.error("Error al generar el plan de entrenamiento");
                throw error;
            }
        },
        [onPlanGenerated]
    );

    return {
        updatePlayer,
        generateAiTrainingPlan,
    };
};