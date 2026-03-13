"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, ShieldCheck, TimerReset, Zap } from "lucide-react";
import { FirebaseUser, hasRecentLoginWindow, onAuthStateChanged, signOutUser } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
    const router = useRouter();
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged((nextUser) => {
            if (!nextUser) {
                setUser(null);
                setCheckingSession(false);
                return;
            }

            if (hasRecentLoginWindow()) {
                setUser(nextUser);
                setCheckingSession(false);
                router.replace("/dashboard");
                return;
            }

            void signOutUser();
            setUser(null);
            setCheckingSession(false);
        });

        return () => unsubscribe();
    }, [router]);

    return (
        <div className="flex flex-col items-center text-center py-20">
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-200 text-sm font-medium">
                <Zap size={14} />
                Mock Trading Demo
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-text to-text-muted bg-clip-text text-transparent">
                Automate Your <br /> <span className="text-primary">Futures Trading</span>
            </h1>

            <p className="text-xl text-text-muted max-w-2xl mb-10 leading-relaxed">
                TradePilot is a polished trading bot demo with simulated Binance Futures orders,
                Firebase login, and a dashboard designed for assignment review and deployment demos.
            </p>

            <div className="flex gap-4">
                <Link href="/dashboard" className="btn-primary px-8 py-4 text-lg flex items-center gap-2">
                    Get Started <ArrowRight size={20} />
                </Link>
                {checkingSession ? (
                    <div className="glass-panel px-8 py-4 text-lg text-text-muted">Checking session...</div>
                ) : user ? (
                    <Link href="/dashboard" className="glass-panel px-8 py-4 text-lg hover:bg-surface transition-colors">
                        Open Dashboard
                    </Link>
                ) : (
                    <Link href="/login" className="glass-panel px-8 py-4 text-lg hover:bg-surface transition-colors">
                        Login
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
                <FeatureCard
                    icon={<Zap className="text-primary" />}
                    title="Mock Execution"
                    description="Submit MARKET and LIMIT orders through the same product flow using safe, simulated trade data."
                />
                <FeatureCard
                    icon={<ShieldCheck className="text-primary" />}
                    title="Secure Auth"
                    description="Protected by Firebase Authentication with Google login and server-side JWT verification."
                />
                <FeatureCard
                    icon={<TimerReset className="text-primary" />}
                    title="Frictionless Entry"
                    description="Move from landing page to dashboard in a smooth, guided flow designed for quick demos and reviewer walkthroughs."
                />
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="glass-panel p-8 text-left hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-text-muted leading-relaxed">{description}</p>
        </div>
    );
}
