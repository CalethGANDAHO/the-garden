import React, { useState, useEffect } from 'react';
import { useVibe } from '../context/VibeContext';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, Calendar, Lock, Globe } from 'lucide-react';

export default function Navbar({ onOpenAdmin }) {
  const { vibe, toggleVibe } = useVibe();
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isNight = vibe === 'night';

  const navLinks = [
    { href: '#menu', label: t.nav.menu },
    { href: '#reserve', label: t.nav.reserve },
    { href: '#events', label: t.nav.events },
    { href: '#atmosphere', label: t.nav.atmosphere },
    { href: '#location', label: t.nav.location },
  ];

  const languages = [
    { code: 'fr', label: 'FR', name: 'Français' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'yo', label: 'YO', name: 'Yorùbá' }
  ];

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <nav className={`mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-8 py-3 transition-all duration-500 ${
        scrolled
          ? isNight
            ? 'rounded-2xl bg-black/80 backdrop-blur-xl ring-1 ring-white/10 shadow-xl'
            : 'rounded-2xl bg-white/90 backdrop-blur-xl ring-1 ring-slate-900/10 shadow-xl text-slate-900'
          : isNight
            ? 'bg-black/30 backdrop-blur-sm sm:bg-transparent'
            : 'bg-white/40 backdrop-blur-sm sm:bg-transparent text-slate-900'
      }`}>
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/20 text-primary ring-1 ring-primary/40 transition-transform duration-300 group-hover:scale-105">
            <span className="font-display font-bold text-sm text-leaf">G</span>
          </span>
          <div className="flex flex-col">
            <span className={`font-display text-sm font-bold tracking-tight transition-colors ${
              isNight ? 'text-white group-hover:text-primary' : 'text-slate-900 group-hover:text-primary'
            }`}>
              The Garden
            </span>
            <span className={`text-[9px] tracking-[0.28em] uppercase ${
              isNight ? 'text-white/70' : 'text-slate-600'
            }`}>
              Rooftop · Bar · Bistro
            </span>
          </div>
        </a>

        {/* Liens Desktop */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors tracking-wide ${
                isNight
                  ? 'text-white/85 hover:text-primary'
                  : 'text-slate-700 hover:text-primary font-semibold'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions à droite : Sélecteur Langue + Réserver + Switch Vibe + Admin */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Sélecteur de Langue (FR | EN | YO) */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-bold transition-all ${
                isNight
                  ? 'border border-white/20 bg-black/50 text-white hover:border-primary/50'
                  : 'border border-slate-300 bg-white/85 text-slate-900 shadow-sm hover:border-primary'
              }`}
              title="Choisir la langue / Select language / Yan èdè"
            >
              <Globe className="size-3.5 text-leaf" />
              <span className="uppercase">{language}</span>
            </button>

            {langMenuOpen && (
              <div 
                className={`absolute right-0 mt-2 w-36 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 ${
                  isNight
                    ? 'border border-white/15 bg-black/90'
                    : 'border border-slate-200 bg-white/95 text-slate-900 shadow-xl'
                }`}
                onMouseLeave={() => setLangMenuOpen(false)}
              >
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                      language === l.code
                        ? 'bg-primary text-slate-950 font-bold'
                        : isNight
                          ? 'text-white/80 hover:bg-white/10 hover:text-white'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <span>{l.name}</span>
                    <span className="text-[10px] opacity-75">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bouton Réserver Rapide Desktop */}
          <a
            href="#reserve"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-leaf to-primary px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-primary/20 transition-transform hover:scale-105 active:scale-95"
          >
            <Calendar className="size-3.5" />
            {t.nav.bookBtn}
          </a>

          {/* Switch Jour / Nuit */}
          <button
            onClick={toggleVibe}
            aria-label="Basculer entre le mode jour et nuit"
            className={`flex items-center gap-1 rounded-full p-1 backdrop-blur-sm transition-all duration-300 ${
              isNight
                ? 'border border-white/20 bg-black/60 shadow-inner'
                : 'border border-amber-300/80 bg-white/90 shadow-md ring-2 ring-amber-400/20'
            }`}
            title="Changer l'ambiance Jour / Nuit"
          >
            <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-all duration-300 ${
              vibe === 'day'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm'
                : 'text-white/45 hover:text-white/70'
            }`}>
              <Sun className={`size-3.5 ${vibe === 'day' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span className="hidden md:inline">{t.nav.day}</span>
            </span>
            <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-all duration-300 ${
              vibe === 'night'
                ? 'bg-gradient-to-r from-primary to-cyan-400 text-slate-950 shadow-sm'
                : isNight
                  ? 'text-white/45'
                  : 'text-slate-400 hover:text-slate-700'
            }`}>
              <Moon className={`size-3.5 ${vibe === 'night' ? 'text-slate-950' : 'text-cyan-400'}`} />
              <span className="hidden md:inline">{t.nav.night}</span>
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
