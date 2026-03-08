import { forwardRef, type SelectHTMLAttributes } from "react";
import type { IconType } from "react-icons";

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
    label?: string;
    error?: string;
    helperText?: string;
    options: SelectOption[];
    leftIcon?: IconType;
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({
        label,
        error,
        helperText,
        options,
        leftIcon: LeftIcon,
        placeholder = "Selecciona una opción",
        className = "",
        ...props
    }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {LeftIcon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                            <LeftIcon className="w-5 h-5" />
                        </div>
                    )}

                    <select
                        ref={ref}
                        className={`
                            w-full px-4 py-3.5 rounded-xl border-2 font-sans
                            transition-all duration-200 appearance-none
                            bg-gray-50 text-gray-900
                            focus:outline-none focus:ring-4 focus:ring-orange-500/20
                            disabled:bg-gray-100 disabled:cursor-not-allowed
                            ${LeftIcon ? "pl-12" : ""}
                            ${error
                                                ? "border-red-500 focus:border-red-500"
                                                : "border-gray-200 focus:border-orange-500 hover:border-orange-300"
                                            }
                            ${className}
                        `}
                        {...props}
                    >
                        <option value="" disabled>
                            {placeholder}
                        </option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Custom Arrow */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
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

Select.displayName = "Select";