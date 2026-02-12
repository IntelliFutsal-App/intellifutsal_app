import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCheck, FaTimes } from "react-icons/fa";
import { BaseModal, Button, TextArea } from "@shared/components";
import { approveRejectPlanSchema, type ApproveRejectPlanSchema } from "@features/training/schemas/approveRejectPlanSchema";

interface ApproveRejectPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    planTitle: string;
    action: "approve" | "reject";
    onConfirm: (data: ApproveRejectPlanSchema) => Promise<void>;
}

export const ApproveRejectPlanModal = ({
    isOpen,
    onClose,
    planTitle,
    action,
    onConfirm,
}: ApproveRejectPlanModalProps) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ApproveRejectPlanSchema>({
        resolver: zodResolver(approveRejectPlanSchema),
        defaultValues: {
            approvalComment: "",
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = async (data: ApproveRejectPlanSchema) => {
        try {
            setIsProcessing(true);
            await onConfirm(data);
            handleClose();
        } catch (error) {
            console.error("Error al procesar plan:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const isApprove = action === "approve";
    const Icon = isApprove ? FaCheck : FaTimes;
    const iconColor = isApprove ? "green" : "red";
    const title = isApprove ? "Aprobar Plan" : "Rechazar Plan";
    const actionLabel = isApprove ? "Aprobar" : "Rechazar";

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            subtitle={planTitle}
            icon={Icon}
            iconColor={iconColor}
            maxWidth="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Confirmation Message */}
                <div
                    className={`rounded-xl p-4 border ${isApprove ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                        }`}
                >
                    <p className={`text-sm ${isApprove ? "text-green-800" : "text-red-800"}`}>
                        {isApprove ? (
                            <>
                                ¿Estás seguro de que deseas <strong>aprobar</strong> este plan? El plan
                                quedará disponible para ser asignado a jugadores.
                            </>
                        ) : (
                            <>
                                ¿Estás seguro de que deseas <strong>rechazar</strong> este plan? Esta acción
                                marcará el plan como no apto.
                            </>
                        )}
                    </p>
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Comentario (opcional)
                    </label>
                    <TextArea
                        {...register("approvalComment")}
                        placeholder={
                            isApprove
                                ? "Agrega observaciones o sugerencias..."
                                : "Explica el motivo del rechazo..."
                        }
                        rows={3}
                        error={errors.approvalComment?.message}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        fullWidth
                        onClick={handleClose}
                        disabled={isProcessing}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant={isApprove ? "success" : "danger"}
                        fullWidth
                        loading={isProcessing}
                        disabled={isProcessing}
                        icon={Icon}
                        iconPosition="left"
                    >
                        {isProcessing ? "Procesando..." : actionLabel}
                    </Button>
                </div>
            </form>
        </BaseModal>
    );
};