import type { Role } from "@features/auth";
import { Logo, Button } from "@shared/components";
import { FaBrain, FaChartLine, FaClipboardList, FaDumbbell, FaHome, FaRunning, FaSearch, FaSignOutAlt, FaUsers, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "@shared/hooks";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

interface SidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    role: Role;
}

export const Sidebar = ({ activeSection, setActiveSection, role }: SidebarProps) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const coachMenuItems = useMemo(
        () => [
            { id: "overview", label: "Vista General", icon: FaHome },
            { id: "teams", label: "Mis Equipos", icon: FaUsers },
            { id: "players", label: "Jugadores", icon: FaRunning },
            { id: "training-plans", label: "Entrenamientos", icon: FaDumbbell },
            { id: "ai-analysis", label: "Análisis IA", icon: FaBrain },
            { id: "field-analysis", label: "Análisis de Campo", icon: FaChartLine },
            { id: "join-requests", label: "Solicitudes", icon: FaClipboardList },
        ],
        []
    );

    const playerMenuItems = useMemo(
        () => [
            { id: "overview", label: "Mi Panel", icon: FaHome },
            { id: "my-training", label: "Mis Entrenamientos", icon: FaDumbbell },
            { id: "my-progress", label: "Mi Progreso", icon: FaChartLine },
            { id: "my-team", label: "Mi Equipo", icon: FaUsers },
            { id: "my-analysis", label: "Mi Análisis IA", icon: FaBrain },
            { id: "find-teams", label: "Buscar Equipos", icon: FaSearch },
        ],
        []
    );

    const menuItems = role === "COACH" ? coachMenuItems : playerMenuItems;

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await logout();
        } finally {
            navigate("/auth/sign-in", { replace: true });
            setIsLoggingOut(false);
            setIsOpen(false);
        }
    };

    const menuButtonBase =
        "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-400";

    return (
        <>
            {/* Mobile toggle */}
            <button
                aria-label="Abrir menú"
                className="lg:hidden fixed top-4 left-4 z-50 bg-white/90 p-2 rounded-lg shadow-md"
                onClick={() => setIsOpen(true)}
            >
                <FaBars />
            </button>

            {/* Overlay for mobile drawer */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden
                />
            )}

            {/* Sidebar - desktop + mobile drawer */}
            <aside
                aria-label="Barra lateral de navegación"
                className={twMerge(
                    "fixed left-0 top-0 h-screen w-64 bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 z-50 hidden lg:block",
                    // mobile drawer classes conditionally applied
                    isOpen ? "block lg:block" : ""
                )}
            >
                <div className="p-6 border-b border-gray-700/50">
                    <Logo dark={true} />
                </div>

                <nav className="p-4 space-y-2" role="navigation" aria-label="Secciones principales">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = activeSection === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveSection(item.id);
                                    setIsOpen(false);
                                }}
                                aria-current={active ? "page" : undefined}
                                title={item.label}
                                className={twMerge(
                                    menuButtonBase,
                                    active
                                        ? "bg-linear-to-r from-orange-600 to-orange-700 text-white"
                                        : "text-gray-300 hover:bg-gray-800/50 hover:text-white cursor-pointer"
                                )}
                            >
                                <Icon
                                    className={twMerge(
                                        "text-lg transition-transform duration-200",
                                        active ? "scale-110" : "group-hover:scale-110"
                                    )}
                                    aria-hidden
                                />
                                <span className="font-medium text-sm">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-700/50 space-y-2">
                    <Button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300"
                        icon={FaSignOutAlt}
                        iconPosition="left"
                        size="md"
                    >
                        {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
                    </Button>
                </div>
            </aside>

            {/* Mobile Drawer (same markup but as overlay) */}
            <aside
                aria-label="Menú móvil"
                className={twMerge(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 transform transition-transform duration-200 lg:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-4 flex items-center justify-between border-b border-gray-700/50">
                    <Logo dark={true} />
                    <button
                        aria-label="Cerrar menú"
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-gray-200 hover:text-white rounded-md"
                    >
                        <FaTimes />
                    </button>
                </div>

                <nav className="p-4 space-y-2" role="navigation" aria-label="Secciones principales">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = activeSection === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveSection(item.id);
                                    setIsOpen(false);
                                }}
                                aria-current={active ? "page" : undefined}
                                title={item.label}
                                className={twMerge(
                                    menuButtonBase,
                                    active
                                        ? "bg-linear-to-r from-orange-600 to-orange-700 text-white"
                                        : "text-gray-300 hover:bg-gray-800/50 hover:text-white cursor-pointer"
                                )}
                            >
                                <Icon
                                    className={twMerge(
                                        "text-lg transition-transform duration-200",
                                        active ? "scale-110" : "group-hover:scale-110"
                                    )}
                                    aria-hidden
                                />
                                <span className="font-medium text-sm">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-700/50">
                    <Button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300"
                        icon={FaSignOutAlt}
                        iconPosition="left"
                        size="md"
                    >
                        {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
                    </Button>
                </div>
            </aside>
        </>
    );
};