export interface PlayerTeamResponse {
    id: number;
    entryDate: Date;
    exitDate?: Date;
    playerId: number;
    teamId: number;
    status: boolean;
}