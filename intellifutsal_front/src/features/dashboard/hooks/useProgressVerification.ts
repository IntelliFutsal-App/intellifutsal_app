import { trainingAssignmentService, trainingPlanService, trainingProgressService, type TrainingAssignmentResponse, type TrainingPlanResponse, type TrainingProgressResponse } from "@features/training";
import { playerService } from "@features/player";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

export interface EnrichedAssignmentForVerification {
    assignment: TrainingAssignmentResponse;
    plan: TrainingPlanResponse | null;
    progress: TrainingProgressResponse[];
    player: {
        id: number;
        name: string;
    };
    latestSession: TrainingProgressResponse | null;
    unverifiedCount: number;
    totalSessions: number;
    verifiedCount: number;
    avgCompletion: number;
}

export const useProgressVerification = (teamId: number | null) => {
    const [assignments, setAssignments] = useState<EnrichedAssignmentForVerification[]>([]);
    const [loading, setLoading] = useState(true);
    const [verifyingId, setVerifyingId] = useState<number | null>(null);
    const requestIdRef = useRef(0);

    const load = useCallback(async () => {
        if (!teamId) {
            setAssignments([]);
            setLoading(false);
            return;
        }

        const reqId = ++requestIdRef.current;
        setLoading(true);

        try {
            const rawAssignments = await trainingAssignmentService.findByTeam(teamId);
            
            const relevantAssignments = rawAssignments.filter(
                a => a.status === "ACTIVE" || a.status === "COMPLETED"
            );

            if (reqId !== requestIdRef.current) return;

            const enriched = await Promise.allSettled(
                relevantAssignments.map(async (assignment) => {
                    const [planRes, progressRes, playerRes] = await Promise.allSettled([
                        trainingPlanService.findById(assignment.trainingPlanId),
                        trainingProgressService.findByAssignment(assignment.id),
                        playerService.findById(assignment.playerId!),
                    ]);

                    const plan = planRes.status === "fulfilled" ? planRes.value : null;
                    const progress = progressRes.status === "fulfilled" ? progressRes.value : [];
                    const player = playerRes.status === "fulfilled" ? playerRes.value : null;

                    const unverifiedSessions = progress.filter(p => !p.coachVerified);
                    const verifiedSessions = progress.filter(p => p.coachVerified);
                    const avgCompletion = progress.length > 0
                        ? Math.round(progress.reduce((acc, p) => acc + p.completionPercentage, 0) / progress.length)
                        : 0;

                    const latestSession = progress.length > 0
                        ? [...progress].sort((a, b) => new Date(b.progressDate).getTime() - new Date(a.progressDate).getTime())[0]
                        : null;

                    return {
                        assignment,
                        plan,
                        progress,
                        player: {
                            id: assignment.playerId,
                            name: player ? `${player.firstName} ${player.lastName}` : `Jugador #${assignment.playerId}`,
                        },
                        latestSession,
                        unverifiedCount: unverifiedSessions.length,
                        totalSessions: progress.length,
                        verifiedCount: verifiedSessions.length,
                        avgCompletion,
                    };
                })
            );

            if (reqId !== requestIdRef.current) return;

            const successfulAssignments = enriched
                .filter((r): r is PromiseFulfilledResult<EnrichedAssignmentForVerification> => r.status === "fulfilled")
                .map(r => r.value);

            successfulAssignments.sort((a, b) => {
                if (a.unverifiedCount !== b.unverifiedCount) {
                    return b.unverifiedCount - a.unverifiedCount;
                }
                return b.totalSessions - a.totalSessions;
            });

            setAssignments(successfulAssignments);
        } catch (error) {
            if (reqId !== requestIdRef.current) return;
            console.error("Error cargando progreso:", error);
        } finally {
            if (reqId === requestIdRef.current) setLoading(false);
        }
    }, [teamId]);

    useEffect(() => {
        void load();
    }, [load]);

    const verifyProgress = useCallback(
        async (progressId: number, comment?: string) => {
            try {
                setVerifyingId(progressId);
                await trainingProgressService.verifyByCoach(progressId, {
                    verificationComment: comment || undefined,
                });
                toast.success("Progreso verificado correctamente");
                await load();
            } catch (error) {
                console.error("Error verificando progreso:", error);
                throw error;
            } finally {
                setVerifyingId(null);
            }
        },
        [load]
    );

    const stats = useMemo(() => {
        const totalAssignments = assignments.length;
        const totalSessions = assignments.reduce((acc, a) => acc + a.totalSessions, 0);
        const unverifiedSessions = assignments.reduce((acc, a) => acc + a.unverifiedCount, 0);
        const verifiedSessions = assignments.reduce((acc, a) => acc + a.verifiedCount, 0);
        const avgCompletion = assignments.length > 0
            ? Math.round(assignments.reduce((acc, a) => acc + a.avgCompletion, 0) / assignments.length)
            : 0;

        return {
            totalAssignments,
            totalSessions,
            unverifiedSessions,
            verifiedSessions,
            avgCompletion,
        };
    }, [assignments]);

    return {
        assignments,
        loading,
        verifyingId,
        stats,
        verifyProgress,
        refresh: load,
    };
};