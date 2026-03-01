import { Navigate } from "react-router-dom";
import type { Role } from "@features/auth";
import { useAuth } from "../hooks";
import { Loading } from "./atoms";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
    requiresOnboarding?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    requiresOnboarding = true,
}) => {
    const { isAuthenticated, isLoading, user, hasRole } = useAuth();

    if (isLoading) return <Loading />;
    if (!isAuthenticated) return <Navigate to="/auth/sign-in" replace />;
    if (allowedRoles && !hasRole(allowedRoles)) return <Navigate to="/forbidden" replace />;

    if (requiresOnboarding && user?.onboardingStatus !== "ACTIVE") {
        switch (user?.onboardingStatus) {
            case "TEAM_PENDING":
                return <Navigate to="/pending-approval" replace />;
            case "COACH_PENDING_APPROVAL":
                return <Navigate to="/coach-pending-approval" replace />;
            case "PROFILE_CREATED":
                return (
                    <Navigate
                        to={user.role === "COACH" ? "/auth/team-setup-coach" : "/auth/team-setup-player"}
                        replace
                    />
                );
            case "REGISTERED":
                return <Navigate to="/auth/sign-up" replace />;
            default:
                return <Navigate to="/auth/sign-in" replace />;
        }
    }

    return <>{children}</>;
};