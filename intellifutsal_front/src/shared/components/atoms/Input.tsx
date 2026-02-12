import { forwardRef, type InputHTMLAttributes, useState } from "react";
import type { IconType } from "react-icons";
import { FiEye, FiEyeOff } from "react-icons/fi";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: IconType;
    rightIcon?: IconType;
    showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({
        label,
        error,
        helperText,
        leftIcon: LeftIcon,
        rightIcon: RightIcon,
        showPasswordToggle = false,
        type = "text",
        className = "",
        ...props
    }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const inputType = showPasswordToggle && showPassword ? "text" : type;

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {LeftIcon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            <LeftIcon className="w-5 h-5" />
                        </div>
                    )}

                    <input
                        ref={ref}
                        type={inputType}
                        className={`
                            w-full px-4 py-3.5 rounded-xl border-2 font-sans
                            transition-all duration-200
                            bg-gray-50 text-gray-900 placeholder-gray-500
                            focus:outline-none focus:ring-4 focus:ring-orange-500/20
                            disabled:bg-gray-100 disabled:cursor-not-allowed
                            ${LeftIcon ? "pl-12" : ""}
                            ${(RightIcon || showPasswordToggle) ? "pr-12" : ""}
                            ${error
                                                ? "border-red-500 focus:border-red-500"
                                                : "border-gray-200 focus:border-orange-500 hover:border-orange-300"
                                            }
                            ${className}
                        `}
                        {...props}
                    />

                    {showPasswordToggle && type === "password" && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors"
                        >
                            {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>
                    )}

                    {RightIcon && !showPasswordToggle && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                            <RightIcon className="w-5 h-5" />
                        </div>
                    )}
                </div>

                {error && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p className="mt-2 text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";