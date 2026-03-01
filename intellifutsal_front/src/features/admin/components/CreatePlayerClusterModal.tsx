import { BaseModal, Select } from "@shared/components";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Field } from "./Field";
import { ModalFooter } from "./ModalFooter";
import type { CreatePlayerClusterSchema } from "@features/ai-module";

type Option = { value: string; label: string };

interface CreatePlayerClusterModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<CreatePlayerClusterSchema>;
    onSubmit: (data: CreatePlayerClusterSchema) => void;
    isLoading?: boolean;
    playerOptions: Option[];
    clusterOptions: Option[];
}

export const CreatePlayerClusterModal = ({
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
    playerOptions,
    clusterOptions,
}: CreatePlayerClusterModalProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = form;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title="Asignar Jugador a Cluster"
            subtitle="Crea la relación Player ↔ Cluster"
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
                                placeholder="Selecciona un jugador activo"
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
                        <Field label="Cluster" required error={errors.clusterId?.message}>
                            <Select
                                options={clusterOptions}
                                placeholder="Selecciona un cluster"
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

                <ModalFooter onCancel={onClose} submitText="Crear" isLoading={isLoading} />
            </form>
        </BaseModal>
    );
};