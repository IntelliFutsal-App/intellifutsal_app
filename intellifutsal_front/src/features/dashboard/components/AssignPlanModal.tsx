import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaUsers, FaUser } from "react-icons/fa";
import { BaseModal, Button, Input, Select } from "@shared/components";
import { playerService } from "@features/player/services/playerService";
import { assignPlanSchema, type AssignPlanSchema } from "@features/training/schemas";
import type { PlayerResponse } from "@features/player/types";

interface AssignPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    planId: number | null;
    teamId: number | null;
    onAssign: (data: AssignPlanData) => Promise<void>;
}

export interface AssignPlanData {
    planId: number;
    target: "player" | "team";
    playerId?: number;
    teamId?: number;
    startDate: Date;
    endDate: Date;
}

export const AssignPlanModal = ({
    isOpen,
    onClose,
    planId,
    teamId: initialTeamId,
    onAssign,
}: AssignPlanModalProps) => {
    const [isAssigning, setIsAssigning] = useState(false);
    const [players, setPlayers] = useState<PlayerResponse[]>([]);
    const [loadingPlayers, setLoadingPlayers] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<AssignPlanSchema>({
        resolver: zodResolver(assignPlanSchema),
        defaultValues: {
            target: initialTeamId ? "team" : "player",
            teamId: initialTeamId || undefined,
            playerId: undefined,
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        },
    });

    const selectedTarget = watch("target");
    const selectedTeamId = watch("teamId");

    useEffect(() => {
        if (!selectedTeamId) {
            setPlayers([]);
            return;
        }

        const fetchPlayers = async () => {
            try {
                setLoadingPlayers(true);
                const data = await playerService.findByTeamId(selectedTeamId);
                setPlayers(data);
            } catch (error) {
                console.error("Error al cargar jugadores:", error);
                setPlayers([]);
            } finally {
                setLoadingPlayers(false);
            }
        };

        if (selectedTarget === "player") {
            void fetchPlayers();
        }
    }, [selectedTeamId, selectedTarget]);

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = async (data: AssignPlanSchema) => {
        if (!planId) return;

        try {
            setIsAssigning(true);
            await onAssign({
                planId,
                target: data.target,
                playerId: data.playerId,
                teamId: data.teamId,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
            });
            handleClose();
        } catch (error) {
            console.error("Error al asignar plan:", error);
        } finally {
            setIsAssigning(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Asignar Plan de Entrenamiento"
            subtitle="Asigna este plan a jugadores o equipos"
            icon={FaUsers}
            iconColor="blue"
            maxWidth="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Target Selection */}
                {!initialTeamId && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tipo de Asignación <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setValue("target", "player")}
                                className={`p-4 rounded-xl border-2 transition-all ${selectedTarget === "player"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <FaUser className="text-2xl mx-auto mb-2 text-blue-600" />
                                <p className="font-semibold text-gray-800">Jugador Individual</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setValue("target", "team")}
                                className={`p-4 rounded-xl border-2 transition-all ${selectedTarget === "team"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <FaUsers className="text-2xl mx-auto mb-2 text-blue-600" />
                                <p className="font-semibold text-gray-800">Equipo Completo</p>
                            </button>
                        </div>
                    </div>
                )}

                {/* Player Selection */}
                {selectedTarget === "player" && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Jugador <span className="text-red-500">*</span>
                        </label>
                        {loadingPlayers ? (
                            <p className="text-sm text-gray-500">Cargando jugadores...</p>
                        ) : (
                            <Select
                                {...register("playerId", { valueAsNumber: true })}
                                options={[
                                    { value: "", label: "Selecciona un jugador" },
                                    ...players.map((p) => ({
                                        value: p.id.toString(),
                                        label: `${p.firstName} ${p.lastName} - ${p.position}`,
                                    })),
                                ]}
                            />
                        )}
                        {errors.playerId && (
                            <p className="text-xs text-red-600 mt-1">{errors.playerId.message}</p>
                        )}
                    </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Fecha de Inicio <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="date"
                            {...register("startDate")}
                            error={errors.startDate?.message}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Fecha de Fin <span className="text-red-500">*</span>
                        </label>
                        <Input type="date" {...register("endDate")} error={errors.endDate?.message} />
                    </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs text-blue-800">
                        <span className="font-bold">Nota:</span> La asignación se creará y activará
                        automáticamente. {selectedTarget === "team" ? "Todos los jugadores del equipo" : "El jugador seleccionado"} podrán ver este plan
                        en su dashboard.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        fullWidth
                        onClick={handleClose}
                        disabled={isAssigning}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={isAssigning}
                        disabled={isAssigning}
                        icon={FaUsers}
                        iconPosition="left"
                    >
                        {isAssigning ? "Asignando..." : "Asignar Plan"}
                    </Button>
                </div>
            </form>
        </BaseModal>
    );
};