import { userService, type UserResponse } from "@features/profile";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

export const useUsersManagement = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInactive, setShowInactive] = useState(false);
    const requestIdRef = useRef(0);

    const load = useCallback(async () => {
        const reqId = ++requestIdRef.current;
        setLoading(true);

        try {
            const data = showInactive
                ? await userService.findAllIncludingInactive()
                : await userService.findAll();

            if (reqId !== requestIdRef.current) return;
            setUsers(data);
        } catch (error) {
            if (reqId !== requestIdRef.current) return;
            console.error("Error cargando usuarios:", error);
            toast.error("Error al cargar usuarios");
        } finally {
            if (reqId === requestIdRef.current) setLoading(false);
        }
    }, [showInactive]);

    useEffect(() => {
        void load();
    }, [load]);

    const createUser = useCallback(
        async (data: Parameters<typeof userService.create>[0]) => {
            try {
                await userService.create(data);
                toast.success("Usuario creado correctamente");
                await load();
            } catch (error) {
                console.error("Error creando usuario:", error);
                toast.error("Error al crear usuario");
                throw error;
            }
        },
        [load]
    );

    const updateUser = useCallback(
        async (data: Parameters<typeof userService.update>[0]) => {
            try {
                await userService.update(data);
                toast.success("Usuario actualizado correctamente");
                await load();
            } catch (error) {
                console.error("Error actualizando usuario:", error);
                toast.error("Error al actualizar usuario");
                throw error;
            }
        },
        [load]
    );

    const toggleStatus = useCallback(
        async (id: number, currentStatus: boolean) => {
            try {
                await userService.updateStatus(id, { status: !currentStatus });
                toast.success(currentStatus ? "Usuario desactivado" : "Usuario activado");
                await load();
            } catch (error) {
                console.error("Error cambiando estado:", error);
                toast.error("Error al cambiar estado del usuario");
                throw error;
            }
        },
        [load]
    );

    const deleteUser = useCallback(
        async (id: number) => {
            try {
                await userService.delete(id);
                toast.success("Usuario eliminado permanentemente");
                await load();
            } catch (error) {
                console.error("Error eliminando usuario:", error);
                toast.error("Error al eliminar usuario");
                throw error;
            }
        },
        [load]
    );

    const approveCoach = useCallback(
        async (coachCredentialId: number, approved: boolean) => {
            try {
                await userService.approveCoach({ coachCredentialId, approved });
                toast.success("Entrenador aprobado correctamente");
                await load();
            } catch (error) {
                console.error("Error aprobando coach:", error);
                toast.error("Error al aprobar entrenador");
                throw error;
            }
        },
        [load]
    );

    const stats = useMemo(() => {
        const active = users.filter((u) => u.status);
        const byRole = users.reduce(
            (acc, u) => {
                acc[u.role] = (acc[u.role] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>
        );
        const pendingCoaches = users.filter(
            (u) => u.role === "COACH" && u.onboardingStatus === "PENDING"
        );

        return { total: users.length, active: active.length, byRole, pendingCoaches };
    }, [users]);

    return {
        users,
        loading,
        stats,
        showInactive,
        setShowInactive,
        createUser,
        updateUser,
        toggleStatus,
        deleteUser,
        approveCoach,
        refresh: load,
    };
};