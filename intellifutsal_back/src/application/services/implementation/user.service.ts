import { approveCoachSchema, createUserSchema, updateStatusSchema, updateUserSchema } from "../../dto"; 
import { BadRequestException, ConflictException, InternalServerException, NotFoundException } from '../../../domain/exceptions';
import { ApproveCoachRequest, CoachResponse, CreateUserRequest, OnboardingStatus, PlayerResponse, UpdateStatusRequest, UpdateUserRequest, UserResponse } from '../../../domain/interfaces';
import { CoachMapper, PlayerMapper, UserMapper } from '../../mappers';
import { Credential } from '../../../infrastructure/models';
import { CoachRepository, CoachTeamRepository, CredentialRepository, PlayerRepository } from '../../../infrastructure/repository';
import { COACH_NOT_FOUND, CREDENTIAL_NOT_FOUND, INTERNAL_SERVER_ERROR, REGISTRATION_NOT_COMPLETED, ROLE_NOT_SUPPORTED, USER_EMAIL_ALREADY_EXISTS, USER_EMAIL_NOT_FOUND, USER_NOT_FOUND, USER_SAVE_ERROR, USER_UPDATE_ERROR } from '../../../core/utilities/messages.utility';
import { validateRequest } from '../../../core/utilities/validations.utility';
import { IUserService } from "../user.service.interface";
import * as bcrypt from 'bcryptjs';


export class UserService implements IUserService {
    private readonly credentialRepository: CredentialRepository;
    private readonly playerRepository: PlayerRepository;
    private readonly coachRepository: CoachRepository;
    private readonly coachTeamRepository: CoachTeamRepository;

    constructor() {
        this.credentialRepository = new CredentialRepository();
        this.playerRepository = new PlayerRepository();
        this.coachRepository = new CoachRepository();
        this.coachTeamRepository = new CoachTeamRepository();
    }

    public findAll = async (): Promise<UserResponse[]> => {
        const users = await this.credentialRepository.findAll();

        return UserMapper.toResponseList(users);
    }

    public findAllIncludingInactive = async (): Promise<UserResponse[]> => {
        const users = await this.credentialRepository.findAllIncludingInactive();

        return UserMapper.toResponseList(users);
    }

    public findById = async (id: number): Promise<UserResponse> => {
        const user = await this.findUserOrThrow(id);

        return UserMapper.toResponse(user);
    }

    public findByIdIncludingInactive = async (id: number): Promise<UserResponse> => {
        const user = await this.findUserIncludingInactiveOrThrow(id);

        return UserMapper.toResponse(user);
    }

    public findByEmail = async (email: string): Promise<UserResponse> => {
        const user = await this.findUserByEmailOrThrow(email);

        return UserMapper.toResponse(user);
    }

    public findRoleEntityById = async (id: number): Promise<CoachResponse | PlayerResponse> => {
        const coach = await this.coachRepository.findByCredentialId(id);
        if (coach) return CoachMapper.toResponse(coach);

        const player = await this.playerRepository.findByCredentialId(id);
        if (player) return PlayerMapper.toResponse(player);

        throw new BadRequestException(`${ REGISTRATION_NOT_COMPLETED }`);
    }

    public save = async (createUserRequest: CreateUserRequest): Promise<UserResponse> => {
        await this.ensureEmailIsUnique(createUserRequest.email);
        const validatedRequest = validateRequest(createUserSchema, createUserRequest);
        
        const passwordHashed = await bcrypt.hash(validatedRequest.password, 10);
        const user = UserMapper.toEntity(validatedRequest, passwordHashed);
        const savedUser = await this.credentialRepository.save(user);
        if (!savedUser) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ USER_SAVE_ERROR }`);
        
        return UserMapper.toResponse(savedUser);
    }

    public update = async (updateUserRequest: UpdateUserRequest): Promise<UserResponse> => {
        const currentUser = await this.findUserOrThrow(updateUserRequest.id);
        const validatedRequest = validateRequest(updateUserSchema, updateUserRequest);

        if (validatedRequest.email && validatedRequest.email !== currentUser.email) await this.ensureEmailIsUnique(validatedRequest.email, currentUser.id);
        
        const passwordHashed = await this.updatePassword(validatedRequest, currentUser);
        const user = UserMapper.toEntityUpdate(validatedRequest, passwordHashed);
        const updatedUser = await this.credentialRepository.update(user);
        if (!updatedUser) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ USER_UPDATE_ERROR }`);
        
        return UserMapper.toResponse(updatedUser);
    }

    public delete = async (id: number): Promise<void> => {
        await this.findUserOrThrow(id);
        await this.credentialRepository.delete(id);
    }

    public updateStatus = async (id: number, updateStatusRequest: UpdateStatusRequest): Promise<UserResponse> => {
        const user = await this.findUserIncludingInactiveOrThrow(id);
        const validatedRequest = validateRequest(updateStatusSchema, updateStatusRequest);

        user.status = validatedRequest.status;
        const updatedUser = await this.credentialRepository.update(user);
        if (!updatedUser) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ USER_UPDATE_ERROR }`);
        
        return UserMapper.toResponse(updatedUser);
    }

    public approveCoach = async (credentialId: number, request: ApproveCoachRequest): Promise<UserResponse> => {
        const validated = validateRequest(approveCoachSchema, request);

        const credential = await this.credentialRepository.findById(credentialId);
        if (!credential) throw new NotFoundException(`${ CREDENTIAL_NOT_FOUND }${ credentialId }`);
        if (credential.role !== "ADMIN") throw new BadRequestException(ROLE_NOT_SUPPORTED);

        const coachCredential = await this.credentialRepository.findById(validated.coachCredentialId);
        if (!coachCredential) throw new NotFoundException(`${ COACH_NOT_FOUND }${ validated.coachCredentialId }`);
        const coach = await this.coachRepository.findByCredentialId(coachCredential.id);
        if (!coach) throw new NotFoundException(`${ COACH_NOT_FOUND }${ validated.coachCredentialId }`);

        if (validated.approved === true) {
            const hasActiveTeam = await this.coachTeamRepository.existsActiveTeamForCoach(coach.id);
            const next: OnboardingStatus = hasActiveTeam
                ? ("ACTIVE" as OnboardingStatus)
                : ("PROFILE_CREATED" as OnboardingStatus);

            await this.credentialRepository.updateOnboardingStatus(coachCredential.id, next);
        } else {
            await this.credentialRepository.updateOnboardingStatus(
                coachCredential.id,
                ("COACH_PENDING_APPROVAL" as OnboardingStatus),
            );
        }

        const updated = await this.credentialRepository.findById(coachCredential.id);
        if (!updated) throw new NotFoundException(`${ COACH_NOT_FOUND }${ coachCredential.id }`);

        return UserMapper.toResponse(updated);
    }

    private findUserOrThrow = async (id: number): Promise<Credential> => {
        const user = await this.credentialRepository.findById(id);
        
        if (!user) throw new NotFoundException(`${ USER_NOT_FOUND }${ id }`);
        
        return user;
    }

    private findUserIncludingInactiveOrThrow = async (id: number): Promise<Credential> => {
        const user = await this.credentialRepository.findByIdIncludingInactive(id);

        if (!user) throw new NotFoundException(`${ USER_NOT_FOUND }${ id }`);

        return user;
    }

    private findUserByEmailOrThrow = async (email: string): Promise<Credential> => {
        const user = await this.credentialRepository.findByEmail(email);
        
        if (!user) throw new NotFoundException(`${ USER_EMAIL_NOT_FOUND }${ email }`);
        
        return user;
    }

    private ensureEmailIsUnique = async (email: string, excludeId?: number): Promise<void> => {
        const existingEmail = await this.credentialRepository.findByEmailExcludingId(email, excludeId);
        
        if (existingEmail) throw new ConflictException(`${ USER_EMAIL_ALREADY_EXISTS }${ email }`);
    }

    private updatePassword = async (validatedRequest: UpdateUserRequest, user: Credential): Promise<string> => {
        if (validatedRequest.password !== undefined) return await bcrypt.hash(validatedRequest.password, 10);

        return user.password;
    }
}