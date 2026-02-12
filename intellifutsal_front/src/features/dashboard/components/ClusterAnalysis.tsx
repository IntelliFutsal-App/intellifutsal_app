import { useMemo } from "react";
import { FaDumbbell, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { DonutChart } from "@shared/components";
import type { PlayerFieldData } from "../hooks";

interface ClusterAnalysisProps {
    players: PlayerFieldData[];
}

export const ClusterAnalysis = ({ players: playersData }: ClusterAnalysisProps) => {
    const physicalClusterData = useMemo(() => {
        const distribution: Record<string, { count: number; description: string; clusterId: number }> = {};

        playersData.forEach(player => {
            if (player.physical?.clusterName) {
                const key = player.physical.clusterName;
                if (!distribution[key]) {
                    distribution[key] = {
                        count: 0,
                        description: player.physical.description,
                        clusterId: player.physical.clusterId,
                    };
                }
                distribution[key].count++;
            }
        });

        return Object.entries(distribution).map(([name, data]) => ({
            key: name,
            count: data.count,
            description: data.description,
            clusterId: data.clusterId,
        }));
    }, [playersData]);

    const positionClusterData = useMemo(() => {
        const distribution: Record<string, number> = {};

        playersData.forEach(player => {
            if (player.position?.clusterName) {
                const position = player.position.clusterName;
                distribution[position] = (distribution[position] || 0) + 1;
            }
        });

        return Object.entries(distribution).map(([name, count]) => ({
            key: name,
            count: count,
        }));
    }, [playersData]);

    const physicalClusterDetails = useMemo(() => {
        const details: Record<string, {
            clusterId: number;
            clusterName: string;
            description: string;
            count: number;
            players: Array<{
                name: string;
                strengths: string[];
                developmentAreas: string[];
                trainingRecommendations: string[];
            }>;
        }> = {};

        playersData.forEach(player => {
            if (player.physical) {
                const key = player.physical.clusterName;
                if (!details[key]) {
                    details[key] = {
                        clusterId: player.physical.clusterId,
                        clusterName: player.physical.clusterName,
                        description: player.physical.description,
                        count: 0,
                        players: [],
                    };
                }
                details[key].count++;
                details[key].players.push({
                    name: player.name,
                    strengths: player.physical.strengths,
                    developmentAreas: player.physical.developmentAreas,
                    trainingRecommendations: player.physical.trainingRecommendations,
                });
            }
        });

        return Object.values(details);
    }, [playersData]);

    const positionDetails = useMemo(() => {
        const details: Record<string, {
            clusterId: number;
            clusterName: string;
            count: number;
            players: string[];
        }> = {};

        playersData.forEach(player => {
            if (player.position) {
                const key = player.position.clusterName;
                if (!details[key]) {
                    details[key] = {
                        clusterId: player.position.clusterId,
                        clusterName: player.position.clusterName,
                        count: 0,
                        players: [],
                    };
                }
                details[key].count++;
                details[key].players.push(player.name);
            }
        });

        return Object.values(details);
    }, [playersData]);

    return (
        <div className="space-y-6">
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {physicalClusterData.length > 0 && (
                    <DonutChart
                        data={physicalClusterData}
                        title="Perfiles Físicos del Equipo"
                        colorMap={{}}
                    />
                )}

                {positionClusterData.length > 0 && (
                    <DonutChart
                        data={positionClusterData}
                        title="Distribución de Posiciones"
                        colorMap={{}}
                    />
                )}
            </div>

            {/* Physical Profiles Details */}
            {physicalClusterDetails.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 group overflow-hidden relative">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-600 to-green-700 flex items-center justify-center">
                            <FaDumbbell className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Perfiles Físicos Detallados</h3>
                    </div>

                    <div className="space-y-4">
                        {physicalClusterDetails.map((cluster) => (
                            <div key={cluster.clusterId} className="border border-gray-200 rounded-xl overflow-hidden">
                                {/* Cluster Header */}
                                <div className="bg-linear-to-r from-green-50 to-emerald-50 p-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-lg font-bold text-gray-800">
                                            {cluster.clusterName}
                                        </h4>
                                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                            {cluster.count} {cluster.count === 1 ? 'jugador' : 'jugadores'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">{cluster.description}</p>
                                </div>

                                {/* Players in this cluster */}
                                <div className="p-4 bg-white">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {cluster.players.map((player, idx) => (
                                            <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <p className="font-semibold text-gray-800 mb-3">{player.name}</p>
                                                
                                                {player.strengths.length > 0 && (
                                                    <div className="mb-3">
                                                        <p className="text-xs font-semibold text-emerald-700 mb-1">Fortalezas:</p>
                                                        <ul className="space-y-1">
                                                            {player.strengths.slice(0, 2).map((strength, i) => (
                                                                <li key={i} className="text-xs text-emerald-600 flex items-start gap-1">
                                                                    <span className="mt-0.5">✓</span>
                                                                    <span className="line-clamp-2">{strength}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {player.developmentAreas.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-amber-700 mb-1">A mejorar:</p>
                                                        <ul className="space-y-1">
                                                            {player.developmentAreas.slice(0, 2).map((area, i) => (
                                                                <li key={i} className="text-xs text-amber-600 flex items-start gap-1">
                                                                    <span className="mt-0.5">◦</span>
                                                                    <span className="line-clamp-2">{area}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Position Details */}
            {positionDetails.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 group overflow-hidden relative">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                            <FaMapMarkerAlt className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Distribución por Posición</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {positionDetails.map((position) => (
                            <div key={position.clusterId} className="bg-linear-to-br from-blue-50 to-indigo-50/30 rounded-xl p-4 border border-blue-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-base font-bold text-gray-800">{position.clusterName}</h4>
                                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                        {position.count}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    {position.players.map((player, idx) => (
                                        <p key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                            {player}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Summary Stats */}
            <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 group overflow-hidden relative">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                        <FaUsers className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Resumen del Equipo</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/80 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">{playersData.length}</p>
                        <p className="text-sm text-gray-600 mt-1">Jugadores Analizados</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">{physicalClusterDetails.length}</p>
                        <p className="text-sm text-gray-600 mt-1">Perfiles Físicos</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{positionDetails.length}</p>
                        <p className="text-sm text-gray-600 mt-1">Posiciones Diferentes</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-orange-600">
                            {Math.round((playersData.filter(p => p.physical && p.position).length / playersData.length) * 100)}%
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Completitud</p>
                    </div>
                </div>
            </div>
        </div>
    );
};