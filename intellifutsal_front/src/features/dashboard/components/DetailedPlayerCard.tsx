import { useState } from "react";
import type { PlayerResponse } from "@features/player/types";
import { FaBrain, FaChartLine, FaCog, FaRunning } from "react-icons/fa";
import { Button } from "@shared/components";
import { EditPlayerModal } from "./EditPlayerModal";
import { PlayerAiAnalysisModal } from "./PlayerAiAnalysisModal";
import { usePlayerManagement } from "../hooks/usePlayerManagement";

interface DetailedPlayerCardProps {
    player: PlayerResponse;
    onPlayerUpdated?: () => void;
}

const StatTile = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-linear-to-br from-gray-50 to-orange-50/30 rounded-xl p-3 text-center border border-gray-100">
        <div className="text-xs text-gray-600 mb-1">{label}</div>
        <div className="font-bold text-gray-800">{value}</div>
    </div>
);

export const DetailedPlayerCard = ({ player, onPlayerUpdated }: DetailedPlayerCardProps) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAiAnalysisModalOpen, setIsAiAnalysisModalOpen] = useState(false);

    const { updatePlayer, generateAiTrainingPlan } = usePlayerManagement({
        onPlayerUpdated: () => {
            onPlayerUpdated?.();
        },
    });

    const fullName = `${player.firstName} ${player.lastName}`;
    const statusDotClass = player.status ? "bg-green-400" : "bg-gray-400";

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative">
                {/* Header */}
                <div className="bg-linear-to-br from-orange-600 to-orange-700 p-5 sm:p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />

                    <div className="relative flex items-center gap-4 min-w-0">
                        <div className="relative shrink-0">
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=ea580c&color=fff`}
                                alt={fullName}
                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl ring-4 ring-white/30 shadow-lg"
                            />
                            <div
                                className={`absolute -bottom-1 -right-1 w-5 h-5 ${statusDotClass} rounded-full border-2 border-white shadow-md`}
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-white text-base sm:text-lg truncate">{fullName}</h3>
                            <p className="text-orange-100 text-sm font-medium truncate">{player.position}</p>

                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                                <span className="text-xs text-white/80">{player.age} años</span>
                                <span className="w-1 h-1 bg-white/50 rounded-full hidden sm:inline-block" />
                                <span className="text-xs text-white/80">ID: {player.id}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5">
                    {/* Basic Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        <StatTile label="Altura" value={`${player.height}m`} />
                        <StatTile label="Peso" value={`${player.weight}kg`} />
                        <StatTile label="IMC" value={Number(player.bmi).toFixed(1)} />
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-linear-to-br from-blue-50 to-blue-100/30 rounded-xl p-4 mb-4 border border-blue-100">
                        <h4 className="text-xs font-bold text-gray-800 mb-3 flex items-center">
                            <FaRunning className="mr-2 text-blue-600" />
                            Rendimiento Físico
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="min-w-0">
                                <div className="text-xs text-gray-600 mb-1">30m</div>
                                <div className="text-sm font-bold text-gray-800 truncate">
                                    {player.thirtyMetersTime}s
                                </div>
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs text-gray-600 mb-1">1000m</div>
                                <div className="text-sm font-bold text-gray-800 truncate">
                                    {player.thousandMetersTime}s
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Jump Metrics */}
                    <div className="bg-linear-to-br from-purple-50 to-purple-100/30 rounded-xl p-4 mb-4 border border-purple-100">
                        <h4 className="text-xs font-bold text-gray-800 mb-3 flex items-center">
                            <FaChartLine className="mr-2 text-purple-600" />
                            Saltos
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                                <div className="text-gray-600 mb-1">Alto</div>
                                <div className="font-bold text-gray-800">{player.highJump}cm</div>
                            </div>
                            <div>
                                <div className="text-gray-600 mb-1">Bipodal</div>
                                <div className="font-bold text-gray-800">{player.bipodalJump}cm</div>
                            </div>
                            <div>
                                <div className="text-gray-600 mb-1">Derecho</div>
                                <div className="font-bold text-gray-800">{player.rightUnipodalJump}cm</div>
                            </div>
                            <div>
                                <div className="text-gray-600 mb-1">Izquierdo</div>
                                <div className="font-bold text-gray-800">{player.leftUnipodalJump}cm</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                        <Button
                            onClick={() => setIsAiAnalysisModalOpen(true)}
                            variant="primary"
                            icon={FaBrain}
                            iconPosition="left"
                            fullWidth
                        >
                            Análisis IA
                        </Button>

                        <Button
                            variant="ghost"
                            icon={FaCog}
                            iconPosition="left"
                            className="sm:px-4!"
                            fullWidth
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            <span className="sm:hidden">Editar</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EditPlayerModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                player={player}
                onUpdate={updatePlayer}
            />

            <PlayerAiAnalysisModal
                isOpen={isAiAnalysisModalOpen}
                onClose={() => setIsAiAnalysisModalOpen(false)}
                player={player}
                onGenerateTrainingPlan={generateAiTrainingPlan}
            />
        </>
    );
};