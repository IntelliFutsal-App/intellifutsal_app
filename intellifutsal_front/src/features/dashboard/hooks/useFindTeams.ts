import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { TeamResponse, JoinRequestResponse } from "@features/team/types";
import { teamService, joinRequestService } from "@features/team/services";

export const useFindTeams = () => {
    const [teams, setTeams] = useState<TeamResponse[]>([]);
    const [myRequests, setMyRequests] = useState<JoinRequestResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const requestIdRef = useRef(0);

    const fetchTeams = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        try {
            setLoading(true);
            const data = await teamService.findAll();

            if (requestId !== requestIdRef.current) return;

            setTeams(data.filter((team) => team.status));
        } catch (error) {
            if (requestId !== requestIdRef.current) return;
            console.error("Error al cargar equipos:", error);
            toast.error("Error al cargar equipos disponibles");
            setTeams([]);
        } finally {
            if (requestId === requestIdRef.current) setLoading(false);
        }
    }, []);

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
            try {
                await joinRequestService.create({ teamId });
                toast.success("Solicitud enviada exitosamente");

                await fetchMyRequests();
            } catch (error) {
                console.error("Error al enviar solicitud:", error);
                toast.error("Error al enviar la solicitud");
                throw error;
            }
        },
        [fetchMyRequests]
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
        (teamId: number) => {
            return myRequests.find((req) => req.teamId === teamId);
        },
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