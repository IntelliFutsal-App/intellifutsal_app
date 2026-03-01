import { coachService, type CoachResponse } from "@features/coach";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

export const useCoachesManagement = () => {
    const [coaches, setCoaches] = useState<CoachResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInactive, setShowInactive] = useState(false);
    const requestIdRef = useRef(0);

    const load = useCallback(async () => {
        const reqId = ++requestIdRef.current;
        setLoading(true);

        try {
            const data = showInactive
                ? await coachService.findAllIncludingInactive()
                : await coachService.findAll();

            if (reqId !== requestIdRef.current) return;
            setCoaches(data);
        } catch (error) {
            if (reqId !== requestIdRef.current) return;
            console.error("Error cargando coaches:", error);
            toast.error("Error al cargar entrenadores");
        } finally {
            if (reqId === requestIdRef.current) setLoading(false);
        }
    }, [showInactive]);

    useEffect(() => {
        void load();
    }, [load]);

    const createCoach = useCallback(
        async (data: Parameters<typeof coachService.create>[0]) => {
            try {
                await coachService.create(data);
                toast.success("Entrenador creado correctamente");
                await load();
            } catch (error) {
                console.error("Error creando coach:", error);
                toast.error("Error al crear entrenador");
                throw error;
            }
        },
        [load]
    );

    const updateCoach = useCallback(
        async (data: Parameters<typeof coachService.update>[0]) => {
            try {
                await coachService.update(data);
                toast.success("Entrenador actualizado correctamente");
                await load();
            } catch (error) {
                console.error("Error actualizando coach:", error);
                toast.error("Error al actualizar entrenador");
                throw error;
            }
        },
        [load]
    );

    const toggleStatus = useCallback(
        async (id: number, currentStatus: boolean) => {
            try {
                await coachService.updateStatus(id, { status: !currentStatus });
                toast.success(currentStatus ? "Entrenador desactivado" : "Entrenador activado");
                await load();
            } catch (error) {
                console.error("Error cambiando estado:", error);
                toast.error("Error al cambiar estado");
                throw error;
            }
        },
        [load]
    );

    const deleteCoach = useCallback(
        async (id: number) => {
            try {
                await coachService.delete(id);
                toast.success("Entrenador eliminado permanentemente");
                await load();
            } catch (error) {
                console.error("Error eliminando coach:", error);
                toast.error("Error al eliminar entrenador");
                throw error;
            }
        },
        [load]
    );

    const stats = useMemo(() => {
        const active = coaches.filter((c) => c.status);

        const expSum = active.reduce((acc, c) => {
            const n = Number(c.expYears);
            return acc + (Number.isFinite(n) ? n : 0);
        }, 0);

        const avgExp =
            active.length > 0 ? Math.round(expSum / active.length) : 0;

        return { total: coaches.length, active: active.length, avgExp };
    }, [coaches]);

    return {
        coaches,
        loading,
        stats,
        showInactive,
        setShowInactive,
        createCoach,
        updateCoach,
        toggleStatus,
        deleteCoach,
        refresh: load,
    };
};