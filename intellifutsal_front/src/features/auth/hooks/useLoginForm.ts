import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@shared/hooks";
import type { LoginFormData } from "../schemas";

export const useLoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = useCallback(
        async (data: LoginFormData) => {
            if (isLoading) return;

            setIsLoading(true);
            const loadingToast = toast.loading("Iniciando sesión...");

            try {
                await login(data.email, data.password);
                toast.dismiss(loadingToast);
                navigate("/dashboard", { replace: true });
            } catch (error) {
                toast.dismiss(loadingToast);
                toast.error(error as string);
            } finally {
                setIsLoading(false);
            }
        },
        [isLoading, login, navigate]
    );

    return { isLoading, onSubmit };
};