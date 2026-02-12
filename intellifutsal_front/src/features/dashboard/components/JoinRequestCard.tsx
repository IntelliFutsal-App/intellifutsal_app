import type { JoinRequestStatus } from "@features/team/types";
import { Badge, Button } from "@shared/components";
import { FaCheck, FaTimes } from "react-icons/fa";

type JoinRequestCardVM = {
    id: number;
    playerName: string;
    teamName: string;
    status: JoinRequestStatus;
};

interface JoinRequestCardProps {
    request: JoinRequestCardVM;
    isActing?: boolean;
    onApprove?: (id: number) => void;
    onReject?: (id: number) => void;
}

const STATUS_BADGE: Record<JoinRequestStatus, { label: string; variant: "warning" | "success" | "danger" | "neutral" }> = {
    PENDING: { label: "PENDIENTE", variant: "warning" },
    APPROVED: { label: "APROBADA", variant: "success" },
    REJECTED: { label: "RECHAZADA", variant: "danger" },
    CANCELLED: { label: "CANCELADA", variant: "neutral" },
};

export const JoinRequestCard = ({ request, isActing = false, onApprove, onReject }: JoinRequestCardProps) => {
    const badge = STATUS_BADGE[request.status];

    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(request.playerName)}&background=ea580c&color=fff`}
                            alt={request.playerName}
                            className="w-12 h-12 rounded-xl ring-2 ring-orange-200 group-hover:ring-4 transition-all duration-300"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white" />
                    </div>

                    <div className="min-w-0">
                        <h4 className="font-bold text-gray-800 truncate">{request.playerName}</h4>
                        <p className="text-xs text-gray-600 truncate">{request.teamName}</p>
                    </div>
                </div>

                <Badge variant={badge.variant} className="w-fit">
                    {badge.label}
                </Badge>
            </div>

            {request.status === "PENDING" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    <Button
                        disabled={isActing}
                        loading={isActing}
                        onClick={() => onApprove?.(request.id)}
                        variant="success"
                        icon={FaCheck}
                        iconPosition="left"
                        fullWidth
                        size="xs"
                    >
                        Aprobar
                    </Button>

                    <Button
                        disabled={isActing}
                        loading={isActing}
                        onClick={() => onReject?.(request.id)}
                        variant="danger"
                        icon={FaTimes}
                        iconPosition="left"
                        fullWidth
                        size="xs"
                    >
                        Rechazar
                    </Button>
                </div>
            )}
        </div>
    );
};