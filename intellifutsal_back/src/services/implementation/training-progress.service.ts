import { CreateTrainingProgressRequest, TrainingProgressResponse, VerifyTrainingProgressRequest } from "../../interfaces";
import { TrainingProgressRepository, TrainingAssignmentRepository, PlayerRepository, CoachRepository } from "../../repository";
import { TrainingProgressMapper } from "../../mappers";
import { validateRequest } from "../../utilities/validations.utility";
import { createTrainingProgressSchema, verifyTrainingProgressSchema } from "../../dto";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../../exceptions";
import { COACH_NOT_FOUND_CREDENTIAL, PLAYER_NOT_FOUND_CREDENTIAL, TRAINING_ASSIGNMENT_NOT_FOUND, TRAINING_PROGRESS_NOT_ACTIVE_ASSIGNMENT, TRAINING_PROGRESS_NOT_ALLOWED_TO_CREATE_FOR_ANOTHER_PLAYER, TRAINING_PROGRESS_NOT_ALLOWED_TO_VERIFY_FOR_ANOTHER_COACH, TRAINING_PROGRESS_NOT_FOUND } from "../../utilities/messages.utility";
import { TrainingAssignmentStatus } from "../../interfaces/enums";
import { ITrainingProgressService } from "../training-progress.service.interface";


export class TrainingProgressService implements ITrainingProgressService {
    private readonly progressRepository: TrainingProgressRepository;
    private readonly assignmentRepository: TrainingAssignmentRepository;
    private readonly playerRepository: PlayerRepository;
    private readonly coachRepository: CoachRepository;

    constructor() {
        this.progressRepository = new TrainingProgressRepository();
        this.assignmentRepository = new TrainingAssignmentRepository();
        this.playerRepository = new PlayerRepository();
        this.coachRepository = new CoachRepository();
    }

    public findByAssignment = async (assignmentId: number): Promise<TrainingProgressResponse[]> => {
        const items = await this.progressRepository.findByAssignment(assignmentId);

        return TrainingProgressMapper.toResponseList(items);
    };

    public createByPlayer = async (credentialId: number, request: CreateTrainingProgressRequest): Promise<TrainingProgressResponse> => {
        const validated = validateRequest(createTrainingProgressSchema, request);

        const assignment = await this.assignmentRepository.findById(validated.trainingAssignmentId);
        if (!assignment) throw new NotFoundException(`${ TRAINING_ASSIGNMENT_NOT_FOUND }${ validated.trainingAssignmentId }`);

        const playerSaved = await this.playerRepository.findByCredentialId(credentialId);
        if (!playerSaved) throw new NotFoundException(`${ PLAYER_NOT_FOUND_CREDENTIAL }${ credentialId }`);
        
        if (!assignment.player || assignment.player.id !== playerSaved.id) throw new UnauthorizedException(TRAINING_PROGRESS_NOT_ALLOWED_TO_CREATE_FOR_ANOTHER_PLAYER);
        if (assignment.status !== TrainingAssignmentStatus.ACTIVE) throw new BadRequestException(TRAINING_PROGRESS_NOT_ACTIVE_ASSIGNMENT);

        const player = assignment.player;
        const entity = TrainingProgressMapper.toEntityByPlayer(validated, assignment, player);
        const saved = await this.progressRepository.save(entity);

        return TrainingProgressMapper.toResponse(saved);
    };

    public verifyByCoach = async (credentialId: number, progressId: number, request: VerifyTrainingProgressRequest): Promise<TrainingProgressResponse> => {
        const validated = validateRequest(verifyTrainingProgressSchema, request);

        const progress = await this.progressRepository.findById(progressId);
        if (!progress) throw new NotFoundException(`${ TRAINING_PROGRESS_NOT_FOUND }${ progressId }`);

        const coachSaved = await this.coachRepository.findByCredentialId(credentialId);
        if (!coachSaved) throw new NotFoundException(`${ COACH_NOT_FOUND_CREDENTIAL }${ credentialId }`);

        const assignment = progress.trainingAssignment;
        if (!assignment.assignedByCoach || assignment.assignedByCoach.id !== coachSaved.id) throw new UnauthorizedException(TRAINING_PROGRESS_NOT_ALLOWED_TO_VERIFY_FOR_ANOTHER_COACH);

        const updated = await this.progressRepository.verify(progress.id, validated.verificationComment);
        if (updated && updated.completionPercentage === 100) {
            assignment.status = TrainingAssignmentStatus.COMPLETED;
            assignment.endDate = new Date();
            await this.assignmentRepository.update(assignment);
        }

        return TrainingProgressMapper.toResponse(updated!);
    };
}