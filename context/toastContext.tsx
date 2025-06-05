"use client";

import React, { createContext, useContext, useState, useRef } from "react";
import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

interface ToastContextType {
    showToast: (message: string, title?: string, variant?: "success" | "error" | "warning" | "default") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastTitle, setToastTitle] = useState("Notification");
    const [variant, setVariant] = useState<"success" | "error" | "warning" | "default">("default")
    const timerRef = useRef<number>(0);

    const showToast = (message: string, title: string = "Notification", variant: string = "default") => {
        setToastMessage(message);
        setToastTitle(title);
        setVariant(variant as "success" | "error" | "warning" | "default");
        setToastOpen(false);
        clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            setToastOpen(true);
        }, 100);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastProvider swipeDirection="right">
                <ToastViewport className="ToastViewport">
                    <Toast open={toastOpen} onOpenChange={setToastOpen} className="ToastRoot" variant={variant}>
                        <ToastTitle className="ToastTitle">{toastTitle}</ToastTitle>
                        <ToastDescription className="ToastDescription">{toastMessage}</ToastDescription>
                    </Toast>
                </ToastViewport>
            </ToastProvider>
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProviderWrapper");
    }
    return context;
};