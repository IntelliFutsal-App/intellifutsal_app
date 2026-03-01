import { BaseModal, Input, Select, type SelectOption } from "@shared/components";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { UpdatePlayerSchema } from "@features/player";
import type { PlayerResponse } from "@features/player/types";
import { Field } from "./Field";
import { ModalFooter } from "./ModalFooter";
import { POSITION_OPTIONS } from "../types";

interface EditPlayerModalProps {
    player: PlayerResponse | null;
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<UpdatePlayerSchema>;
    onSubmit: (data: UpdatePlayerSchema) => void | Promise<void>;
    isLoading?: boolean;
}

const SectionHeader = ({ title, tone }: { title: string; tone: "blue" | "green" | "purple" }) => {
    const map = {
        blue: "bg-blue-50 border-blue-200 text-blue-900",
        green: "bg-green-50 border-green-200 text-green-900",
        purple: "bg-purple-50 border-purple-200 text-purple-900",
    } as const;

    return (
        <div className={`border rounded-2xl p-3 ${map[tone]}`}>
            <p className="text-xs font-extrabold uppercase tracking-wide">{title}</p>
        </div>
    );
};

export const EditPlayerModal = ({
    player,
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
}: EditPlayerModalProps) => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = form;

    if (!player) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title="Editar Jugador"
            subtitle="Actualiza datos y métricas (campos opcionales)"
            maxWidth="2xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
                    <p className="text-xs text-blue-800">
                        Editando:{" "}
                        <span className="font-semibold">
                            {player.firstName} {player.lastName}
                        </span>{" "}
                        <span className="text-blue-700/80">(ID: {player.id})</span>
                    </p>
                </div>

                <SectionHeader title="Datos Personales (Opcional)" tone="blue" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Nombre" error={(errors).firstName?.message} hint="Puedes dejarlo igual si no necesitas cambiarlo">
                        <Input {...register("firstName")} placeholder="Opcional" disabled={isLoading} />
                    </Field>

                    <Field label="Apellido" error={(errors).lastName?.message} hint="Puedes dejarlo igual si no necesitas cambiarlo">
                        <Input {...register("lastName")} placeholder="Opcional" disabled={isLoading} />
                    </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Fecha Nacimiento" error={(errors).birthDate?.message} hint="Puedes dejarlo igual si no necesitas cambiarlo">
                        <Input type="date" {...register("birthDate")} disabled={isLoading} />
                    </Field>

                    <Controller
                        control={control}
                        name={"position"}
                        render={({ field }) => (
                            <Field label="Posición" error={(errors).position?.message}>
                                <Select
                                    options={POSITION_OPTIONS as SelectOption[]}
                                    placeholder="Sin cambios"
                                    disabled={isLoading}
                                    value={(field.value as string) ?? ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                    ref={field.ref}
                                />
                            </Field>
                        )}
                    />
                </div>

                <SectionHeader title="Métricas Básicas (Opcional)" tone="green" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Altura (cm)" error={(errors).height?.message} hint="Puedes dejarlo igual si no necesitas cambiarlo">
                        <Input
                            type="number"
                            step="0.1"
                            {...register("height", { valueAsNumber: true })}
                            placeholder="Opcional"
                            disabled={isLoading}
                        />
                    </Field>

                    <Field label="Peso (kg)" error={(errors).weight?.message} hint="Puedes dejarlo igual si no necesitas cambiarlo">
                        <Input
                            type="number"
                            step="0.1"
                            {...register("weight", { valueAsNumber: true })}
                            placeholder="Opcional"
                            disabled={isLoading}
                        />
                    </Field>
                </div>

                <SectionHeader title="Métricas Físicas (Opcional)" tone="purple" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Salto Alto (cm)" error={(errors).highJump?.message} hint="Puedes dejarlo igual si no necesitas cambiarlo">
                        <Input
                            type="number"
                            step="0.1"
                            {...register("highJump", { valueAsNumber: true })}
                            placeholder="Opcional"
                            disabled={isLoading}
                        />
                    </Field>

                    <Field label="Salto Bipodal (cm)" error={(errors).bipodalJump?.message} hint="Puedes dejarlo igual si no necesitas cambiarlo">
                        <Input
                            type="number"
                            step="0.1"
                            {...register("bipodalJump", { valueAsNumber: true })}
                            placeholder="Opcional"
                            disabled={isLoading}
                        />
                    </Field>

                    <Field label="Salto Unipodal Der. (cm)" error={(errors).rightUnipodalJump?.message} hint="Puedes dejarlo igual si no necesitas cambiarlo">
                        <Input
                            type="number"
                            step="0.1"
                            {...register("rightUnipodalJump", { valueAsNumber: true })}
                            placeholder="Opcional"
                            disabled={isLoading}
                        />
                    </Field>

                    <Field label="Salto Unipodal Izq. (cm)" error={(errors).leftUnipodalJump?.message} hint="Puedes dejarlo igual si no necesitas cambiarlo">
                        <Input
                            type="number"
                            step="0.1"
                            {...register("leftUnipodalJump", { valueAsNumber: true })}
                            placeholder="Opcional"
                            disabled={isLoading}
                        />
                    </Field>

                    <Field label="Tiempo 30m (s)" error={(errors).thirtyMetersTime?.message} hint="Puedes dejarlo igual si no necesitas cambiarlo">
                        <Input
                            type="number"
                            step="0.01"
                            {...register("thirtyMetersTime", { valueAsNumber: true })}
                            placeholder="Opcional"
                            disabled={isLoading}
                        />
                    </Field>

                    <Field label="Tiempo 1000m (s)" error={(errors).thousandMetersTime?.message} hint="Puedes dejarlo igual si no necesitas cambiarlo">
                        <Input
                            type="number"
                            step="0.1"
                            {...register("thousandMetersTime", { valueAsNumber: true })}
                            placeholder="Opcional"
                            disabled={isLoading}
                        />
                    </Field>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
                    <p className="text-xs text-amber-800">
                        <span className="font-semibold">Nota:</span> Campos vacíos se interpretan como “sin cambios” (según tu API/schema).
                    </p>
                </div>

                <ModalFooter onCancel={onClose} submitText="Actualizar" isLoading={isLoading} />
            </form>
        </BaseModal>
    );
};