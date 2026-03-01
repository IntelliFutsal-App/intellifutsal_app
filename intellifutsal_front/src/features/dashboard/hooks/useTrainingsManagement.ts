import { trainingAssignmentService, trainingPlanService, trainingProgressService, type TrainingAssignmentResponse, type TrainingPlanResponse, type TrainingProgressResponse } from "@features/training";
import { useCallback, useEffect, useMemo, useState } from "react";

type PlanStats = {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    archived: number;
};

type AssignmentStats = {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
    pending: number;
};

const countBy = (items: { status: string }[], status: string) =>
    items.filter((x) => x.status === status).length;

export const useTrainingsManagement = () => {
    const [plans, setPlans] = useState<TrainingPlanResponse[]>([]);
    const [assignments, setAssignments] = useState<TrainingAssignmentResponse[]>([]);
    const [progress, setProgress] = useState<TrainingProgressResponse[]>([]);

    const [isLoadingPlans, setIsLoadingPlans] = useState(true);
    const [isLoadingAssignments, setIsLoadingAssignments] = useState(true);
    const [isLoadingProgress, setIsLoadingProgress] = useState(false);

    const [isActing, setIsActing] = useState(false);

    const [activeTeamId, setActiveTeamId] = useState<number | null>(null);
    const [activeAssignmentId, setActiveAssignmentId] = useState<number | null>(null);

    const refreshPlans = useCallback(async () => {
        setIsLoadingPlans(true);
        try {
            const res = await trainingPlanService.findAll();
            setPlans(res);
        } finally {
            setIsLoadingPlans(false);
        }
    }, []);

    const refreshAssignments = useCallback(async () => {
        setIsLoadingAssignments(true);
        try {
            const res = await trainingAssignmentService.findAll();
            setAssignments(res);
        } finally {
            setIsLoadingAssignments(false);
        }
    }, []);

    const setAssignmentsTeamFilter = useCallback((teamId: number | null) => {
        setActiveTeamId(teamId);
    }, []);

    const loadProgressByAssignment = useCallback(async (assignmentId: number) => {
        setActiveAssignmentId(assignmentId);
        setIsLoadingProgress(true);
        try {
            const res = await trainingProgressService.findByAssignment(assignmentId);
            setProgress(res);
        } finally {
            setIsLoadingProgress(false);
        }
    }, []);

    const approvePlan = useCallback(
        async (id: number, approvalComment?: string) => {
            setIsActing(true);
            try {
                await trainingPlanService.approve(id, { approvalComment: approvalComment?.trim() || undefined });
                await refreshPlans();
            } finally {
                setIsActing(false);
            }
        },
        [refreshPlans]
    );

    const rejectPlan = useCallback(
        async (id: number, approvalComment?: string) => {
            setIsActing(true);
            try {
                await trainingPlanService.reject(id, { approvalComment: approvalComment?.trim() || undefined });
                await refreshPlans();
            } finally {
                setIsActing(false);
            }
        },
        [refreshPlans]
    );

    const archivePlan = useCallback(
        async (id: number) => {
            setIsActing(true);
            try {
                await trainingPlanService.archive(id);
                await refreshPlans();
            } finally {
                setIsActing(false);
            }
        },
        [refreshPlans]
    );

    const activateAssignment = useCallback(
        async (id: number) => {
            setIsActing(true);
            try {
                await trainingAssignmentService.activate(id);
                await refreshAssignments();
            } finally {
                setIsActing(false);
            }
        },
        [refreshAssignments]
    );

    const cancelAssignment = useCallback(
        async (id: number) => {
            setIsActing(true);
            try {
                await trainingAssignmentService.cancel(id);
                await refreshAssignments();
            } finally {
                setIsActing(false);
            }
        },
        [refreshAssignments]
    );

    const plansStats: PlanStats = useMemo(
        () => ({
            total: plans.length,
            pending: countBy(plans, "PENDING_APPROVAL"),
            approved: countBy(plans, "APPROVED"),
            rejected: countBy(plans, "REJECTED"),
            archived: countBy(plans, "ARCHIVED"),
        }),
        [plans]
    );

    const assignmentsStats: AssignmentStats = useMemo(
        () => ({
            total: assignments.length,
            active: countBy(assignments, "ACTIVE"),
            completed: countBy(assignments, "COMPLETED"),
            cancelled: countBy(assignments, "CANCELLED"),
            pending: countBy(assignments, "PENDING"),
        }),
        [assignments]
    );

    useEffect(() => {
        void refreshPlans();
        void refreshAssignments();
    }, [refreshPlans, refreshAssignments]);

    return {
        plans,
        assignments,
        progress,

        plansStats,
        assignmentsStats,

        isLoadingPlans,
        isLoadingAssignments,
        isLoadingProgress,
        isActing,

        activeTeamId,
        activeAssignmentId,

        refreshPlans,
        refreshAssignments,

        setAssignmentsTeamFilter,
        loadProgressByAssignment,

        approvePlan,
        rejectPlan,
        archivePlan,

        activateAssignment,
        cancelAssignment,

        clearProgress: () => {
            setActiveAssignmentId(null);
            setProgress([]);
        },
    };
};