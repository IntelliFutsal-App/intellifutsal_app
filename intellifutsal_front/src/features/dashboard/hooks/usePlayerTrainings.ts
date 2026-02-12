import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { TrainingAssignmentResponse } from "@features/training/types";
import { trainingAssignmentService } from "@features/training/services/trainingAssignmentService";
import { trainingProgressService } from "@features/training/services/trainingProgressService";

export const usePlayerTrainings = () => {
    const [assignments, setAssignments] = useState<TrainingAssignmentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const requestIdRef = useRef(0);

    const fetchAssignments = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        try {
            setLoading(true);
            const data = await trainingAssignmentService.findMyAssignments();

            if (requestId !== requestIdRef.current) return;

            setAssignments(data);
        } catch (error) {
            if (requestId !== requestIdRef.current) return;
            console.error("Error al cargar asignaciones:", error);
            toast.error("Error al cargar tus entrenamientos");
            setAssignments([]);
        } finally {
            if (requestId === requestIdRef.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchAssignments();
    }, [fetchAssignments]);

    const recordProgress = useCallback(
        async (
            assignmentId: number,
            data: { completionPercentage: number; notes?: string }
        ) => {
            try {
                await trainingProgressService.createByPlayer({
                    trainingAssignmentId: assignmentId,
                    progressDate: new Date(),
                    completionPercentage: data.completionPercentage,
                    notes: data.notes,
                });

                toast.success("Progreso registrado exitosamente");
                await fetchAssignments();
            } catch (error) {
                console.error("Error al registrar progreso:", error);
                toast.error("Error al registrar el progreso");
                throw error;
            }
        },
        [fetchAssignments]
    );

    return {
        assignments,
        loading,
        fetchAssignments,
        recordProgress,
    };
};