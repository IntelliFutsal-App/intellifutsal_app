import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaPlus } from "react-icons/fa";
import { BaseModal, Button, Input, Select } from "@shared/components";
import { createTeamSchema, type CreateTeamSchema } from "@features/team/schemas/createTeamSchema";

interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: CreateTeamSchema) => Promise<void>;
}

const CATEGORY_OPTIONS = [
    { value: "Junior", label: "Junior" },
    { value: "Senior", label: "Senior" },
    { value: "Amateur", label: "Amateur" },
    { value: "Professional", label: "Profesional" },
];

export const CreateTeamModal = ({ isOpen, onClose, onCreate }: CreateTeamModalProps) => {
    const [isCreating, setIsCreating] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateTeamSchema>({
        resolver: zodResolver(createTeamSchema),
        defaultValues: {
            name: "",
            category: undefined,
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = async (data: CreateTeamSchema) => {
        try {
            setIsCreating(true);
            await onCreate(data);
            handleClose();
        } catch (error) {
            console.error("Error al crear equipo:", error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Crear Nuevo Equipo"
            subtitle="Configura los detalles básicos del equipo"
            icon={FaPlus}
            iconColor="orange"
            maxWidth="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre del equipo <span className="text-red-500">*</span>
                    </label>
                    <Input
                        {...register("name")}
                        placeholder="Ej: USB Cali Sub-20"
                        error={errors.name?.message}
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Categoría <span className="text-red-500">*</span>
                    </label>
                    <Select
                        {...register("category")}
                        options={CATEGORY_OPTIONS}
                        placeholder="Selecciona una categoría"
                    />
                    {errors.category && (
                        <p className="text-xs text-red-600 mt-1">{errors.category.message}</p>
                    )}
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs text-blue-800">
                        <span className="font-bold">Nota:</span> Una vez creado el equipo, serás
                        automáticamente asignado como director técnico. Podrás agregar jugadores desde la
                        sección de gestión del equipo.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        fullWidth
                        onClick={handleClose}
                        disabled={isCreating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={isCreating}
                        disabled={isCreating}
                        icon={FaPlus}
                        iconPosition="left"
                    >
                        {isCreating ? "Creando..." : "Crear Equipo"}
                    </Button>
                </div>
            </form>
        </BaseModal>
    );
};