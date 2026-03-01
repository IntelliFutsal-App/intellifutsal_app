import { BaseModal, Button } from "@shared/components";
import { FaExclamationTriangle } from "react-icons/fa";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    title?: string;
    description?: string;
    itemName?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmDeleteModal = ({
    isOpen,
    title = "Confirmar eliminación",
    description = "Esta acción no se puede deshacer.",
    itemName,
    confirmText = "Eliminar",
    cancelText = "Cancelar",
    isLoading = false,
    onClose,
    onConfirm,
}: ConfirmDeleteModalProps) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title={title}
            subtitle="Por favor confirma para continuar"
            maxWidth="md"
            usePortal
        >
            <div className="space-y-4">
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                        <FaExclamationTriangle />
                    </div>

                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-red-900">
                            ¿Eliminar {itemName ? <span className="font-black">{itemName}</span> : "este registro"}?
                        </p>
                        <p className="text-xs text-red-800 mt-1">{description}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isLoading ? "Eliminando..." : confirmText}
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
};