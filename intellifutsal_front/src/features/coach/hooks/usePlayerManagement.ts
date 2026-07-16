import { playerService, type UpdatePlayerSchema } from "@features/player";
import { trainingPlanService } from "@features/training";
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
                throw error;
            }
        },
        [onPlayerUpdated]
    );

    const generateAiTrainingPlan = useCallback(
        async (playerId: number) => {
            try {
                // The AI generates a plan proposal only. It is left in
                // PENDING_APPROVAL so a coach reviews it before it is approved,
                // assigned and activated: accountability for training load stays
                // with the coach, not the model.
                await trainingPlanService.createFromAiForPlayer(playerId);

                toast.success("Plan generado con IA. Queda pendiente de tu revisión y aprobación.");
                onPlanGenerated?.();
            } catch (error) {
                console.error("Error al generar plan con IA:", error);
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