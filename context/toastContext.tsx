"use client";

import React, { createContext, useContext, useState, useRef } from "react";
import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

interface ToastContextType {
    showToast: (
        message: string,
        title?: string,
        variant?: "success" | "error" | "warning" | "default",
        timeout?: number // Optional timeout parameter
    ) => void;
    hideToast: () => void; // Function to manually hide the toast
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastTitle, setToastTitle] = useState("Notification");
    const [variant, setVariant] = useState<"success" | "error" | "warning" | "default">("default");
    const timerRef = useRef<number>(0);
    const intervalRef = useRef<number>(0);

    const [duration, setDuration] = useState(3000);

    const showToast = (
        message: string,
        title: string = "Notification",
        variant: string = "default",
        timeout: number = duration // Default timeout of 3000ms
    ) => {
        setDuration(timeout);

        setToastMessage(message);
        setToastTitle(title);
        setVariant(variant as "success" | "error" | "warning" | "default");
        setToastOpen(true); // Ensure the toast is shown immediately
        clearTimeout(timerRef.current); // Clear any previous timeout
        clearInterval(intervalRef.current); // Clear any previous interval

        timerRef.current = window.setTimeout(() => {
            setToastOpen(false); // Hide the toast after the specified timeout
            clearInterval(intervalRef.current); // Clear the countdown interval
        }, timeout);
    };

    const hideToast = () => {
        setToastOpen(false);
        clearTimeout(timerRef.current); // Clear any active timers
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <ToastProvider swipeDirection="right">
                <ToastViewport className="ToastViewport">
                    <Toast open={toastOpen} onOpenChange={setToastOpen} className="ToastRoot" variant={variant} duration={duration}>
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