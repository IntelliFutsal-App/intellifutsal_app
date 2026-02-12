import { TrainingPlanResponse, CreateTrainingPlanRequest, AiApiAnalyzeResponse } from "../interfaces";
import { TrainingPlan, Coach, Cluster } from "../models";
import { TrainingPlanStatus } from "../interfaces/enums";
import { AiApiFullRecommendationsResponse, PlayerPhysicalResultsResponse, TeamAnalysisResultsResponse } from "../interfaces";


export class TrainingPlanMapper {
    static toResponse = (trainingPlan: TrainingPlan): TrainingPlanResponse => {
        const trainingPlanResponse = new TrainingPlanResponse();

        trainingPlanResponse.id = trainingPlan.id;
        trainingPlanResponse.title = trainingPlan.title;
        trainingPlanResponse.description = trainingPlan.description;
        trainingPlanResponse.createdByCoachId = trainingPlan.createdByCoach?.id;
        trainingPlanResponse.generatedByAi = trainingPlan.generatedByAi;
        trainingPlanResponse.difficulty = trainingPlan.difficulty;
        trainingPlanResponse.durationMinutes = trainingPlan.durationMinutes;
        trainingPlanResponse.focusArea = trainingPlan.focusArea;
        trainingPlanResponse.clusterId = trainingPlan.cluster?.id;
        trainingPlanResponse.status = trainingPlan.status;
        trainingPlanResponse.approvalComment = trainingPlan.approvalComment;
        trainingPlanResponse.createdAt = trainingPlan.createdAt;
        if (trainingPlan.updatedAt) trainingPlanResponse.updatedAt = trainingPlan.updatedAt;
        trainingPlanResponse.approvedAt = trainingPlan.approvedAt;
        trainingPlanResponse.rejectedAt = trainingPlan.rejectedAt;

        return trainingPlanResponse;
    };

    static toResponseList = (trainingPlans: TrainingPlan[]): TrainingPlanResponse[] => {
        return trainingPlans.map(this.toResponse);
    };

    static toEntityManual = (createTrainingPlanRequest: CreateTrainingPlanRequest, coach?: Coach, cluster?: Cluster): TrainingPlan => {
        const trainingPlan = new TrainingPlan();

        trainingPlan.title = createTrainingPlanRequest.title;
        trainingPlan.description = createTrainingPlanRequest.description;
        trainingPlan.createdByCoach = coach;
        trainingPlan.generatedByAi = false;
        trainingPlan.difficulty = createTrainingPlanRequest.difficulty;
        trainingPlan.durationMinutes = createTrainingPlanRequest.durationMinutes;
        trainingPlan.focusArea = createTrainingPlanRequest.focusArea;
        trainingPlan.cluster = cluster;
        trainingPlan.status = TrainingPlanStatus.PENDING_APPROVAL;

        return trainingPlan;
    };

    static fromAiPlayerFullRecommendations = (playerName: string, aiResponse: AiApiFullRecommendationsResponse, coach?: Coach): TrainingPlan => {
        const trainingPlan = new TrainingPlan();

        trainingPlan.title = `Plan IA para ${playerName} - ${aiResponse.position.clusterName}`;
        trainingPlan.description =
            `Descripción física: ${aiResponse.physicalCondition.description}\n\n` +
            `Recomendaciones específicas:\n- ` +
            aiResponse.specificRecommendations.join("\n- ");
        trainingPlan.createdByCoach = coach;
        trainingPlan.generatedByAi = true;
        trainingPlan.difficulty = "MEDIUM";
        trainingPlan.durationMinutes = 60;
        trainingPlan.focusArea = "physical & positional";
        trainingPlan.status = TrainingPlanStatus.PENDING_APPROVAL;

        return trainingPlan;
    };

    static fromAiPlayerPhysical = (playerName: string, aiResponse: PlayerPhysicalResultsResponse, coach?: Coach): TrainingPlan => {
        const trainingPlan = new TrainingPlan();

        trainingPlan.title = `Plan físico IA para ${playerName} - ${aiResponse.clusterName}`;
        trainingPlan.description =
            `Descripción: ${aiResponse.description}\n\n` +
            `Fortalezas:\n- ${aiResponse.strengths.join("\n- ")}\n\n` +
            `Áreas de desarrollo:\n- ${aiResponse.developmentAreas.join("\n- ")}\n\n` +
            `Recomendaciones de entrenamiento:\n- ${aiResponse.trainingRecommendations.join("\n- ")}`;
        trainingPlan.createdByCoach = coach;
        trainingPlan.generatedByAi = true;
        trainingPlan.difficulty = "MEDIUM";
        trainingPlan.durationMinutes = 60;
        trainingPlan.focusArea = "physical";
        trainingPlan.status = TrainingPlanStatus.PENDING_APPROVAL;

        return trainingPlan;
    };

    static fromAiTeamAnalysis = (teamName: string, aiResponse: TeamAnalysisResultsResponse, coach?: Coach): TrainingPlan => {
        const trainingPlan = new TrainingPlan();

        trainingPlan.title = `Plan táctico IA - ${teamName}`;
        trainingPlan.description =
            `Análisis general:\n${aiResponse.generalAnalysis}\n\n` +
            `Fortalezas del equipo:\n- ${aiResponse.teamStrengths.join("\n- ")}\n\n` +
            `Debilidades del equipo:\n- ${aiResponse.teamWeaknesses.join("\n- ")}\n\n` +
            `Ajustes de alineación:\n- ${aiResponse.lineupAdjustments}\n\n` +
            `Recomendaciones de entrenamiento:\n- ${aiResponse.trainingRecommendations.join("\n- ")}`;
        trainingPlan.createdByCoach = coach;
        trainingPlan.generatedByAi = true;
        trainingPlan.difficulty = "MEDIUM";
        trainingPlan.durationMinutes = 90;
        trainingPlan.focusArea = "team-tactical";
        trainingPlan.status = TrainingPlanStatus.PENDING_APPROVAL;

        return trainingPlan;
    };

    static fromAiPlayerAnalyze = (playerName: string, aiResponse: AiApiAnalyzeResponse, coach?: Coach): TrainingPlan => {
        const trainingPlan = new TrainingPlan();

        const strengths = Array.isArray(aiResponse.strengths)
            ? aiResponse.strengths
            : aiResponse.strengths
            ? [String(aiResponse.strengths)]
            : [];

        const weaknesses = Array.isArray(aiResponse.weaknesses)
            ? aiResponse.weaknesses
            : aiResponse.weaknesses
            ? [String(aiResponse.weaknesses)]
            : [];

        const trainingRecommendations = Array.isArray(aiResponse.trainingRecommendations)
            ? aiResponse.trainingRecommendations
            : aiResponse.trainingRecommendations
            ? [String(aiResponse.trainingRecommendations)]
            : [];

        trainingPlan.title = `Plan IA avanzado para ${playerName} - ${aiResponse.physicalName}`;

        trainingPlan.description =
            `Análisis general:\n${aiResponse.generalAnalysis}\n\n` +
            `Perfil de rendimiento:\n${aiResponse.performanceProfile}\n\n` +
            `Fortalezas:\n- ${strengths.join("\n- ")}\n\n` +
            `Debilidades:\n- ${weaknesses.join("\n- ")}\n\n` +
            `Recomendaciones de entrenamiento:\n- ${trainingRecommendations.join("\n- ")}\n\n` +
            `Análisis detallado del modelo:\n${aiResponse.analysis}`;

        trainingPlan.createdByCoach = coach;
        trainingPlan.generatedByAi = true;
        trainingPlan.difficulty = "MEDIUM";
        trainingPlan.durationMinutes = 60;
        trainingPlan.focusArea = "physical & tactical";
        trainingPlan.status = TrainingPlanStatus.PENDING_APPROVAL;

        return trainingPlan;
    };
}