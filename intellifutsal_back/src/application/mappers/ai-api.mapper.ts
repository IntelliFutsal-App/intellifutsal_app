import { AiApiRequest, AiApiTeamPlayersRequest, AiApiTeamRequest, PlayerResponse } from '../../domain/interfaces';
import { calculateAge } from '../../core/utilities/age.utility';


export class AiApiMapper {
    static toRequest = (playerResponse: PlayerResponse): AiApiRequest => {
        const aiApiRequest = new AiApiRequest();

        aiApiRequest.age = calculateAge(playerResponse.birthDate);
        if (playerResponse.weight) aiApiRequest.weight = playerResponse.weight;
        if (playerResponse.height) aiApiRequest.height = playerResponse.height;
        if (playerResponse.bmi) aiApiRequest.bmi = playerResponse.bmi;
        if (playerResponse.highJump) aiApiRequest.highJump = playerResponse.highJump;
        if (playerResponse.rightUnipodalJump) aiApiRequest.rightUnipodalJump = playerResponse.rightUnipodalJump;
        if (playerResponse.leftUnipodalJump) aiApiRequest.leftUnipodalJump = playerResponse.leftUnipodalJump;
        if (playerResponse.bipodalJump) aiApiRequest.bipodalJump = playerResponse.bipodalJump;
        if (playerResponse.thirtyMetersTime) aiApiRequest.thirtyMetersTime = playerResponse.thirtyMetersTime;
        if (playerResponse.thousandMetersTime) aiApiRequest.thousandMetersTime = playerResponse.thousandMetersTime;

        return aiApiRequest;
    }

    static toTeamRequest = (playerResponses: PlayerResponse[], teamName: string): AiApiTeamRequest => {
        const aiApiTeamRequest = new AiApiTeamRequest();

        aiApiTeamRequest.teamName = teamName;
        aiApiTeamRequest.players = playerResponses.map(playerResponse => {
            return {
                id: playerResponse.id,
                name: `${ playerResponse.firstName } ${ playerResponse.lastName }`,
                age: calculateAge(playerResponse.birthDate),
                weight: playerResponse.weight,
                height: playerResponse.height,
                bmi: playerResponse.bmi,
                highJump: playerResponse.highJump,
                rightUnipodalJump: playerResponse.rightUnipodalJump,
                leftUnipodalJump: playerResponse.leftUnipodalJump,
                bipodalJump: playerResponse.bipodalJump,
                thirtyMetersTime: playerResponse.thirtyMetersTime,
                thousandMetersTime: playerResponse.thousandMetersTime
            } as AiApiTeamPlayersRequest;
        });

        return aiApiTeamRequest;
    }
}