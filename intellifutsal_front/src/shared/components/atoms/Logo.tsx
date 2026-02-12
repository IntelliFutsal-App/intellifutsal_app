import { Link } from "react-router-dom";

interface LogoProps {
    size?: "sm" | "md" | "lg";
    showText?: boolean;
    dark?: boolean;
}

export const Logo = ({ size = "md", showText = true, dark = false }: LogoProps) => {
    const sizeClasses = {
        sm: "w-7 h-7",
        md: "w-9 h-9",
        lg: "w-12 h-12"
    };

    const textSizeClasses = {
        sm: "text-xl",
        md: "text-2xl",
        lg: "text-3xl"
    };

    return (
        <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
                <img
                    src="/icon.png"
                    alt="IntelliFutsal Logo"
                    className={`${sizeClasses[size]} object-contain transition-transform duration-300 group-hover:scale-110`}
                />
            </div>
            {showText && (
                <h1 className={`${textSizeClasses[size]} font-bold bg-linear-to-r bg-clip-text text-transparent transition-all duration-300 ${dark ? "text-white" : "from-gray-900 to-gray-700"}`}>
                    IntelliFutsal
                </h1>
            )}
        </Link>
    );
};