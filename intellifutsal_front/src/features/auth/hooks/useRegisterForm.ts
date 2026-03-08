import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@shared/hooks";
import type { RegisterFormData } from "../schemas";
import { coachService } from "@features/coach";
import { playerService } from "@features/player";
import { toCoachPayload, toPlayerPayload } from "../utils";

const isHttpConflict = (err: unknown) =>
    typeof err === "object" &&
    err !== null &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((err as any).response?.status === 409);

export const useRegisterForm = () => {
    const { register: registerUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = useCallback(
        async (data: RegisterFormData) => {
            if (isLoading) return;

            setIsLoading(true);
            const loadingToast = toast.loading("Creando su cuenta...");

            try {
                await registerUser(data.email, data.password, data.role);

                try {
                    if (data.role === "COACH") {
                        await coachService.create(toCoachPayload(data));
                        toast.dismiss(loadingToast);
                        toast.success("¡Cuenta creada exitosamente!");
                        navigate("/coach-pending-approval", { replace: true });
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
                } catch (profileError) {
                    await logout();

                    toast.dismiss(loadingToast);

                    console.error("Error creando perfil:", profileError);
                    return;
                }
            } catch (authError) {
                toast.dismiss(loadingToast);

                if (isHttpConflict(authError)) {
                    toast.error("El correo electrónico ya está en uso");
                } 

                console.error("Error creando credencial:", authError);
            } finally {
                setIsLoading(false);
            }
        },
        [isLoading, navigate, registerUser, logout]
    );

    return { isLoading, onSubmit };
};
