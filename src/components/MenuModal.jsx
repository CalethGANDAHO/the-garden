import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, Sparkles, Calendar, Check } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export default function MenuModal({ item, onClose, onSelectForBooking }) {
  const { t } = useLanguage();
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="glass relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-background/95 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          aria-label="Fermer la fenêtre"
          className="absolute top-4 right-4 z-20 grid size-10 place-items-center rounded-full bg-black/60 text-white/80 backdrop-blur-md transition-transform hover:scale-110 hover:text-white"
        >
          <X className="size-5" />
        </button>

        {/* Image du plat */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="size-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="hero-veil absolute inset-0" />
          <div className="absolute right-5 bottom-5 left-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-leaf backdrop-blur-md mb-2">
              <Sparkles className="size-3" /> {formatPrice(item.price)}
            </span>
            <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {item.name}
            </h3>
            <p className="mt-1 text-xs text-white/75 sm:text-sm">
              {item.tagline}
            </p>
          </div>
        </div>

        {/* Ingrédients & Action */}
        <div className="p-6">
          <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3">
            {t.menu.ingredientsTitle}
          </h4>
          <div className="flex flex-wrap gap-2 mb-6">
            {item.ingredients.map((ing, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-secondary/40 px-3 py-1 text-xs text-white/90"
              >
                <Check className="size-3 text-primary" /> {ing}
              </span>
            ))}
          </div>

          <button
            onClick={() => {
              onSelectForBooking(item);
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-leaf to-primary py-3.5 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-primary/20 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calendar className="size-4" />
            {t.menu.bookForDish}
          </button>
        </div>
      </div>
    </div>
  );
}
