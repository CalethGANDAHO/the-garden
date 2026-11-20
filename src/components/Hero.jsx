import React from 'react';
import { useVibe } from '../context/VibeContext';
import { Utensils, Calendar, Music, Sparkles } from 'lucide-react';

export default function Hero() {
  const { vibe } = useVibe();
  const isNight = vibe === 'night';

  const quickLinks = [
    { href: '#menu', label: 'Explorer le Menu', icon: Utensils },
    { href: '#reserve', label: 'Réserver une Table', icon: Calendar },
    { href: '#events', label: 'Événements & Soirées', icon: Music },
  ];

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden flex flex-col justify-end">
      {/* Image de fond avec transition et assombrissement élégant */}
      <img
        src="/image/facade_night.jpg.webp"
        alt="La façade illuminée du Garden Rooftop de nuit à Cotonou"
        className="absolute inset-0 size-full object-cover transition-transform duration-1000 scale-105"
        fetchPriority="high"
      />
      
      {/* Dégradés superposés pour lisibilité optimale */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-black/60 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent sm:w-3/4 md:w-2/3" />

      {/* Contenu Hero */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl w-full flex-col justify-end px-5 pt-32 pb-14 sm:px-8 sm:pb-20">
        {/* Badge d'ambiance */}
        <div className="animate-rise mb-6 flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-1.5 text-xs font-semibold tracking-[0.25em] text-white/90 uppercase backdrop-blur-md">
            <span className="size-2 rounded-full bg-leaf animate-ping" />
            {isNight ? 'Ouvert · Ambiance Nuit' : 'Ouvert · Ambiance Jour'}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/70">
            <Sparkles className="size-3 text-leaf" /> Rooftop bar & restaurant à Cotonou
          </span>
        </div>

        {/* Titre Principal */}
        <h1
          className="animate-rise max-w-3xl font-display font-extrabold leading-[1.05] tracking-tight text-white"
          style={{ fontSize: 'clamp(2.75rem, 8vw, 5.5rem)' }}
        >
          Sublimez vos <span className="neon-text">Nuits</span>
          <br />
          à Cotonou.
        </h1>

        {/* Sous-titre adaptatif */}
        <p className="animate-rise mt-5 max-w-xl text-base text-white/80 sm:text-lg leading-relaxed">
          {isNight
            ? "Cocktails en rooftop, concerts live et grillades au feu de bois sous les néons — ouvert tous les soirs jusqu'au dernier morceau."
            : "Déjeuners ombragés dans le jardin, jus frais pressés et après-midis paisibles avant que la ville ne s'anime."}
        </p>

        {/* Boutons d'action rapide */}
        <div className="animate-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="group flex items-center justify-between gap-4 rounded-full border border-white/15 bg-black/60 px-6 py-3.5 backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-black/80 hover:shadow-lg hover:shadow-primary/10 sm:justify-start"
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon className="size-4 shrink-0 text-primary transition-transform duration-300 group-hover:scale-110" />
                <span className="text-sm font-medium text-white">{label}</span>
              </span>
              <span className="text-white/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
