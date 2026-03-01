import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, useProfile } from "@shared/hooks";
import { Loading } from "./atoms";

interface OnboardingGuardProps {
    children: React.ReactNode;
}

export const OnboardingGuard = ({ children }: OnboardingGuardProps) => {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { profileState, isLoading: profileLoading } = useProfile();
    const navigate = useNavigate();
    const location = useLocation();
    const lastRedirectRef = useRef<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated || !user) {
            lastRedirectRef.current = null;
            return;
        }

        const onboardingRoutes = new Set([
            "/auth/team-setup-coach",
            "/auth/team-setup-player",
            "/pending-approval",
        ]);

        const publicRoutes = new Set([
            "/",
            "/auth/sign-in",
            "/auth/sign-up",
            "/not-found",
            "/forbidden",
        ]);

        const currentPath = location.pathname;

        let targetRoute: string | null = null;

        switch (user.onboardingStatus) {
            case "PROFILE_CREATED": {
                targetRoute =
                    user.role === "COACH"
                        ? "/auth/team-setup-coach"
                        : "/auth/team-setup-player";
                break;
            }

            case "TEAM_PENDING": {
                targetRoute = "/pending-approval";
                break;
            }

            case "COACH_PENDING_APPROVAL": {
                targetRoute = "/coach-pending-approval";
                break;
            }

            case "ACTIVE": {
                if (publicRoutes.has(currentPath) || onboardingRoutes.has(currentPath)) {
                    targetRoute = "/dashboard";
                }
                break;
            }

            case "REGISTERED": {
                if (publicRoutes.has(currentPath)) {
                    targetRoute = "/auth/sign-up";
                }
                break;
            }

            default: {
                if (publicRoutes.has(currentPath)) targetRoute = "/dashboard";
                break;
            }
        }

        if (!targetRoute) {
            lastRedirectRef.current = null;
            return;
        }

        if (targetRoute === currentPath) {
            lastRedirectRef.current = null;
            return;
        }

        if (lastRedirectRef.current === `${currentPath}->${targetRoute}`) return;

        lastRedirectRef.current = `${currentPath}->${targetRoute}`;
        navigate(targetRoute, { replace: true });
    }, [authLoading, isAuthenticated, user, location.pathname, navigate]);

    if (authLoading) return <Loading />;

    if (isAuthenticated && user?.onboardingStatus === "ACTIVE") {
        if (profileLoading) return <Loading />;
        if (!profileState) return <Loading />;
    }

    return <>{children}</>;
};