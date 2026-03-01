import { BaseModal, Input, Select, Badge } from "@shared/components";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Field } from "./Field";
import { ModalFooter } from "./ModalFooter";
import type { Option, PlayerTeamResponse, UpdatePlayerTeamSchema } from "@features/team";

interface EditPlayerTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<UpdatePlayerTeamSchema>;
    onSubmit: (data: UpdatePlayerTeamSchema) => void | Promise<void>;
    isLoading?: boolean;
    item: PlayerTeamResponse | null;
    teamOptions: Option[];
    playerOptions: Option[];
    playerLabel?: string;
    teamLabel?: string;
}

export const EditPlayerTeamModal = ({
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
    item,
    teamOptions,
    playerOptions,
    playerLabel,
    teamLabel,
}: EditPlayerTeamModalProps) => {
    const { control, register, handleSubmit, formState: { errors } } = form;

    if (!item) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title="Editar relación Player ↔ Team"
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
                        {playerLabel ?? `Player #${item.playerId}`} → {teamLabel ?? `Team #${item.teamId}`}
                    </p>
                </div>

                <Controller
                    control={control}
                    name="playerId"
                    render={({ field }) => (
                        <Field label="Jugador" error={errors.playerId?.message}>
                            <Select
                                options={playerOptions}
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

                <Field label="Fecha de ingreso" error={errors.entryDate?.message}>
                    <Input type="date" {...register("entryDate")} disabled={isLoading} />
                </Field>

                <Field label="Fecha de salida" error={errors.exitDate?.message}>
                    <Input type="date" {...register("exitDate")} disabled={isLoading} />
                </Field>

                <ModalFooter onCancel={onClose} submitText="Actualizar" isLoading={isLoading} />
            </form>
        </BaseModal>
    );
};