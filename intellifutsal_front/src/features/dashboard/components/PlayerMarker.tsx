import { FaUser } from "react-icons/fa";
import type { PlayerFieldData } from "../hooks";

interface PlayerMarkerProps {
    player: PlayerFieldData;
    position: { x: number; y: number };
    onClick?: () => void;
}

const CLUSTER_COLORS = {
    0: { bg: 'bg-orange-500', border: 'border-orange-600', glow: 'shadow-orange-500/50', name: 'Explosivo' }, 
    1: { bg: 'bg-blue-500', border: 'border-blue-600', glow: 'shadow-blue-500/50', name: 'Balanceado' },     
    2: { bg: 'bg-green-500', border: 'border-green-600', glow: 'shadow-green-500/50', name: 'Resistente' },  
    3: { bg: 'bg-purple-500', border: 'border-purple-600', glow: 'shadow-purple-500/50', name: 'Poderoso' }, 
    4: { bg: 'bg-cyan-500', border: 'border-cyan-600', glow: 'shadow-cyan-500/50', name: 'Ágil' },          
} as const;

const getShortPositionName = (description: string): string => {
    const upper = description.toUpperCase();
    
    if (upper.includes("'ALA'") || upper.includes('ALA')) return 'Ala';
    if (upper.includes("'PÍVOT'") || upper.includes('PÍVOT') || upper.includes('PIVOT')) return 'Pívot';
    if (upper.includes("'POSTE'") || upper.includes('POSTE') || upper.includes('FIXO')) return 'Poste';
    if (upper.includes("'ARQUERO'") || upper.includes('ARQUERO') || upper.includes('PORTERO') || upper.includes('GOALKEEPER')) return 'Portero';
    
    return description;
};

export const PlayerMarker = ({ player, position, onClick }: PlayerMarkerProps) => {
    const physicalCluster = player.physical?.clusterId ?? 0;
    const colors = CLUSTER_COLORS[physicalCluster as keyof typeof CLUSTER_COLORS] || CLUSTER_COLORS[0];

    const displayPosition = player.position?.clusterName
        ? getShortPositionName(player.position.clusterName)
        : 'Sin posición';

    if (player.loading) {
        return (
            <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
            >
                <div className="w-12 h-12 rounded-full bg-gray-400 border-2 border-gray-500 animate-pulse" />
            </div>
        );
    }

    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 cursor-pointer group"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            onClick={onClick}
        >
            {/* Player circle */}
            <div className={`
                w-12 h-12 sm:w-14 sm:h-14 rounded-full ${colors.bg} ${colors.border} border-3
                flex items-center justify-center shadow-lg ${colors.glow}
                transition-all duration-300 group-hover:shadow-2xl
            `}>
                <FaUser className="text-white text-base sm:text-lg" />
            </div>

            {/* Position badge */}
            {player.position && (
                <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center shadow-md">
                    <span className="text-[9px] sm:text-[10px] font-bold text-gray-700">
                        {displayPosition.charAt(0)}
                    </span>
                </div>
            )}

            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl">
                    <p className="font-semibold">{player.name}</p>
                    {player.position && (
                        <p className="text-gray-300 text-[10px] mt-0.5">{displayPosition}</p>
                    )}
                    {player.physical && (
                        <p className="text-gray-400 text-[10px]">{colors.name}</p>
                    )}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
                </div>
            </div>
        </div>
    );
};