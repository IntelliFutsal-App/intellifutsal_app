import { ProfileContext } from "@app/contexts";
import type { ProfileContextType } from "@features/profile";
import { useContext } from "react";

export const useProfile = (): ProfileContextType => {
    const context = useContext(ProfileContext);
    if (!context) throw new Error("useProfile debe usarse dentro de un ProfileProvider");
    
    return context;
};