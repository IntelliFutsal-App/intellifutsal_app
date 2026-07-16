import { useCallback } from "react";
import { toast } from "react-toastify";
import { trainingPlanService } from "../services";

interface UseTeamOperationsProps {
    onPlanGenerated?: () => void;
}

export const useTeamOperations = ({ onPlanGenerated }: UseTeamOperationsProps = {}) => {
    const generateAiTrainingPlanForTeam = useCallback(
        async (teamId: number) => {
            try {
                // The AI generates a team plan proposal only. It is left in
                // PENDING_APPROVAL for the coach to review before approval and
                // assignment: the model assists the decision, it does not make it.
                await trainingPlanService.createFromAiForTeam(teamId);

                toast.success("Plan grupal generado con IA. Queda pendiente de tu revisión y aprobación.");
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