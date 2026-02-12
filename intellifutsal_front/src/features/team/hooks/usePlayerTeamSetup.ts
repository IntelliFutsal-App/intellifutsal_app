import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import type { TeamResponse } from "../types";
import { joinRequestService, teamService } from "../services";

export const usePlayerTeamSetup = () => {
    const [teams, setTeams] = useState<TeamResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [sendingRequestTeamId, setSendingRequestTeamId] = useState<number | null>(null);

    const loadTeams = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await teamService.findAll();
            setTeams(data);
        } catch (error) {
            console.error("Error al cargar equipos:", error);
            toast.error("Error al cargar equipos");
            setTeams([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadTeams();
    }, [loadTeams]);

    const filteredTeams = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return teams;

        return teams.filter((t) => {
            const name = t.name?.toLowerCase() ?? "";
            const category = t.category?.toLowerCase() ?? "";
            return name.includes(term) || category.includes(term);
        });
    }, [teams, searchTerm]);

    const canSendRequest = useCallback(
        (teamId: number) => sendingRequestTeamId === null || sendingRequestTeamId === teamId,
        [sendingRequestTeamId]
    );

    const sendJoinRequest = useCallback(async (teamId: number) => {
        if (sendingRequestTeamId != null) return;

        setSendingRequestTeamId(teamId);
        const loadingToast = toast.loading("Enviando solicitud...");

        try {
            await joinRequestService.create({ teamId });
            toast.dismiss(loadingToast);
            toast.success("¡Solicitud enviada exitosamente!");
            return { ok: true as const };
        } catch (error) {
            toast.dismiss(loadingToast);
            const message = error instanceof Error ? error.message : "Error al enviar solicitud";
            toast.error(message);
            return { ok: false as const };
        } finally {
            setSendingRequestTeamId(null);
        }
    }, [sendingRequestTeamId]);

    return {
        teams,
        filteredTeams,
        searchTerm,
        setSearchTerm,
        isLoading,
        sendingRequestTeamId,
        sendJoinRequest,
        canSendRequest,
        reload: loadTeams,
    };
};