"use client";

import OrderForm from "@/components/order-form";
import OrderHistory from "@/components/order-history";
import { FirebaseUser, hasRecentLoginWindow, onAuthStateChanged, signOutUser } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPageClient() {
    const router = useRouter();
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged((nextUser) => {
            if (!nextUser) {
                router.push("/login");
                setUser(null);
                setLoading(false);
                return;
            }

            if (!hasRecentLoginWindow()) {
                void signOutUser();
                router.push("/login");
                setUser(null);
                setLoading(false);
                return;
            }

            setUser(nextUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        if (!user) {
            return;
        }

        const interval = window.setInterval(() => {
            if (!hasRecentLoginWindow()) {
                void signOutUser();
                router.push("/login");
                setUser(null);
            }
        }, 30000);

        return () => window.clearInterval(interval);
    }, [router, user]);

    if (loading) {
        return <div className="flex items-center justify-center h-[80vh] text-primary">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-text">Dashboard</h1>
                <p className="text-text-muted">Manage your simulated trades and review mock performance data inside the TradePilot demo dashboard.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4">
                    <OrderForm isAuthenticated />
                </div>
                <div className="lg:col-span-8">
                    <OrderHistory isAuthenticated />
                </div>
            </div>
        </div>
    );
}
