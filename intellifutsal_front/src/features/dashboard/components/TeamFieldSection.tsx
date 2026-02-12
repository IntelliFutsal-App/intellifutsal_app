import { useState } from "react";
import { FaChartBar, FaFutbol, FaPlay } from "react-icons/fa";
import { useActiveTeam } from "@shared/hooks";
import { Button, InlineLoading } from "@shared/components";
import { useTeamPlayers } from "../hooks";
import { useTeamFieldAnalysis } from "../hooks/useTeamFieldAnalysis";
import type { PlayerFieldData } from "../hooks/useTeamFieldAnalysis";
import { ClusterAnalysis } from "./ClusterAnalysis";
import { FutsalField } from "./FutsalField";
import { PlayerInfoPanel } from "./PlayerInfoPanel";

export const TeamFieldSection = () => {
    const { activeTeamId, activeTeam } = useActiveTeam();
    const { players, loading: isLoadingPlayers } = useTeamPlayers(activeTeamId);
    const { playersData, loading: isAnalyzing, analyzeTeam } = useTeamFieldAnalysis(activeTeamId, players);

    const [selectedPlayer, setSelectedPlayer] = useState<PlayerFieldData | null>(null);
    const [showAnalysis, setShowAnalysis] = useState(false);

    const hasAnalysis = playersData.length > 0;

    if (isLoadingPlayers) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <InlineLoading title="Cargando jugadores..." description="Consultando el roster del equipo" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Análisis de Campo
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">{activeTeam?.name ?? "Sin equipo"}</p>
                    </div>

                    <div className="flex gap-3">
                        {hasAnalysis && (
                            <Button
                                onClick={() => setShowAnalysis(!showAnalysis)}
                                className={`
                                    ${showAnalysis
                                        ? 'bg-linear-to-r from-purple-600 to-purple-700 text-white hover:shadow-purple-500/50'
                                        : 'bg-white text-gray-700 hover:shadow-xl border border-gray-200'
                                    }
                                `}
                                icon={FaChartBar}
                                variant="outline"
                            >
                                {showAnalysis ? 'Ver Campo' : 'Ver Análisis'}
                            </Button>
                        )}

                        <Button
                            onClick={analyzeTeam}
                            disabled={isAnalyzing || !activeTeamId || players.length === 0}
                            icon={FaPlay}
                            variant="primary"
                        >
                            {isAnalyzing ? 'Analizando...' : hasAnalysis ? 'Reanalizar' : 'Iniciar Análisis'}
                        </Button>
                    </div>
                </div>
            </div>

            {!activeTeamId ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
                    <p className="text-yellow-800 font-medium">No tienes un equipo activo seleccionado.</p>
                </div>
            ) : players.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                    <p className="text-gray-700 font-medium">Este equipo aún no tiene jugadores asignados.</p>
                </div>
            ) : isAnalyzing ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <InlineLoading
                        title="Analizando equipo..."
                        description="Prediciendo posiciones y perfiles físicos de los jugadores"
                    />
                </div>
            ) : !hasAnalysis ? (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-gray-100 shadow-xl text-center overflow-hidden relative">
                    <div className="bg-linear-to-br from-orange-100 to-orange-50 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <FaFutbol className="text-4xl sm:text-5xl text-orange-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Comienza el Análisis</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                        Presiona "Iniciar Análisis" para visualizar a tus jugadores en el campo y obtener insights sobre sus posiciones y capacidades físicas.
                    </p>
                </div>
            ) : showAnalysis ? (
                <ClusterAnalysis players={playersData} />
            ) : (
                <div className={`grid gap-6 ${selectedPlayer ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {/* Field View */}
                    <div className={selectedPlayer ? 'lg:col-span-2' : ''}>
                        <FutsalField
                            players={playersData}
                            onPlayerClick={setSelectedPlayer}
                        />
                    </div>

                    {/* Player Info Panel */}
                    {selectedPlayer && (
                        <div className="lg:col-span-1">
                            <PlayerInfoPanel
                                player={selectedPlayer}
                                onClose={() => setSelectedPlayer(null)}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};