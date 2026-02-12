import { AuthContext } from "@app/contexts/AuthContext";
import type { AuthContextType } from "@features/auth";
import { useContext } from "react";

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");

    return context;
};