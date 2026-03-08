import { BaseModal, Input, Select } from "@shared/ui";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Field } from "./Field";
import { ModalFooter } from "./ModalFooter";
import type { CreatePlayerTeamSchema, Option } from "@features/team";

interface CreatePlayerTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<CreatePlayerTeamSchema>;
    onSubmit: (data: CreatePlayerTeamSchema) => void | Promise<void>;
    isLoading?: boolean;
    teamOptions: Option[];
    playerOptions: Option[];
}

export const CreatePlayerTeamModal = ({
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
    teamOptions,
    playerOptions,
}: CreatePlayerTeamModalProps) => {
    const { control, register, handleSubmit, formState: { errors } } = form;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title="Asignar Jugador a Equipo"
            subtitle="Crea la relación Player ↔ Team"
            maxWidth="md"
            usePortal
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Controller
                    control={control}
                    name="playerId"
                    render={({ field }) => (
                        <Field label="Jugador" required error={errors.playerId?.message}>
                            <Select
                                options={playerOptions}
                                placeholder="Selecciona un jugador"
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

                <Field label="Fecha de ingreso" required error={errors.entryDate?.message}>
                    <Input type="date" {...register("entryDate")} disabled={isLoading} />
                </Field>

                <Field label="Fecha de salida" error={errors.exitDate?.message}>
                    <Input type="date" {...register("exitDate")} disabled={isLoading} />
                </Field>

                <ModalFooter onCancel={onClose} submitText="Crear" isLoading={isLoading} />
            </form>
        </BaseModal>
    );
};