import { CreatePlayerRequest, PlayerResponse, UpdatePlayerRequest } from "../interfaces";
import { Credential, Player } from "../models";
import { stringToPosition } from '../interfaces/enums/position.enum';
import { calculateAge } from "../utilities/age.utility";


export class PlayerMapper {
    static toResponse = (player: Player): PlayerResponse => {
        const playerResponse = new PlayerResponse();

        playerResponse.id = player.id;
        playerResponse.firstName = player.firstName;
        playerResponse.lastName = player.lastName;
        playerResponse.birthDate = player.birthDate;
        playerResponse.age = calculateAge(player.birthDate);
        playerResponse.height = player.height;
        playerResponse.weight = player.weight;
        playerResponse.bmi = player.bmi;
        playerResponse.highJump = player.highJump;
        playerResponse.rightUnipodalJump = player.rightUnipodalJump;
        playerResponse.leftUnipodalJump = player.leftUnipodalJump;
        playerResponse.bipodalJump = player.bipodalJump;
        playerResponse.thirtyMetersTime = player.thirtyMetersTime;
        playerResponse.thousandMetersTime = player.thousandMetersTime;
        playerResponse.position = player.position;
        playerResponse.status = player.status;
        playerResponse.credentialId = player.credential?.id;
        playerResponse.createdAt = player.createdAt;
        if (player.updatedAt) playerResponse.updatedAt = player.updatedAt;

        return playerResponse;
    }

    static toResponseList = (players: Player[]): PlayerResponse[] => {
        return players.map(this.toResponse);
    }

    static toEntity = (createPlayerRequest: CreatePlayerRequest, credential: Credential, bmi: number): Player => {
        const player = new Player();

        player.firstName = createPlayerRequest.firstName;
        player.lastName = createPlayerRequest.lastName;
        player.birthDate = createPlayerRequest.birthDate;
        player.height = createPlayerRequest.height;
        player.weight = createPlayerRequest.weight;
        player.bmi = bmi;
        player.highJump = createPlayerRequest.highJump;
        player.rightUnipodalJump = createPlayerRequest.rightUnipodalJump;
        player.leftUnipodalJump = createPlayerRequest.leftUnipodalJump;
        player.bipodalJump = createPlayerRequest.bipodalJump;
        player.thirtyMetersTime = createPlayerRequest.thirtyMetersTime;
        player.thousandMetersTime = createPlayerRequest.thousandMetersTime;
        player.position = stringToPosition(createPlayerRequest.position);
        player.credential = credential;

        return player;
    }

    static toUpdateEntity = (updatePlayerRequest: UpdatePlayerRequest, bmi?: number): Player => {
        const player = new Player();

        player.id = updatePlayerRequest.id;
        
        if (updatePlayerRequest.firstName) player.firstName = updatePlayerRequest.firstName;
        if (updatePlayerRequest.lastName) player.lastName = updatePlayerRequest.lastName;
        if (updatePlayerRequest.birthDate) player.birthDate = updatePlayerRequest.birthDate;
        if (updatePlayerRequest.height) player.height = updatePlayerRequest.height;
        if (updatePlayerRequest.weight) player.weight = updatePlayerRequest.weight;
        if (bmi) player.bmi = bmi;
        if (updatePlayerRequest.highJump) player.highJump = updatePlayerRequest.highJump;
        if (updatePlayerRequest.rightUnipodalJump) player.rightUnipodalJump = updatePlayerRequest.rightUnipodalJump;
        if (updatePlayerRequest.leftUnipodalJump) player.leftUnipodalJump = updatePlayerRequest.leftUnipodalJump;
        if (updatePlayerRequest.bipodalJump) player.bipodalJump = updatePlayerRequest.bipodalJump;
        if (updatePlayerRequest.thirtyMetersTime) player.thirtyMetersTime = updatePlayerRequest.thirtyMetersTime;
        if (updatePlayerRequest.thousandMetersTime) player.thousandMetersTime = updatePlayerRequest.thousandMetersTime;
        if (updatePlayerRequest.position) player.position = stringToPosition(updatePlayerRequest.position);

        return player;
    }
}