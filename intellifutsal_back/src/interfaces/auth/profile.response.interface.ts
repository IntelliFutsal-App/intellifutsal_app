import { CoachResponse } from "../coach";
import { Role } from "../enums";
import { PlayerResponse } from "../player";
import { TeamResponse } from "../team";

export class ProfileStateResponse {
    type!: Role;
    profile!: PlayerResponse | CoachResponse;
    teams!: TeamResponse[];
}