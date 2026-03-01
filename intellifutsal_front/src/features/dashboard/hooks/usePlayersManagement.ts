import { playerService, type PlayerResponse } from "@features/player";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

export const usePlayersManagement = () => {
    const [players, setPlayers] = useState<PlayerResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInactive, setShowInactive] = useState(false);
    const requestIdRef = useRef(0);

    const load = useCallback(async () => {
        const reqId = ++requestIdRef.current;
        setLoading(true);

        try {
            const data = showInactive
                ? await playerService.findAllIncludingInactive()
                : await playerService.findAll();

            if (reqId !== requestIdRef.current) return;
            setPlayers(data);
        } catch (error) {
            if (reqId !== requestIdRef.current) return;
            console.error("Error cargando players:", error);
            toast.error("Error al cargar jugadores");
        } finally {
            if (reqId === requestIdRef.current) setLoading(false);
        }
    }, [showInactive]);

    useEffect(() => {
        void load();
    }, [load]);

    const createPlayer = useCallback(
        async (data: Parameters<typeof playerService.create>[0]) => {
            try {
                await playerService.create(data);
                toast.success("Jugador creado correctamente");
                await load();
            } catch (error) {
                console.error("Error creando player:", error);
                toast.error("Error al crear jugador");
                throw error;
            }
        },
        [load]
    );

    const updatePlayer = useCallback(
        async (data: Parameters<typeof playerService.update>[0]) => {
            try {
                await playerService.update(data);
                toast.success("Jugador actualizado correctamente");
                await load();
            } catch (error) {
                console.error("Error actualizando player:", error);
                toast.error("Error al actualizar jugador");
                throw error;
            }
        },
        [load]
    );

    const toggleStatus = useCallback(
        async (id: number, currentStatus: boolean) => {
            try {
                await playerService.updateStatus(id, { status: !currentStatus });
                toast.success(currentStatus ? "Jugador desactivado" : "Jugador activado");
                await load();
            } catch (error) {
                console.error("Error cambiando estado:", error);
                toast.error("Error al cambiar estado");
                throw error;
            }
        },
        [load]
    );

    const deletePlayer = useCallback(
        async (id: number) => {
            try {
                await playerService.delete(id);
                toast.success("Jugador eliminado permanentemente");
                await load();
            } catch (error) {
                console.error("Error eliminando player:", error);
                toast.error("Error al eliminar jugador");
                throw error;
            }
        },
        [load]
    );

    const stats = useMemo(() => {
        const active = players.filter((p) => p.status);
        const avgAge =
            active.length > 0
                ? Math.round(active.reduce((acc, p) => acc + p.age, 0) / active.length)
                : 0;

        return { total: players.length, active: active.length, avgAge };
    }, [players]);

    return {
        players,
        loading,
        stats,
        showInactive,
        setShowInactive,
        createPlayer,
        updatePlayer,
        toggleStatus,
        deletePlayer,
        refresh: load,
    };
};