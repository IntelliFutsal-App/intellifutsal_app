import { JoinRequestStatus } from "../enums";


export class JoinRequestResponse {
    id!: number;
    playerId!: number;
    teamId!: number;
    coachId?: number | null;
    status!: JoinRequestStatus;
    reviewComment?: string | null;
    createdAt!: Date;
    reviewedAt?: Date | null;
    updatedAt?: Date | null;
}