import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase.js";

const AuthContext = createContext(null);

const STORAGE_KEY = "signify_auth";

/* ─── localStorage helpers ─── */
function saveSession(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, ts: Date.now() }));
  } catch { /* silently ignore quota errors */ }
}

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Expire local cache after 24h
    if (Date.now() - data.ts > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

/* ─── helper to extract user data ─── */
function extractUser(firebaseUser, provider = "google") {
  return {
    name: firebaseUser.displayName || "User",
    email: firebaseUser.email || "",
    picture: firebaseUser.photoURL || "",
    provider,
    uid: firebaseUser.uid,
  };
}

/* ═══════════════════════════════
   AUTH PROVIDER
   ═══════════════════════════════ */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ── Listen to Firebase auth state ── */
  useEffect(() => {
    // First, try to restore from localStorage for instant UI
    const cached = loadSession();
    if (cached && cached.name) {
      setUser(cached);
    }

    // Then listen for Firebase auth changes (source of truth)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = extractUser(firebaseUser);
        setUser(userData);
        saveSession(userData);
      } else {
        // Only clear if no cached session (avoid flicker)
        const cached = loadSession();
        if (!cached) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ── Google Sign-In ── */
  const loginWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userData = extractUser(result.user, "google");
      setUser(userData);
      saveSession(userData);
      return true;
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked by your browser. Please allow popups for this site.");
      } else if (err.code === "auth/api-key-not-valid.-please-pass-a-valid-api-key.") {
        setError("Firebase API key not configured. Please add your Firebase credentials to .env");
      } else {
        setError(err.message || "Google sign-in failed. Please try again.");
      }
      return false;
    }
  }, []);

  /* ── Email/Password (simulated — frontend-only demo) ── */
  const loginWithEmail = useCallback(async (email, password) => {
    setError(null);
    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 1200));
    // Create a simulated user session
    const userData = {
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      picture: "",
      provider: "email",
      uid: "demo-" + Date.now(),
    };
    setUser(userData);
    saveSession(userData);
    return true;
  }, []);

  /* ── Logout ── */
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch { /* ignore */ }
    setUser(null);
    clearSession();
    setError(null);
  }, []);

  const value = { user, loading, error, loginWithGoogle, loginWithEmail, logout, setError };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
