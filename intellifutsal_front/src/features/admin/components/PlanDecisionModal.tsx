import { BaseModal, Input } from "@shared/ui";
import { Field } from "./Field";
import { ModalFooter } from "./ModalFooter";
import type { UseFormReturn } from "react-hook-form";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import type { PlanDecisionSchema } from "@features/training";

type Mode = "approve" | "reject";

interface PlanDecisionModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<PlanDecisionSchema>;
    onSubmit: (data: PlanDecisionSchema) => void;
    isLoading?: boolean;
    planTitle?: string;
    mode: Mode;
}

export const PlanDecisionModal = ({
    isOpen,
    onClose,
    form,
    onSubmit,
    isLoading = false,
    planTitle,
    mode,
}: PlanDecisionModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    const isApprove = mode === "approve";

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title={isApprove ? "Aprobar Plan" : "Rechazar Plan"}
            subtitle={planTitle ? `Plan: ${planTitle}` : "Decisión administrativa"}
            maxWidth="md"
            icon={isApprove ? FaCheckCircle : FaTimesCircle}
            iconColor={isApprove ? "green" : "red"}
            usePortal
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Field label="Comentario (opcional)" error={errors.approvalComment?.message}>
                    <Input
                        {...register("approvalComment")}
                        placeholder={isApprove ? "Ej. Aprobado por cumplimiento de objetivos" : "Ej. Requiere ajustes"}
                        disabled={isLoading}
                    />
                </Field>

                <ModalFooter
                    onCancel={onClose}
                    submitText={isApprove ? "Aprobar" : "Rechazar"}
                    isLoading={isLoading}
                />
            </form>
        </BaseModal>
    );
};