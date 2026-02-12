import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaDumbbell } from "react-icons/fa";
import { BaseModal, Button, Input, TextArea } from "@shared/components";
import type { TrainingAssignmentResponse } from "@features/training/types";
import { recordProgressSchema, type RecordProgressSchema } from "@features/training/schemas";

interface RecordProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignment: TrainingAssignmentResponse | null;
    onRecord: (assignmentId: number, data: { completionPercentage: number; notes?: string }) => Promise<void>;
}

export const RecordProgressModal = ({
    isOpen,
    onClose,
    assignment,
    onRecord,
}: RecordProgressModalProps) => {
    const [isRecording, setIsRecording] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<RecordProgressSchema>({
        resolver: zodResolver(recordProgressSchema),
        defaultValues: {
            completionPercentage: 0,
            notes: "",
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = async (data: RecordProgressSchema) => {
        if (!assignment) return;

        try {
            setIsRecording(true);
            await onRecord(assignment.id, {
                completionPercentage: data.completionPercentage,
                notes: data.notes,
            });
            handleClose();
        } catch (error) {
            console.error("Error al registrar progreso:", error);
        } finally {
            setIsRecording(false);
        }
    };

    if (!assignment) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Registrar Progreso"
            subtitle={`Entrenamiento #${assignment.id}`}
            icon={FaDumbbell}
            iconColor="orange"
            maxWidth="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Completion Percentage */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Porcentaje de Completitud <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        placeholder="0-100"
                        {...register("completionPercentage", { valueAsNumber: true })}
                        error={errors.completionPercentage?.message}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Indica qué porcentaje del entrenamiento has completado hoy
                    </p>

                    {/* Quick Buttons */}
                    <div className="flex gap-2 mt-3">
                        {[25, 50, 75, 100].map((percentage) => (
                            <button
                                key={percentage}
                                type="button"
                                onClick={() => setValue("completionPercentage", percentage)}
                                className="flex-1 px-3 py-2 text-xs font-medium bg-linear-to-br from-orange-50 to-orange-100/30 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                            >
                                {percentage}%
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Notas (Opcional)
                    </label>
                    <TextArea
                        {...register("notes")}
                        placeholder="¿Cómo te sentiste? ¿Tuviste alguna dificultad? ¿Qué fue lo que más te costó?"
                        rows={4}
                        error={errors.notes?.message}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Comparte tus observaciones sobre esta sesión de entrenamiento
                    </p>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs text-blue-800">
                        <span className="font-bold">Importante:</span> Tu progreso será visible para tu
                        entrenador. Sé honesto con tu evaluación para que pueda ayudarte mejor.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        fullWidth
                        onClick={handleClose}
                        disabled={isRecording}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={isRecording}
                        disabled={isRecording}
                        icon={FaDumbbell}
                        iconPosition="left"
                    >
                        {isRecording ? "Guardando..." : "Registrar Progreso"}
                    </Button>
                </div>
            </form>
        </BaseModal>
    );
};