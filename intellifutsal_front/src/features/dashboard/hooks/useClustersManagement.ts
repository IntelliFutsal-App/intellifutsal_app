import { clusterService, type ClusterResponse, type CreateClusterRequest, type UpdateClusterRequest } from "@features/ai-module";
import { useCallback, useEffect, useMemo, useState } from "react";

type ClusterStats = { total: number };

export const useClustersManagement = () => {
    const [clusters, setClusters] = useState<ClusterResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isActing, setIsActing] = useState(false);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await clusterService.findAll();
            setClusters(data);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    const stats: ClusterStats = useMemo(() => ({ total: clusters.length }), [clusters]);

    const createCluster = useCallback(
        async (payload: CreateClusterRequest) => {
            setIsActing(true);
            try {
                const created = await clusterService.create(payload);
                await refresh();
                return created;
            } finally {
                setIsActing(false);
            }
        },
        [refresh]
    );

    const updateCluster = useCallback(
        async (payload: UpdateClusterRequest) => {
            setIsActing(true);
            try {
                await clusterService.update(payload);
                await refresh();
            } finally {
                setIsActing(false);
            }
        },
        [refresh]
    );

    const deleteCluster = useCallback(
        async (id: number) => {
            setIsActing(true);
            try {
                await clusterService.delete(id);
                await refresh();
            } finally {
                setIsActing(false);
            }
        },
        [refresh]
    );

    return {
        clusters,
        stats,
        isLoading,
        isActing,
        refresh,
        createCluster,
        updateCluster,
        deleteCluster,
    };
};