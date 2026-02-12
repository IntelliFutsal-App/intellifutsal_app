import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@shared/hooks";
import { coachService } from "@features/coach/services/coachService";
import { playerService } from "@features/player/services/playerService";
import type { RegisterFormData } from "../schemas";
import { toCoachPayload, toPlayerPayload } from "@shared/utils/registerUtils";

export const useRegisterForm = () => {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = useCallback(
        async (data: RegisterFormData) => {
            if (isLoading) return;

            setIsLoading(true);
            const loadingToast = toast.loading("Creando tu cuenta...");

            try {
                await registerUser(data.email, data.password, data.role);

                if (data.role === "COACH") {
                    await coachService.create(toCoachPayload(data));
                    toast.dismiss(loadingToast);
                    toast.success("¡Cuenta creada exitosamente!");
                    navigate("/auth/team-setup-coach", { replace: true });
                    return;
                }

                if (data.role === "PLAYER") {
                    await playerService.create(toPlayerPayload(data));
                    toast.dismiss(loadingToast);
                    toast.success("¡Cuenta creada exitosamente!");
                    navigate("/auth/team-setup-player", { replace: true });
                    return;
                }

                throw new Error("Rol inválido");
            } catch (error) {
                toast.dismiss(loadingToast);
                const errorMessage =
                    error instanceof Error ? error.message : "Error al crear la cuenta";
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        },
        [isLoading, navigate, registerUser]
    );

    return { isLoading, onSubmit };
};