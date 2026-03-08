import { BaseModal, Input, Select, type SelectOption } from "@shared/ui";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { CreateCredentialSchema } from "@features/profile";
import { Field } from "./Field";
import { ModalFooter } from "./ModalFooter";
import { ROLE_OPTIONS } from "../types";

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<CreateCredentialSchema>;
    onSubmit: (data: CreateCredentialSchema) => void | Promise<void>;
    isLoading?: boolean;
}

export const CreateUserModal = ({
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
}: CreateUserModalProps) => {
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
            title="Crear Usuario"
            subtitle="Crea credenciales y asigna un rol"
            maxWidth="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Field label="Email" required error={errors.email?.message} hint="Ej. correo@ejemplo.com">
                    <Input
                        {...register("email")}
                        placeholder="correo@ejemplo.com"
                        disabled={isLoading}
                    />
                </Field>

                <Field
                    label="Contraseña"
                    required
                    error={errors.password?.message}
                    hint="Mínimo 8 caracteres"
                >
                    <Input
                        type="password"
                        {...register("password")}
                        placeholder="********"
                        disabled={isLoading}
                    />
                </Field>

                <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                        <Field label="Rol" required error={errors.role?.message} hint="Define permisos del usuario">
                            <Select
                                options={ROLE_OPTIONS as SelectOption[]}
                                placeholder="Seleccionar rol"
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

                <ModalFooter onCancel={onClose} submitText="Crear" isLoading={isLoading} />
            </form>
        </BaseModal>
    );
};