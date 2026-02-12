import { FaUsers, FaChartLine } from "react-icons/fa";
import type { TeamActivityResponse } from "@features/dashboard/types";

interface TeamActivityCardsProps {
    data: TeamActivityResponse[];
    title: string;
}

export const TeamActivityCards = ({ data, title }: TeamActivityCardsProps) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="bg-gray-100 rounded-full p-6 mb-4">
                        <FaUsers className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-sm font-semibold text-gray-600">No hay equipos registrados</p>
                    <p className="text-xs text-gray-500 mt-1">Los equipos aparecerán aquí</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="space-y-3">
                {data.map((team) => {
                    const activityRate7Days =
                        team.activePlayers > 0
                            ? (team.playersWithProgressLast7Days / team.activePlayers) * 100
                            : 0;
                    const activityRate28Days =
                        team.activePlayers > 0
                            ? (team.playersWithProgressLast28Days / team.activePlayers) * 100
                            : 0;

                    return (
                        <div
                            key={team.teamId}
                            className="bg-linear-to-r from-gray-50 to-orange-50/30 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-linear-to-br from-orange-500 to-orange-600 p-3 rounded-lg">
                                        <FaUsers className="text-white text-sm" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{team.teamName}</h4>
                                        <p className="text-xs text-gray-500">
                                            {team.activePlayers} jugadores activos
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white rounded-lg p-3 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaChartLine className="text-blue-600 text-xs" />
                                        <span className="text-xs text-gray-600 font-medium">7 días</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-800">
                                        {team.playersWithProgressLast7Days}
                                        <span className="text-xs text-gray-500 font-normal ml-1">
                                            ({activityRate7Days.toFixed(0)}%)
                                        </span>
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg p-3 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaChartLine className="text-green-600 text-xs" />
                                        <span className="text-xs text-gray-600 font-medium">28 días</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-800">
                                        {team.playersWithProgressLast28Days}
                                        <span className="text-xs text-gray-500 font-normal ml-1">
                                            ({activityRate28Days.toFixed(0)}%)
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};