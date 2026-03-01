import type { PlayerSelfAnalysis } from "@features/ai-module";
import { FaBrain, FaDumbbell, FaRedo } from "react-icons/fa";

interface SelfAnalysisPanelProps {
    analysis: PlayerSelfAnalysis;
    onReanalyze: () => void;
}

export const SelfAnalysisPanel = ({ analysis, onReanalyze }: SelfAnalysisPanelProps) => {
    const { position, physical } = analysis;

    return (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-linear-to-r from-orange-600 to-orange-700 p-5 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-14 -mt-14" />
                <div className="relative flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold">Mi Análisis IA</h3>
                        <p className="text-orange-100 text-xs mt-0.5">Predicciones personalizadas para ti</p>
                    </div>
                    <button
                        onClick={onReanalyze}
                        title="Reanalizar"
                        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <FaRedo className="text-sm" />
                    </button>
                </div>
            </div>

            <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
                {position && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center shrink-0">
                                <FaBrain className="text-white text-sm" />
                            </div>
                            <h4 className="text-base font-bold text-gray-800">Posición Sugerida</h4>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-blue-900">{position.clusterName}</span>
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-medium">
                                    Cluster {position.clusterId}
                                </span>
                            </div>
                            <p className="text-xs text-blue-800 leading-relaxed">
                                Según tus métricas físicas y capacidades, la IA sugiere que tu posición natural es{" "}
                                <span className="font-semibold">{position.clusterName}</span>.
                            </p>
                        </div>
                    </div>
                )}

                {physical && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-green-600 to-green-700 flex items-center justify-center shrink-0">
                                <FaDumbbell className="text-white text-sm" />
                            </div>
                            <h4 className="text-base font-bold text-gray-800">Perfil Físico</h4>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-green-900">{physical.clusterName}</span>
                                    <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                                        Cluster {physical.clusterId}
                                    </span>
                                </div>
                                <p className="text-xs text-green-800 leading-relaxed">{physical.description}</p>
                            </div>

                            {physical.strengths.length > 0 && (
                                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                    <p className="text-xs font-bold text-emerald-900 mb-2">✓ Fortalezas</p>
                                    <ul className="space-y-1.5">
                                        {physical.strengths.map((s, i) => (
                                            <li key={i} className="text-xs text-emerald-800 flex items-start gap-2">
                                                <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                                                <span>{s}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {physical.developmentAreas.length > 0 && (
                                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                    <p className="text-xs font-bold text-amber-900 mb-2">◦ Áreas de Mejora</p>
                                    <ul className="space-y-1.5">
                                        {physical.developmentAreas.map((a, i) => (
                                            <li key={i} className="text-xs text-amber-800 flex items-start gap-2">
                                                <span className="text-amber-500 mt-0.5 shrink-0">◦</span>
                                                <span>{a}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {physical.trainingRecommendations.length > 0 && (
                                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                                    <p className="text-xs font-bold text-purple-900 mb-2">→ Recomendaciones</p>
                                    <ul className="space-y-1.5">
                                        {physical.trainingRecommendations.map((r, i) => (
                                            <li key={i} className="text-xs text-purple-800 flex items-start gap-2">
                                                <span className="text-purple-500 mt-0.5 shrink-0">→</span>
                                                <span>{r}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {physical.features && (
                                <div>
                                    <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                                        Métricas Físicas
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { label: "Edad", value: `${physical.features.age} años` },
                                            { label: "Altura", value: `${physical.features.height} cm` },
                                            { label: "Peso", value: `${physical.features.weight} kg` },
                                            { label: "IMC", value: physical.features.bmi.toFixed(1) },
                                            { label: "Salto Alto", value: `${physical.features.highJump} cm` },
                                            { label: "Salto Bipodal", value: `${physical.features.bipodalJump} cm` },
                                            { label: "30m", value: `${physical.features.thirtyMetersTime.toFixed(2)}s` },
                                            { label: "1000m", value: `${physical.features.thousandMetersTime.toFixed(0)}s` },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                <p className="text-[10px] text-gray-500 mb-0.5">{label}</p>
                                                <p className="text-sm font-bold text-gray-800">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};