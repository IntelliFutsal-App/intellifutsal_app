import { type UseFormRegister, type FieldErrors, Controller, type Control } from "react-hook-form";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { Input, Select } from "@shared/components";
import type { RegisterFormData } from "../schemas";

interface BaseFieldsProps {
    register: UseFormRegister<RegisterFormData>;
    control: Control<RegisterFormData>;
    errors: FieldErrors<RegisterFormData>;
    roleOptions: Array<{ value: string; label: string }>;
}

export const BaseFields = ({ register, control, errors, roleOptions }: BaseFieldsProps) => {
    return (
        <div className="space-y-4">
            <Input
                {...register("email")}
                label="Correo Electrónico *"
                type="email"
                placeholder="tu@email.com"
                leftIcon={FiMail}
                error={errors.email?.message}
                autoComplete="email"
            />

            <Input
                {...register("password")}
                label="Contraseña *"
                type="password"
                placeholder="••••••••"
                leftIcon={FiLock}
                showPasswordToggle
                error={errors.password?.message}
                helperText="Mínimo 6 caracteres, una mayúscula y un número"
                autoComplete="new-password"
            />

            <Input
                {...register("confirmPassword")}
                label="Confirmar Contraseña *"
                type="password"
                placeholder="••••••••"
                leftIcon={FiLock}
                showPasswordToggle
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
            />

            <Controller
                name="role"
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        label="Tipo de Cuenta *"
                        options={roleOptions}
                        leftIcon={FiUser}
                        placeholder="Selecciona tu rol"
                        error={errors.role?.message}
                    />
                )}
            />
        </div>
    );
};