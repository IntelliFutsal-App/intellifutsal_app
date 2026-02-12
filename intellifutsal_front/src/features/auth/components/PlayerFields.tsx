import { type UseFormRegister, type FieldErrors, Controller, type Control } from "react-hook-form";
import { FiUser, FiCalendar } from "react-icons/fi";
import { Input, Select } from "@shared/components";
import type { RegisterFormData } from "../schemas";

interface PlayerFieldsProps {
    register: UseFormRegister<RegisterFormData>;
    control: Control<RegisterFormData>;
    errors: FieldErrors<RegisterFormData>;
    positionOptions: Array<{ value: string; label: string }>;
}

const getFieldError = (errors: FieldErrors<RegisterFormData>, field: string): string | undefined => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (errors as any)[field]?.message;
};

export const PlayerFields = ({ register, control, errors, positionOptions }: PlayerFieldsProps) => {
    return (
        <div className="space-y-4">
            <div className="max-h-[420px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
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

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        {...register("height", { valueAsNumber: true })}
                        label="Altura (m) *"
                        type="number"
                        step="0.01"
                        placeholder="1.75"
                        error={getFieldError(errors, "height")}
                    />
                    <Input
                        {...register("weight", { valueAsNumber: true })}
                        label="Peso (kg) *"
                        type="number"
                        step="0.1"
                        placeholder="70"
                        error={getFieldError(errors, "weight")}
                    />
                </div>

                <Controller
                    name="position"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            label="Posición *"
                            options={positionOptions}
                            placeholder="Selecciona tu posición"
                            error={getFieldError(errors, "position")}
                        />
                    )}
                />

                <div className="border-t border-gray-200 pt-4 mt-4">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Métricas Físicas *</p>
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            {...register("highJump", { valueAsNumber: true })}
                            label="Salto Vertical (m)"
                            type="number"
                            step="0.01"
                            placeholder="0.45"
                            error={getFieldError(errors, "highJump")}
                        />
                        <Input
                            {...register("bipodalJump", { valueAsNumber: true })}
                            label="Salto Bipodal (m)"
                            type="number"
                            step="0.01"
                            placeholder="2.30"
                            error={getFieldError(errors, "bipodalJump")}
                        />
                        <Input
                            {...register("rightUnipodalJump", { valueAsNumber: true })}
                            label="Salto Unipodal Der. (m)"
                            type="number"
                            step="0.01"
                            placeholder="1.80"
                            error={getFieldError(errors, "rightUnipodalJump")}
                        />
                        <Input
                            {...register("leftUnipodalJump", { valueAsNumber: true })}
                            label="Salto Unipodal Izq. (m)"
                            type="number"
                            step="0.01"
                            placeholder="1.75"
                            error={getFieldError(errors, "leftUnipodalJump")}
                        />
                        <Input
                            {...register("thirtyMetersTime", { valueAsNumber: true })}
                            label="Tiempo 30m (seg)"
                            type="number"
                            step="0.01"
                            placeholder="4.5"
                            error={getFieldError(errors, "thirtyMetersTime")}
                        />
                        <Input
                            {...register("thousandMetersTime", { valueAsNumber: true })}
                            label="Tiempo 1000m (seg)"
                            type="number"
                            step="0.01"
                            placeholder="240"
                            error={getFieldError(errors, "thousandMetersTime")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};