import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Calendar,
  Key,
  ShieldCheck,
  LogOut,
  Database,
  Server,
  CheckCircle,
  RefreshCw,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [apiHealth, setApiHealth] = useState<string | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const checkHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await fetch("http://localhost:5000/api/health");
      const data = await res.json();
      setApiHealth(data.status === "ok" ? "Opérationnelle (200 OK)" : "Inconnu");
    } catch {
      setApiHealth("Indisponible");
    } finally {
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Non disponible";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/80 border border-indigo-500/20 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/30 ring-2 ring-white/20">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Connecté
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                  JWT Authentifié
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">
                Bienvenue, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-200">{user?.name}</span> !
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Vous êtes authentifié sur la session MySQL <span className="text-indigo-300 font-mono font-medium">base_teste</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            id="dashboard-logout-btn"
            disabled={isLoggingOut}
            className="px-5 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 font-medium text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-rose-500/10 active:scale-95 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <div className="w-4 h-4 border-2 border-rose-300/30 border-t-rose-300 rounded-full animate-spin" />
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid Stats & Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300 md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              Profil Utilisateur
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              TypeORM Entity
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 gap-1">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400" /> ID Utilisateur (UUID)
              </span>
              <span className="font-mono text-xs text-indigo-300 bg-indigo-950/40 px-2 py-1 rounded border border-indigo-800/40 select-all">
                {user?.id}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 gap-1">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" /> Adresse Email
              </span>
              <span className="text-sm font-medium text-slate-200">{user?.email}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 gap-1">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" /> Date d'inscription
              </span>
              <span className="text-sm text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Stack Status Card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between group hover:border-violet-500/40 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-violet-400" />
                État du Système
              </h3>
              <button
                onClick={checkHealth}
                disabled={isCheckingHealth}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Actualiser l'état"
              >
                <RefreshCw className={`w-4 h-4 ${isCheckingHealth ? "animate-spin text-indigo-400" : ""}`} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" /> MySQL DB
                </span>
                <span className="text-emerald-400 font-medium flex items-center gap-1 text-xs">
                  <CheckCircle className="w-3.5 h-3.5" /> base_teste
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-400" /> API Express
                </span>
                <span className="text-indigo-300 font-medium text-xs">
                  {apiHealth || "En vérification..."}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" /> Sécurité JWT
                </span>
                <span className="text-amber-400 font-medium text-xs">HS256 / Bcrypt 10</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" /> Frontend
                </span>
                <span className="text-violet-300 font-medium text-xs">React 19 + Tailwind</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500">Authentification persistée via LocalStorage & Middleware Express</p>
          </div>
        </div>
      </div>
    </div>
  );
};
