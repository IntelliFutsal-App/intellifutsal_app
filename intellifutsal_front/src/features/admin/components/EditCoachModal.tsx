import { BaseModal, Input } from "@shared/ui";
import type { UseFormReturn } from "react-hook-form";
import type { CoachResponse, UpdateCoachSchema } from "@features/coach";
import { Field } from "./Field";
import { ModalFooter } from "./ModalFooter";

interface EditCoachModalProps {
    coach: CoachResponse | null;
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<UpdateCoachSchema>;
    onSubmit: (data: UpdateCoachSchema) => void | Promise<void>;
    isLoading?: boolean;
}

export const EditCoachModal = ({
    coach,
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
}: EditCoachModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    if (!coach) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title="Editar Entrenador"
            subtitle="Actualiza los datos principales (campos opcionales)"
            maxWidth="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="text-xs text-blue-800">
                        Editando:{" "}
                        <span className="font-semibold">
                            {coach.firstName} {coach.lastName}
                        </span>{" "}
                        <span className="text-blue-700/80">(ID: {coach.id})</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Nombre" error={errors.firstName?.message} hint="Puedes dejarlo igual si no necesitas cambiarlo">
                        <Input {...register("firstName")} placeholder="Opcional" disabled={isLoading} />
                    </Field>

                    <Field label="Apellido" error={errors.lastName?.message} hint="Puedes dejarlo igual si no necesitas cambiarlo">
                        <Input {...register("lastName")} placeholder="Opcional" disabled={isLoading} />
                    </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Años de Experiencia" error={errors.expYears?.message} hint="Puedes dejarlo igual si no necesitas cambiarlo">
                        <Input
                            type="number"
                            {...register("expYears", { valueAsNumber: true })}
                            placeholder="Opcional"
                            disabled={isLoading}
                        />
                    </Field>

                    <Field label="Especialidad" error={errors.specialty?.message} hint="Puedes dejarlo igual si no necesitas cambiarlo">
                        <Input {...register("specialty")} placeholder="Opcional" disabled={isLoading} />
                    </Field>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-xs text-amber-800">
                        <span className="font-semibold">Nota:</span> Campos vacíos se interpretan como “sin cambios”.
                    </p>
                </div>

                <ModalFooter onCancel={onClose} submitText="Actualizar" isLoading={isLoading} />
            </form>
        </BaseModal>
    );
};