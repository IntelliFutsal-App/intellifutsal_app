import { useMemo, useState } from "react";
import { BaseModal, Input, Select } from "@shared/ui";
import { Field } from "./Field";
import { ModalFooter } from "./ModalFooter";
import type { UseFormReturn } from "react-hook-form";
import type { ClusterResponse, UpdateClusterSchema, PlayerClusterResponse } from "@features/ai-module";

type Option = { value: string; label: string };

type RelationAction = "none" | "create" | "update";

interface EditClusterModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<UpdateClusterSchema>;
    onSubmit: (
        data: UpdateClusterSchema,
        extras?: { action?: RelationAction; playerId?: number; relationId?: number }
    ) => void | Promise<void>;
    isLoading?: boolean;
    cluster: ClusterResponse | null;
    playerOptions?: Option[];
    relationsForCluster?: PlayerClusterResponse[];
    playerNameById?: Map<number, string>;
}

export const EditClusterModal = ({
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
    cluster,
    playerOptions,
    relationsForCluster = [],
    playerNameById,
}: EditClusterModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    const [action, setAction] = useState<RelationAction>("none");
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
    const [selectedRelationId, setSelectedRelationId] = useState<number | null>(null);

    const hasPlayers = useMemo(() => (playerOptions?.length ?? 0) > 0, [playerOptions]);
    const hasRelations = useMemo(() => relationsForCluster.length > 0, [relationsForCluster]);

    const relationOptions: Option[] = useMemo(() => {
        return relationsForCluster.map((r) => {
            const name = playerNameById?.get(r.playerId) ?? `Jugador #${r.playerId}`;
            return { value: String(r.id), label: `#${r.id} — ${name}` };
        });
    }, [relationsForCluster, playerNameById]);

    if (!cluster) return null;

    const extras =
        action === "none"
            ? { action: "none" as const }
            : action === "create"
                ? { action: "create" as const, playerId: selectedPlayerId ?? undefined }
                : {
                    action: "update" as const,
                    relationId: selectedRelationId ?? undefined,
                    playerId: selectedPlayerId ?? undefined,
                };

    const isRelationConfigValid =
        action === "none" ||
        (action === "create" && !!selectedPlayerId) ||
        (action === "update" && !!selectedRelationId && !!selectedPlayerId);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title="Editar Cluster"
            subtitle="Actualiza los datos del cluster"
            maxWidth="md"
            usePortal
        >
            <form
                onSubmit={handleSubmit((data) => onSubmit(data, extras))}
                className="space-y-4"
            >
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
                    <p className="text-xs text-blue-800">
                        Editando: <span className="font-semibold">#{cluster.id}</span>
                    </p>
                    <p className="text-xs text-blue-700 mt-1 truncate">{cluster.description}</p>
                </div>

                <Field label="Descripción" error={errors.description?.message}>
                    <Input
                        {...register("description")}
                        placeholder="Nueva descripción (opcional)"
                        disabled={isLoading}
                    />
                </Field>

                {hasPlayers && (
                    <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-4 space-y-3">
                        <p className="text-xs font-semibold text-gray-700">Asignaciones (opcional)</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setAction("none");
                                    setSelectedPlayerId(null);
                                    setSelectedRelationId(null);
                                }}
                                className={`h-12 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${action === "none"
                                        ? "bg-linear-to-r from-orange-500 to-orange-600 text-white"
                                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                    }`}
                                disabled={isLoading}
                            >
                                No cambiar
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setAction("create");
                                    setSelectedRelationId(null);
                                }}
                                className={`h-12 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${action === "create"
                                        ? "bg-linear-to-r from-orange-500 to-orange-600 text-white"
                                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                    }`}
                                disabled={isLoading}
                            >
                                Crear relación
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setAction("update");
                                }}
                                className={`h-12 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${action === "update"
                                        ? "bg-linear-to-r from-orange-500 to-orange-600 text-white"
                                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                    }`}
                                disabled={isLoading || !hasRelations}
                                title={!hasRelations ? "Este cluster no tiene relaciones aún" : undefined}
                            >
                                Actualizar relación
                            </button>
                        </div>

                        {action === "update" && (
                            <Field label="Relación a actualizar" required error={undefined}>
                                <Select
                                    options={relationOptions}
                                    placeholder={hasRelations ? "Selecciona una relación" : "Sin relaciones"}
                                    disabled={isLoading || !hasRelations}
                                    value={selectedRelationId ? String(selectedRelationId) : ""}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setSelectedRelationId(v ? Number(v) : null);
                                    }}
                                />
                            </Field>
                        )}

                        {(action === "create" || action === "update") && (
                            <Field label={action === "create" ? "Jugador a asignar" : "Jugador nuevo"} required error={undefined}>
                                <Select
                                    options={playerOptions!}
                                    placeholder="Selecciona un jugador"
                                    disabled={isLoading}
                                    value={selectedPlayerId ? String(selectedPlayerId) : ""}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setSelectedPlayerId(v ? Number(v) : null);
                                    }}
                                />
                            </Field>
                        )}

                        {action !== "none" && !isRelationConfigValid && (
                            <p className="text-xs text-amber-700">
                                Completa la configuración de la asignación para poder guardar.
                            </p>
                        )}
                    </div>
                )}

                <ModalFooter
                    onCancel={onClose}
                    submitText="Actualizar"
                    isLoading={isLoading}
                />
            </form>
        </BaseModal>
    );
};