"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FirebaseUser, hasRecentLoginWindow, onAuthStateChanged, signInWithPopup, signOutUser } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { LayoutDashboard, LogIn, LogOut } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const [user, setUser] = useState<FirebaseUser | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged((u) => {
            if (u && hasRecentLoginWindow()) {
                setUser(u);
                return;
            }

            setUser(null);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) {
            return;
        }

        const interval = window.setInterval(() => {
            if (!hasRecentLoginWindow()) {
                setUser(null);
                void signOutUser();
            }
        }, 30000);

        return () => window.clearInterval(interval);
    }, [user]);

    const handleLogin = async () => {
        try {
            await signInWithPopup();
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const handleLogout = () => signOutUser();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ];

    return (
        <nav className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-bold text-primary tracking-tighter flex items-center gap-2">
                        <Image
                            src="/apple-touch-icon.png"
                            alt="TradePilot logo"
                            width={32}
                            height={32}
                            className="rounded-lg"
                        />
                        TradePilot
                    </Link>

                    <div className="hidden md:flex items-center gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${pathname === item.path ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-text'
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-text-muted hidden sm:inline">{user.email}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-text-muted hover:text-red-400 transition-colors"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="btn-primary flex items-center gap-2"
                            aria-label="Login to TradePilot"
                        >
                            <LogIn size={18} />
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
