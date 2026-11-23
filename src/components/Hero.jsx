import React from 'react';
import { useVibe } from '../context/VibeContext';
import { useLanguage } from '../context/LanguageContext';
import { Utensils, Calendar, Music, Sparkles } from 'lucide-react';

export default function Hero() {
  const { vibe } = useVibe();
  const { t } = useLanguage();
  const isNight = vibe === 'night';

  const quickLinks = [
    { href: '#menu', label: t.hero.exploreMenu, icon: Utensils },
    { href: '#reserve', label: t.hero.reserveTable, icon: Calendar },
    { href: '#events', label: t.hero.weeklyEvents, icon: Music },
  ];

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden flex flex-col justify-end">
      {/* Image de façade NATURELLE ET ÉCLATANTE - AUCUN FILTRE OBSCURCISSANT */}
      <img
        src="/image/facade_night.jpg.webp"
        alt="La façade illuminée du Garden Rooftop de nuit à Cotonou"
        className="absolute inset-0 size-full object-cover transition-transform duration-1000 scale-100"
        fetchPriority="high"
      />
      
      {/* Fondu discret uniquement tout en bas pour transitionner doucement avec la suite du site */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Contenu Hero avec ombres de texte nettes pour lisibilité parfaite sur fond clair/vrai */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl w-full flex-col justify-end px-5 pt-32 pb-14 sm:px-8 sm:pb-20">
        {/* Badge d'ambiance */}
        <div className="animate-rise mb-6 flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/70 px-4 py-1.5 text-xs font-semibold tracking-[0.25em] text-white uppercase backdrop-blur-md shadow-lg">
            <span className="size-2 rounded-full bg-leaf animate-ping" />
            {isNight ? t.hero.badgeNight : t.hero.badgeDay}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            <Sparkles className="size-3 text-leaf" /> {t.hero.badgeDesc}
          </span>
        </div>

        {/* Titre Principal */}
        <h1
          className="animate-rise max-w-3xl font-display font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
          style={{ fontSize: 'clamp(2.75rem, 8vw, 5.5rem)' }}
        >
          {t.hero.titlePre} <span className="neon-text">{t.hero.titleHighlight}</span>
          <br />
          {t.hero.titlePost}
        </h1>

        {/* Sous-titre adaptatif */}
        <p className="animate-rise mt-5 max-w-xl text-base text-white sm:text-lg leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
          {isNight ? t.hero.descNight : t.hero.descDay}
        </p>

        {/* Boutons d'action rapide */}
        <div className="animate-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="group flex items-center justify-between gap-4 rounded-full border border-white/25 bg-black/70 px-6 py-3.5 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-primary hover:bg-black/90 hover:scale-105 sm:justify-start"
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon className="size-4 shrink-0 text-primary transition-transform duration-300 group-hover:scale-110" />
                <span className="text-sm font-semibold text-white">{label}</span>
              </span>
              <span className="text-white/70 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
