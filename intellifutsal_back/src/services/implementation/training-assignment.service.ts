import { CreateTrainingAssignmentRequest, TrainingAssignmentResponse } from "../../interfaces";
import { TrainingAssignmentRepository, TrainingPlanRepository, PlayerRepository, TeamRepository, CoachRepository } from "../../repository";
import { TrainingAssignmentMapper } from "../../mappers";
import { validateRequest } from "../../utilities/validations.utility";
import { createTrainingAssignmentSchema } from "../../dto";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../../exceptions";
import { TrainingAssignmentStatus } from "../../interfaces/enums";
import { TRAINING_ASSIGNMENT_NOT_FOUND, TRAINING_PLAN_NOT_FOUND, PLAYER_NOT_FOUND, TEAM_NOT_FOUND, COACH_NOT_FOUND_CREDENTIAL, PLAYER_NOT_FOUND_CREDENTIAL } from "../../utilities/messages.utility";
import { ITrainingAssignmentService } from "../training-assignment.service.interface";


export class TrainingAssignmentService implements ITrainingAssignmentService {
    private readonly assignmentRepository: TrainingAssignmentRepository;
    private readonly trainingPlanRepository: TrainingPlanRepository;
    private readonly playerRepository: PlayerRepository;
    private readonly teamRepository: TeamRepository;
    private readonly coachRepository: CoachRepository;

    constructor() {
        this.assignmentRepository = new TrainingAssignmentRepository();
        this.trainingPlanRepository = new TrainingPlanRepository();
        this.playerRepository = new PlayerRepository();
        this.teamRepository = new TeamRepository();
        this.coachRepository = new CoachRepository();
    }

    public findByPlayer = async (credentialId: number): Promise<TrainingAssignmentResponse[]> => {
        const player = await this.playerRepository.findByCredentialId(credentialId);
        if (!player) throw new NotFoundException(`${ PLAYER_NOT_FOUND_CREDENTIAL }${ credentialId }`);

        const assignments = await this.assignmentRepository.findByPlayer(player.id);

        return TrainingAssignmentMapper.toResponseList(assignments);
    };

    public findByTeam = async (teamId: number): Promise<TrainingAssignmentResponse[]> => {
        const assignments = await this.assignmentRepository.findByTeam(teamId);

        return TrainingAssignmentMapper.toResponseList(assignments);
    };

    public findById = async (id: number): Promise<TrainingAssignmentResponse> => {
        const assignment = await this.assignmentRepository.findById(id);
        if (!assignment) throw new NotFoundException(`${ TRAINING_ASSIGNMENT_NOT_FOUND }${ id }`);

        return TrainingAssignmentMapper.toResponse(assignment);
    };

    public create = async (credentialId: number, request: CreateTrainingAssignmentRequest): Promise<TrainingAssignmentResponse> => {
        const validated = validateRequest(createTrainingAssignmentSchema, request);

        const plan = await this.trainingPlanRepository.findById(validated.trainingPlanId);
        if (!plan) throw new NotFoundException(`${ TRAINING_PLAN_NOT_FOUND }${ validated.trainingPlanId }`);

        const coach = await this.coachRepository.findByCredentialId(credentialId);
        if (!coach) throw new BadRequestException(`${ COACH_NOT_FOUND_CREDENTIAL }${ credentialId }`);

        let player = undefined;
        if (validated.playerId) {
            player = await this.playerRepository.findById(validated.playerId);
            if (!player) throw new NotFoundException(`${ PLAYER_NOT_FOUND }${ validated.playerId }`);
        }

        let team = undefined;
        if (validated.teamId) {
            team = await this.teamRepository.findById(validated.teamId);
            if (!team) throw new NotFoundException(`${ TEAM_NOT_FOUND }${ validated.teamId }`);
        }

        const entity = TrainingAssignmentMapper.toEntity(validated, plan, coach, player, team);
        const saved = await this.assignmentRepository.save(entity);

        return TrainingAssignmentMapper.toResponse(saved);
    };

    public activate = async (id: number): Promise<TrainingAssignmentResponse> => {
        const assignment = await this.assignmentRepository.findById(id);
        if (!assignment) throw new NotFoundException(`${ TRAINING_ASSIGNMENT_NOT_FOUND }${ id }`);

        const updated = await this.assignmentRepository.updateStatus(assignment.id, TrainingAssignmentStatus.ACTIVE);

        return TrainingAssignmentMapper.toResponse(updated!);
    };

    public cancel = async (id: number): Promise<TrainingAssignmentResponse> => {
        const assignment = await this.assignmentRepository.findById(id);
        if (!assignment) throw new NotFoundException(`${ TRAINING_ASSIGNMENT_NOT_FOUND }${ id }`);

        const updated = await this.assignmentRepository.updateStatus(assignment.id, TrainingAssignmentStatus.CANCELLED);

        return TrainingAssignmentMapper.toResponse(updated!);
    };
}