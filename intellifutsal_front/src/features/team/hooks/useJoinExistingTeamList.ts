import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import type { TeamResponse } from "../types";
import { coachTeamService, teamService } from "../services";

export const useJoinExistingTeamList = () => {
    const [teams, setTeams] = useState<TeamResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [joiningTeamId, setJoiningTeamId] = useState<number | null>(null);

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

        return teams.filter((team) => {
            const name = team.name?.toLowerCase() ?? "";
            const category = team.category?.toLowerCase() ?? "";
            return name.includes(term) || category.includes(term);
        });
    }, [teams, searchTerm]);

    const joinTeam = useCallback(async (teamId: number) => {
        if (joiningTeamId != null) return;

        setJoiningTeamId(teamId);
        const toastId = toast.loading("Uniéndote al equipo...");

        try {
            await coachTeamService.create({
                teamId,
                assignmentDate: new Date().toISOString().split("T")[0],
            });

            toast.update(toastId, {
                render: "¡Te has unido al equipo exitosamente!",
                type: "success",
                isLoading: false,
                autoClose: 2500,
            });

            return { ok: true as const };
        } catch (error) {
            console.error("Error al unirse al equipo:", error);
            const message =
                error instanceof Error ? error.message : "Error al unirse al equipo";

            toast.update(toastId, {
                render: message,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });

            return { ok: false as const };
        } finally {
            setJoiningTeamId(null);
        }
    }, [joiningTeamId]);

    return {
        teams,
        filteredTeams,
        searchTerm,
        setSearchTerm,
        isLoading,
        joiningTeamId,
        reload: loadTeams,
        joinTeam,
    };
};