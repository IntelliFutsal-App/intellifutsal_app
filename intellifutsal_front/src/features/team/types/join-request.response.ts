import type { JoinRequestStatus } from "./join-request-status";

export interface JoinRequestResponse {
    id: number;
    playerId: number;
    teamId: number;
    coachId?: number | null;
    status: JoinRequestStatus;
    reviewComment?: string | null;
    createdAt: Date;
    reviewedAt?: Date | null;
    updatedAt?: Date | null;
}
