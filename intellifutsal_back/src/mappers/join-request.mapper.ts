import { JoinRequestResponse, UpdateJoinRequestStatusRequest, JoinRequestStatus } from "../interfaces";
import { JoinRequest, Player, Team } from "../models";


export class JoinRequestMapper {
    static toResponse = (joinRequest: JoinRequest): JoinRequestResponse => {
        const joinRequestResponse = new JoinRequestResponse();

        joinRequestResponse.id = joinRequest.id;
        joinRequestResponse.playerId = joinRequest.player.id;
        joinRequestResponse.teamId = joinRequest.team.id;
        joinRequestResponse.coachId = joinRequest.coach?.id;
        joinRequestResponse.status = joinRequest.status;
        joinRequestResponse.reviewComment = joinRequest.reviewComment;
        joinRequestResponse.createdAt = joinRequest.createdAt;
        joinRequestResponse.reviewedAt = joinRequest.reviewedAt;
        if (joinRequest.updatedAt) joinRequestResponse.updatedAt = joinRequest.updatedAt;

        return joinRequestResponse;
    };

    static toResponseList = (joinRequests: JoinRequest[]): JoinRequestResponse[] => {
        return joinRequests.map(this.toResponse);
    };

    static toEntityCreate = (player: Player, team: Team): JoinRequest => {
        const joinRequest = new JoinRequest();

        joinRequest.player = player;
        joinRequest.team = team;
        joinRequest.status = JoinRequestStatus.PENDING;
        joinRequest.reviewComment = undefined;

        return joinRequest;
    };

    static toUpdateEntity = (joinRequest: JoinRequest, updateRequest: UpdateJoinRequestStatusRequest): JoinRequest => {
        if (updateRequest.reviewComment !== undefined) joinRequest.reviewComment = updateRequest.reviewComment;

        return joinRequest;
    };
}