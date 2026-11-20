import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import AdminDashboardView from './AdminDashboardView';

export default function AdminModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'garden2026';

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === expectedPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Mot de passe incorrect.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/15 bg-background/95 p-5 sm:p-8 shadow-2xl">
        {/* Bouton Fermer */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <X className="size-4" />
        </button>

        {!isAuthenticated ? (
          /* Écran de connexion */
          <div className="max-w-sm mx-auto text-center py-6 space-y-5">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/20 text-primary border border-primary/30">
              <Lock className="size-8" />
            </div>

            <div>
              <h3 className="font-display text-2xl font-bold text-white">
                Espace Restaurateur
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Accès réservé à l'équipe de The Garden Rooftop.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 size-4 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Mot de passe gérant"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full rounded-2xl border border-white/15 bg-black/50 pl-10 pr-10 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-1.5 rounded-xl bg-red-500/10 border border-red-500/20 p-2.5 text-xs text-red-300">
                  <AlertCircle className="size-3.5 shrink-0" /> {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-leaf to-primary py-3 text-sm font-bold text-slate-950 shadow-lg shadow-primary/20 transition-transform active:scale-95"
              >
                Déverrouiller le Tableau de Bord
              </button>

              <p className="text-[10px] text-white/40">
                Mot de passe par défaut : <code className="text-leaf">garden2026</code>
              </p>
            </form>
          </div>
        ) : (
          /* Tableau de bord complet */
          <AdminDashboardView onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}
