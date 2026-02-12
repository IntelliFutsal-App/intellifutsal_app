import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export const useProtectedRoute = (requiredRole?: string[]) => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/auth/sign-in");
            return;
        } if (requiredRole && user?.role && !requiredRole.includes(user.role)) {
            navigate("/forbidden");
        }
    }, [isAuthenticated, user, requiredRole, navigate]);
};