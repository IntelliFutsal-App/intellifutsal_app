import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useProfile } from "@shared/hooks";
import type { JoinRequestResponse, TeamResponse } from "../types";
import { joinRequestService, teamService } from "../services";

export const useFindTeams = () => {
    const { profileState } = useProfile();
    const [teams, setTeams] = useState<TeamResponse[]>([]);
    const [myRequests, setMyRequests] = useState<JoinRequestResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const requestIdRef = useRef(0);

    const myTeamIds = useMemo(() => {
        const ids = profileState?.teams?.map(t => t.id) ?? [];
        return new Set<number>(ids);
    }, [profileState?.teams]);

    const fetchTeams = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        try {
            setLoading(true);
            const data = await teamService.findAll();

            if (requestId !== requestIdRef.current) return;

            const available = data.filter(team => team.status && !myTeamIds.has(team.id));
            setTeams(available);
        } catch (error) {
            if (requestId !== requestIdRef.current) return;
            console.error("Error al cargar equipos:", error);
            toast.error("Error al cargar equipos disponibles");
            setTeams([]);
        } finally {
            if (requestId === requestIdRef.current) setLoading(false);
        }
    }, [myTeamIds]);

    const fetchMyRequests = useCallback(async () => {
        try {
            setLoadingRequests(true);
            const data = await joinRequestService.findMyRequests();
            setMyRequests(data);
        } catch (error) {
            console.error("Error al cargar mis solicitudes:", error);
            setMyRequests([]);
        } finally {
            setLoadingRequests(false);
        }
    }, []);

    useEffect(() => {
        void fetchTeams();
        void fetchMyRequests();
    }, [fetchTeams, fetchMyRequests]);

    const sendJoinRequest = useCallback(
        async (teamId: number) => {
            if (myTeamIds.has(teamId)) {
                toast.info("Ya perteneces a este equipo.");
                return;
            }

            try {
                await joinRequestService.create({ teamId });
                toast.success("Solicitud enviada exitosamente");

                await fetchMyRequests();
                await fetchTeams();
            } catch (error) {
                console.error("Error al enviar solicitud:", error);
                toast.error("Error al enviar la solicitud");
                throw error;
            }
        },
        [fetchMyRequests, fetchTeams, myTeamIds]
    );

    const cancelRequest = useCallback(
        async (requestId: number) => {
            try {
                await joinRequestService.cancel(requestId);
                toast.success("Solicitud cancelada");

                await fetchMyRequests();
            } catch (error) {
                console.error("Error al cancelar solicitud:", error);
                toast.error("Error al cancelar la solicitud");
                throw error;
            }
        },
        [fetchMyRequests]
    );

    const getRequestForTeam = useCallback(
        (teamId: number) => myRequests.find(req => req.teamId === teamId),
        [myRequests]
    );

    return {
        teams,
        myRequests,
        loading,
        loadingRequests,
        sendJoinRequest,
        cancelRequest,
        getRequestForTeam,
        refreshTeams: fetchTeams,
        refreshRequests: fetchMyRequests,
    };
};