import type { HTMLAttributes } from "react";

type LoadingVariant = "fullscreen" | "contained";

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
    variant?: LoadingVariant;
    label?: string;
    showBackdrop?: boolean;
}

export const Loading = ({
    variant = "fullscreen",
    label = "Cargando experiencia IA...",
    showBackdrop = true,
    className = "",
    ...rest
}: LoadingProps) => {
    const isFullscreen = variant === "fullscreen";

    return (
        <div
            {...rest}
            className={[
                isFullscreen ? "fixed inset-0 z-50" : "absolute inset-0 z-10",
                isFullscreen ? "bg-white" : "bg-transparent",
                "flex items-center justify-center",
                className,
            ].join(" ")}
        >
            {/* Animated Background */}
            {showBackdrop && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {!isFullscreen && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
                    )}

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 animate-pulse" />
                    </div>
                    <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-64 h-64 bg-orange-300 rounded-full blur-3xl opacity-10 animate-pulse delay-150" />
                    </div>
                </div>
            )}

            {/* Loading Content */}
            <div className="relative text-center">
                <div className="mb-8 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
                    </div>

                    <div className="relative flex items-center justify-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <img
                                src="/icon.png"
                                alt="IntelliFutsal Logo"
                                className="w-12 h-12 object-contain animate-pulse"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">IntelliFutsal</h2>
                    <p className="text-gray-600 font-medium">{label}</p>
                </div>

                <div className="flex items-center justify-center gap-2 mt-6">
                    <span className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-orange-600 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-orange-600 rounded-full animate-bounce delay-200" />
                </div>
            </div>
        </div>
    );
};