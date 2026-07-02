import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, CheckCircle, Clock, Award, Flame, ArrowRight, TrendingUp,
  LogOut, Shield, User
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard.jsx";
import Header from "../components/ui/Header.jsx";
import { COURSES, USER_PROFILE } from "../data/mockData.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardPage() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const mockUser = USER_PROFILE;

  // Use auth user's name if available, fallback to mock
  const displayName = authUser?.name || mockUser.name;
  const displayEmail = authUser?.email || mockUser.email;
  const displayPicture = authUser?.picture || null;
  const provider = authUser?.provider || null;

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="section-padded py-10">
      {/* ── User Profile Card ── */}
      {authUser && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard className="p-6" hover={false}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="relative">
                {displayPicture ? (
                  <img
                    src={displayPicture}
                    alt={displayName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                    <User size={24} className="text-white" />
                  </div>
                )}
                {/* Provider badge */}
                {provider && (
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-md ${
                    provider === "google" ? "bg-blue-500" : "bg-[#1877F2]"
                  }`}>
                    {provider === "google" ? "G" : "f"}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-xl font-bold text-txt-primary truncate">{displayName}</h2>
                <p className="text-sm text-txt-muted truncate">{displayEmail}</p>
                {provider && (
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-600 border border-brand-100">
                    Signed in with {provider.charAt(0).toUpperCase() + provider.slice(1)}
                  </span>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-200 text-txt-muted text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Security notice */}
      {authUser && (
        <div className="flex items-start gap-2.5 p-3 mb-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
          <Shield size={16} className="mt-0.5 flex-shrink-0" />
          <p className="text-xs">
            <strong>Frontend-only authentication.</strong> Your session is stored locally in this browser. This is suitable for demos and prototypes.
          </p>
        </div>
      )}

      <Header
        title={`Welcome back, ${displayName.split(" ")[0]}!`}
        subtitle="Track your learning progress and continue where you left off"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: BookOpen, label: "Courses Enrolled", value: mockUser.coursesEnrolled, color: "from-brand-400 to-brand-600" },
          { icon: CheckCircle, label: "Lessons Completed", value: mockUser.lessonsCompleted, color: "from-emerald-400 to-emerald-600" },
          { icon: Award, label: "Certificates", value: mockUser.certificatesEarned, color: "from-amber-400 to-amber-600" },
          { icon: Flame, label: "Day Streak", value: `${mockUser.streak} 🔥`, color: "from-orange-400 to-red-500" },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="p-5" hover={false}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                <Icon size={18} className="text-white" />
              </div>
              <div className="font-display text-2xl font-bold text-txt-primary">{value}</div>
              <p className="text-xs text-txt-muted mt-1">{label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Active Courses */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-txt-primary flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-500" />
            Continue Learning
          </h2>
          <Link to="/courses" className="text-sm text-brand-500 font-medium hover:text-brand-600 flex items-center gap-1">
            All Courses <ArrowRight size={14} />
          </Link>
        </div>

        <div className="space-y-4">
          {mockUser.activeCourses.map((active) => {
            const course = COURSES.find((c) => c.id === active.courseId);
            if (!course) return null;
            return (
              <Link key={active.courseId} to={`/courses/${active.courseId}`}>
                <GlassCard className="p-5 flex items-center gap-5" hover={true}>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-100 to-accent-indigo/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🤟</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-sm text-txt-primary truncate">{course.title}</h3>
                    <p className="text-xs text-txt-muted mt-0.5">{course.instructor} · {active.lastAccessed}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 h-2 bg-surface-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-purple"
                          style={{ width: `${active.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-txt-muted">{active.progress}%</span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
