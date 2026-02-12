import { AuthProvider } from "@app/contexts/AuthContext";
import { ProfileProvider } from "@app/contexts/ProfileContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

interface Props {
    children: ReactNode;
}

export const AppProviders = ({ children }: Props) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ProfileProvider>
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                    {children}
                </ProfileProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};