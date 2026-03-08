import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthLayout } from "@shared/layouts";
import { Loading, OnboardingGuard, ProtectedRoute } from "@shared/ui";


const NotFoundPage = lazy(() => import("@shared/ui/pages/NotFoundPage"));
const ForbiddenPage = lazy(() => import("@shared/ui/pages/ForbiddenPage"));
const SignInPage = lazy(() => import("@features/auth/pages/SignInPage"));
const SignUpPage = lazy(() => import("@features/auth/pages/SignUpPage"));
const LandingPage = lazy(() => import("@features/landing/pages/LandingPage"));
const CoachTeamSetupPage = lazy(() => import("@features/team/pages/CoachTeamSetupPage"));
const PlayerTeamSetupPage = lazy(() => import("@features/team/pages/PlayerTeamSetupPage"));
const PendingApprovalPage = lazy(() => import("@features/team/pages/PendingApprovalPage"));
const CoachPendingApprovalPage = lazy(() => import("@features/team/pages/CoachPendingApprovalPage"));
const DashboardPage = lazy(() => import("@features/dashboard/pages/DashboardPage"));

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                <OnboardingGuard>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/not-found" element={<NotFoundPage />} />
                        <Route path="/forbidden" element={<ForbiddenPage />} />

                        <Route path="/auth" element={<AuthLayout />}>
                            <Route index element={<Navigate to="/auth/sign-in" replace />} />
                            <Route path="sign-in" element={<SignInPage />} />
                            <Route path="sign-up" element={<SignUpPage />} />
                            <Route path="team-setup-coach" element={<CoachTeamSetupPage />} />
                            <Route path="team-setup-player" element={<PlayerTeamSetupPage />} />
                        </Route>

                        <Route path="/dashboard" element={
                            <ProtectedRoute allowedRoles={["ADMIN", "COACH", "PLAYER"]}>
                                <DashboardPage/>
                            </ProtectedRoute> 
                        } />  

                        <Route path="/pending-approval" element={
                            <ProtectedRoute allowedRoles={["PLAYER"]} requiresOnboarding={false}>
                                <PendingApprovalPage />
                            </ProtectedRoute>
                        } />

                        <Route path="/coach-pending-approval" element={
                            <ProtectedRoute allowedRoles={["COACH"]} requiresOnboarding={false}>
                                <CoachPendingApprovalPage />
                            </ProtectedRoute>
                        } />

                        <Route path="*" element={<Navigate to="/not-found" replace />} />
                    </Routes>
                </OnboardingGuard>
            </Suspense>
        </BrowserRouter>
    );
};