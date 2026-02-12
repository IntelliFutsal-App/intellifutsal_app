import { useProfile } from "./useProfile";

export const useActiveTeam = () => {
    const { profileState, activeTeamId, setActiveTeamId } = useProfile();

    const activeTeam = profileState?.teams.find(t => t.id === activeTeamId) ?? null;

    return { activeTeamId, activeTeam, setActiveTeamId };
};