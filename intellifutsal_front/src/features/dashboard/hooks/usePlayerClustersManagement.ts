import { useCallback, useEffect, useMemo, useState } from "react";
import type { PlayerResponse } from "@features/player/types";
import { clusterService, playerClusterService, type ClusterResponse, type CreatePlayerClusterRequest, type PlayerClusterResponse, type UpdatePlayerClusterRequest } from "@features/ai-module";
import { playerService } from "@features/player";

type Stats = { total: number };

export const usePlayerClustersManagement = () => {
    const [items, setItems] = useState<PlayerClusterResponse[]>([]);
    const [clusters, setClusters] = useState<ClusterResponse[]>([]);
    const [players, setPlayers] = useState<PlayerResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isActing, setIsActing] = useState(false);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        try {
            const [pc, cl, pl] = await Promise.all([
                playerClusterService.findAll(),
                clusterService.findAll(),
                playerService.findAll(),
            ]);

            setItems(pc);
            setClusters(cl);
            setPlayers(pl);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    const stats: Stats = useMemo(() => ({ total: items.length }), [items]);

    const playersActive = useMemo(() => players.filter((p) => !!p.status), [players]);

    const createItem = useCallback(
        async (payload: CreatePlayerClusterRequest) => {
            setIsActing(true);
            try {
                await playerClusterService.create(payload);
                await refresh();
            } finally {
                setIsActing(false);
            }
        },
        [refresh]
    );

    const updateItem = useCallback(
        async (payload: UpdatePlayerClusterRequest) => {
            setIsActing(true);
            try {
                await playerClusterService.update(payload);
                await refresh();
            } finally {
                setIsActing(false);
            }
        },
        [refresh]
    );

    const deleteItem = useCallback(
        async (id: number) => {
            setIsActing(true);
            try {
                await playerClusterService.delete(id);
                await refresh();
            } finally {
                setIsActing(false);
            }
        },
        [refresh]
    );

    return {
        items,
        clusters,
        playersActive,
        stats,
        isLoading,
        isActing,
        refresh,
        createItem,
        updateItem,
        deleteItem,
    };
};