import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import MockModeBanner from "@/components/mock-mode-banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TradePilot",
    description: "TradePilot is a mock-first trading bot demo built with FastAPI, Next.js, Firebase, and Supabase.",
    manifest: "/site.webmanifest",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <meta name="theme-color" content="#0b0e11" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
                <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
            </head>
            <body className={inter.className}>
                <Providers>
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <MockModeBanner />
                        <main className="flex-1 container mx-auto px-4 py-8">
                            {children}
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
