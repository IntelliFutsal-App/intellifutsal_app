import type { PlayerFieldData } from "@features/ai-module";
import { FaBrain, FaDumbbell, FaRedo, FaTimes } from "react-icons/fa";

interface SelfMode {
    mode: "self";
    onReanalyze: () => void;
    position: PlayerFieldData["position"];
    physical: PlayerFieldData["physical"];
    player?: never;
    onClose?: never;
}

interface TeammateMode {
    mode?: "teammate";
    player: PlayerFieldData;
    onClose: () => void;
    onReanalyze?: never;
    position?: never;
    physical?: never;
}

type PlayerInfoPanelProps = SelfMode | TeammateMode;

export const PlayerInfoPanel = (props: PlayerInfoPanelProps) => {
    const isSelf = props.mode === "self";

    const position = isSelf ? props.position : props.player?.position;
    const physical = isSelf ? props.physical : props.player?.physical;
    const title = isSelf ? "Mi Análisis IA" : props.player?.name ?? "";
    const subtitle = isSelf
        ? "Predicciones personalizadas para ti"
        : position?.clusterName ?? null;

    if (!isSelf && !props.player) return null;

    return (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 group overflow-hidden relative">
            <div className="bg-linear-to-r from-orange-600 to-orange-700 p-5 sm:p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-14 -mt-14" />
                <div className="relative flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="text-lg sm:text-2xl font-bold truncate">{title}</h3>
                        {subtitle && (
                            <p className="text-orange-100 text-xs sm:text-sm mt-0.5">{subtitle}</p>
                        )}
                    </div>

                    {isSelf ? (
                        <button
                            onClick={props.onReanalyze}
                            title="Reanalizar"
                            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        >
                            <FaRedo className="text-sm" />
                        </button>
                    ) : (
                        <button
                            onClick={props.onClose}
                            title="Cerrar"
                            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        >
                            <FaTimes className="text-sm" />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {position && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center shrink-0">
                                <FaBrain className="text-white text-sm" />
                            </div>
                            <h4 className="text-base font-bold text-gray-800">
                                {isSelf ? "Posición Sugerida" : "Análisis de Posición"}
                            </h4>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-blue-900">{position.clusterName}</span>
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-medium">
                                    Cluster {position.clusterId}
                                </span>
                            </div>
                            {isSelf && (
                                <p className="text-xs text-blue-800 leading-relaxed">
                                    Según tus métricas físicas y capacidades, la IA sugiere que tu posición natural es{" "}
                                    <span className="font-semibold">{position.clusterName}</span>.
                                </p>
                            )}
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
                                <p className="text-xs sm:text-sm text-green-700 leading-relaxed">{physical.description}</p>
                            </div>

                            {physical.strengths.length > 0 && (
                                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                    <p className="text-xs font-bold text-emerald-900 mb-2">✓ Fortalezas</p>
                                    <ul className="space-y-1.5">
                                        {physical.strengths.map((s, i) => (
                                            <li key={i} className="text-xs sm:text-sm text-emerald-700 flex items-start gap-2">
                                                <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                                                <span>{s}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {physical.developmentAreas.length > 0 && (
                                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                    <p className="text-xs font-bold text-amber-900 mb-2">◦ Áreas de Desarrollo</p>
                                    <ul className="space-y-1.5">
                                        {physical.developmentAreas.map((a, i) => (
                                            <li key={i} className="text-xs sm:text-sm text-amber-700 flex items-start gap-2">
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
                                            <li key={i} className="text-xs sm:text-sm text-purple-700 flex items-start gap-2">
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
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
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