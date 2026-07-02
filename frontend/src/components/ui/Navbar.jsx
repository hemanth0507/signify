import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, BookOpen, MessageSquare, Zap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();

  const navLinks = [
    { name: "LEARN", path: "/courses", icon: BookOpen },
    { name: "PRACTICE", path: "/tools", icon: Zap },
    { name: "COMMUNITY", path: "/community", icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-surface-muted h-20">
      <div className="container mx-auto px-6 h-full flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-3xl font-display font-bold text-brand-500 tracking-tight group-hover:scale-105 transition-transform">
            signify
          </span>
        </Link>

        {/* Desktop Navigation - Centered & Tabs */}
        <div className="hidden lg:flex items-center gap-8 h-full">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 h-full border-b-4 px-4 font-bold text-sm tracking-wide transition-all ${
                  isActive
                    ? "border-brand-500 text-brand-500"
                    : "border-transparent text-txt-muted hover:text-brand-300 hover:border-brand-200"
                }`}
              >
                <link.icon size={18} className={isActive ? "fill-current" : ""} />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* User Actions - Friendly Profile */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-muted rounded-2xl">
            <span className="font-bold text-accent-yellow">🔥 3</span>
            <span className="text-xs font-bold text-txt-muted uppercase">Day Streak</span>
          </div>

          {currentUser ? (
             <Link to="/profile" className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold border-2 border-brand-200 hover:border-brand-500 transition-all">
               {currentUser.displayName ? currentUser.displayName[0] : <User size={20} />}
             </Link>
          ) : (
            <>
              <Link to="/login" className="font-bold text-brand-500 hover:text-brand-600 px-4">
                LOG IN
              </Link>
              <Link to="/signup" className="btn-primary !py-2 !px-6 !text-sm !shadow-none !border-b-4">
                GET STARTED
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-txt-primary p-2 rounded-xl hover:bg-surface-muted"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b-2 border-surface-muted p-6 flex flex-col gap-4 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-surface-muted font-bold text-txt-secondary"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-500">
                <link.icon size={20} />
              </div>
              {link.name}
            </Link>
          ))}
          <div className="border-t-2 border-surface-muted pt-4 flex flex-col gap-3">
             <Link to="/login" className="btn-secondary w-full text-center" onClick={() => setIsOpen(false)}>LOG IN</Link>
             <Link to="/signup" className="btn-primary w-full text-center" onClick={() => setIsOpen(false)}>GET STARTED</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
