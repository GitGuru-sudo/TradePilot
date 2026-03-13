"use client";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const RECENT_LOGIN_KEY = "tradebot_last_login_at";
export const SESSION_WINDOW_MINUTES = 10;
const SESSION_WINDOW_MS = SESSION_WINDOW_MINUTES * 60 * 1000;

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();
const auth = app.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Initialize Analytics conditionally (only in browser)
export const initAnalytics = async () => {
    if (typeof window !== "undefined") {
        await import("firebase/compat/analytics");
        return typeof (app as typeof app & { analytics?: () => unknown }).analytics === "function"
            ? (app as typeof app & { analytics: () => unknown }).analytics()
            : null;
    }
    return null;
};

function canUseStorage() {
    return typeof window !== "undefined";
}

export function recordRecentLogin(timestamp = Date.now()) {
    if (!canUseStorage()) {
        return;
    }

    window.localStorage.setItem(RECENT_LOGIN_KEY, String(timestamp));
}

export function clearRecentLogin() {
    if (!canUseStorage()) {
        return;
    }

    window.localStorage.removeItem(RECENT_LOGIN_KEY);
}

export function getRecentLoginTimestamp() {
    if (!canUseStorage()) {
        return null;
    }

    const value = window.localStorage.getItem(RECENT_LOGIN_KEY);
    if (!value) {
        return null;
    }

    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : null;
}

export function hasRecentLoginWindow() {
    const loginAt = getRecentLoginTimestamp();
    if (!loginAt) {
        return false;
    }

    return Date.now() - loginAt <= SESSION_WINDOW_MS;
}

export function getSessionMinutesRemaining() {
    const loginAt = getRecentLoginTimestamp();
    if (!loginAt) {
        return 0;
    }

    const remainingMs = SESSION_WINDOW_MS - (Date.now() - loginAt);
    return Math.max(0, Math.ceil(remainingMs / 60000));
}

export async function signInWithPopup() {
    const result = await auth.signInWithPopup(googleProvider);
    recordRecentLogin();
    return result;
}

export const onAuthStateChanged = (callback: (user: firebase.User | null) => void) => auth.onAuthStateChanged(callback);

export async function signOutUser() {
    clearRecentLogin();
    return auth.signOut();
}

export type FirebaseUser = firebase.User;
export { auth, googleProvider };
