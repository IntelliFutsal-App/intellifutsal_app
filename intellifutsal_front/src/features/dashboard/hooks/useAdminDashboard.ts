import { coachService, type CoachResponse } from "@features/coach";
import { playerService, type PlayerResponse } from "@features/player";
import { userService, type UserResponse } from "@features/profile";
import { teamService, type TeamResponse } from "@features/team";
import { trainingPlanService, type TrainingPlanResponse } from "@features/training";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

export interface AdminDashboardData {
    users: UserResponse[];
    coaches: CoachResponse[];
    players: PlayerResponse[];
    teams: TeamResponse[];
    trainingPlans: TrainingPlanResponse[];
}

export const useAdminDashboard = () => {
    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const requestIdRef = useRef(0);

    const load = useCallback(async () => {
        const reqId = ++requestIdRef.current;
        setLoading(true);

        try {
            const [usersRes, coachesRes, playersRes, teamsRes, plansRes] = await Promise.allSettled([
                userService.findAllIncludingInactive(),
                coachService.findAllIncludingInactive(),
                playerService.findAllIncludingInactive(),
                teamService.findAllIncludingInactive(),
                trainingPlanService.findAll(),
            ]);

            if (reqId !== requestIdRef.current) return;

            setData({
                users: usersRes.status === "fulfilled" ? usersRes.value : [],
                coaches: coachesRes.status === "fulfilled" ? coachesRes.value : [],
                players: playersRes.status === "fulfilled" ? playersRes.value : [],
                teams: teamsRes.status === "fulfilled" ? teamsRes.value : [],
                trainingPlans: plansRes.status === "fulfilled" ? plansRes.value : [],
            });
        } catch (error) {
            if (reqId !== requestIdRef.current) return;
            console.error("Error cargando dashboard admin:", error);
            toast.error("Error al cargar datos del sistema");
        } finally {
            if (reqId === requestIdRef.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const stats = useMemo(() => {
        if (!data) return null;

        // Users
        const activeUsers = data.users.filter((u) => u.status);
        const coachUsers = data.users.filter((u) => u.role === "COACH");
        const playerUsers = data.users.filter((u) => u.role === "PLAYER");
        const pendingCoaches = coachUsers.filter((u) => u.onboardingStatus === "PENDING");

        // Coaches
        const activeCoaches = data.coaches.filter((c) => c.status);
        const avgExpYears =
            activeCoaches.length > 0
                ? Math.round(activeCoaches.reduce((acc, c) => acc + c.expYears, 0) / activeCoaches.length)
                : 0;

        // Players
        const activePlayers = data.players.filter((p) => p.status);
        const avgAge =
            activePlayers.length > 0
                ? Math.round(activePlayers.reduce((acc, p) => acc + p.age, 0) / activePlayers.length)
                : 0;

        // Teams
        const activeTeams = data.teams.filter((t) => t.status);
        const totalPlayersInTeams = activeTeams.reduce((acc, t) => acc + t.playerCount, 0);
        const avgPlayersPerTeam =
            activeTeams.length > 0 ? Math.round(totalPlayersInTeams / activeTeams.length) : 0;

        // Plans
        const pendingPlans = data.trainingPlans.filter((p) => p.status === "PENDING_APPROVAL");
        const approvedPlans = data.trainingPlans.filter((p) => p.status === "APPROVED");
        const aiPlans = data.trainingPlans.filter((p) => p.generatedByAi);
        const manualPlans = data.trainingPlans.filter((p) => !p.generatedByAi);

        return {
            users: {
                total: data.users.length,
                active: activeUsers.length,
                coaches: coachUsers.length,
                players: playerUsers.length,
                pendingCoaches: pendingCoaches.length,
            },
            coaches: {
                total: data.coaches.length,
                active: activeCoaches.length,
                avgExpYears,
            },
            players: {
                total: data.players.length,
                active: activePlayers.length,
                avgAge,
            },
            teams: {
                total: data.teams.length,
                active: activeTeams.length,
                totalPlayersInTeams,
                avgPlayersPerTeam,
            },
            plans: {
                total: data.trainingPlans.length,
                pending: pendingPlans.length,
                approved: approvedPlans.length,
                ai: aiPlans.length,
                manual: manualPlans.length,
            },
        };
    }, [data]);

    return { data, stats, loading, refresh: load };
};