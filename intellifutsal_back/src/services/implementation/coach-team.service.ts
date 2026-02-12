import { createCoachTeamSchema, updateCoachTeamSchema, updateStatusSchema } from "../../dto";
import { BadRequestException, ConflictException, InternalServerException, NotFoundException } from "../../exceptions";
import { CoachTeamResponse, CreateCoachTeamRequest, OnboardingStatus, UpdateCoachTeamRequest, UpdateStatusRequest } from "../../interfaces";
import { CoachTeamMapper } from "../../mappers";
import { Coach, CoachTeam, Credential, Team } from "../../models";
import { CoachRepository, CredentialRepository, TeamRepository } from "../../repository";
import { CoachTeamRepository } from '../../repository/coach-team.repository';
import { COACH_NOT_FOUND, COACH_NOT_FOUND_CREDENTIAL, COACH_TEAM_ALREADY_ASSOCIATED, COACH_TEAM_ASSIGNMENT_DATE_FUTURE_ERROR, COACH_TEAM_END_DATE_BEFORE_ASSIGNMENT_ERROR, COACH_TEAM_END_DATE_FUTURE_ERROR, COACH_TEAM_NOT_FOUND, COACH_TEAM_SAVE_ERROR, COACH_TEAM_UPDATE_ERROR, CREDENTIAL_NOT_FOUND, INTERNAL_SERVER_ERROR, TEAM_NOT_FOUND } from "../../utilities/messages.utility";
import { validateRequest } from "../../utilities/validations.utility";
import { ICoachTeamService } from "../coach-team.service.interface";


export class CoachTeamService implements ICoachTeamService {
    private readonly coachTeamRepository: CoachTeamRepository;
    private readonly coachRepository: CoachRepository;
    private readonly teamRepository: TeamRepository;
    private readonly credentialRepository: CredentialRepository;

    constructor() {
        this.coachTeamRepository = new CoachTeamRepository();
        this.coachRepository = new CoachRepository();
        this.teamRepository = new TeamRepository();
        this.credentialRepository = new CredentialRepository();
    }

    public findAll = async (): Promise<CoachTeamResponse[]> => {
        const coachTeams = await this.coachTeamRepository.findAll();
        
        return CoachTeamMapper.toResponseList(coachTeams);
    }

    public findAllIncludingInactive = async (): Promise<CoachTeamResponse[]> => {
        const coachTeams = await this.coachTeamRepository.findAllIncludingInactive();

        return CoachTeamMapper.toResponseList(coachTeams);
    }

    public findById = async (id: number): Promise<CoachTeamResponse> => {
        const coachTeam = await this.findCoachTeamOrThrow(id);

        return CoachTeamMapper.toResponse(coachTeam);
    }

    public findByIdIncludingInactive = async (id: number): Promise<CoachTeamResponse> => {
        const coachTeam = await this.findCoachTeamIncludingInactiveOrThrow(id);

        return CoachTeamMapper.toResponse(coachTeam);
    }

    public findByCoachId = async (coachId: number): Promise<CoachTeamResponse[]> => {
        const coachTeams = await this.coachTeamRepository.findByCoachId(coachId);
        
        return CoachTeamMapper.toResponseList(coachTeams);
    }

    public save = async (credentialId: number, createCoachTeamRequest: CreateCoachTeamRequest): Promise<CoachTeamResponse> => {
        const validatedRequest = validateRequest(createCoachTeamSchema, createCoachTeamRequest);
        this.validateDates(validatedRequest.assignmentDate, validatedRequest.endDate);
        
        const coach = await this.findCoachOrThrow(credentialId);
        const team = await this.findTeamOrThrow(validatedRequest.teamId);
        await this.validateDuplicate(coach.id, validatedRequest.teamId);

        const coachTeam = CoachTeamMapper.toEntity(validatedRequest, coach, team);
        const savedCoachTeam = await this.coachTeamRepository.save(coachTeam);
        if (!savedCoachTeam) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ COACH_TEAM_SAVE_ERROR }`);

        await this.findCredentialOrThrow(credentialId);
        await this.credentialRepository.updateOnboardingStatus(credentialId, OnboardingStatus.ACTIVE);
        
        return CoachTeamMapper.toResponse(savedCoachTeam);
    }

    public update = async (updateCoachTeamRequest: UpdateCoachTeamRequest): Promise<CoachTeamResponse> => {
        const coachTeam = await this.findCoachTeamOrThrow(updateCoachTeamRequest.id);
        const validatedRequest = validateRequest(updateCoachTeamSchema, updateCoachTeamRequest);
        
        const assignmentDate = validatedRequest.assignmentDate || coachTeam.assignmentDate;
        const endDate = validatedRequest.endDate === undefined ? coachTeam.endDate : validatedRequest.endDate;
        this.validateDates(assignmentDate, endDate);

        const coach = await this.getUpdatedCoach(validatedRequest.coachId, coachTeam.coach);
        const team = await this.getUpdatedTeam(validatedRequest.teamId, coachTeam.team);
        if ((validatedRequest.coachId && validatedRequest.coachId !== coachTeam.coach.id) || (validatedRequest.teamId && validatedRequest.teamId !== coachTeam.team.id)) 
        await this.validateDuplicate(validatedRequest.coachId || coachTeam.coach.id, validatedRequest.teamId || coachTeam.team.id, coachTeam.id);

        const coachTeamEntity = CoachTeamMapper.toUpdateEntity(validatedRequest, coach, team);
        const updatedCoachTeam = await this.coachTeamRepository.update(coachTeamEntity);
        if (!updatedCoachTeam) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ COACH_TEAM_UPDATE_ERROR }`);
        
        return CoachTeamMapper.toResponse(updatedCoachTeam);
    }

    public delete = async (id: number): Promise<void> => {
        const coachTeam = await this.findCoachTeamIncludingInactiveOrThrow(id);

        await this.coachTeamRepository.delete(id);

        const coachCredentialId = await this.findCredentialIdByCoachOrThrow(coachTeam.coach.id);

        const stillHasActive = await this.coachTeamRepository.existsActiveTeamForCoach(coachTeam.coach.id, id);
        if (!stillHasActive) await this.credentialRepository.updateOnboardingStatus(coachCredentialId, OnboardingStatus.TEAM_PENDING);
    };

    public updateStatus = async (id: number, updateStatusRequest: UpdateStatusRequest): Promise<CoachTeamResponse> => {
        const coachTeam = await this.findCoachTeamIncludingInactiveOrThrow(id);
        const validatedRequest = validateRequest(updateStatusSchema, updateStatusRequest);

        coachTeam.status = validatedRequest.status;
        const updatedCoachTeam = await this.coachTeamRepository.update(coachTeam);
        if (!updatedCoachTeam) throw new InternalServerException(`${ INTERNAL_SERVER_ERROR }${ COACH_TEAM_UPDATE_ERROR }`);

        const coachCredentialId = await this.findCredentialIdByCoachOrThrow(coachTeam.coach.id);
        if (validatedRequest.status === true) {
            await this.credentialRepository.updateOnboardingStatus(coachCredentialId, OnboardingStatus.ACTIVE);
        } else {
            const stillHasActive = await this.coachTeamRepository.existsActiveTeamForCoach(coachTeam.coach.id, coachTeam.id);
            if (!stillHasActive) await this.credentialRepository.updateOnboardingStatus(coachCredentialId, OnboardingStatus.TEAM_PENDING);
        }

        return CoachTeamMapper.toResponse(updatedCoachTeam);
    }

    private findCoachTeamOrThrow = async (id: number): Promise<CoachTeam> => {
        const coachTeam = await this.coachTeamRepository.findById(id);

        if (!coachTeam) throw new NotFoundException(`${ COACH_TEAM_NOT_FOUND }${ id }`);

        return coachTeam;
    }

    private findCoachTeamIncludingInactiveOrThrow = async (id: number): Promise<CoachTeam> => {
        const coachTeam = await this.coachTeamRepository.findByIdIncludingInactive(id);

        if (!coachTeam) throw new NotFoundException(`${ COACH_TEAM_NOT_FOUND }${ id }`);

        return coachTeam;
    }

    private findCoachOrThrow = async (credentialId: number): Promise<Coach> => {
        const coach = await this.coachRepository.findByCredentialId(credentialId);

        if (!coach) throw new NotFoundException(`${ COACH_NOT_FOUND_CREDENTIAL }${ credentialId }`);

        return coach;
    }

    private findTeamOrThrow = async (id: number): Promise<Team> => {
        const team = await this.teamRepository.findById(id);

        if (!team) throw new NotFoundException(`${ TEAM_NOT_FOUND }${ id }`);

        return team;
    }

    private findCredentialOrThrow = async (id: number): Promise<Credential> => {
        const credential = await this.credentialRepository.findById(id);
        if (!credential) throw new NotFoundException(`${ CREDENTIAL_NOT_FOUND }${ id }`);

        return credential;
    }

    private findCredentialIdByCoachOrThrow = async (coachId: number): Promise<number> => {
        const credentialId = await this.coachRepository.findCredentialIdByCoachId(coachId);
        if (!credentialId) throw new NotFoundException(`${ CREDENTIAL_NOT_FOUND } for Coach ID: ${ coachId }`);

        return credentialId;
    }

    private getUpdatedCoach = async (newCoachId: number | undefined, currentCoach: Coach): Promise<Coach> => {
        if (!newCoachId) return currentCoach;
        
        const coach = await this.coachRepository.findById(newCoachId);
        if (!coach) throw new NotFoundException(`${ COACH_NOT_FOUND }${ newCoachId }`);

        return coach;
    }

    private getUpdatedTeam = async (newTeamId: number | undefined, currentTeam: Team): Promise<Team> => {
        if (!newTeamId) return currentTeam;
        
        const team = await this.teamRepository.findById(newTeamId);
        if (!team) throw new NotFoundException(`${ TEAM_NOT_FOUND }${ newTeamId }`);

        return team;
    }

    private validateDuplicate = async (coachId: number, teamId: number, excludeId?: number): Promise<void> => {
        const isDuplicate = await this.coachTeamRepository.isDuplicate(coachId, teamId, excludeId);
        if (isDuplicate) throw new ConflictException(`${ COACH_TEAM_ALREADY_ASSOCIATED }`);
    }

    private validateDates = (assignmentDate: Date, endDate: Date | undefined): void => {
        const now = new Date();
        
        if (assignmentDate > now) throw new BadRequestException(COACH_TEAM_ASSIGNMENT_DATE_FUTURE_ERROR);
        if (endDate && endDate > now) throw new BadRequestException(COACH_TEAM_END_DATE_FUTURE_ERROR);
        if (endDate !== null && endDate !== undefined && endDate <= assignmentDate) throw new BadRequestException(COACH_TEAM_END_DATE_BEFORE_ASSIGNMENT_ERROR);
    }
}