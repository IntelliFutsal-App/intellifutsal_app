import type { ReactNode } from "react";
import { MinimalNavbar } from "@shared/ui";
import { Footer } from "@shared/ui";

interface MinimalLayoutProps {
    children: ReactNode;
}

export const MinimalLayout = ({ children }: MinimalLayoutProps) => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <MinimalNavbar />
            <main className="flex-1 flex flex-col pt-16">
                {children}
            </main>
            <Footer />
        </div>
    );
};
