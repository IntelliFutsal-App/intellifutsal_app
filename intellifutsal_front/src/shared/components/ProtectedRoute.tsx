import type { Role } from "@features/auth";
import { useAuth } from "../hooks";
import { Loading } from "./atoms";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
    requiresOnboarding?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, requiresOnboarding = true }) => {
    const { isAuthenticated, isLoading, user, hasRole } = useAuth();

    if (isLoading) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/sign-in" replace />;
    } if (allowedRoles && !hasRole(allowedRoles)) {
        return <Navigate to="/dashboard" replace />;
    }

    if (requiresOnboarding && user?.onboardingStatus !== "ACTIVE") {
        return null;
    }

    return <>{children}</>;
};
