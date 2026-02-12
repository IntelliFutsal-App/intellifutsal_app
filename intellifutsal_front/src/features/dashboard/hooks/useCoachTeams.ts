import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import type { CoachTeamResponse, TeamResponse } from "@features/team/types";
import { coachTeamService } from "@features/team/services/coachTeamService";
import { teamService } from "@features/team/services";
import type { Role } from "@features/auth";
import type { ProfileStateResponse } from "@features/profile/types";

type CoachTeamWithTeam = CoachTeamResponse & { team?: TeamResponse };

export const useCoachTeams = ({
    userRole,
    userPresent,
    activeTeamId,
    setActiveTeamId,
    profileState,
}: {
    userRole?: Role;
    userPresent: boolean;
    activeTeamId: number | null | undefined;
    setActiveTeamId: (id: number) => void;
    profileState: ProfileStateResponse | null;
}) => {
    const [coachTeamsData, setCoachTeamsData] = useState<CoachTeamWithTeam[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const coachId = useMemo(() => {
        const coachProfile = profileState?.profile;
        return coachProfile && "credentialId" in coachProfile ? coachProfile.id : null;
    }, [profileState?.profile]);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setIsLoading(true);

                if (!userPresent || userRole !== "COACH" || !coachId) {
                    if (!mounted) return;
                    setCoachTeamsData([]);
                    return;
                }

                const assignments = await coachTeamService.findByCoachId(coachId);

                const teams =
                    profileState?.teams?.length ? profileState.teams : await teamService.findMyTeams();

                const teamById = new Map<number, TeamResponse>(teams.map((t: TeamResponse) => [t.id, t]));

                const joined: CoachTeamWithTeam[] = assignments
                    .filter((a) => a.status)
                    .map((a) => ({ ...a, team: teamById.get(a.teamId) }))
                    .filter((j) => !!j.team);

                if (!mounted) return;

                setCoachTeamsData(joined);

                if (joined.length > 0) {
                    const availableIds = joined.map((j) => j.team!.id);
                    const stillValid = activeTeamId != null && availableIds.includes(activeTeamId);
                    if (!stillValid) setActiveTeamId(availableIds[0]);
                }
            } catch (e) {
                console.error("Error al cargar coachTeams/teams:", e);
                toast.error("Error al cargar tus equipos");
                if (mounted) setCoachTeamsData([]);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, [userPresent, userRole, coachId, profileState?.teams, activeTeamId, setActiveTeamId]);

    const activeTeams = useMemo(
        () => coachTeamsData.filter((ct) => ct.team?.status),
        [coachTeamsData]
    );

    const inactiveTeams = useMemo(
        () => coachTeamsData.filter((ct) => ct.team && !ct.team.status),
        [coachTeamsData]
    );

    return { coachTeamsData, isLoading, activeTeams, inactiveTeams };
};