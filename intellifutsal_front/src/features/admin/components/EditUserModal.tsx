import { BaseModal, Input } from "@shared/components";
import type { UseFormReturn } from "react-hook-form";
import type { UpdateCredentialSchema, UserResponse } from "@features/profile";
import { Field } from "./Field";
import { ModalFooter } from "./ModalFooter";

interface EditUserModalProps {
    user: UserResponse | null;
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<UpdateCredentialSchema>;
    onSubmit: (data: UpdateCredentialSchema) => void | Promise<void>;
    isLoading?: boolean;
}

export const EditUserModal = ({
    user,
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
}: EditUserModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    if (!user) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title="Editar Usuario"
            subtitle="Actualiza email y/o contraseña"
            maxWidth="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
                    <p className="text-xs text-blue-800">
                        Editando: <span className="font-semibold">{user.email}</span>{" "}
                        <span className="text-blue-700/80">(ID: {user.id})</span>
                    </p>
                </div>

                <Field
                    label="Email"
                    error={errors.email?.message}
                    hint="Puedes dejarlo igual si no necesitas cambiarlo"
                >
                    <Input
                        {...register("email")}
                        placeholder="correo@ejemplo.com"
                        disabled={isLoading}
                    />
                </Field>

                <Field
                    label="Contraseña"
                    error={errors.password?.message}
                    hint="Puedes dejarlo igual si no necesitas cambiarlo"
                >
                    <Input
                        type="password"
                        {...register("password")}
                        placeholder="********"
                        disabled={isLoading}
                    />
                </Field>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
                    <p className="text-xs text-amber-800">
                        <span className="font-semibold">Tip:</span> Si cambias la contraseña, el usuario deberá iniciar sesión nuevamente.
                    </p>
                </div>

                <ModalFooter onCancel={onClose} submitText="Actualizar" isLoading={isLoading} />
            </form>
        </BaseModal>
    );
};