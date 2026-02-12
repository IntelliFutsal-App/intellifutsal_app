import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { PlayerResponse } from "@features/player/types";
import { playerService } from "@features/player/services/playerService";
import type { SelectOption } from "@shared/components";

type ViewMode = "grid" | "table";

export const usePlayersSection = (activeTeamId?: number | null) => {
    const [players, setPlayers] = useState<PlayerResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterPosition, setFilterPosition] = useState<string>("all");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    const requestIdRef = useRef(0);

    const refresh = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        if (!activeTeamId) {
            setPlayers([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await playerService.findByTeamId(activeTeamId);

            if (requestId !== requestIdRef.current) return;
            setPlayers(data);
        } catch (error) {
            if (requestId !== requestIdRef.current) return;
            console.error("Error al cargar jugadores:", error);
            toast.error("Error al cargar jugadores del equipo");
            setPlayers([]);
        } finally {
            if (requestId === requestIdRef.current) setLoading(false);
        }
    }, [activeTeamId]);

    const fetchPlayers = useCallback(async () => {
        if (!activeTeamId) {
            setPlayers([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await playerService.findByTeamId(activeTeamId);
            setPlayers(data);
        } catch (error) {
            console.error("Error al cargar jugadores:", error);
            toast.error("Error al cargar jugadores");
            setPlayers([]);
        } finally {
            setLoading(false);
        }
    }, [activeTeamId]);

    useEffect(() => {
        void fetchPlayers();
    }, [fetchPlayers]);

    useEffect(() => {
        setPlayers([]);
        setLoading(true);
        setSearchTerm("");
        setFilterPosition("all");
        setViewMode("grid");
        requestIdRef.current += 1;

        void refresh();
    }, [refresh]);

    const positions = useMemo(() => {
        const unique = new Set(players.map((p) => p.position).filter(Boolean));
        return ["all", ...Array.from(unique)];
    }, [players]);

    const positionOptions: SelectOption[] = useMemo(() => {
        return [
            { value: "all", label: "Todas las posiciones" },
            ...positions
                .filter((p) => p !== "all")
                .map((p) => ({ value: p, label: p })),
        ];
    }, [positions]);

    const filteredPlayers = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return players.filter((player) => {
            const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();

            const matchesSearch =
                term.length === 0 ||
                fullName.includes(term) ||
                player.position.toLowerCase().includes(term);

            const matchesPosition =
                filterPosition === "all" || player.position === filterPosition;

            return matchesSearch && matchesPosition;
        });
    }, [players, searchTerm, filterPosition]);

    const stats = useMemo(() => {
        const total = players.length;
        const activeCount = players.filter((p) => p.status).length;

        const avgAge =
            total > 0
                ? Math.round(players.reduce((acc, p) => acc + (p.age ?? 0), 0) / total)
                : 0;

        const avgBmi =
            total > 0
                ? players.reduce((acc, p) => acc + Number(p.bmi ?? 0), 0) / total
                : 0;

        return { total, activeCount, avgAge, avgBmi };
    }, [players]);

    const clearFilters = useCallback(() => {
        setSearchTerm("");
        setFilterPosition("all");
    }, []);

    const showEmptyByNoTeam = !activeTeamId && !loading;

    return {
        players,
        loading,

        searchTerm,
        setSearchTerm,
        filterPosition,
        setFilterPosition,
        viewMode,
        setViewMode,

        filteredPlayers,
        positionOptions,

        stats,
        clearFilters,
        showEmptyByNoTeam,

        refreshPlayers: fetchPlayers,
    };
};