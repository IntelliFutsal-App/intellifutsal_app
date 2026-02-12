import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { JoinRequestResponse } from "@features/team/types";
import { joinRequestService } from "@features/team/services/joinRequestService";

export const useJoinRequests = (activeTeamId?: number | null) => {
    const [requests, setRequests] = useState<JoinRequestResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [actingById, setActingById] = useState<Record<number, boolean>>({});

    const requestIdRef = useRef(0);

    const setActing = useCallback((id: number, value: boolean) => {
        setActingById((prev) => ({ ...prev, [id]: value }));
    }, []);

    const refresh = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        if (!activeTeamId) {
            setRequests([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await joinRequestService.findAllPending(activeTeamId);

            if (requestId !== requestIdRef.current) return;
            setRequests(data);
        } catch (e) {
            if (requestId !== requestIdRef.current) return;

            console.error("Error cargando join requests:", e);
            toast.error("Error al cargar solicitudes de ingreso");
            setRequests([]);
        } finally {
            if (requestId === requestIdRef.current) setLoading(false);
        }
    }, [activeTeamId]);

    useEffect(() => {
        setRequests([]);
        setActingById({});
        setLoading(true);
        requestIdRef.current += 1;

        void refresh();
    }, [refresh]);

    const approve = useCallback(
        async (id: number) => {
            try {
                setActing(id, true);
                const updated = await joinRequestService.approve(id);
                setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
                toast.success("Solicitud aprobada");
            } catch (e) {
                console.error("Error aprobando join request:", e);
                toast.error("No se pudo aprobar la solicitud");
            } finally {
                setActing(id, false);
            }
        },
        [setActing]
    );

    const reject = useCallback(
        async (id: number) => {
            try {
                setActing(id, true);
                const updated = await joinRequestService.reject(id);
                setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
                toast.info("Solicitud rechazada");
            } catch (e) {
                console.error("Error rechazando join request:", e);
                toast.error("No se pudo rechazar la solicitud");
            } finally {
                setActing(id, false);
            }
        },
        [setActing]
    );

    const pendingCount = useMemo(
        () => requests.filter((r) => r.status === "PENDING").length,
        [requests]
    );

    return { requests, loading, actingById, pendingCount, approve, reject, refresh };
};