import { BaseModal, Input, Select, Badge } from "@shared/ui";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Field } from "./Field";
import { ModalFooter } from "./ModalFooter";
import type { CoachTeamResponse, Option, UpdateCoachTeamSchema } from "@features/team";

interface EditCoachTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<UpdateCoachTeamSchema>;
    onSubmit: (data: UpdateCoachTeamSchema) => void | Promise<void>;
    isLoading?: boolean;
    item: CoachTeamResponse | null;
    teamOptions: Option[];
    coachOptions: Option[];
    coachLabel?: string;
    teamLabel?: string;
}

export const EditCoachTeamModal = ({
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
    item,
    teamOptions,
    coachOptions,
    coachLabel,
    teamLabel,
}: EditCoachTeamModalProps) => {
    const { control, register, handleSubmit, formState: { errors } } = form;

    if (!item) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title="Editar relación Coach ↔ Team"
            subtitle="Actualiza la asignación"
            maxWidth="md"
            usePortal
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-blue-800">
                            Editando relación: <span className="font-semibold">#{item.id}</span>
                        </p>
                        <Badge variant={item.status ? "success" : "secondary"} className="w-fit">
                            {item.status ? "Activa" : "Inactiva"}
                        </Badge>
                    </div>
                    <p className="text-xs text-blue-700 mt-1 truncate">
                        {coachLabel ?? `Coach #${item.coachId}`} → {teamLabel ?? `Team #${item.teamId}`}
                    </p>
                </div>

                <Controller
                    control={control}
                    name="coachId"
                    render={({ field }) => (
                        <Field label="Entrenador" error={errors.coachId?.message}>
                            <Select
                                options={coachOptions}
                                placeholder="Sin cambios"
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
                        <Field label="Equipo" error={errors.teamId?.message}>
                            <Select
                                options={teamOptions}
                                placeholder="Sin cambios"
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

                <Field label="Fecha de asignación" error={errors.assignmentDate?.message}>
                    <Input type="date" {...register("assignmentDate")} disabled={isLoading} />
                </Field>

                <Field label="Fecha de finalización" error={errors.endDate?.message}>
                    <Input type="date" {...register("endDate")} disabled={isLoading} />
                </Field>

                <ModalFooter onCancel={onClose} submitText="Actualizar" isLoading={isLoading} />
            </form>
        </BaseModal>
    );
};