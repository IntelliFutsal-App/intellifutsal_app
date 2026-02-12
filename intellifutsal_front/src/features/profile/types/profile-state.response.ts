import type { Role } from "@features/auth";
import type { CoachResponse } from "@features/coach/types";
import type { PlayerResponse } from "@features/player/types";
import type { TeamResponse } from "@features/team/types";

export interface ProfileStateResponse {
    type: Role;
    profile: PlayerResponse | CoachResponse;
    teams: TeamResponse[];
}