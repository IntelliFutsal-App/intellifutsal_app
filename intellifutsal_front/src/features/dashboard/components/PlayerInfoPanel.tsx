import { FaBrain, FaDumbbell, FaTimes } from "react-icons/fa";
import type { PlayerFieldData } from "../hooks";

interface PlayerInfoPanelProps {
    player: PlayerFieldData | null;
    onClose: () => void;
}

export const PlayerInfoPanel = ({ player, onClose }: PlayerInfoPanelProps) => {
    if (!player) return null;

    return (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 group overflow-hidden relative">
            {/* Header */}
            <div className="bg-linear-to-r from-orange-600 to-orange-700 p-6 text-white relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
                >
                    <FaTimes className="text-sm" />
                </button>
                <h3 className="text-2xl font-bold mb-1">{player.name}</h3>
                {player.position && (
                    <p className="text-orange-100 text-sm">{player.position.clusterName}</p>
                )}
            </div>

            <div className="p-6 space-y-6">
                {/* Position Analysis */}
                {player.position && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                                <FaBrain className="text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-800">Análisis de Posición</h4>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <p className="text-sm text-blue-900">
                                <span className="font-semibold">Cluster:</span> {player.position.clusterId}
                            </p>
                            <p className="text-sm text-blue-900 mt-1">
                                <span className="font-semibold">Posición:</span> {player.position.clusterName}
                            </p>
                        </div>
                    </div>
                )}

                {/* Physical Analysis */}
                {player.physical && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-600 to-green-700 flex items-center justify-center">
                                <FaDumbbell className="text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-800">Perfil Físico</h4>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                <p className="text-sm text-green-900">
                                    <span className="font-semibold">Cluster:</span> {player.physical.clusterId} - {player.physical.clusterName}
                                </p>
                                <p className="text-sm text-green-700 mt-2">{player.physical.description}</p>
                            </div>

                            {player.physical.strengths.length > 0 && (
                                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                    <p className="text-sm font-semibold text-emerald-900 mb-2">Fortalezas:</p>
                                    <ul className="space-y-1">
                                        {player.physical.strengths.map((strength, idx) => (
                                            <li key={idx} className="text-sm text-emerald-700 flex items-start gap-2">
                                                <span className="text-emerald-500 mt-0.5">✓</span>
                                                <span>{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {player.physical.developmentAreas.length > 0 && (
                                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                    <p className="text-sm font-semibold text-amber-900 mb-2">Áreas de Desarrollo:</p>
                                    <ul className="space-y-1">
                                        {player.physical.developmentAreas.map((area, idx) => (
                                            <li key={idx} className="text-sm text-amber-700 flex items-start gap-2">
                                                <span className="text-amber-500 mt-0.5">◦</span>
                                                <span>{area}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {player.physical.trainingRecommendations.length > 0 && (
                                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                                    <p className="text-sm font-semibold text-purple-900 mb-2">Recomendaciones:</p>
                                    <ul className="space-y-1">
                                        {player.physical.trainingRecommendations.map((rec, idx) => (
                                            <li key={idx} className="text-sm text-purple-700 flex items-start gap-2">
                                                <span className="text-purple-500 mt-0.5">→</span>
                                                <span>{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Physical Metrics */}
                {player.physical?.features && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Métricas Físicas</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <MetricCard label="Edad" value={`${player.physical.features.age} años`} />
                            <MetricCard label="Altura" value={`${player.physical.features.height} cm`} />
                            <MetricCard label="Peso" value={`${player.physical.features.weight} kg`} />
                            <MetricCard label="IMC" value={player.physical.features.bmi.toFixed(1)} />
                            <MetricCard label="Salto Alto" value={`${player.physical.features.highJump} cm`} />
                            <MetricCard label="Salto Bipodal" value={`${player.physical.features.bipodalJump} cm`} />
                            <MetricCard label="30m" value={`${player.physical.features.thirtyMetersTime.toFixed(2)}s`} />
                            <MetricCard label="1000m" value={`${player.physical.features.thousandMetersTime.toFixed(0)}s`} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const MetricCard = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
);