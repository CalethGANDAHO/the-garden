import React, { useRef } from 'react';
import { events } from '../data/eventsData';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, Clock, Star, Sparkles } from 'lucide-react';

export default function Events() {
  const { t } = useLanguage();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction * 340,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="events" className="py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Titre et flèches de défilement */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="mb-8 min-w-0">
            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" /> {t.events.tag}
            </span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white">
              {t.events.title}
            </h2>
          </div>

          <div className="flex shrink-0 gap-2 mb-8">
            <button
              onClick={() => scroll(-1)}
              aria-label="Événement précédent"
              className="glass grid size-11 place-items-center rounded-full border border-white/10 text-white/80 transition-colors hover:border-primary hover:text-white"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Événement suivant"
              className="glass grid size-11 place-items-center rounded-full border border-white/10 text-white/80 transition-colors hover:border-primary hover:text-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Défilement horizontal */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8 mx-auto max-w-6xl"
      >
        {events.map((event) => (
          <article
            key={event.id}
            className="glass lift w-[300px] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 bg-black/40 sm:w-[340px]"
          >
            {/* Image de l'événement */}
            <div className="relative h-48 overflow-hidden bg-black/50">
              <img
                src={event.image}
                alt={event.title}
                loading="lazy"
                className="size-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="hero-veil absolute inset-0" />
              
              {/* Jour */}
              <span className="glass absolute top-4 left-4 rounded-full px-3 py-1 text-[11px] font-bold tracking-widest uppercase text-white backdrop-blur-md">
                {event.day}
              </span>

              {/* Badge Favori */}
              {event.badge && (
                <span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-amber-300 backdrop-blur-md border border-amber-400/20">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  {event.badge}
                </span>
              )}
            </div>

            {/* Contenu */}
            <div className="p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  {event.title}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Clock className="size-3.5" /> {event.time}
                </p>
                <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {event.blurb}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5">
                <a
                  href="#reserve"
                  className="flex items-center justify-between text-xs font-bold text-leaf hover:underline"
                >
                  {t.events.bookForEvent}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Badges récapitulatifs */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8 mt-6 flex flex-wrap gap-3">
        {t.events.badges.map((badge, idx) => (
          <span key={idx} className="glass flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white/90 border border-white/10">
            <Sparkles className="size-3.5 text-primary" /> {badge}
          </span>
        ))}
      </div>
    </section>
  );
}
