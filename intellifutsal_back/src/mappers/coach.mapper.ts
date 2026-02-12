import { CoachResponse, CreateCoachRequest, UpdateCoachRequest } from "../interfaces";
import { Coach, Credential } from "../models";
import { calculateAge } from "../utilities/age.utility";


export class CoachMapper {
    static toResponse = (coach: Coach): CoachResponse => {
        const coachResponse = new CoachResponse();

        coachResponse.id = coach.id;
        coachResponse.firstName = coach.firstName;
        coachResponse.lastName = coach.lastName;
        coachResponse.birthDate = coach.birthDate;
        coachResponse.age = calculateAge(coach.birthDate);    
        coachResponse.expYears = coach.expYears;
        coachResponse.specialty = coach.specialty;
        coachResponse.credentialId = coach.credential.id;
        coachResponse.status = coach.status;
        coachResponse.createdAt = coach.createdAt;
        if (coach.updatedAt) coachResponse.updatedAt = coach.updatedAt;

        return coachResponse;
    }

    static toResponseList = (coaches: Coach[]): CoachResponse[] => {
        return coaches.map(this.toResponse);
    }

    static toEntity = (createCoachRequest: CreateCoachRequest, credential: Credential): Coach => {
        const coach = new Coach();

        coach.firstName = createCoachRequest.firstName;
        coach.lastName = createCoachRequest.lastName;
        coach.birthDate = createCoachRequest.birthDate;
        coach.expYears = createCoachRequest.expYears;
        coach.specialty = createCoachRequest.specialty;
        coach.credential = credential;

        return coach;
    }

    static toUpdateEntity = (updateCoachRequest: UpdateCoachRequest): Coach => {
        const coach = new Coach();

        coach.id = updateCoachRequest.id;
        
        if (updateCoachRequest.firstName) coach.firstName = updateCoachRequest.firstName;
        if (updateCoachRequest.lastName) coach.lastName = updateCoachRequest.lastName;
        if (updateCoachRequest.birthDate) coach.birthDate = updateCoachRequest.birthDate;
        if (updateCoachRequest.expYears) coach.expYears = updateCoachRequest.expYears;
        if (updateCoachRequest.specialty) coach.specialty = updateCoachRequest.specialty;

        return coach;
    }
}