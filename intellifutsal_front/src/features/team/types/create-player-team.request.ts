export interface CreatePlayerTeamRequest {
    entryDate: Date;
    exitDate?: Date;
    playerId: number;
    teamId: number;
}