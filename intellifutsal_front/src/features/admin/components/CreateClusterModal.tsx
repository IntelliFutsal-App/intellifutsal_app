import { useMemo, useState } from "react";
import { BaseModal, Input, Select } from "@shared/components";
import { Field } from "./Field";
import { ModalFooter } from "./ModalFooter";
import type { UseFormReturn } from "react-hook-form";
import type { CreateClusterSchema } from "@features/ai-module";

type Option = { value: string; label: string };

interface CreateClusterModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<CreateClusterSchema>;
    onSubmit: (data: CreateClusterSchema, extras?: { playerId?: number }) => void | Promise<void>;
    isLoading?: boolean;

    /** Optional: if provided, lets user assign a player to the new cluster in the same flow */
    playerOptions?: Option[];
}

export const CreateClusterModal = ({
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
    playerOptions,
}: CreateClusterModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

    const hasPlayers = useMemo(() => (playerOptions?.length ?? 0) > 0, [playerOptions]);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title="Crear Cluster"
            subtitle="Registra un cluster nuevo"
            maxWidth="md"
            usePortal
        >
            <form
                onSubmit={handleSubmit((data) => onSubmit(data, { playerId: selectedPlayerId ?? undefined }))}
                className="space-y-4"
            >
                <Field label="Descripción" required error={errors.description?.message}>
                    <Input
                        {...register("description")}
                        placeholder="Ej. Perfil explosivo / velocidad alta"
                        disabled={isLoading}
                    />
                </Field>

                {hasPlayers && (
                    <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-4">
                        <p className="text-xs font-semibold text-gray-700 mb-3">
                            Asignación inicial (opcional)
                        </p>

                        <Field label="Asignar jugador" error={undefined}>
                            <Select
                                options={playerOptions!}
                                placeholder="Sin asignar"
                                disabled={isLoading}
                                value={selectedPlayerId ? String(selectedPlayerId) : ""}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setSelectedPlayerId(v ? Number(v) : null);
                                }}
                            />
                        </Field>

                        <p className="text-[11px] text-gray-500 mt-2">
                            Si seleccionas un jugador, al crear el cluster se creará también la relación Player ↔ Cluster.
                        </p>
                    </div>
                )}

                <ModalFooter onCancel={onClose} submitText="Crear" isLoading={isLoading} />
            </form>
        </BaseModal>
    );
};