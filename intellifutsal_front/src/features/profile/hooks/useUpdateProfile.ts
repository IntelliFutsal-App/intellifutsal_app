import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { coachService, type UpdateCoachRequest } from "@features/coach";
import { playerService, type UpdatePlayerRequest } from "@features/player";
import { useProfile } from "@shared/hooks";
import type { UpdateUserRequest } from "../types";
import { userService } from "../services";

export const useUpdateProfile = () => {
    const { profileState, refreshProfile } = useProfile();
    const [isSavingCredential, setIsSavingCredential] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const updateCredential = useCallback(
        async (data: Omit<UpdateUserRequest, "id">) => {
            const credentialId = profileState?.profile?.credentialId;
            if (!credentialId) return;

            setIsSavingCredential(true);
            try {
                await userService.update({ id: credentialId, ...data });
                toast.success("Credencial actualizada correctamente");
                await refreshProfile?.();
            } catch (error) {
                console.error("Error actualizando credencial:", error);
                toast.error("Error al actualizar la credencial");
                throw error;
            } finally {
                setIsSavingCredential(false);
            }
        },
        [profileState, refreshProfile]
    );

    const updateCoachProfile = useCallback(
        async (data: Omit<UpdateCoachRequest, "id">) => {
            const coachId = (profileState?.profile as { id?: number })?.id;
            if (!coachId) return;

            setIsSavingProfile(true);
            try {
                await coachService.update({ id: coachId, ...data });
                toast.success("Perfil de entrenador actualizado");
                await refreshProfile?.();
            } catch (error) {
                console.error("Error actualizando perfil de coach:", error);
                toast.error("Error al actualizar el perfil");
                throw error;
            } finally {
                setIsSavingProfile(false);
            }
        },
        [profileState, refreshProfile]
    );

    const updatePlayerProfile = useCallback(
        async (data: Omit<UpdatePlayerRequest, "id">) => {
            const playerId = (profileState?.profile as { id?: number })?.id;
            if (!playerId) return;

            setIsSavingProfile(true);
            try {
                await playerService.update({ id: playerId, ...data });
                toast.success("Perfil de jugador actualizado");
                await refreshProfile?.();
            } catch (error) {
                console.error("Error actualizando perfil de jugador:", error);
                toast.error("Error al actualizar el perfil");
                throw error;
            } finally {
                setIsSavingProfile(false);
            }
        },
        [profileState, refreshProfile]
    );

    return {
        isSavingCredential,
        isSavingProfile,
        updateCredential,
        updateCoachProfile,
        updatePlayerProfile,
    };
};