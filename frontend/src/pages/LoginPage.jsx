import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

/* password strength helper */
function getStrength(pw) {
  if (!pw) return { label: "", pct: 0, cls: "" };
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { label: "Weak", pct: 20, cls: "bg-red-500" };
  if (s <= 2) return { label: "Fair", pct: 40, cls: "bg-orange-500" };
  if (s <= 3) return { label: "Good", pct: 65, cls: "bg-yellow-500" };
  if (s <= 4) return { label: "Strong", pct: 85, cls: "bg-brand-500" };
  return { label: "Very strong", pct: 100, cls: "bg-emerald-500" };
}

/* Google SVG icon */
function GoogleIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.09A6.97 6.97 0 0 1 5.48 12c0-.72.13-1.43.36-2.09V7.07H2.18A11.96 11.96 0 0 0 .96 12c0 1.94.46 3.77 1.22 5.33l2.66-2.07v-1.17Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.99 14.97.96 12 .96 7.7.96 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
    </svg>
  );
}

export default function LoginPage() {
  const { user, loading: authLoading, error: authError, loginWithGoogle, loginWithEmail, setError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const strength = getStrength(password);

  /* redirect if already logged in */
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  /* clear auth errors on mount */
  useEffect(() => { setError(null); }, [setError]);

  function validate() {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleEmailLogin(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setEmailLoading(true);
    try {
      await loginWithEmail(email, password);
    } finally {
      setEmailLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } finally {
      setGoogleLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-base">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-sm text-txt-secondary">Checking session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface-base relative">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-txt-secondary hover:text-brand-600 transition-colors">
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Home</span>
      </Link>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 group mb-6">
            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🤟</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-brand-900 mb-2">Welcome back</h1>
          <p className="text-txt-secondary">Sign in to continue your ISL learning journey</p>
        </div>

        {/* Card */}
        <div className="card p-8 shadow-xl border-brand-100">
          {/* Error banner */}
          {authError && (
            <div className="flex items-start gap-2.5 p-3 mb-5 rounded-xl bg-red-50 border border-red-200 text-red-600">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{authError}</p>
            </div>
          )}

          {/* ── Google Sign-In (primary) ── */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-200 bg-white text-txt-primary text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-6 shadow-sm"
          >
            {googleLoading ? <Loader2 size={20} className="animate-spin text-brand-600" /> : <GoogleIcon />}
            {googleLoading ? "Signing in…" : "Sign in with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-txt-muted uppercase tracking-wider font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-brand-900 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-muted" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(ev) => { setEmail(ev.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`input-field !pl-10 ${errors.email ? "!border-red-500 focus:!border-red-500 focus:!ring-red-100" : ""}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-brand-900 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-muted" />
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(ev) => { setPassword(ev.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`input-field !pl-10 !pr-10 ${errors.password ? "!border-red-500 focus:!border-red-500 focus:!ring-red-100" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-txt-muted hover:text-brand-600 transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.password}</p>}
            </div>

            {/* Password strength bar */}
            {password && (
              <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-surface-base overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${strength.cls}`} style={{ width: `${strength.pct}%` }} />
                </div>
                <p className="text-xs text-txt-muted font-medium">
                  Strength: <span className="text-brand-600">{strength.label}</span>
                </p>
              </div>
            )}

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label htmlFor="login-remember" className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="login-remember"
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <span className="text-sm text-txt-secondary font-medium">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button type="submit" disabled={emailLoading} className="btn-primary w-full shadow-lg">
              {emailLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-txt-secondary mt-8 font-medium">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">
            Create one
          </Link>
        </p>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1.5 mt-8 text-xs text-txt-muted font-medium">
          <Sparkles size={12} className="text-brand-400" />
          <span>AI-Powered ISL Learning Platform</span>
        </div>
      </motion.div>
    </div>
  );
}
