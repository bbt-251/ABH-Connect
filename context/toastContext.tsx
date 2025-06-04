"use client";

import React, { createContext, useContext, useState, useRef } from "react";
import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

interface ToastContextType {
    showToast: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastTitle, setToastTitle] = useState("Notification");
    const timerRef = useRef<number>(0);

    const showToast = (message: string, title: string = "Notification") => {
        setToastMessage(message);
        setToastTitle(title);
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
                    <Toast open={toastOpen} onOpenChange={setToastOpen} className="ToastRoot">
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