import type { User } from "@features/auth";
import type { CoachResponse } from "@features/coach";
import type { PlayerResponse } from "@features/player";
import { EditProfileModal } from "@features/profile";
import { TeamSelectorModal } from "@features/team";
import { useAuth, useProfile } from "@shared/hooks";
import { useMemo, useState } from "react";
import { FaChevronDown, FaPencilAlt } from "react-icons/fa";

interface TopBarProps {
    user: User;
    userResponse: PlayerResponse | CoachResponse | null;
    onNotificationsClick?: () => void;
    notificationsCount?: number;
}

export const TopBar = ({
    userResponse,
}: TopBarProps) => {
    const { user } = useAuth();
    const { profileState, activeTeamId, setActiveTeamId } = useProfile();
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const fullName = useMemo(
        () => {
            return user?.role !== "ADMIN" && userResponse ? `${userResponse.firstName} ${userResponse.lastName}`.trim() : "Administrador";
        },
        [userResponse, user?.role]
    );

    const avatarSrc = useMemo(() => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=ea580c&color=fff&size=64`;
    }, [fullName]);

    const activeTeam = useMemo(() => {
        return profileState?.teams.find((t) => t.id === activeTeamId) ?? null;
    }, [profileState?.teams, activeTeamId]);

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
                                {user?.role !== "ADMIN" ? userResponse?.firstName : user?.email}
                            </span>
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                            Gestiona tu entrenamiento con inteligencia artificial
                        </p>
                    </div>

                    {
                        user?.role !== "ADMIN" && (
                            <div className="flex items-center gap-2 sm:gap-3">
                                {/* Edit profile button — desktop */}
                                <button
                                    type="button"
                                    onClick={() => setIsEditProfileOpen(true)}
                                    title="Editar perfil"
                                    className="hidden sm:flex items-center justify-center px-3 sm:px-4 py-4 rounded-xl bg-linear-to-br from-gray-50 to-orange-50/30 border border-gray-200/50 text-gray-500 hover:text-orange-600 hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-400"
                                    aria-label="Editar perfil"
                                >
                                    <FaPencilAlt className="text-sm" />
                                </button>

                                {/* Profile / Team selector button — desktop */}
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

                                {/* Mobile */}
                                <button
                                    type="button"
                                    onClick={() => setIsEditProfileOpen(true)}
                                    className="sm:hidden p-2 rounded-xl border border-gray-200/50 bg-linear-to-br from-gray-50 to-orange-50/30 text-gray-500 hover:text-orange-600 transition-all duration-200"
                                    aria-label="Editar perfil"
                                >
                                    <FaPencilAlt className="text-sm" />
                                </button>

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
                        )
                    }
                </div>
            </header>

            <TeamSelectorModal
                isOpen={isTeamModalOpen}
                onClose={() => setIsTeamModalOpen(false)}
                teams={profileState?.teams || []}
                activeTeamId={activeTeamId}
                onSelectTeam={handleTeamSelect}
            />

            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
            />
        </>
    );
};