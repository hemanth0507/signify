import React from "react";
import { motion } from "framer-motion";
import { LogOut, Shield, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="section-padded py-12 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-2xl font-bold text-brand-900 mb-6">Profile</h1>

        <div className="card p-8 space-y-8 shadow-lg border-brand-100">
          {/* Avatar & Name */}
          <div className="flex items-center gap-6">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-surface-base shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-brand-100 flex items-center justify-center border-4 border-surface-base shadow-sm">
                <User size={40} className="text-brand-500" />
              </div>
            )}
            <div>
              <h2 className="font-display text-2xl font-bold text-brand-900">
                {user?.name || "User"}
              </h2>
              <p className="text-sm text-txt-secondary mt-1">{user?.email || "–"}</p>
              <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-medium">
                <Shield size={12} />
                Signed in via Google
              </div>
            </div>
          </div>

          {/* Info fields */}
          <div className="grid gap-6 pt-6 border-t border-brand-50">
            <div>
              <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider mb-2">Display Name</label>
              <div className="input-field cursor-default bg-surface-base text-txt-secondary border-transparent">
                {user?.name || "–"}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider mb-2">Email</label>
              <div className="input-field cursor-default bg-surface-base text-txt-secondary border-transparent">
                {user?.email || "–"}
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="pt-6 border-t border-brand-50 flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-all shadow-sm"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
