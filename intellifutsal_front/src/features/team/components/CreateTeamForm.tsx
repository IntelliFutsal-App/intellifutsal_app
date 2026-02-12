import { Controller } from "react-hook-form";
import { FiArrowLeft, FiCheck, FiUsers } from "react-icons/fi";
import { Button, Input, Select } from "@shared/components";
import { useCreateTeamForm } from "../hooks/useCreateTeamForm";

interface CreateTeamFormProps {
    onBack: () => void;
}

export const CreateTeamForm = ({ onBack }: CreateTeamFormProps) => {
    const { form, isLoading, categoryOptions, onSubmit } = useCreateTeamForm();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = form;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Back */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    icon={FiArrowLeft}
                    iconPosition="left"
                    onClick={onBack}
                    className="px-0!"
                >
                    Volver
                </Button>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-display font-bold text-gray-900">
                    Crear Nuevo Equipo
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Completa los datos de tu equipo para comenzar
                </p>
            </div>

            {/* Form */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        {...register("name")}
                        label="Nombre del Equipo *"
                        placeholder="ej: FC Barcelona Futsal"
                        leftIcon={FiUsers}
                        error={errors.name?.message}
                        disabled={isLoading}
                    />

                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Categoría *"
                                options={categoryOptions}
                                placeholder="Selecciona una categoría"
                                error={errors.category?.message}
                                disabled={isLoading}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                            />
                        )}
                    />

                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={isLoading}
                            disabled={isLoading}
                            icon={FiCheck}
                            iconPosition="left"
                        >
                            Crear Equipo
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};