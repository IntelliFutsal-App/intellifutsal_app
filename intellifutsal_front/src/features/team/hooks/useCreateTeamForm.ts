import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createTeamSchema, type CreateTeamSchema } from "../schemas/createTeamSchema";
import { coachTeamService, teamService } from "../services";

export type CategoryOption = { value: string; label: string };

export const useCreateTeamForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<CreateTeamSchema>({
        resolver: zodResolver(createTeamSchema),
        defaultValues: { name: "", category: undefined },
        mode: "onSubmit",
    });

    const categoryOptions: CategoryOption[] = useMemo(
        () => [
            { value: "Junior", label: "Junior" },
            { value: "Senior", label: "Senior" },
            { value: "Amateur", label: "Amateur" },
            { value: "Professional", label: "Profesional" },
        ],
        []
    );

    const onSubmit = useCallback(
        async (data: CreateTeamSchema) => {
            if (isLoading) return;

            setIsLoading(true);
            const loadingToastId = toast.loading("Creando equipo...");

            try {
                const team = await teamService.create({
                    name: data.name,
                    category: data.category,
                });

                await coachTeamService.create({
                    teamId: team.id,
                    assignmentDate: new Date().toISOString().split("T")[0],
                });

                toast.update(loadingToastId, {
                    render: "¡Equipo creado exitosamente!",
                    type: "success",
                    isLoading: false,
                    autoClose: 2500,
                });

                navigate("/dashboard");
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : "Error al crear el equipo";

                toast.update(loadingToastId, {
                    render: message,
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            } finally {
                setIsLoading(false);
            }
        },
        [isLoading, navigate]
    );

    return {
        form,
        isLoading,
        categoryOptions,
        onSubmit,
    };
};