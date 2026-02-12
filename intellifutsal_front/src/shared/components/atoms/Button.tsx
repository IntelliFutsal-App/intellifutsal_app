import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

export interface ButtonProps {
    children: ReactNode;
    to?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "success" | "danger";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    icon?: IconType;
    iconPosition?: "left" | "right";
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
}

export const Button = ({
    children,
    to,
    onClick,
    variant = "primary",
    size = "md",
    icon: Icon,
    iconPosition = "right",
    disabled = false,
    loading = false,
    fullWidth = false,
    className = "",
    type = "button"
}: ButtonProps) => {
    const baseClasses = "font-sans font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group overflow-hidden relative";

    const sizeClasses = {
        xs: "px-3 py-1.5 text-xs rounded-lg",
        sm: "px-5 py-2.5 text-sm rounded-xl",
        md: "px-7 py-3.5 text-base rounded-xl",
        lg: "px-10 py-4 text-lg rounded-xl",
        xl: "px-12 py-5 text-xl rounded-2xl"
    };

    const variantClasses = {
        primary: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105",
        secondary: "bg-white text-orange-600 hover:bg-orange-50 shadow-lg hover:shadow-xl hover:scale-105 border border-orange-100",
        tertiary: "bg-gray-800 text-white hover:bg-gray-900 shadow-lg hover:shadow-xl hover:scale-105",
        outline: "border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white hover:scale-105",
        ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        success: "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105",
        danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
    };

    const widthClass = fullWidth ? "w-full" : "";
    const classes = twMerge(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        widthClass,
        className
    );

    const content = (
        <>
            {loading && <FaSpinner className="animate-spin w-4 h-4" />}
            {!loading && Icon && iconPosition === "left" && <Icon className="w-5 h-5" />}
            <span>{children}</span>
            {!loading && Icon && iconPosition === "right" && <Icon className="w-5 h-5" />}
        </>
    );

    if (to && !disabled) {
        return (
            <Link to={to} className={classes}>
                {content}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} disabled={disabled || loading} className={classes}>
            {content}
        </button>
    );
};