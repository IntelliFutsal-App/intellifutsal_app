import { profileService } from "@features/profile/services/profileService";
import type { ProfileContextType, ProfileStateResponse } from "@features/profile/types";
import { useAuth } from "@shared/hooks";
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const ACTIVE_TEAM_STORAGE_KEY = "activeTeamId";

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, user, isLoading: authLoading } = useAuth();

    const [profileState, setProfileState] = useState<ProfileStateResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [activeTeamId, _setActiveTeamId] = useState<number | null>(() => {
        const raw = localStorage.getItem(ACTIVE_TEAM_STORAGE_KEY);
        if (!raw) return null;
        const parsed = Number(raw);
        return Number.isFinite(parsed) ? parsed : null;
    });

    const isFetchingRef = useRef(false);
    const lastUserIdRef = useRef<number | null>(null);
    const normalizedForUserRef = useRef<number | null>(null);

    const setActiveTeamId = useCallback((teamId: number | null) => {
        _setActiveTeamId(teamId);
        if (teamId === null) localStorage.removeItem(ACTIVE_TEAM_STORAGE_KEY);
        else localStorage.setItem(ACTIVE_TEAM_STORAGE_KEY, String(teamId));
    }, []);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated || !user) {
            setProfileState(null);
            setIsLoading(false);
            setActiveTeamId(null);
            lastUserIdRef.current = null;
            normalizedForUserRef.current = null;
            return;
        }

        if (lastUserIdRef.current === user.id) return;
        lastUserIdRef.current = user.id;

        const run = async () => {
            if (isFetchingRef.current) return;
            isFetchingRef.current = true;

            try {
                setIsLoading(true);
                const data = await profileService.getProfile();
                setProfileState(data);
            } catch (error) {
                console.error("Error al obtener el perfil:", error);
                setProfileState(null);
                setActiveTeamId(null);
            } finally {
                setIsLoading(false);
                isFetchingRef.current = false;
            }
        };

        run();
    }, [authLoading, isAuthenticated, user, setActiveTeamId]);

    useEffect(() => {
        if (!profileState || !user) return;
        if (normalizedForUserRef.current === user.id) return;

        const teamIds = new Set(profileState.teams.map(t => t.id));

        if (activeTeamId !== null && teamIds.has(activeTeamId)) {
            normalizedForUserRef.current = user.id;
            return;
        }

        const fallback = profileState.teams.length > 0 ? profileState.teams[0].id : null;
        setActiveTeamId(fallback);
        normalizedForUserRef.current = user.id;
    }, [profileState, user, activeTeamId, setActiveTeamId]);

    const refreshProfile = useCallback(async () => {
        if (!isAuthenticated || !user) return;
        if (isFetchingRef.current) return;

        isFetchingRef.current = true;
        try {
            setIsLoading(true);
            const data = await profileService.getProfile();
            setProfileState(data);

            normalizedForUserRef.current = null;
        } catch (error) {
            console.error("Error al refrescar perfil:", error);
        } finally {
            setIsLoading(false);
            isFetchingRef.current = false;
        }
    }, [isAuthenticated, user]);

    const clearProfile = useCallback(() => {
        setProfileState(null);
        setActiveTeamId(null);
        lastUserIdRef.current = null;
        normalizedForUserRef.current = null;
    }, [setActiveTeamId]);

    const value: ProfileContextType = useMemo(
        () => ({
            profileState,
            isLoading,
            refreshProfile,
            clearProfile,
            activeTeamId,
            setActiveTeamId,
        }),
        [profileState, isLoading, refreshProfile, clearProfile, activeTeamId, setActiveTeamId],
    );

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};