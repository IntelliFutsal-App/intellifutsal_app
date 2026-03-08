import { useState, useMemo } from "react";
import { FaCheckCircle, FaClock, FaSearch, FaChartLine } from "react-icons/fa";
import { BaseModal, Button, InlineLoading, Input, Badge } from "@shared/ui";
import { useProfile } from "@shared/hooks";
import { StatCard } from "./StatCard";
import { useProgressVerification } from "../hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyProgressSchema, type TrainingProgressResponse, type VerifyProgressSchema } from "@features/training";

export const ProgressVerificationSection = () => {
    const { activeTeamId } = useProfile();
    const { assignments, loading, verifyingId, stats, verifyProgress } = useProgressVerification(activeTeamId);

    const [searchTerm, setSearchTerm] = useState("");
    const [expandedAssignmentId, setExpandedAssignmentId] = useState<number | null>(null);
    const [verifyModal, setVerifyModal] = useState<{
        isOpen: boolean;
        progressId: number;
        playerName: string;
        progressDate: Date;
    } | null>(null);

    const { register, handleSubmit, reset } = useForm<VerifyProgressSchema>({
        resolver: zodResolver(verifyProgressSchema),
    });

    const filteredAssignments = useMemo(() => {
        if (!searchTerm) return assignments;
        const term = searchTerm.toLowerCase();
        return assignments.filter(a => 
            a.player.name.toLowerCase().includes(term) ||
            a.plan?.title.toLowerCase().includes(term)
        );
    }, [assignments, searchTerm]);

    const handleOpenVerifyModal = (progress: TrainingProgressResponse, playerName: string) => {
        setVerifyModal({
            isOpen: true,
            progressId: progress.id,
            playerName,
            progressDate: progress.progressDate,
        });
        reset();
    };

    const handleConfirmVerify = handleSubmit(async (data) => {
        if (!verifyModal) return;
        await verifyProgress(verifyModal.progressId, data.verificationComment);
        setVerifyModal(null);
    });

    if (!activeTeamId) {
        return (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border border-gray-100 shadow-xl text-center">
                <div className="bg-amber-100 rounded-full p-6 w-fit mx-auto mb-4">
                    <FaClock className="text-amber-600 text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Selecciona un equipo</h3>
                <p className="text-gray-600">
                    Para ver y verificar el progreso de los jugadores, primero selecciona un equipo activo.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <InlineLoading title="Cargando progreso..." description="Obteniendo sesiones de entrenamiento" />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={FaChartLine}
                        label="Asignaciones Activas"
                        value={stats.totalAssignments.toString()}
                        color="blue"
                    />
                    <StatCard
                        icon={FaClock}
                        label="Sesiones Pendientes"
                        value={stats.unverifiedSessions.toString()}
                        color="orange"
                    />
                    <StatCard
                        icon={FaCheckCircle}
                        label="Sesiones Verificadas"
                        value={stats.verifiedSessions.toString()}
                        color="green"
                    />
                    <StatCard
                        icon={FaChartLine}
                        label="Completitud Promedio"
                        value={`${stats.avgCompletion}%`}
                        color="purple"
                    />
                </div>

                {/* Header */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-800">Verificación de Progreso</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Revisa y verifica las sesiones de entrenamiento de tus jugadores
                    </p>
                </div>

                {/* Search */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-xl">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <Input
                            placeholder="Buscar por jugador o plan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Empty State */}
                {filteredAssignments.length === 0 && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border border-gray-100 shadow-xl text-center">
                        <div className="bg-gray-100 rounded-full p-6 w-fit mx-auto mb-4">
                            <FaCheckCircle className="text-gray-400 text-4xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {searchTerm ? "No se encontraron resultados" : "No hay asignaciones activas"}
                        </h3>
                        <p className="text-gray-600">
                            {searchTerm
                                ? "Intenta con otro término de búsqueda"
                                : "Las asignaciones activas aparecerán aquí cuando los jugadores tengan planes asignados"}
                        </p>
                    </div>
                )}

                {/* Assignments List */}
                {filteredAssignments.length > 0 && (
                    <div className="space-y-4">
                        {filteredAssignments.map((item) => {
                            const isExpanded = expandedAssignmentId === item.assignment.id;
                            const hasUnverified = item.unverifiedCount > 0;

                            return (
                                <div
                                    key={item.assignment.id}
                                    className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
                                >
                                    {/* Header */}
                                    <div
                                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() =>
                                            setExpandedAssignmentId(isExpanded ? null : item.assignment.id)
                                        }
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-bold text-gray-800 truncate">
                                                        {item.player.name}
                                                    </h3>
                                                    {hasUnverified && (
                                                        <Badge variant="warning">
                                                            {item.unverifiedCount} pendiente{item.unverifiedCount > 1 ? "s" : ""}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {item.plan?.title || "Plan desconocido"}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="text-right">
                                                    <p className="text-gray-500">Sesiones</p>
                                                    <p className="font-bold text-gray-800">{item.totalSessions}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-gray-500">Verificadas</p>
                                                    <p className="font-bold text-green-600">{item.verifiedCount}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-gray-500">Promedio</p>
                                                    <p className="font-bold text-purple-600">{item.avgCompletion}%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && item.progress.length > 0 && (
                                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                                            <h4 className="text-sm font-bold text-gray-700 mb-3">
                                                Historial de Sesiones
                                            </h4>
                                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                                {item.progress
                                                    .sort((a, b) => new Date(b.progressDate).getTime() - new Date(a.progressDate).getTime())
                                                    .map((progress) => (
                                                        <div
                                                            key={progress.id}
                                                            className="bg-white rounded-lg p-3 border border-gray-200"
                                                        >
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <p className="text-sm font-semibold text-gray-800">
                                                                            {new Date(progress.progressDate).toLocaleDateString("es-CO", {
                                                                                day: "2-digit",
                                                                                month: "short",
                                                                                year: "numeric",
                                                                            })}
                                                                        </p>
                                                                        {progress.coachVerified ? (
                                                                            <Badge variant="success">
                                                                                Verificada{progress.verifiedAt && ` el ${new Date(progress.verifiedAt).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}`}
                                                                            </Badge>
                                                                        ) : (
                                                                            <Badge variant="warning">Pendiente</Badge>
                                                                        )}
                                                                    </div>

                                                                    {/* Progress bar */}
                                                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                                                        <div
                                                                            className={`h-2 rounded-full transition-all ${
                                                                                progress.completionPercentage >= 80
                                                                                    ? "bg-green-500"
                                                                                    : progress.completionPercentage >= 50
                                                                                    ? "bg-orange-500"
                                                                                    : "bg-red-500"
                                                                            }`}
                                                                            style={{ width: `${progress.completionPercentage}%` }}
                                                                        />
                                                                    </div>

                                                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                                                        <span>Completitud: {progress.completionPercentage}%</span>
                                                                    </div>

                                                                    {progress.notes && (
                                                                        <p className="text-xs text-gray-600 mt-2 italic">
                                                                            "{progress.notes}"
                                                                        </p>
                                                                    )}

                                                                    {progress.verificationComment && (
                                                                        <div className="bg-green-50 border border-green-200 rounded p-2 mt-2">
                                                                            <p className="text-xs text-green-800">
                                                                                <span className="font-semibold">Coach:</span>{" "}
                                                                                {progress.verificationComment}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {!progress.coachVerified && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="primary"
                                                                        onClick={() => handleOpenVerifyModal(progress, item.player.name)}
                                                                        disabled={verifyingId === progress.id}
                                                                    >
                                                                        {verifyingId === progress.id ? "Verificando..." : "Verificar"}
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                    {isExpanded && item.progress.length === 0 && (
                                        <div className="border-t border-gray-200 p-6 bg-gray-50 text-center">
                                            <p className="text-sm text-gray-500">
                                                Aún no hay sesiones registradas para este plan
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Verify Modal */}
            {verifyModal && (
                <BaseModal
                    isOpen={verifyModal.isOpen}
                    onClose={() => setVerifyModal(null)}
                    title="Verificar Sesión"
                    maxWidth="md"
                >
                    <form onSubmit={handleConfirmVerify} className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">Jugador:</span> {verifyModal.playerName}
                            </p>
                            <p className="text-sm text-blue-800 mt-1">
                                <span className="font-semibold">Fecha:</span>{" "}
                                {new Date(verifyModal.progressDate).toLocaleDateString("es-CO", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Comentario (opcional)
                            </label>
                            <textarea
                                {...register("verificationComment")}
                                placeholder="Añade observaciones sobre esta sesión..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                                rows={4}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="secondary" onClick={() => setVerifyModal(null)}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary">
                                Confirmar Verificación
                            </Button>
                        </div>
                    </form>
                </BaseModal>
            )}
        </>
    );
};