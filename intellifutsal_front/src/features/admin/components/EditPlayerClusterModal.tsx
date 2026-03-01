import { BaseModal, Select } from "@shared/components";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Field } from "./Field";
import { ModalFooter } from "./ModalFooter";
import type { PlayerClusterResponse, UpdatePlayerClusterSchema } from "@features/ai-module";

type Option = { value: string; label: string };

interface EditPlayerClusterModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<UpdatePlayerClusterSchema>;
    onSubmit: (data: UpdatePlayerClusterSchema) => void;
    isLoading?: boolean;
    item: PlayerClusterResponse | null;
    playerOptions: Option[];
    clusterOptions: Option[];
}

export const EditPlayerClusterModal = ({
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
    item,
    playerOptions,
    clusterOptions,
}: EditPlayerClusterModalProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = form;

    if (!item) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title="Editar relación Player ↔ Cluster"
            subtitle="Actualiza la asignación"
            maxWidth="md"
            usePortal
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="text-xs text-blue-800">
                        Editando relación: <span className="font-semibold">#{item.id}</span>
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
                    name="clusterId"
                    render={({ field }) => (
                        <Field label="Cluster" error={errors.clusterId?.message}>
                            <Select
                                options={clusterOptions}
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

                <ModalFooter onCancel={onClose} submitText="Actualizar" isLoading={isLoading} />
            </form>
        </BaseModal>
    );
};