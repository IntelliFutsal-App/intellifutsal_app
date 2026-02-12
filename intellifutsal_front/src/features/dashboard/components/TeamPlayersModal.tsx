import { useEffect, useState } from "react";
import { FaUsers, FaChartLine, FaRunning, FaDumbbell } from "react-icons/fa";
import { BaseModal, Button, InlineLoading } from "@shared/components";
import type { TeamResponse } from "@features/team/types";
import type { PlayerResponse } from "@features/player/types";
import { playerService } from "@features/player/services/playerService";

interface TeamPlayersModalProps {
    isOpen: boolean;
    onClose: () => void;
    team: TeamResponse | null;
    onManageAll: () => void;
}

export const TeamPlayersModal = ({ isOpen, onClose, team, onManageAll }: TeamPlayersModalProps) => {
    const [players, setPlayers] = useState<PlayerResponse[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !team) {
            setPlayers([]);
            return;
        }

        const fetchPlayers = async () => {
            try {
                setLoading(true);
                const data = await playerService.findByTeamId(team.id);
                setPlayers(data);
            } catch (error) {
                console.error("Error al cargar jugadores:", error);
                setPlayers([]);
            } finally {
                setLoading(false);
            }
        };

        void fetchPlayers();
    }, [isOpen, team]);

    if (!team) return null;

    const activePlayers = players.filter((p) => p.status);
    const avgAge =
        players.length > 0 ? Math.round(players.reduce((acc, p) => acc + p.age, 0) / players.length) : 0;
    const avgBmi =
        players.length > 0 ? players.reduce((acc, p) => acc + Number(p.bmi), 0) / players.length : 0;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Jugadores del Equipo"
            subtitle={team.name}
            icon={FaUsers}
            iconColor="blue"
            maxWidth="2xl"
        >
            <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-linear-to-br from-blue-50 to-blue-100/30 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                            <FaUsers className="text-blue-600" />
                            <p className="text-xs font-semibold text-blue-700">Total</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{players.length}</p>
                        <p className="text-xs text-gray-600 mt-1">
                            {activePlayers.length} activos
                        </p>
                    </div>

                    <div className="bg-linear-to-br from-green-50 to-green-100/30 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                            <FaChartLine className="text-green-600" />
                            <p className="text-xs font-semibold text-green-700">Edad Prom.</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{avgAge}</p>
                        <p className="text-xs text-gray-600 mt-1">años</p>
                    </div>

                    <div className="bg-linear-to-br from-purple-50 to-purple-100/30 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                            <FaDumbbell className="text-purple-600" />
                            <p className="text-xs font-semibold text-purple-700">IMC Prom.</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{avgBmi.toFixed(1)}</p>
                        <p className="text-xs text-gray-600 mt-1">índice</p>
                    </div>
                </div>

                {/* Players List */}
                {loading ? (
                    <div className="py-8">
                        <InlineLoading title="Cargando jugadores..." description="Obteniendo datos del equipo" />
                    </div>
                ) : players.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-gray-100 rounded-full p-6 w-fit mx-auto mb-4">
                            <FaUsers className="text-gray-400 text-3xl" />
                        </div>
                        <p className="text-sm font-semibold text-gray-600">No hay jugadores registrados</p>
                        <p className="text-xs text-gray-500 mt-1">Agrega jugadores a este equipo</p>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 mb-3">
                            Lista de Jugadores ({players.length})
                        </h3>
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden max-h-[400px] overflow-y-auto">
                            {players.map((player) => {
                                const fullName = `${player.firstName} ${player.lastName}`;
                                return (
                                    <div
                                        key={player.id}
                                        className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                                    >
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=ea580c&color=fff&size=48`}
                                            alt={fullName}
                                            className="w-12 h-12 rounded-lg ring-2 ring-orange-200"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-800 truncate">{fullName}</p>
                                            <p className="text-xs text-gray-500">
                                                {player.position} • {player.age} años
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-700">
                                                {player.height}m / {player.weight}kg
                                            </p>
                                            <p className="text-xs text-gray-500">IMC: {Number(player.bmi).toFixed(1)}</p>
                                        </div>
                                        <div>
                                            <span
                                                className={`inline-block w-2 h-2 rounded-full ${player.status ? "bg-green-400" : "bg-gray-400"
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="ghost" fullWidth onClick={onClose}>
                        Cerrar
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        fullWidth
                        icon={FaRunning}
                        iconPosition="left"
                        onClick={() => {
                            onManageAll();
                            onClose();
                        }}
                    >
                        Gestionar Jugadores
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
};