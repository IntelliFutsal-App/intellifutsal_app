import type { User } from "@features/auth";
import type { CoachResponse } from "@features/coach/types";
import type { PlayerResponse } from "@features/player/types";
import { useProfile } from "@shared/hooks";
import { useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { TeamSelectorModal } from "./TeamsSelectorModal";

interface TopBarProps {
    user: User;
    userResponse: PlayerResponse | CoachResponse;
    onNotificationsClick?: () => void;
    notificationsCount?: number;
}

export const TopBar = ({
    userResponse,
    // onNotificationsClick,
    // notificationsCount = 1,
}: TopBarProps) => {
    const { profileState, activeTeamId, setActiveTeamId } = useProfile();
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

    const fullName = useMemo(
        () => `${userResponse.firstName} ${userResponse.lastName}`.trim(),
        [userResponse.firstName, userResponse.lastName]
    );

    const avatarSrc = useMemo(() => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=ea580c&color=fff&size=64`;
    }, [fullName]);

    const activeTeam = useMemo(() => {
        return profileState?.teams.find((t) => t.id === activeTeamId) ?? null;
    }, [profileState?.teams, activeTeamId]);

    // const showDot = notificationsCount > 0;

    const handleTeamSelect = (teamId: number) => {
        setActiveTeamId(teamId);
    };

    return (
        <>
            <header className="fixed top-0 right-0 left-0 lg:left-64 h-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 z-30">
                <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
                    {/* Left */}
                    <div className="min-w-0 flex-1">
                        <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent truncate">
                            Bienvenido de vuelta,{" "}
                            <span className="bg-linear-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                                {userResponse.firstName}
                            </span>
                        </h1>

                        <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                            Gestiona tu entrenamiento con inteligencia artificial
                        </p>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Notifications */}
                        {/* <div className="relative">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-3! rounded-xl hover:bg-orange-50"
                                onClick={onNotificationsClick}
                                aria-label="Abrir notificaciones"
                            >
                                <FaBell className="text-lg sm:text-xl text-gray-600" />
                            </Button>

                            {showDot && (
                                <span
                                    aria-label={`${notificationsCount} notificaciones`}
                                    className="absolute top-2 right-2 w-2.5 h-2.5 bg-linear-to-br from-red-500 to-red-600 rounded-full animate-pulse"
                                />
                            )}
                        </div> */}

                        {/* Profile Button */}
                        <button
                            type="button"
                            onClick={() => setIsTeamModalOpen(true)}
                            className="hidden sm:flex items-center gap-3 px-3 sm:px-4 py-2 bg-linear-to-br from-gray-50 to-orange-50/30 rounded-xl border border-gray-200/50 hover:shadow-md hover:border-orange-300 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-400"
                            aria-label="Cambiar equipo activo"
                            title={`Equipo activo: ${activeTeam?.name || "Ninguno"}`}
                        >
                            <img
                                src={avatarSrc}
                                alt={fullName}
                                className="w-10 h-10 rounded-full ring-2 ring-orange-200 shrink-0"
                            />
                            <div className="text-sm min-w-0 max-w-[200px]">
                                <div className="font-semibold text-gray-800 truncate">{fullName}</div>
                                <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                                    {activeTeam ? (
                                        <>
                                            <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                                            {activeTeam.name}
                                        </>
                                    ) : (
                                        <span className="text-gray-400">Sin equipo</span>
                                    )}
                                </div>
                            </div>
                            <FaChevronDown className="text-gray-400 text-xs shrink-0" />
                        </button>

                        {/* Mobile Profile Button */}
                        <button
                            type="button"
                            onClick={() => setIsTeamModalOpen(true)}
                            className="sm:hidden p-2 bg-linear-to-br from-gray-50 to-orange-50/30 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200"
                            aria-label="Cambiar equipo activo"
                        >
                            <img
                                src={avatarSrc}
                                alt={fullName}
                                className="w-8 h-8 rounded-full ring-2 ring-orange-200"
                            />
                        </button>
                    </div>
                </div>
            </header>

            {/* Team Selector Modal */}
            <TeamSelectorModal
                isOpen={isTeamModalOpen}
                onClose={() => setIsTeamModalOpen(false)}
                teams={profileState?.teams || []}
                activeTeamId={activeTeamId}
                onSelectTeam={handleTeamSelect}
            />
        </>
    );
};