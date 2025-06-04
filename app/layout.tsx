import React from "react";
import type { Metadata } from "next";
import ClientLayout from "@/hooks/clientLayout";

export const metadata: Metadata = {
    title: "ABH-oneHR - Your Gateway to Opportunities",
    description: "ABH-oneHR is a modern job board platform connecting top talent with leading companies. Find your dream job or the perfect candidate today.",
    generator: "Next.js",
    applicationName: "ABH-oneHR",
    keywords: ["jobs", "careers", "recruitment", "job board", "hiring", "ABH-oneHR"],
    // authors: [{ name: "ABH Connect Team", url: "https://abhconnect.com" }],
    // creator: "ABH Connect",
    // publisher: "ABH Connect",
    // themeColor: "#0a3141",
    // colorScheme: "light",
    // openGraph: {
    //     title: "ABH-oneHR - Your Gateway to Opportunities",
    //     description: "Discover jobs, connect with employers, and grow your career with ABH-oneHR.",
    //     url: "https://abhconnect.com",
    //     siteName: "ABH-oneHR",
    //     images: [
    //         {
    //             url: "https://example.com/og-image.png", // Replace with your actual OpenGraph image URL
    //             width: 1200,
    //             height: 630,
    //             alt: "ABH-oneHR - Your Gateway to Opportunities",
    //         },
    //     ],
    //     locale: "en_US",
    //     type: "website",
    // },
    // twitter: {
    //     card: "summary_large_image",
    //     title: "ABH-oneHR - Your Gateway to Opportunities",
    //     description: "Find your dream job or the perfect candidate with ABH-oneHR.",
    //     images: ["https://example.com/twitter-image.png"], // Replace with your actual Twitter image URL
    //     creator: "@ABHConnect", // Replace with your Twitter handle
    // },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}