import React, { forwardRef, useState } from "react";
import type { TextareaHTMLAttributes } from "react";
import type { IconType } from "react-icons";
import { FiAlertCircle } from "react-icons/fi";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: IconType;
    rightIcon?: IconType;
    showCharCount?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            label,
            error,
            helperText,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            showCharCount = false,
            rows = 4,
            maxLength,
            value,
            defaultValue,
            onChange,
            ...props
        },
        ref
    ) => {
        const [internalValue, setInternalValue] = useState<string>(
            typeof defaultValue === "string" ? defaultValue : ""
        );

        const isControlled = value !== undefined;
        const currentValue = isControlled ? String(value) : internalValue;
        const length = currentValue ? currentValue.length : 0;

        const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
            if (!isControlled) setInternalValue(e.target.value);
            if (onChange) onChange(e);
        };

        return (
            <div style={{ width: "100%" }}>
                {label && (
                    <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#111827" }}>
                        {label}
                    </label>
                )}

                <div style={{ position: "relative" }}>
                    {LeftIcon && (
                        <div style={{ position: "absolute", left: 12, top: 12, color: "#6B7280" }}>
                            <LeftIcon size={18} />
                        </div>
                    )}

                    <textarea
                        ref={ref}
                        rows={rows}
                        maxLength={maxLength}
                        value={isControlled ? value : internalValue}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            paddingLeft: LeftIcon ? 44 : 12,
                            paddingRight: (RightIcon || showCharCount) ? 44 : 12,
                            paddingTop: 12,
                            paddingBottom: 12,
                            borderRadius: 12,
                            borderWidth: 2,
                            borderStyle: "solid",
                            background: "#F9FAFB",
                            color: "#111827",
                            fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto",
                            outline: "none",
                            transition: "all 0.15s ease",
                            borderColor: error ? "#EF4444" : "#E5E7EB",
                        }}
                        {...props}
                    />

                    {RightIcon && (
                        <div style={{ position: "absolute", right: 12, top: 12, color: "#6B7280" }}>
                            <RightIcon size={18} />
                        </div>
                    )}

                    {showCharCount && typeof maxLength === "number" && (
                        <div style={{ position: "absolute", right: 12, bottom: 8, fontSize: 12, color: "#6B7280" }}>
                            {length}/{maxLength}
                        </div>
                    )}
                </div>

                {error ? (
                    <p style={{ marginTop: 8, fontSize: 13, color: "#DC2626", display: "flex", alignItems: "center", gap: 6 }}>
                        <FiAlertCircle size={16} />
                        {error}
                    </p>
                ) : (
                    helperText && (
                        <p style={{ marginTop: 8, fontSize: 13, color: "#6B7280" }}>
                            {helperText}
                        </p>
                    )
                )}
            </div>
        );
    }
);

TextArea.displayName = "TextArea";