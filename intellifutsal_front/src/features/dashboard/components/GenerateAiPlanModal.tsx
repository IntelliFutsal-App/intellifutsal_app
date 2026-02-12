import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaBrain, FaUsers, FaUser } from "react-icons/fa";
import { BaseModal, Button, Select } from "@shared/components";
import { useProfile } from "@shared/hooks";
import { useTeamPlayers } from "../hooks";
import { createAiPlanSchema, type CreateAiPlanSchema } from "@features/training/schemas/createAiPlanSchema";

interface GenerateAiPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (target: "player" | "team", id: number) => Promise<void>;
}

export const GenerateAiPlanModal = ({ isOpen, onClose, onGenerate }: GenerateAiPlanModalProps) => {
    const { activeTeamId } = useProfile();
    const { players } = useTeamPlayers(activeTeamId);
    const [isGenerating, setIsGenerating] = useState(false);

    const {
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateAiPlanSchema>({
        resolver: zodResolver(createAiPlanSchema),
        defaultValues: {
            target: "team",
            teamId: activeTeamId || undefined,
        },
    });

    const target = watch("target");

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = async (data: CreateAiPlanSchema) => {
        try {
            setIsGenerating(true);
            if (data.target === "player" && data.playerId) {
                await onGenerate("player", data.playerId);
            } else if (data.target === "team" && data.teamId) {
                await onGenerate("team", data.teamId);
            }
            handleClose();
        } catch (error) {
            console.error("Error al generar plan:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const playerOptions = players.map(
        (p: { id: number; firstName: string; lastName: string; position: string }) => ({
            value: String(p.id),
            label: `${p.firstName} ${p.lastName} - ${p.position}`,
        })
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Generar Plan con IA"
            subtitle="Crea un plan personalizado automáticamente"
            icon={FaBrain}
            iconColor="orange"
            maxWidth="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Target Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Generar plan para
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setValue("target", "team");
                                setValue("teamId", activeTeamId || undefined);
                                setValue("playerId", undefined);
                            }}
                            className={`p-4 rounded-xl border-2 transition-all ${target === "team"
                                    ? "bg-linear-to-r from-orange-50 to-orange-100/50 border-orange-500"
                                    : "bg-white border-gray-200 hover:border-orange-300"
                                }`}
                        >
                            <FaUsers
                                className={`mx-auto text-2xl mb-2 ${target === "team" ? "text-orange-600" : "text-gray-400"
                                    }`}
                            />
                            <p
                                className={`text-sm font-semibold ${target === "team" ? "text-orange-900" : "text-gray-700"
                                    }`}
                            >
                                Equipo
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setValue("target", "player");
                                setValue("playerId", undefined);
                                setValue("teamId", undefined);
                            }}
                            className={`p-4 rounded-xl border-2 transition-all ${target === "player"
                                    ? "bg-linear-to-r from-orange-50 to-orange-100/50 border-orange-500"
                                    : "bg-white border-gray-200 hover:border-orange-300"
                                }`}
                        >
                            <FaUser
                                className={`mx-auto text-2xl mb-2 ${target === "player" ? "text-orange-600" : "text-gray-400"
                                    }`}
                            />
                            <p
                                className={`text-sm font-semibold ${target === "player" ? "text-orange-900" : "text-gray-700"
                                    }`}
                            >
                                Jugador
                            </p>
                        </button>
                    </div>
                </div>

                {/* Player Selection */}
                {target === "player" && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Seleccionar jugador
                        </label>
                        <Select
                            options={playerOptions}
                            placeholder="Elige un jugador"
                            onChange={(e) => setValue("playerId", Number(e.target.value))}
                        />
                        {errors.playerId && (
                            <p className="text-xs text-red-600 mt-1">{errors.playerId.message}</p>
                        )}
                    </div>
                )}

                {/* Team Info */}
                {target === "team" && activeTeamId && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">Equipo activo:</span> Se generará un plan grupal
                            para todos los jugadores
                        </p>
                    </div>
                )}

                {/* Info Box */}
                <div className="bg-linear-to-r from-orange-50 to-orange-100/30 border border-orange-200 rounded-xl p-4">
                    <p className="text-xs text-orange-900">
                        <span className="font-bold">Nota:</span> La IA analizará las métricas y
                        características del {target === "team" ? "equipo" : "jugador"} para crear un plan
                        personalizado óptimo.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        fullWidth
                        onClick={handleClose}
                        disabled={isGenerating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={isGenerating}
                        disabled={isGenerating}
                        icon={FaBrain}
                        iconPosition="left"
                    >
                        {isGenerating ? "Generando..." : "Generar Plan"}
                    </Button>
                </div>
            </form>
        </BaseModal>
    );
};