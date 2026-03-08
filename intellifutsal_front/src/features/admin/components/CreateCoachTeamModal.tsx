import { BaseModal, Input, Select } from "@shared/ui";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Field } from "./Field";
import { ModalFooter } from "./ModalFooter";
import type { CreateCoachTeamSchema, Option } from "@features/team";

interface CreateCoachTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<CreateCoachTeamSchema>;
    onSubmit: (data: CreateCoachTeamSchema) => void | Promise<void>;
    isLoading?: boolean;
    teamOptions: Option[];
    coachOptions: Option[];
}

export const CreateCoachTeamModal = ({
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
    teamOptions,
    coachOptions,
}: CreateCoachTeamModalProps) => {
    const { control, register, handleSubmit, formState: { errors } } = form;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title="Asignar Entrenador a Equipo"
            subtitle="Crea la relación Coach ↔ Team"
            maxWidth="md"
            usePortal
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Controller
                    control={control}
                    name="coachId"
                    render={({ field }) => (
                        <Field label="Entrenador" required error={errors.coachId?.message}>
                            <Select
                                options={coachOptions}
                                placeholder="Selecciona un entrenador"
                                disabled={isLoading}
                                value={field.value ? String(field.value) : ""}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                            />
                        </Field>
                    )}
                />

                <Controller
                    control={control}
                    name="teamId"
                    render={({ field }) => (
                        <Field label="Equipo" required error={errors.teamId?.message}>
                            <Select
                                options={teamOptions}
                                placeholder="Selecciona un equipo"
                                disabled={isLoading}
                                value={field.value ? String(field.value) : ""}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                            />
                        </Field>
                    )}
                />

                <Field label="Fecha de asignación" required error={errors.assignmentDate?.message}>
                    <Input type="date" {...register("assignmentDate")} disabled={isLoading} />
                </Field>

                <Field label="Fecha de finalización" error={errors.endDate?.message}>
                    <Input type="date" {...register("endDate")} disabled={isLoading} />
                </Field>

                <ModalFooter onCancel={onClose} submitText="Crear" isLoading={isLoading} />
            </form>
        </BaseModal>
    );
};