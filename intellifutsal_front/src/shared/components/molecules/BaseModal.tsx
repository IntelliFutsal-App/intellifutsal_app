import { Fragment, type ReactNode } from "react";
import { FaTimes } from "react-icons/fa";
import type { IconType } from "react-icons";

export type IconColorType = "orange" | "blue" | "green" | "red" | "purple" | "amber";

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string | ReactNode;
    icon?: IconType;
    iconColor?: IconColorType;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    children: ReactNode;
    footer?: ReactNode;
    position?: "center" | "top";
}

const ICON_COLORS = {
    orange: "from-orange-500 to-orange-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-amber-600",
};

const MAX_WIDTHS = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
};

export const BaseModal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    icon: Icon,
    iconColor = "orange",
    maxWidth = "lg",
    children,
    footer,
    position = "center",
}: BaseModalProps) => {
    if (!isOpen) return null;

    return (
        <Fragment>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className={`fixed inset-0 z-50 flex ${position === "center" ? "items-center justify-center" : "items-start justify-center pt-20"
                    } p-4 pointer-events-none`}
            >
                <div
                    className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 ${MAX_WIDTHS[maxWidth]} w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-slide-down`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white/95 backdrop-blur-xl flex items-center justify-between p-6 border-b border-gray-200 z-10">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            {Icon && (
                                <div className={`bg-linear-to-br ${ICON_COLORS[iconColor]} p-3 rounded-xl shrink-0`}>
                                    <Icon className="text-white text-lg" />
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <h2 className="text-xl font-bold text-gray-800 truncate">{title}</h2>
                                {subtitle ? <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p> : subtitle}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0 cursor-pointer"
                            aria-label="Cerrar"
                        >
                            <FaTimes className="text-gray-500 text-lg" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">{children}</div>

                    {/* Footer */}
                    {footer && (
                        <div className="p-6 border-t border-gray-200 bg-gray-50/50">
                            {footer}
                        </div>
                    )}
                </div>
            </div>

            {/* Global Animations */}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slide-down {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
                
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
            `}</style>
        </Fragment>
    );
};