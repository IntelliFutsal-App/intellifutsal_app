import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { CoachDashboardResponse } from "../types";
import { dashboardService } from "../services/dashboardService";

export const useCoachDashboard = () => {
    const [data, setData] = useState<CoachDashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const requestIdRef = useRef(0);

    const refresh = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        try {
            setLoading(true);
            const dashboardData = await dashboardService.getCoachDashboard();

            if (requestId !== requestIdRef.current) return;
            setData(dashboardData);
        } catch (error) {
            if (requestId !== requestIdRef.current) return;
            console.error("Error al cargar dashboard:", error);
            toast.error("Error al cargar datos del dashboard");
            setData(null);
        } finally {
            if (requestId === requestIdRef.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    return {
        data,
        loading,
        refresh,
    };
};