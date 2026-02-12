import { FaUsers, FaTrophy, FaCheckCircle, FaClock, FaTimes } from "react-icons/fa";
import { Badge, Button } from "@shared/components";
import type { TeamResponse, JoinRequestResponse } from "@features/team/types";
import { formatDate } from "@shared/utils/dateUtils";

interface TeamSearchCardProps {
    team: TeamResponse;
    myRequest?: JoinRequestResponse;
    onSendRequest: (teamId: number) => void;
    onCancelRequest: (requestId: number) => void;
}

const getRequestStatusInfo = (status?: string) => {
    switch (status) {
        case "PENDING":
            return { variant: "warning" as const, label: "Pendiente", icon: FaClock };
        case "APPROVED":
            return { variant: "success" as const, label: "Aprobada", icon: FaCheckCircle };
        case "REJECTED":
            return { variant: "danger" as const, label: "Rechazada", icon: FaTimes };
        default:
            return null;
    }
};

export const TeamSearchCard = ({
    team,
    myRequest,
    onSendRequest,
    onCancelRequest,
}: TeamSearchCardProps) => {
    const requestStatus = myRequest ? getRequestStatusInfo(myRequest.status) : null;
    const canSendRequest = !myRequest || myRequest.status === "REJECTED";
    const canCancelRequest = myRequest?.status === "PENDING";

    return (
        <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
            {/* Header */}
            <div className="bg-linear-to-br from-orange-600 to-orange-700 p-5 sm:p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />

                <div className="relative">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-white text-lg sm:text-xl mb-1 truncate" title={team.name}>
                                {team.name}
                            </h3>
                            <p className="text-blue-100 text-sm font-medium truncate" title={team.category}>
                                {team.category}
                            </p>
                        </div>

                        <Badge variant="success" className="shrink-0 bg-white/15 text-white border border-white/20">
                            Activo
                        </Badge>
                    </div>

                    {myRequest && requestStatus && (
                        <div className="flex items-center gap-2 mt-2">
                            <Badge
                                variant={requestStatus.variant}
                                icon={requestStatus.icon}
                                className="text-xs"
                            >
                                {requestStatus.label}
                            </Badge>
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-linear-to-br from-blue-50 to-blue-100/30 rounded-xl p-3 border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                            <FaUsers className="text-blue-600 text-sm" />
                            <p className="text-xs font-semibold text-blue-700">Jugadores</p>
                        </div>
                        <p className="text-lg font-bold text-gray-800">{team.playerCount}</p>
                    </div>

                    <div className="bg-linear-to-br from-purple-50 to-purple-100/30 rounded-xl p-3 border border-purple-200">
                        <div className="flex items-center gap-2 mb-1">
                            <FaTrophy className="text-purple-600 text-sm" />
                            <p className="text-xs font-semibold text-purple-700">Categoría</p>
                        </div>
                        <p className="text-sm font-bold text-gray-800">{team.category}</p>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-linear-to-br from-gray-50 to-blue-50/30 rounded-xl p-4 mb-4 border border-gray-100">
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-600">Fundado:</span>
                            <span className="font-semibold text-gray-800">
                                {formatDate(new Date(team.createdAt))}
                            </span>
                        </div>

                        {team.averageAge && (
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-gray-600">Edad promedio:</span>
                                <span className="font-semibold text-gray-800">{team.averageAge} años</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Request Info */}
                {myRequest && myRequest.status === "PENDING" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                        <p className="text-xs text-amber-800">
                            <span className="font-bold">Solicitud pendiente:</span> Tu solicitud está siendo
                            revisada por los entrenadores del equipo.
                        </p>
                    </div>
                )}

                {myRequest && myRequest.status === "APPROVED" && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                        <p className="text-xs text-green-800">
                            <span className="font-bold">✅ ¡Aprobada!</span> Ya eres parte de este equipo.
                        </p>
                    </div>
                )}

                {myRequest && myRequest.status === "REJECTED" && myRequest.reviewComment && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                        <p className="text-xs text-red-800 mb-1">
                            <span className="font-bold">❌ Rechazada:</span>
                        </p>
                        <p className="text-xs text-red-700 italic">"{myRequest.reviewComment}"</p>
                    </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-1 gap-3">
                    {canSendRequest && (
                        <Button
                            onClick={() => onSendRequest(team.id)}
                            variant="primary"
                            icon={FaUsers}
                            iconPosition="left"
                            fullWidth
                            size="sm"
                        >
                            Solicitar Unirme
                        </Button>
                    )}

                    {canCancelRequest && (
                        <Button
                            onClick={() => onCancelRequest(myRequest!.id)}
                            variant="ghost"
                            icon={FaTimes}
                            iconPosition="left"
                            fullWidth
                            size="sm"
                        >
                            Cancelar Solicitud
                        </Button>
                    )}

                    {myRequest?.status === "APPROVED" && (
                        <Button variant="secondary" fullWidth size="sm" disabled>
                            Ya eres miembro
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};