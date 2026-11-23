import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { zones } from '../../data/zonesData';
import { OCCASIONS } from '../../lib/reservationService';
import { ArrowLeft, Sparkles, MessageSquare } from 'lucide-react';

export default function Step2ZoneOccasion({ booking, onChange, onNext, onPrev }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Choix de la zone */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-white">
          {t.reservation.spaceLabel}
        </label>
        
        <div className="grid gap-4 md:grid-cols-3">
          {zones.map((zone) => {
            const isSelected = booking.zone_id === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => onChange('zone_id', zone.id)}
                className={`lift group relative flex flex-col overflow-hidden rounded-3xl border text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/50 shadow-xl shadow-primary/20 bg-primary/5'
                    : 'border-white/10 bg-black/40 hover:border-white/30'
                }`}
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={zone.image}
                    alt={zone.name}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="hero-veil absolute inset-0" />
                  
                  {isSelected && (
                    <span className="absolute top-3 right-3 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-slate-950 shadow-md">
                      {t.reservation.selected}
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-display text-base font-bold text-white group-hover:text-primary transition-colors">
                      {zone.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {zone.detail}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5 border-t border-white/5 pt-2">
                    {zone.recommendedFor.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[10px] text-primary/80 bg-primary/10 rounded-md px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Occasion & Remarques */}
      <div className="grid gap-6 md:grid-cols-2 pt-2 border-t border-white/10">
        {/* Occasion */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles className="size-4 text-leaf" />
            {t.reservation.occasionLabel}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {OCCASIONS.map((occ) => (
              <button
                key={occ}
                type="button"
                onClick={() => onChange('occasion', occ)}
                className={`rounded-xl border p-2.5 text-left text-xs font-medium transition-all ${
                  booking.occasion === occ
                    ? 'border-primary bg-primary/20 text-white font-semibold'
                    : 'border-white/10 bg-black/30 text-white/70 hover:border-white/20 hover:text-white'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>

        {/* Demandes particulières */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-white">
            <MessageSquare className="size-4 text-primary" />
            {t.reservation.specialRequestsLabel}
          </label>
          <textarea
            rows={4}
            value={booking.demandes_speciales}
            onChange={(e) => onChange('demandes_speciales', e.target.value)}
            placeholder={t.reservation.specialRequestsPlaceholder}
            className="w-full resize-none rounded-2xl border border-white/15 bg-black/40 p-3.5 text-xs text-white placeholder:text-white/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Boutons Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="size-4" /> {t.reservation.backBtn}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-leaf to-primary px-7 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          {t.reservation.nextStepContact}
        </button>
      </div>
    </div>
  );
}
