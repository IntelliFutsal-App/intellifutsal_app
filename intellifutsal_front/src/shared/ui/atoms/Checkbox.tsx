import React, { forwardRef, type InputHTMLAttributes } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string | React.ReactNode;
    error?: string;
    color?: "orange" | "blue" | "green" | "red";
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, error, color = "orange", className = "", ...props }, ref) => {
        const colorClasses = {
            orange: "checked:bg-orange-500 focus:ring-orange-500",
            blue: "checked:bg-blue-500 focus:ring-blue-500",
            green: "checked:bg-green-500 focus:ring-green-500",
            red: "checked:bg-red-500 focus:ring-red-500"
        };

        return (
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        ref={ref}
                        type="checkbox"
                        className={`
                            w-5 h-5 rounded border-2 border-gray-300 
                            transition-all duration-200 cursor-pointer
                            focus:ring-2 focus:ring-offset-2
                            ${colorClasses[color]}
                            ${error ? "border-red-500" : ""}
                            ${className}
                        `}
                        {...props}
                    />
                </div>
                {label && (
                    <label className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                        {label}
                    </label>
                )}
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";
