import { BadRequestException, InternalServerException, NotFoundException, UnauthorizedException } from "../../exceptions";
import { CreateTrainingPlanRequest, TrainingPlanResponse, UpdateTrainingPlanStatusRequest } from "../../interfaces";
import { TrainingPlanRepository, CoachRepository, ClusterRepository } from "../../repository";
import { TrainingPlanMapper } from "../../mappers";
import { COACH_NOT_FOUND_CREDENTIAL, INTERNAL_SERVER_ERROR, PLAYER_NOT_FOUND, TEAM_NOT_FOUND, TRAINING_PLAN_NOT_FOUND, TRAINING_PLAN_NOT_PENDING_APPROVAL, TRAINING_PLAN_SAVE_ERROR } from "../../utilities/messages.utility";
import { validateRequest } from "../../utilities/validations.utility";
import { createTrainingPlanSchema } from "../../dto";
import { TrainingPlanStatus } from "../../interfaces/enums";
import { PlayerRepository, TeamRepository } from "../../repository";
import { AiApiService } from "./ai-api.service";
import { ITrainingPlanService } from "../training-plan.service.interface";


export class TrainingPlanService implements ITrainingPlanService {
    private readonly trainingPlanRepository: TrainingPlanRepository;
    private readonly coachRepository: CoachRepository;
    private readonly clusterRepository: ClusterRepository;
    private readonly playerRepository: PlayerRepository;
    private readonly teamRepository: TeamRepository;
    private readonly aiApiService: AiApiService;

    constructor() {
        this.trainingPlanRepository = new TrainingPlanRepository();
        this.coachRepository = new CoachRepository();
        this.clusterRepository = new ClusterRepository();
        this.playerRepository = new PlayerRepository();
        this.teamRepository = new TeamRepository();
        this.aiApiService = new AiApiService();
    }

    public findAll = async (): Promise<TrainingPlanResponse[]> => {
        const plans = await this.trainingPlanRepository.findAll();

        return TrainingPlanMapper.toResponseList(plans);
    };

    public findById = async (id: number): Promise<TrainingPlanResponse> => {
        const plan = await this.trainingPlanRepository.findById(id);
        if (!plan) throw new NotFoundException(`${ TRAINING_PLAN_NOT_FOUND }${ id }`);

        return TrainingPlanMapper.toResponse(plan);
    };

    public createManual = async (credentialId: number, createRequest: CreateTrainingPlanRequest): Promise<TrainingPlanResponse> => {
        const validated = validateRequest(createTrainingPlanSchema, createRequest);

        const coach = await this.coachRepository.findByCredentialId(credentialId);
        if (!coach) throw new UnauthorizedException(`${ COACH_NOT_FOUND_CREDENTIAL }${ credentialId }`);

        let cluster = undefined;
        if (validated.clusterId) cluster = await this.clusterRepository.findById(validated.clusterId);

        const entity = TrainingPlanMapper.toEntityManual(validated, coach, cluster!);
        const saved = await this.trainingPlanRepository.save(entity);
        if (!saved) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ TRAINING_PLAN_SAVE_ERROR }`);

        return TrainingPlanMapper.toResponse(saved);
    };

    public createFromAiForPlayer = async (playerId: number, credentialId: number): Promise<TrainingPlanResponse> => {
        const player = await this.playerRepository.findById(playerId);
        if (!player) throw new NotFoundException(`${ PLAYER_NOT_FOUND }${ playerId }`);

        const coach = await this.coachRepository.findByCredentialId(credentialId);
        if (!coach) throw new UnauthorizedException(`${ COACH_NOT_FOUND_CREDENTIAL }${ credentialId }`);

        const aiResponse = await this.aiApiService.analyzePrediction(playerId);
        const entity = TrainingPlanMapper.fromAiPlayerAnalyze(`${player.firstName} ${player.lastName}`, aiResponse, coach);

        const saved = await this.trainingPlanRepository.save(entity);
        if (!saved) throw new InternalServerException(`${INTERNAL_SERVER_ERROR}${TRAINING_PLAN_SAVE_ERROR}`);

        return TrainingPlanMapper.toResponse(saved);
    };

    public createFromAiForTeam = async (teamId: number, credentialId: number): Promise<TrainingPlanResponse> => {
        const team = await this.teamRepository.findById(teamId);
        if (!team) throw new NotFoundException(`${ TEAM_NOT_FOUND }${ teamId }`);

        const coach = await this.coachRepository.findByCredentialId(credentialId);
        if (!coach) throw new UnauthorizedException(`${ COACH_NOT_FOUND_CREDENTIAL }${ credentialId }`);

        const aiResponse = await this.aiApiService.analyzeTeamPrediction(teamId);
        const entity = TrainingPlanMapper.fromAiTeamAnalysis(team.name, aiResponse.teamAnalysis, coach);

        const saved = await this.trainingPlanRepository.save(entity);
        if (!saved) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ TRAINING_PLAN_SAVE_ERROR }`);

        return TrainingPlanMapper.toResponse(saved);
    };

    public approve = async (id: number, updateRequest: UpdateTrainingPlanStatusRequest): Promise<TrainingPlanResponse> => {
        const plan = await this.trainingPlanRepository.findById(id);
        if (!plan) throw new NotFoundException(`${ TRAINING_PLAN_NOT_FOUND }${ id }`);
        if (plan.status !== TrainingPlanStatus.PENDING_APPROVAL) throw new BadRequestException(`${ TRAINING_PLAN_NOT_PENDING_APPROVAL }${ plan.status }`);

        const updated = await this.trainingPlanRepository.updateStatus(plan.id, TrainingPlanStatus.APPROVED, updateRequest.approvalComment);

        return TrainingPlanMapper.toResponse(updated!);
    };

    public reject = async (id: number, updateRequest: UpdateTrainingPlanStatusRequest): Promise<TrainingPlanResponse> => {
        const plan = await this.trainingPlanRepository.findById(id);
        if (!plan) throw new NotFoundException(`${ TRAINING_PLAN_NOT_FOUND }${ id }`);
        if (plan.status !== TrainingPlanStatus.PENDING_APPROVAL) throw new BadRequestException(`${ TRAINING_PLAN_NOT_PENDING_APPROVAL }${ plan.status }`);

        const updated = await this.trainingPlanRepository.updateStatus(plan.id, TrainingPlanStatus.REJECTED, updateRequest.approvalComment);

        return TrainingPlanMapper.toResponse(updated!);
    };

    public archive = async (id: number): Promise<TrainingPlanResponse> => {
        const plan = await this.trainingPlanRepository.findById(id);
        if (!plan) throw new NotFoundException(`${ TRAINING_PLAN_NOT_FOUND }${ id }`);

        const updated = await this.trainingPlanRepository.updateStatus(plan.id, TrainingPlanStatus.ARCHIVED);

        return TrainingPlanMapper.toResponse(updated!);
    };
}