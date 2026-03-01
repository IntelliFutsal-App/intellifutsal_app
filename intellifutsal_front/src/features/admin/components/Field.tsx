import type { ReactNode } from "react";

interface FieldProps {
    label: string;
    required?: boolean;
    error?: string;
    hint?: string;
    children: ReactNode;
    className?: string;
}

export const Field = ({
    label,
    required = false,
    error,
    hint,
    children,
    className = "",
}: FieldProps) => {
    const hasError = Boolean(error);

    return (
        <div className={className}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className={hasError ? "ring-1 ring-red-200 rounded-xl" : ""}>
                {children}
            </div>

            {hint && !hasError && (
                <p className="text-xs text-gray-500 mt-1">{hint}</p>
            )}

            {hasError && (
                <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
};