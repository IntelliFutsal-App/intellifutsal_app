import { useMemo } from "react";
import type { JoinRequestStatus, JoinRequestResponse } from "@features/team/types";
import { useProfile } from "@shared/hooks";
import { Badge, InlineLoading } from "@shared/components";
import { JoinRequestCard } from "./JoinRequestCard";
import { useJoinRequests } from "../hooks/useJoinRequests";

type JoinRequestCardVM = {
    id: number;
    playerName: string;
    teamName: string;
    status: JoinRequestStatus;
};

export const JoinRequestsSection = () => {
    const { activeTeamId, profileState } = useProfile();

    const { requests, loading, actingById, pendingCount, approve, reject } =
        useJoinRequests(activeTeamId);

    const vmRequests: JoinRequestCardVM[] = useMemo(() => {
        const teamNameById = new Map<number, string>(
            (profileState?.teams ?? []).map((t) => [t.id, t.name])
        );

        return requests.map((r: JoinRequestResponse) => ({
            id: r.id,
            status: r.status,
            teamName: teamNameById.get(r.teamId) ?? `Equipo #${r.teamId}`,
            playerName: `Jugador #${r.playerId}`,
        }));
    }, [requests, profileState?.teams]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Solicitudes de Ingreso
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Revisa y gestiona las solicitudes de nuevos jugadores
                        </p>
                    </div>

                    <Badge variant="warning" className="w-fit">
                        {pendingCount} pendientes
                    </Badge>
                </div>
            </div>

            {/* States */}
            {!activeTeamId ? (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-10 border border-gray-100 shadow-xl text-center text-gray-600">
                    Selecciona un equipo activo para ver solicitudes.
                </div>
            ) : loading ? (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-10 border border-gray-100 shadow-xl text-center">
                    <InlineLoading title="Cargando solicitudes..." description="Preparando tus métricas y análisis" />
                </div>
            ) : vmRequests.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-10 border border-gray-100 shadow-xl text-center text-gray-600">
                    No hay solicitudes para este equipo.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {vmRequests.map((req) => (
                        <JoinRequestCard
                            key={req.id}
                            request={req}
                            isActing={!!actingById[req.id]}
                            onApprove={approve}
                            onReject={reject}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};