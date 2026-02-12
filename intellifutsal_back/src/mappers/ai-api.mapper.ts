import { AiApiRequest, AiApiTeamPlayersRequest, AiApiTeamRequest, PlayerResponse } from "../interfaces";
import { calculateAge } from "../utilities/age.utility";


export class AiApiMapper {
    static toRequest = (playerResponse: PlayerResponse): AiApiRequest => {
        const aiApiRequest = new AiApiRequest();

        aiApiRequest.age = calculateAge(playerResponse.birthDate);
        aiApiRequest.weight = playerResponse.weight;
        aiApiRequest.height = playerResponse.height;
        aiApiRequest.bmi = playerResponse.bmi;
        aiApiRequest.highJump = playerResponse.highJump;
        aiApiRequest.rightUnipodalJump = playerResponse.rightUnipodalJump;
        aiApiRequest.leftUnipodalJump = playerResponse.leftUnipodalJump;
        aiApiRequest.bipodalJump = playerResponse.bipodalJump;
        aiApiRequest.thirtyMetersTime = playerResponse.thirtyMetersTime;
        aiApiRequest.thousandMetersTime = playerResponse.thousandMetersTime;

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