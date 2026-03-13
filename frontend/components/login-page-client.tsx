"use client";

import Image from "next/image";
import { hasRecentLoginWindow, onAuthStateChanged, signInWithPopup, signOutUser } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function getLoginErrorMessage(error: unknown) {
    const code = typeof error === "object" && error !== null && "code" in error
        ? String((error as { code?: string }).code)
        : "";

    if (code === "auth/configuration-not-found") {
        return "Firebase Authentication is not fully configured for this app yet. Enable Google sign-in and confirm your current domain is authorized in Firebase.";
    }

    if (code === "auth/popup-closed-by-user") {
        return "The Google sign-in popup was closed before login finished.";
    }

    return "Login failed. Please try again.";
}

export default function LoginPageClient() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged((user) => {
            if (!user) {
                setCheckingSession(false);
                return;
            }

            if (hasRecentLoginWindow()) {
                router.push("/dashboard");
                return;
            }

            setErrorMessage("Your previous session expired. Please sign in again to continue.");
            void signOutUser();
            setCheckingSession(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleGoogleLogin = async () => {
        try {
            setErrorMessage(null);
            await signInWithPopup();
            router.push("/dashboard");
        } catch (error) {
            console.error("Login failed", error);
            setErrorMessage(getLoginErrorMessage(error));
        }
    };

    if (checkingSession) {
        return <div className="flex items-center justify-center min-h-[70vh] text-primary">Checking session...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="glass-panel p-10 w-full max-w-md text-center">
                <Image
                    src="/android-chrome-192x192.png"
                    alt="TradePilot logo"
                    width={64}
                    height={64}
                    className="mx-auto mb-6 rounded-2xl"
                />
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">TradePilot</p>
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-text-muted mb-8">Sign in to access your TradePilot dashboard.</p>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-all active:scale-95"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pjax/google.png" alt="Google" className="w-5 h-5" />
                    Continue with Google
                </button>

                {errorMessage ? (
                    <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {errorMessage}
                    </div>
                ) : null}

                <p className="text-xs text-text-muted mt-8">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                    TradePilot uses mock trading data for this demo environment.
                </p>
            </div>
        </div>
    );
}
