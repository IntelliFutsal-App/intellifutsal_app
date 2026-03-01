import { BaseModal, Badge, InlineLoading } from "@shared/components";
import type { TrainingProgressResponse } from "@features/training/types";
import { formatStringDate } from "@shared/utils";
import { FaClipboardCheck } from "react-icons/fa";

interface AssignmentProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading?: boolean;
    assignmentId: number | null;
    progress: TrainingProgressResponse[];
}

export const AssignmentProgressModal = ({
    isOpen,
    onClose,
    isLoading = false,
    assignmentId,
    progress,
}: AssignmentProgressModalProps) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={isLoading ? () => undefined : onClose}
            title="Progreso de Asignación"
            subtitle={assignmentId ? `Asignación #${assignmentId}` : "Detalle de progreso"}
            maxWidth="lg"
            icon={FaClipboardCheck}
            iconColor="blue"
            usePortal
        >
            {isLoading ? (
                <InlineLoading title="Cargando progreso..." description="Consultando registros" />
            ) : progress.length === 0 ? (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700">
                    No hay progresos registrados para esta asignación.
                </div>
            ) : (
                <div className="space-y-3">
                    {progress
                        .slice()
                        .sort((a, b) => +new Date(b.progressDate) - +new Date(a.progressDate))
                        .map((p) => (
                            <div
                                key={p.id}
                                className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-800">
                                            {formatStringDate(p.progressDate as unknown as string)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {p.completionPercentage}% completado
                                        </p>
                                    </div>

                                    <Badge
                                        variant={p.coachVerified ? "success" : "warning"}
                                        className="w-fit"
                                    >
                                        {p.coachVerified ? "Verificado" : "Sin verificar"}
                                    </Badge>
                                </div>

                                {p.notes ? (
                                    <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">
                                        {p.notes}
                                    </p>
                                ) : null}

                                {p.verificationComment ? (
                                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-xs font-semibold text-blue-900">Comentario de verificación</p>
                                        <p className="text-sm text-blue-900 mt-1 whitespace-pre-wrap">
                                            {p.verificationComment}
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        ))}
                </div>
            )}
        </BaseModal>
    );
};