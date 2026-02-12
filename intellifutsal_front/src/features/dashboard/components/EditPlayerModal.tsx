import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCog } from "react-icons/fa";
import { BaseModal, Button, Input, Select } from "@shared/components";
import type { PlayerResponse, Position } from "@features/player/types";
import { updatePlayerSchema, type UpdatePlayerSchema } from "@features/player/schemas/updatePlayerSchema";

interface EditPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    player: PlayerResponse | null;
    onUpdate: (data: UpdatePlayerSchema) => Promise<void>;
}

const POSITION_OPTIONS = [
    { value: "PIVOT", label: "Pivot" },
    { value: "WINGER", label: "Ala" },
    { value: "FIXO", label: "Fijo" },
    { value: "GOALKEEPER", label: "Portero" },
];

export const EditPlayerModal = ({ isOpen, onClose, player, onUpdate }: EditPlayerModalProps) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdatePlayerSchema>({
        resolver: zodResolver(updatePlayerSchema),
        values: player
            ? {
                id: player.id,
                firstName: player.firstName,
                lastName: player.lastName,
                birthDate: player.birthDate instanceof Date
                    ? player.birthDate.toISOString().split('T')[0]
                    : player.birthDate,
                height: player.height,
                weight: player.weight,
                highJump: player.highJump,
                rightUnipodalJump: player.rightUnipodalJump,
                leftUnipodalJump: player.leftUnipodalJump,
                bipodalJump: player.bipodalJump,
                thirtyMetersTime: player.thirtyMetersTime,
                thousandMetersTime: player.thousandMetersTime,
                position: player.position as Position,
            }
            : undefined,
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = async (data: UpdatePlayerSchema) => {
        try {
            setIsUpdating(true);
            await onUpdate(data);
            handleClose();
        } catch (error) {
            console.error("Error al actualizar jugador:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    if (!player) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Editar Jugador"
            subtitle={`${player.firstName} ${player.lastName}`}
            icon={FaCog}
            iconColor="blue"
            maxWidth="3xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Info */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Información Personal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <Input {...register("firstName")} error={errors.firstName?.message} />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Apellido <span className="text-red-500">*</span>
                            </label>
                            <Input {...register("lastName")} error={errors.lastName?.message} />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Fecha de Nacimiento <span className="text-red-500">*</span>
                            </label>
                            <Input type="date" {...register("birthDate")} error={errors.birthDate?.message} />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Posición <span className="text-red-500">*</span>
                            </label>
                            <Select {...register("position")} options={POSITION_OPTIONS} />
                            {errors.position && (
                                <p className="text-xs text-red-600 mt-1">{errors.position.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Physical Stats */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Estadísticas Físicas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Altura (m) <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                {...register("height", { valueAsNumber: true })}
                                error={errors.height?.message}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Peso (kg) <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.1"
                                {...register("weight", { valueAsNumber: true })}
                                error={errors.weight?.message}
                            />
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Rendimiento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tiempo 30m (s) <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                {...register("thirtyMetersTime", { valueAsNumber: true })}
                                error={errors.thirtyMetersTime?.message}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tiempo 1000m (s) <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.1"
                                {...register("thousandMetersTime", { valueAsNumber: true })}
                                error={errors.thousandMetersTime?.message}
                            />
                        </div>
                    </div>
                </div>

                {/* Jump Metrics */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Saltos (cm)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Salto Alto <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.1"
                                {...register("highJump", { valueAsNumber: true })}
                                error={errors.highJump?.message}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Salto Bipodal <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.1"
                                {...register("bipodalJump", { valueAsNumber: true })}
                                error={errors.bipodalJump?.message}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Unipodal Derecho <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.1"
                                {...register("rightUnipodalJump", { valueAsNumber: true })}
                                error={errors.rightUnipodalJump?.message}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Unipodal Izquierdo <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.1"
                                {...register("leftUnipodalJump", { valueAsNumber: true })}
                                error={errors.leftUnipodalJump?.message}
                            />
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs text-blue-800">
                        <span className="font-bold">Nota:</span> Todos los cambios se guardarán
                        inmediatamente al confirmar.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        fullWidth
                        onClick={handleClose}
                        disabled={isUpdating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={isUpdating}
                        disabled={isUpdating}
                        icon={FaCog}
                        iconPosition="left"
                    >
                        {isUpdating ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </div>
            </form>
        </BaseModal>
    );
};