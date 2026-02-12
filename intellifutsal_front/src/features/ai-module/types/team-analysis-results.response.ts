export type TeamAnalysisResultsResponse = {
    generalAnalysis: string;
    lineupAdjustments: string;
    rawAnalysis: string;
    tacticalRecommendations: string[];
    teamStrengths: string[];
    teamWeaknesses: string[];
    trainingRecommendations: string[];
    totalPlayers: number;
    success: boolean;
};