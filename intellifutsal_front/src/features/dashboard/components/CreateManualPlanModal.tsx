import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaPlus } from "react-icons/fa";
import { BaseModal, Button, Input, Select, TextArea } from "@shared/components";
import { createManualTrainingPlanSchema, type CreateManualTrainingPlanSchema } from "@features/training/schemas/createManualTrainingPlanSchema";

interface CreateManualPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: CreateManualTrainingPlanSchema) => Promise<void>;
}

const DIFFICULTY_OPTIONS = [
    { value: "EASY", label: "Fácil" },
    { value: "MEDIUM", label: "Media" },
    { value: "HARD", label: "Difícil" },
];

const FOCUS_AREA_OPTIONS = [
    { value: "physical", label: "Físico" },
    { value: "tactical", label: "Táctico" },
    { value: "technical", label: "Técnico" },
    { value: "psychological", label: "Psicológico" },
    { value: "physical & tactical", label: "Físico y Táctico" },
    { value: "physical & positional", label: "Físico y Posicional" },
];

export const CreateManualPlanModal = ({ isOpen, onClose, onCreate }: CreateManualPlanModalProps) => {
    const [isCreating, setIsCreating] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateManualTrainingPlanSchema>({
        resolver: zodResolver(createManualTrainingPlanSchema),
        defaultValues: {
            title: "",
            description: "",
            difficulty: "MEDIUM",
            durationMinutes: 60,
            focusArea: "physical",
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = async (data: CreateManualTrainingPlanSchema) => {
        try {
            setIsCreating(true);
            await onCreate(data);
            handleClose();
        } catch (error) {
            console.error("Error al crear plan:", error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Crear Plan Manual"
            subtitle="Define tu plan de entrenamiento personalizado"
            icon={FaPlus}
            iconColor="blue"
            maxWidth="2xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Título del plan <span className="text-red-500">*</span>
                    </label>
                    <Input
                        {...register("title")}
                        placeholder="Ej: Desarrollo de Resistencia Aeróbica"
                        error={errors.title?.message}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Descripción <span className="text-red-500">*</span>
                    </label>
                    <TextArea
                        {...register("description")}
                        placeholder="Describe los objetivos y metodología del plan..."
                        rows={4}
                        error={errors.description?.message}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Difficulty */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Dificultad</label>
                        <Select {...register("difficulty")} options={DIFFICULTY_OPTIONS} />
                        {errors.difficulty && (
                            <p className="text-xs text-red-600 mt-1">{errors.difficulty.message}</p>
                        )}
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Duración (minutos)
                        </label>
                        <Input
                            {...register("durationMinutes", { valueAsNumber: true })}
                            type="number"
                            placeholder="60"
                            error={errors.durationMinutes?.message}
                        />
                    </div>
                </div>

                {/* Focus Area */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Área de enfoque</label>
                    <Select {...register("focusArea")} options={FOCUS_AREA_OPTIONS} />
                    {errors.focusArea && (
                        <p className="text-xs text-red-600 mt-1">{errors.focusArea.message}</p>
                    )}
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs text-blue-800">
                        <span className="font-bold">Nota:</span> El plan creado quedará en estado "Pendiente
                        de Aprobación" hasta que sea revisado y aprobado.
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
                        {isCreating ? "Creando..." : "Crear Plan"}
                    </Button>
                </div>
            </form>
        </BaseModal>
    );
};