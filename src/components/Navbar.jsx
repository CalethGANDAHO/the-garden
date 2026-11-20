import React, { useState, useEffect } from 'react';
import { useVibe } from '../context/VibeContext';
import { Sun, Moon, Calendar, Lock } from 'lucide-react';

export default function Navbar({ onOpenAdmin }) {
  const { vibe, toggleVibe } = useVibe();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#menu', label: 'Menu' },
    { href: '#reserve', label: 'Réserver' },
    { href: '#events', label: 'Événements' },
    { href: '#atmosphere', label: 'Ambiance' },
    { href: '#location', label: 'Accès' },
  ];

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <nav className={`mx-auto flex max-w-6xl items-center justify-between px-5 py-3 transition-all duration-500 sm:px-8 ${
        scrolled
          ? 'rounded-2xl bg-black/75 backdrop-blur-xl ring-1 ring-white/10 shadow-lg'
          : 'bg-transparent'
      }`}>
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/20 text-primary ring-1 ring-primary/40 transition-transform duration-300 group-hover:scale-105">
            <span className="font-display font-bold text-sm text-leaf">G</span>
          </span>
          <div className="flex flex-col">
            <span className="font-display text-sm font-bold tracking-tight text-white group-hover:text-primary transition-colors">
              The Garden
            </span>
            <span className="text-[9px] tracking-[0.28em] text-white/60 uppercase">
              Rooftop · Bar · Bistro
            </span>
          </div>
        </a>

        {/* Liens Desktop */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/80 hover:text-primary transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions à droite */}
        <div className="flex items-center gap-2.5">
          {/* Bouton Réserver Rapide Desktop */}
          <a
            href="#reserve"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-leaf to-primary px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-primary/20 transition-transform hover:scale-105 active:scale-95"
          >
            <Calendar className="size-3.5" />
            Réserver
          </a>

          {/* Switch Jour / Nuit */}
          <button
            onClick={toggleVibe}
            aria-label="Basculer entre le mode jour et nuit"
            className="flex items-center gap-1 rounded-full border border-white/20 bg-black/40 p-1 backdrop-blur-sm transition-colors hover:border-white/40"
            title="Changer l'ambiance Jour / Nuit"
          >
            <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-300 ${
              vibe === 'day' ? 'bg-white/20 text-white font-semibold' : 'text-white/45'
            }`}>
              <Sun className="size-3.5 text-yellow-400" />
              <span className="hidden sm:inline">Jour</span>
            </span>
            <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-300 ${
              vibe === 'night' ? 'bg-primary text-slate-950 font-semibold shadow-sm' : 'text-white/45'
            }`}>
              <Moon className="size-3.5" />
              <span className="hidden sm:inline">Nuit</span>
            </span>
          </button>

          {/* Accès Restaurateur discret */}
          <button
            onClick={onOpenAdmin}
            aria-label="Espace Restaurateur"
            className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/5 text-white/40 transition-colors hover:text-primary hover:border-primary/40"
            title="Espace gestionnaire"
          >
            <Lock className="size-3.5" />
          </button>
        </div>
      </nav>
    </header>
  );
}
