import { BaseModal, Input, Select, type SelectOption } from "@shared/ui";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { CreateTeamSchema } from "@features/team";
import { Field } from "./Field";
import { ModalFooter } from "./ModalFooter";
import { TEAM_CATEGORY_OPTIONS } from "../types";

interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<CreateTeamSchema>;
    onSubmit: (data: CreateTeamSchema) => void | Promise<void>;
    isLoading?: boolean;
}

export const CreateTeamModal = ({
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
}: CreateTeamModalProps) => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = form;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title="Crear Equipo"
            subtitle="Registra un equipo nuevo en la plataforma"
            maxWidth="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Field
                    label="Nombre del equipo"
                    required
                    error={errors.name?.message}
                    hint="Ej. Juveniles A"
                >
                    <Input
                        {...register("name")}
                        placeholder="Juveniles A"
                        disabled={isLoading}
                    />
                </Field>

                <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                        <Field
                            label="Categoría"
                            required
                            error={errors.category?.message}
                            hint="Solo se permiten las categorías definidas"
                        >
                            <Select
                                options={TEAM_CATEGORY_OPTIONS as SelectOption[]}
                                placeholder="Selecciona una categoría"
                                disabled={isLoading}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                            />
                        </Field>
                    )}
                />

                <ModalFooter
                    onCancel={onClose}
                    submitText="Crear"
                    isLoading={isLoading}
                />
            </form>
        </BaseModal>
    );
};