import type { ProfileStateResponse } from "./profile-state.response";

export interface ProfileContextType {
    profileState: ProfileStateResponse | null;
    isLoading: boolean;
    activeTeamId: number | null;
    refreshProfile: () => Promise<void>;
    clearProfile: () => void;
    setActiveTeamId: (teamId: number | null) => void;
}