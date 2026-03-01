import { teamService, type TeamResponse } from "@features/team";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

export const useTeamsManagement = () => {
    const [teams, setTeams] = useState<TeamResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInactive, setShowInactive] = useState(false);
    const requestIdRef = useRef(0);

    const load = useCallback(async () => {
        const reqId = ++requestIdRef.current;
        setLoading(true);

        try {
            const data = showInactive
                ? await teamService.findAllIncludingInactive()
                : await teamService.findAll();

            if (reqId !== requestIdRef.current) return;
            setTeams(data);
        } catch (error) {
            if (reqId !== requestIdRef.current) return;
            console.error("Error cargando teams:", error);
            toast.error("Error al cargar equipos");
        } finally {
            if (reqId === requestIdRef.current) setLoading(false);
        }
    }, [showInactive]);

    useEffect(() => {
        void load();
    }, [load]);

    const createTeam = useCallback(
        async (data: Parameters<typeof teamService.create>[0]) => {
            try {
                await teamService.create(data);
                toast.success("Equipo creado correctamente");
                await load();
            } catch (error) {
                console.error("Error creando team:", error);
                toast.error("Error al crear equipo");
                throw error;
            }
        },
        [load]
    );

    const updateTeam = useCallback(
        async (data: Parameters<typeof teamService.update>[0]) => {
            try {
                await teamService.update(data);
                toast.success("Equipo actualizado correctamente");
                await load();
            } catch (error) {
                console.error("Error actualizando team:", error);
                toast.error("Error al actualizar equipo");
                throw error;
            }
        },
        [load]
    );

    const toggleStatus = useCallback(
        async (id: number, currentStatus: boolean) => {
            try {
                await teamService.updateStatus(id, { status: !currentStatus });
                toast.success(currentStatus ? "Equipo desactivado" : "Equipo activado");
                await load();
            } catch (error) {
                console.error("Error cambiando estado:", error);
                toast.error("Error al cambiar estado");
                throw error;
            }
        },
        [load]
    );

    const deleteTeam = useCallback(
        async (id: number) => {
            try {
                await teamService.delete(id);
                toast.success("Equipo eliminado permanentemente");
                await load();
            } catch (error) {
                console.error("Error eliminando team:", error);
                toast.error("Error al eliminar equipo");
                throw error;
            }
        },
        [load]
    );

    const stats = useMemo(() => {
        const active = teams.filter((t) => t.status);
        const totalPlayers = active.reduce((acc, t) => acc + t.playerCount, 0);
        const avgPlayers = active.length > 0 ? Math.round(totalPlayers / active.length) : 0;

        return { total: teams.length, active: active.length, totalPlayers, avgPlayers };
    }, [teams]);

    return {
        teams,
        loading,
        stats,
        showInactive,
        setShowInactive,
        createTeam,
        updateTeam,
        toggleStatus,
        deleteTeam,
        refresh: load,
    };
};