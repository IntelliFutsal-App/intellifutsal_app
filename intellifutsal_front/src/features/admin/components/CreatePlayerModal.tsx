import { BaseModal, Input, Select, type SelectOption } from "@shared/ui";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { CreatePlayerSchema } from "@features/player";
import { Field } from "./Field";
import { ModalFooter } from "./ModalFooter";
import { POSITION_OPTIONS } from "../types";
import { SectionHeader } from "./SectionHeader";

interface CreatePlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<CreatePlayerSchema>;
    onSubmit: (data: CreatePlayerSchema) => void | Promise<void>;
    isLoading?: boolean;
}

export const CreatePlayerModal = ({
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
}: CreatePlayerModalProps) => {
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
            title="Crear Jugador"
            subtitle="Registra un jugador con sus métricas físicas"
            maxWidth="2xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <SectionHeader title="Datos Personales" tone="blue" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Nombre" required error={errors.firstName?.message}>
                        <Input {...register("firstName")} disabled={isLoading} />
                    </Field>

                    <Field label="Apellido" required error={errors.lastName?.message}>
                        <Input {...register("lastName")} disabled={isLoading} />
                    </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Fecha Nacimiento" required error={errors.birthDate?.message}>
                        <Input type="date" {...register("birthDate")} disabled={isLoading} />
                    </Field>

                    <Controller
                        control={control}
                        name="position"
                        render={({ field }) => (
                            <Field label="Posición" error={(errors).position?.message}>
                                <Select
                                    options={POSITION_OPTIONS as SelectOption[]}
                                    placeholder="Seleccionar"
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
                    <Field label="Altura (cm)" error={errors.height?.message}>
                        <Input type="number" step="0.1" {...register("height", { valueAsNumber: true })} disabled={isLoading} />
                    </Field>

                    <Field label="Peso (kg)" error={errors.weight?.message}>
                        <Input type="number" step="0.1" {...register("weight", { valueAsNumber: true })} disabled={isLoading} />
                    </Field>
                </div>

                <SectionHeader title="Métricas Físicas (Opcional)" tone="purple" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Salto Alto (cm)" error={errors.highJump?.message}>
                        <Input type="number" step="0.1" {...register("highJump", { valueAsNumber: true })} disabled={isLoading} />
                    </Field>

                    <Field label="Salto Bipodal (cm)" error={errors.bipodalJump?.message}>
                        <Input type="number" step="0.1" {...register("bipodalJump", { valueAsNumber: true })} disabled={isLoading} />
                    </Field>

                    <Field label="Salto Unipodal Der. (cm)" error={errors.rightUnipodalJump?.message}>
                        <Input type="number" step="0.1" {...register("rightUnipodalJump", { valueAsNumber: true })} disabled={isLoading} />
                    </Field>

                    <Field label="Salto Unipodal Izq. (cm)" error={errors.leftUnipodalJump?.message}>
                        <Input type="number" step="0.1" {...register("leftUnipodalJump", { valueAsNumber: true })} disabled={isLoading} />
                    </Field>

                    <Field label="Tiempo 30m (s)" error={errors.thirtyMetersTime?.message}>
                        <Input type="number" step="0.01" {...register("thirtyMetersTime", { valueAsNumber: true })} disabled={isLoading} />
                    </Field>

                    <Field label="Tiempo 1000m (s)" error={errors.thousandMetersTime?.message}>
                        <Input type="number" step="0.1" {...register("thousandMetersTime", { valueAsNumber: true })} disabled={isLoading} />
                    </Field>
                </div>

                <ModalFooter onCancel={onClose} submitText="Crear" isLoading={isLoading} />
            </form>
        </BaseModal>
    );
};