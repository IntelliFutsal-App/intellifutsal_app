import type { PlayerResponse } from "@features/player/types";
import { FaBrain } from "react-icons/fa";
import { Button, StatTile } from "@shared/components";

interface PlayerCardProps {
    player: PlayerResponse;
    onAnalyze?: (player: PlayerResponse) => void;
}

export const PlayerCard = ({ player, onAnalyze }: PlayerCardProps) => {
    const fullName = `${player.firstName} ${player.lastName}`;

    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative">
            {/* Decorative highlight (subtle on hover) */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-orange-100 to-transparent rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-center space-x-4 mb-4 min-w-0">
                <div className="relative shrink-0">
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=ea580c&color=fff`}
                        alt={`Avatar de ${fullName}`}
                        className="w-14 h-14 rounded-xl ring-2 ring-orange-200 group-hover:ring-4 transition-all duration-300 object-cover"
                    />
                    {/* status dot (green by default if truthy) */}
                    <span
                        aria-hidden
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${player.status ? "bg-green-500" : "bg-gray-300"}`}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 text-lg truncate" title={fullName}>
                        {fullName}
                    </h4>
                    <p className="text-sm text-gray-600 truncate" title={player.position}>
                        {player.position}
                    </p>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <StatTile label="Años" value={player.age ?? "—"} />
                <StatTile label="Altura" value={player.height ? `${player.height}m` : "—"} />
                <StatTile label="Peso" value={player.weight ? `${player.weight}kg` : "—"} />
            </div>

            {/* Action */}
            <Button
                onClick={() => onAnalyze?.(player)}
                variant="primary"
                icon={FaBrain}
                iconPosition="left"
                fullWidth
                aria-label={`Ver análisis IA de ${fullName}`}
            >
                Ver Análisis IA
            </Button>
        </div>
    );
};