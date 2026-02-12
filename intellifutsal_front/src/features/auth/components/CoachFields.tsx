import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { FiUser, FiCalendar, FiTrendingUp, FiActivity } from "react-icons/fi";
import { Input } from "@shared/components";
import type { RegisterFormData } from "../schemas";

interface CoachFieldsProps {
    register: UseFormRegister<RegisterFormData>;
    errors: FieldErrors<RegisterFormData>;
}

const getFieldError = (errors: FieldErrors<RegisterFormData>, field: string): string | undefined => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (errors as any)[field]?.message;
};

export const CoachFields = ({ register, errors }: CoachFieldsProps) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    {...register("firstName")}
                    label="Nombre *"
                    placeholder="Juan"
                    leftIcon={FiUser}
                    error={getFieldError(errors, "firstName")}
                />
                <Input
                    {...register("lastName")}
                    label="Apellido *"
                    placeholder="Pérez"
                    leftIcon={FiUser}
                    error={getFieldError(errors, "lastName")}
                />
            </div>

            <Input
                {...register("birthDate")}
                label="Fecha de Nacimiento *"
                type="date"
                leftIcon={FiCalendar}
                error={getFieldError(errors, "birthDate")}
            />

            <Input
                {...register("expYears", { valueAsNumber: true })}
                label="Años de Experiencia *"
                type="number"
                placeholder="5"
                leftIcon={FiTrendingUp}
                error={getFieldError(errors, "expYears")}
            />

            <Input
                {...register("specialty")}
                label="Especialidad *"
                placeholder="Entrenamiento táctico, preparación física..."
                leftIcon={FiActivity}
                error={getFieldError(errors, "specialty")}
            />
        </div>
    );
};