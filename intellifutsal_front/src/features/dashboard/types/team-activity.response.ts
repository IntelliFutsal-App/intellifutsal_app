export interface TeamActivityResponse {
    teamId: number;
    teamName: string;
    activePlayers: number;
    playersWithProgressLast7Days: number;
    playersWithProgressLast28Days: number;
}