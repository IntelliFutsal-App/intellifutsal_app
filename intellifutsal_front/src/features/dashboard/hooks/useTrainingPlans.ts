import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { TrainingPlanResponse, UpdateTrainingPlanStatusRequest } from "@features/training/types";
import { trainingPlanService } from "@features/training/services/trainingPlanService";
import { trainingAssignmentService } from "@features/training/services/trainingAssignmentService";
import { playerService } from "@features/player/services/playerService";
import type { AssignPlanData } from "../components/AssignPlanModal";

export const useTrainingPlans = () => {
    const [plans, setPlans] = useState<TrainingPlanResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [actingPlanId, setActingPlanId] = useState<number | null>(null);

    const requestIdRef = useRef(0);

    const fetchPlans = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        try {
            setLoading(true);
            const data = await trainingPlanService.findAll();

            if (requestId !== requestIdRef.current) return;
            setPlans(data);
        } catch (error) {
            if (requestId !== requestIdRef.current) return;
            console.error("Error al cargar planes:", error);
            toast.error("Error al cargar planes de entrenamiento");
            setPlans([]);
        } finally {
            if (requestId === requestIdRef.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchPlans();
    }, [fetchPlans]);

    const assignPlan = useCallback(
        async (data: AssignPlanData) => {
            try {
                if (data.target === "player" && data.playerId) {
                    const assignment = await trainingAssignmentService.create({
                        trainingPlanId: data.planId,
                        playerId: data.playerId,
                        startDate: data.startDate,
                        endDate: data.endDate,
                    });

                    await trainingAssignmentService.activate(assignment.id);
                    toast.success("Plan asignado al jugador exitosamente");
                } else if (data.target === "team" && data.teamId) {
                    const players = await playerService.findByTeamId(data.teamId);

                    const assignmentPromises = players.map(async (player) => {
                        const assignment = await trainingAssignmentService.create({
                            trainingPlanId: data.planId,
                            playerId: player.id,
                            teamId: data.teamId,
                            startDate: data.startDate,
                            endDate: data.endDate,
                        });

                        return trainingAssignmentService.activate(assignment.id);
                    });

                    await Promise.all(assignmentPromises);
                    toast.success(
                        `Plan asignado a ${players.length} jugador${players.length !== 1 ? "es" : ""}`
                    );
                }

                await fetchPlans();
            } catch (error) {
                console.error("Error al asignar plan:", error);
                toast.error("Error al asignar el plan");
                throw error;
            }
        },
        [fetchPlans]
    );

    const approvePlan = useCallback(
        async (planId: number, data?: UpdateTrainingPlanStatusRequest) => {
            try {
                setActingPlanId(planId);
                await trainingPlanService.approve(planId, data || {});
                toast.success("Plan aprobado exitosamente");
                await fetchPlans();
            } catch (error) {
                console.error("Error al aprobar plan:", error);
                toast.error("Error al aprobar el plan");
            } finally {
                setActingPlanId(null);
            }
        },
        [fetchPlans]
    );

    const rejectPlan = useCallback(
        async (planId: number, data?: UpdateTrainingPlanStatusRequest) => {
            try {
                setActingPlanId(planId);
                await trainingPlanService.reject(planId, data || {});
                toast.success("Plan rechazado");
                await fetchPlans();
            } catch (error) {
                console.error("Error al rechazar plan:", error);
                toast.error("Error al rechazar el plan");
            } finally {
                setActingPlanId(null);
            }
        },
        [fetchPlans]
    );

    const archivePlan = useCallback(
        async (planId: number) => {
            try {
                setActingPlanId(planId);
                await trainingPlanService.archive(planId);
                toast.success("Plan archivado");
                await fetchPlans();
            } catch (error) {
                console.error("Error al archivar plan:", error);
                toast.error("Error al archivar el plan");
            } finally {
                setActingPlanId(null);
            }
        },
        [fetchPlans]
    );

    const createManualPlan = useCallback(
        async (data: {
            title: string;
            description: string;
            difficulty?: string;
            durationMinutes?: number;
            focusArea?: string;
        }) => {
            try {
                await trainingPlanService.createManual(data);
                toast.success("Plan creado exitosamente");
                await fetchPlans();
            } catch (error) {
                console.error("Error al crear plan:", error);
                toast.error("Error al crear el plan");
                throw error;
            }
        },
        [fetchPlans]
    );

    const createAiPlanForPlayer = useCallback(
        async (playerId: number) => {
            try {
                await trainingPlanService.createFromAiForPlayer(playerId);
                toast.success("Plan generado con IA exitosamente");
                await fetchPlans();
            } catch (error) {
                console.error("Error al generar plan con IA:", error);
                toast.error("Error al generar plan con IA");
                throw error;
            }
        },
        [fetchPlans]
    );

    const createAiPlanForTeam = useCallback(
        async (teamId: number) => {
            try {
                await trainingPlanService.createFromAiForTeam(teamId);
                toast.success("Plan generado con IA para el equipo");
                await fetchPlans();
            } catch (error) {
                console.error("Error al generar plan con IA:", error);
                toast.error("Error al generar plan con IA");
                throw error;
            }
        },
        [fetchPlans]
    );

    return {
        plans,
        loading,
        actingPlanId,
        fetchPlans,
        assignPlan,
        approvePlan,
        rejectPlan,
        archivePlan,
        createManualPlan,
        createAiPlanForPlayer,
        createAiPlanForTeam,
    };
};