import { BaseModal, Input } from "@shared/ui";
import type { UseFormReturn } from "react-hook-form";
import type { CreateCoachSchema } from "@features/coach";
import { Field } from "./Field";
import { ModalFooter } from "./ModalFooter";

interface CreateCoachModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<CreateCoachSchema>;
    onSubmit: (data: CreateCoachSchema) => void | Promise<void>;
    isLoading?: boolean;
}

export const CreateCoachModal = ({
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
}: CreateCoachModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title="Crear Entrenador"
            subtitle="Registra un entrenador nuevo en la plataforma"
            maxWidth="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Nombre" required error={errors.firstName?.message}>
                        <Input {...register("firstName")} placeholder="Ej. Juan" disabled={isLoading} />
                    </Field>

                    <Field label="Apellido" required error={errors.lastName?.message}>
                        <Input {...register("lastName")} placeholder="Ej. Pérez" disabled={isLoading} />
                    </Field>
                </div>

                <Field label="Fecha Nacimiento" required error={errors.birthDate?.message}>
                    <Input type="date" {...register("birthDate")} disabled={isLoading} />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Años de Experiencia" required error={errors.expYears?.message}>
                        <Input
                            type="number"
                            {...register("expYears", { valueAsNumber: true })}
                            placeholder="Ej. 5"
                            disabled={isLoading}
                        />
                    </Field>

                    <Field label="Especialidad" required error={errors.specialty?.message}>
                        <Input {...register("specialty")} placeholder="Ej. Futsal" disabled={isLoading} />
                    </Field>
                </div>

                <ModalFooter onCancel={onClose} submitText="Crear" isLoading={isLoading} />
            </form>
        </BaseModal>
    );
};