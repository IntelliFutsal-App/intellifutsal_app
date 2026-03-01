import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { trainingAssignmentService, trainingPlanService, trainingProgressService } from "../services";
import type { TrainingAssignmentResponse, TrainingPlanResponse, TrainingProgressResponse } from "../types";

export interface EnrichedAssignment {
    assignment: TrainingAssignmentResponse;
    plan: TrainingPlanResponse | null;
    progress: TrainingProgressResponse[];
    latestCompletion: number;
    avgCompletion: number;
    sessionCount: number;
    verifiedCount: number;
    daysRemaining: number | null;
}

export const usePlayerProgress = () => {
    const [enriched, setEnriched] = useState<EnrichedAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const requestIdRef = useRef(0);

    const load = useCallback(async () => {
        const reqId = ++requestIdRef.current;
        setLoading(true);

        try {
            const assignments = await trainingAssignmentService.findMyAssignments();
            if (reqId !== requestIdRef.current) return;

            const enrichedList = await Promise.all(
                assignments.map(async (assignment): Promise<EnrichedAssignment> => {
                    const [planResult, progressResult] = await Promise.allSettled([
                        trainingPlanService.findById(assignment.trainingPlanId),
                        trainingProgressService.findByAssignment(assignment.id),
                    ]);

                    const plan = planResult.status === "fulfilled" ? planResult.value : null;
                    const progress = progressResult.status === "fulfilled" ? progressResult.value : [];

                    const sorted = [...progress].sort(
                        (a, b) => new Date(b.progressDate).getTime() - new Date(a.progressDate).getTime()
                    );

                    const latestCompletion = sorted[0]?.completionPercentage ?? 0;
                    const avgCompletion =
                        progress.length > 0
                            ? Math.round(progress.reduce((acc, p) => acc + p.completionPercentage, 0) / progress.length)
                            : 0;

                    const verifiedCount = progress.filter((p) => p.coachVerified).length;

                    let daysRemaining: number | null = null;
                    if (assignment.endDate) {
                        const diff = new Date(assignment.endDate).getTime() - Date.now();
                        daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
                    }

                    return {
                        assignment,
                        plan,
                        progress: sorted,
                        latestCompletion,
                        avgCompletion,
                        sessionCount: progress.length,
                        verifiedCount,
                        daysRemaining,
                    };
                })
            );

            if (reqId !== requestIdRef.current) return;

            const statusOrder: Record<string, number> = { ACTIVE: 0, PENDING: 1, COMPLETED: 2, CANCELLED: 3 };
            enrichedList.sort((a, b) => {
                const so = (statusOrder[a.assignment.status] ?? 9) - (statusOrder[b.assignment.status] ?? 9);
                if (so !== 0) return so;
                return new Date(b.assignment.createdAt).getTime() - new Date(a.assignment.createdAt).getTime();
            });

            setEnriched(enrichedList);
        } catch (error) {
            if (reqId !== requestIdRef.current) return;
            console.error("Error cargando progreso:", error);
            toast.error("Error al cargar tus datos de progreso");
        } finally {
            if (reqId === requestIdRef.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const stats = useMemo(() => {
        const active = enriched.filter((e) => e.assignment.status === "ACTIVE");
        const completed = enriched.filter((e) => e.assignment.status === "COMPLETED");
        const totalSessions = enriched.reduce((acc, e) => acc + e.sessionCount, 0);
        const totalVerified = enriched.reduce((acc, e) => acc + e.verifiedCount, 0);

        const avgOverall =
            active.length > 0
                ? Math.round(active.reduce((acc, e) => acc + e.avgCompletion, 0) / active.length)
                : 0;

        return { active, completed, totalSessions, totalVerified, avgOverall };
    }, [enriched]);

    return { enriched, loading, stats, refresh: load };
};