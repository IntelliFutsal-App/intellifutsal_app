import { createCoachSchema, updateCoachSchema, updateStatusSchema } from "../../dto";
import { ConflictException, InternalServerException, NotFoundException } from "../../exceptions";
import { CoachResponse, CreateCoachRequest, OnboardingStatus, Role, UpdateCoachRequest, UpdateStatusRequest } from "../../interfaces";
import { CoachMapper } from "../../mappers";
import { Coach, Credential } from "../../models";
import { CoachRepository, CredentialRepository, PlayerRepository } from "../../repository";
import { LOGIN_URL } from "../../utilities/constants.utility";
import { COACH_NOT_FOUND, COACH_ROLE_NOT_VALID, COACH_SAVE_ERROR, COACH_UPDATE_ERROR, CREDENTIAL_ALREADY_ASSIGNED_COACH, CREDENTIAL_ALREADY_ASSIGNED_PLAYER, CREDENTIAL_NOT_FOUND, INTERNAL_SERVER_ERROR } from "../../utilities/messages.utility";
import { validateRequest } from "../../utilities/validations.utility";
import { ICoachService } from "../coach.service.interface";
import { MailService } from "./mail.service";


export class CoachService implements ICoachService {
    private readonly coachRepository: CoachRepository;
    private readonly credentialRepository: CredentialRepository;
    private readonly playerRepository: PlayerRepository;
    private readonly mailService: MailService;

    constructor() {
        this.coachRepository = new CoachRepository();
        this.credentialRepository = new CredentialRepository();
        this.playerRepository = new PlayerRepository();
        this.mailService = new MailService();
    }

    public findAll = async (): Promise<CoachResponse[]> => {
        const coaches = await this.coachRepository.findAll();

        return CoachMapper.toResponseList(coaches);
    }

    public findAllIncludingInactive = async (): Promise<CoachResponse[]> => {
        const coaches = await this.coachRepository.findAllIncludingInactive();

        return CoachMapper.toResponseList(coaches);
    }

    public findById = async (id: number): Promise<CoachResponse> => {
        const coach = await this.findCoachOrThrow(id);

        return CoachMapper.toResponse(coach);
    }

    public findByIdIncludingInactive = async (id: number): Promise<CoachResponse> => {
        const coach = await this.findCoachIncludingInactiveOrThrow(id);

        return CoachMapper.toResponse(coach);
    }

    public save = async (credentialId: number, createCoachRequest: CreateCoachRequest): Promise<CoachResponse> => {
        const validatedRequest = validateRequest(createCoachSchema, createCoachRequest);
        const credential = await this.findCredentialOrThrow(credentialId);

        const coach = CoachMapper.toEntity(validatedRequest, credential);
        const savedCoach = await this.coachRepository.save(coach);
        if (!savedCoach) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ COACH_SAVE_ERROR }`);

        await this.credentialRepository.updateOnboardingStatus(credential.id, OnboardingStatus.PROFILE_CREATED);

        this.sendWelcomeMailAsync(savedCoach, credential);

        return CoachMapper.toResponse(savedCoach);
    }

    public update = async (updateCoachRequest: UpdateCoachRequest): Promise<CoachResponse> => {
        await this.findCoachOrThrow(updateCoachRequest.id);
        const validatedRequest = validateRequest(updateCoachSchema, updateCoachRequest);
        
        const coach = CoachMapper.toUpdateEntity(validatedRequest);
        const updatedCoach = await this.coachRepository.update(coach);
        if (!updatedCoach) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ COACH_UPDATE_ERROR }`);
        
        return CoachMapper.toResponse(updatedCoach);
    }

    public delete = async (id: number): Promise<void> => {
        await this.findCoachOrThrow(id);
        await this.coachRepository.delete(id);
    }

    public updateStatus = async (id: number, updateStatusRequest: UpdateStatusRequest): Promise<CoachResponse> => {
        const coach = await this.findCoachIncludingInactiveOrThrow(id);
        const validatedRequest = validateRequest(updateStatusSchema, updateStatusRequest);

        coach.status = validatedRequest.status;
        const updatedCoach = await this.coachRepository.update(coach);
        if (!updatedCoach) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ COACH_UPDATE_ERROR }`);

        return CoachMapper.toResponse(updatedCoach);
    }

    private findCoachOrThrow = async (id: number): Promise<Coach> => {
        const coach = await this.coachRepository.findById(id);

        if (!coach) throw new NotFoundException(`${ COACH_NOT_FOUND }${ id }`);

        return coach;
    }

    private findCoachIncludingInactiveOrThrow = async (id: number): Promise<Coach> => {
        const coach = await this.coachRepository.findByIdIncludingInactive(id);

        if (!coach) throw new NotFoundException(`${ COACH_NOT_FOUND }${ id }`);

        return coach;
    }

    private findCredentialOrThrow = async (id: number): Promise<Credential> => {
        const credential = await this.credentialRepository.findById(id);
        if (!credential) throw new NotFoundException(`${ CREDENTIAL_NOT_FOUND }${ id }`);
        if (credential.role !== Role.COACH) throw new ConflictException(`${ COACH_ROLE_NOT_VALID }`);

        const isAlreadyAssignedToCoach = await this.coachRepository.isAssignedToCoach(id);
        if (isAlreadyAssignedToCoach) throw new ConflictException(CREDENTIAL_ALREADY_ASSIGNED_COACH);
        
        const isAlreadyAssignedToPlayer = await this.playerRepository.isAssignedToPlayer(id);
        if (isAlreadyAssignedToPlayer) throw new ConflictException(CREDENTIAL_ALREADY_ASSIGNED_PLAYER);
        
        return credential;
    }

    private sendWelcomeMailAsync = (coach: Coach, credential: Credential): void => {
        this.mailService.sendMailAsync(
            [credential.email], 
            "welcome", 
            {
                name: `${coach.firstName} ${coach.lastName}`,
                email: credential.email,
                registrationDate: credential.createdAt,
                loginUrl: LOGIN_URL,
            }
        );
    }
}
