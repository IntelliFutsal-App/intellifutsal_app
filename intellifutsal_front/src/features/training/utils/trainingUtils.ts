import type { TrainingAssignmentResponse, TrainingPlanResponse, TrainingProgressResponse } from "../types";

export type TrainingPlanStatus =
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "REJECTED"
    | "ARCHIVED"
    | string;

export type TrainingAssignmentStatus =
    | "ACTIVE"
    | "COMPLETED"
    | "CANCELLED"
    | "PENDING"
    | string;

/* eslint-disable @typescript-eslint/no-explicit-any */
const toDate = (v: any) => (v ? new Date(v) : v);

export const normalizeTrainingAssignmentDates = (a: TrainingAssignmentResponse): TrainingAssignmentResponse => ({
    ...a,
    startDate: toDate((a as any).startDate),
    endDate: toDate((a as any).endDate),
    approvedAt: toDate((a as any).approvedAt),
    cancelledAt: toDate((a as any).cancelledAt),
    createdAt: toDate((a as any).createdAt),
    updatedAt: (a as any).updatedAt ? new Date((a as any).updatedAt) : (a as any).updatedAt,
});

export const normalizeTrainingPlanDates = (p: TrainingPlanResponse): TrainingPlanResponse => ({
    ...p,
    approvedAt: toDate((p as any).approvedAt),
    rejectedAt: toDate((p as any).rejectedAt),
    createdAt: toDate((p as any).createdAt),
    updatedAt: (p as any).updatedAt ? new Date((p as any).updatedAt) : (p as any).updatedAt,
});

export const normalizeTrainingProgressDates = (p: TrainingProgressResponse): TrainingProgressResponse => ({
    ...p,
    progressDate: toDate((p as any).progressDate),
    verifiedAt: toDate((p as any).verifiedAt),
    createdAt: toDate((p as any).createdAt),
    updatedAt: (p as any).updatedAt ? new Date((p as any).updatedAt) : (p as any).updatedAt,
});

export const mapPlanStatusToEs = (s: TrainingPlanStatus) => {
    switch (s) {
        case "PENDING_APPROVAL": return "Pendiente";
        case "APPROVED": return "Aprobado";
        case "REJECTED": return "Rechazado";
        case "ARCHIVED": return "Archivado";
        default: return s;
    }
};

export const mapAssignmentStatusToEs = (s: TrainingAssignmentStatus) => {
    switch (s) {
        case "ACTIVE": return "Activa";
        case "COMPLETED": return "Completada";
        case "CANCELLED": return "Cancelada";
        case "PENDING": return "Pendiente";
        default: return s;
    }
};

export const mapOriginToEs = (generatedByAi: boolean) => (generatedByAi ? "IA" : "Manual");