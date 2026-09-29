import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { Dashboard } from "./components/Dashboard";

const MainContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeView, setActiveView] = useState<"login" | "register">("login");

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        </div>
        <p className="mt-4 text-sm font-medium text-slate-400 animate-pulse">
          Vérification de la session en cours...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        currentView={isAuthenticated ? "dashboard" : activeView}
        onSwitchView={(view) => setActiveView(view)}
      />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        {isAuthenticated ? (
          <Dashboard />
        ) : activeView === "login" ? (
          <LoginForm onSwitchToRegister={() => setActiveView("register")} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setActiveView("login")} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        <p>Système d'Authentification Fullstack • React 19 + TailwindCSS • Express + TypeORM + MySQL (base_teste)</p>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#090d16] bg-mesh flex flex-col text-slate-100 selection:bg-indigo-500 selection:text-white">
        <MainContent />
      </div>
    </AuthProvider>
  );
}

export default App;
