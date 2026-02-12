import { authService, TokenManager, type AuthContextType, type Role, type User } from "@features/auth";
import { createContext, useCallback, useContext, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { ProfileContext } from "./ProfileContext";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const profileContext = useContext(ProfileContext);

    const isValidatingRef = useRef(false);
    const hasValidatedRef = useRef(false);

    const validateAndSetUser = useCallback(async () => {
        if (isValidatingRef.current || hasValidatedRef.current) {
            return;
        }

        isValidatingRef.current = true;

        const accessToken = TokenManager.getAccessToken();
        const refreshToken = TokenManager.getRefreshToken();

        if (!refreshToken && !accessToken) {
            setUser(null);
            setIsLoading(false);
            setIsInitialized(true);
            hasValidatedRef.current = true;
            isValidatingRef.current = false;
            return;
        }

        try {
            if (!accessToken && refreshToken) {
                const refreshed = await authService.refreshToken(refreshToken);
                TokenManager.setTokens(refreshed.accessToken, refreshed.refreshToken);
                setUser(refreshed.user);
                setIsLoading(false);
                setIsInitialized(true);
                hasValidatedRef.current = true;
                isValidatingRef.current = false;
                return;
            }

            try {
                const { isValid, payload } = await authService.validateToken();

                if (isValid && payload) {
                    setUser(payload);
                    setIsLoading(false);
                    setIsInitialized(true);
                    hasValidatedRef.current = true;
                    isValidatingRef.current = false;
                    return;
                }

                throw new Error("Token no válido");

            } catch {
                if (!refreshToken) {
                    throw new Error("No hay refresh token disponible");
                }

                try {
                    const refreshed = await authService.refreshToken(refreshToken);
                    TokenManager.setTokens(refreshed.accessToken, refreshed.refreshToken);
                    setUser(refreshed.user);
                } catch (refreshError) {
                    console.error("Error en refresh:", refreshError);
                    throw refreshError;
                }
            }
        } catch (error) {
            console.error("Boot auth falló completamente:", error);
            TokenManager.clearTokens();
            setUser(null);
        } finally {
            setIsLoading(false);
            setIsInitialized(true);
            hasValidatedRef.current = true;
            isValidatingRef.current = false;
        }
    }, []);

    useEffect(() => {
        if (!isInitialized && !hasValidatedRef.current) {
            validateAndSetUser();
        }
    }, [validateAndSetUser, isInitialized]);

    const login = async (email: string, password: string) => {
        const response = await authService.login(email, password);

        TokenManager.setTokens(response.accessToken, response.refreshToken);

        setUser(response.user);
        hasValidatedRef.current = false;
        toast.success(`¡Bienvenid@ de nuevo, ${response.user.email}!`);
    };

    const register = async (email: string, password: string, role: Role) => {
        const response = await authService.register(email, password, role);

        TokenManager.setTokens(response.accessToken, response.refreshToken);

        setUser(response.user);
        hasValidatedRef.current = false;
        toast.success("¡Cuenta creada con éxito!");
    };

    const logout = async () => {
        try {
            await authService.logout();
            toast.info("Cierre de sesión exitoso");
        } catch (error) {
            console.error("Cierre de sesión fallido:", error);
        } finally {
            TokenManager.clearTokens();
            setUser(null);
            profileContext?.clearProfile();
            hasValidatedRef.current = false;
            isValidatingRef.current = false;
        }
    };

    const hasRole = (roles: Role | Role[]): boolean => {
        if (!user) return false;
        const roleArray = Array.isArray(roles) ? roles : [roles];
        return roleArray.includes(user.role);
    };

    const updateUser = useCallback((updatedUser: User) => {
        setUser(updatedUser);
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        hasRole,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};