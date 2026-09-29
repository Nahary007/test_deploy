import React from "react";
import { useAuth } from "../context/AuthContext";
import { Shield, LogIn, UserPlus } from "lucide-react";

interface NavbarProps {
  currentView: "login" | "register" | "dashboard";
  onSwitchView: (view: "login" | "register") => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onSwitchView }) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090d16]/70 border-b border-white/5 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">AuthSystem</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                MySQL + TypeORM
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">React TypeScript & Express</p>
          </div>
        </div>

        {/* Right nav */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-200">{user?.name}</span>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Actif
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => onSwitchView("login")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === "login"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Connexion
              </button>
              <button
                onClick={() => onSwitchView("register")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === "register"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Inscription
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
