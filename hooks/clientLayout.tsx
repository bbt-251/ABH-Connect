"use client";

import React from "react";
import { Montserrat } from "next/font/google";
import { AuthProvider } from "@/context/authContext";
import { ToastProviderWrapper } from "@/context/toastContext";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ToastProviderWrapper>
                <div className={montserrat.className}>{children}</div>
            </ToastProviderWrapper>
        </AuthProvider>
    );
}