import { playerService, type PlayerResponse } from "@features/player";
import { useEffect, useMemo, useState } from "react";

export const useTeamPlayers = (activeTeamId?: number | null) => {
    const [players, setPlayers] = useState<PlayerResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            if (!activeTeamId) {
                if (!mounted) return;
                setPlayers([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await playerService.findByTeamId(activeTeamId);
                if (!mounted) return;
                setPlayers(data);
            } catch (error) {
                console.error("Error al cargar players por team:", error);
                if (!mounted) return;
                setPlayers([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, [activeTeamId]);

    const activePlayers = useMemo(() => players.filter((p) => p.status), [players]);
    const count = activePlayers.length;

    return { players, activePlayers, loading, count };
};