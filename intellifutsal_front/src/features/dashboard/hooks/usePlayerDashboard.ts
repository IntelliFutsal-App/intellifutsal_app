import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { PlayerDashboardResponse } from "../types";
import { dashboardService } from "../services";

export const usePlayerDashboard = () => {
    const [data, setData] = useState<PlayerDashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const requestIdRef = useRef(0);

    const fetchDashboard = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        try {
            setLoading(true);
            const result = await dashboardService.getPlayerDashboard();

            if (requestId !== requestIdRef.current) return;
            setData(result);
        } catch (error) {
            if (requestId !== requestIdRef.current) return;
            console.error("Error al cargar dashboard:", error);
            toast.error("Error al cargar los datos del panel");
        } finally {
            if (requestId === requestIdRef.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchDashboard();
    }, [fetchDashboard]);

    return { data, loading, refresh: fetchDashboard };
};