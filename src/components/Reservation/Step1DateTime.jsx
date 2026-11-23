import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Calendar as CalendarIcon, Clock, Users, AlertCircle, Loader2 } from 'lucide-react';
import { getSlotAvailability } from '../../lib/reservationService';

export default function Step1DateTime({ booking, onChange, onNext }) {
  const { t } = useLanguage();
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);

  // Date du jour au format YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    let isMounted = true;
    async function checkSlots() {
      if (!booking.date) return;
      setLoading(true);
      try {
        const slots = await getSlotAvailability(booking.date, booking.personnes, booking.zone_id);
        if (isMounted) setAvailability(slots);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    checkSlots();
    return () => { isMounted = false; };
  }, [booking.date, booking.personnes, booking.zone_id]);

  const canProceed = booking.date && booking.heure && booking.personnes >= 1;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Choix de la Date */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-white">
            <CalendarIcon className="size-4 text-primary" />
            {t.reservation.dateLabel}
          </label>
          <input
            type="date"
            min={todayStr}
            value={booking.date}
            onChange={(e) => onChange('date', e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3.5 text-sm text-white outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <p className="text-[11px] text-muted-foreground">
            {t.reservation.dateHint}
          </p>
        </div>

        {/* Choix du Nombre de Couverts */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-white">
            <Users className="size-4 text-primary" />
            {t.reservation.guestsLabel} ({booking.personnes} {booking.personnes > 1 ? t.reservation.guestsPlural : t.reservation.guestsSingle})
          </label>
          
          <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-black/40 px-4 py-2.5">
            <button
              type="button"
              onClick={() => onChange('personnes', Math.max(1, booking.personnes - 1))}
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 text-lg font-bold text-white transition-colors hover:bg-white/20 active:scale-95"
            >
              −
            </button>
            <span className="flex-1 text-center font-display text-2xl font-bold text-primary">
              {booking.personnes}
            </span>
            <button
              type="button"
              onClick={() => onChange('personnes', Math.min(25, booking.personnes + 1))}
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-lg font-bold text-slate-950 transition-colors hover:bg-primary/90 active:scale-95"
            >
              +
            </button>
          </div>

          {/* Raccourcis rapides */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[2, 4, 6, 8, 10, 15].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => onChange('personnes', n)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  booking.personnes === n
                    ? 'bg-leaf text-slate-950 font-bold'
                    : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
                }`}
              >
                {n} p.
              </button>
            ))}
          </div>

          {booking.personnes > 10 && (
            <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 p-2.5 text-xs text-amber-300">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>
                {t.reservation.largeGroupWarning}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Choix du Créneau Horaire avec Capacité Réelle */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-semibold text-white">
            <Clock className="size-4 text-primary" />
            {t.reservation.timeSlotLabel}
          </label>
          {loading && (
            <span className="flex items-center gap-1.5 text-xs text-primary animate-pulse">
              <Loader2 className="size-3 animate-spin" /> {t.reservation.checkingTables}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {availability.map((slot) => {
            const isSelected = booking.heure === slot.id;
            const isAvailable = slot.available;

            return (
              <button
                key={slot.id}
                type="button"
                disabled={!isAvailable}
                onClick={() => onChange('heure', slot.id)}
                className={`group relative flex flex-col items-center justify-center rounded-2xl border p-3.5 transition-all duration-300 ${
                  !isAvailable
                    ? 'cursor-not-allowed border-white/5 bg-white/5 text-white/20 opacity-50'
                    : isSelected
                    ? 'border-primary bg-primary/20 text-white shadow-md shadow-primary/20 ring-1 ring-primary'
                    : 'border-white/10 bg-black/30 text-white/80 hover:border-white/30 hover:bg-black/50'
                }`}
              >
                <span className="text-base font-bold tracking-tight">
                  {slot.label}
                </span>
                <span className={`mt-1 text-[10px] tracking-wide uppercase font-semibold ${
                  !isAvailable ? 'text-red-400/80' : isSelected ? 'text-primary' : 'text-leaf'
                }`}>
                  {!isAvailable ? slot.reason : `${slot.remainingGuests} ${t.reservation.placesRemaining}`}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-muted-foreground">
          ⏱️ {t.reservation.standardDuration}
        </p>
      </div>

      {/* Bouton Suivant */}
      <div className="flex justify-end pt-4 border-t border-white/10">
        <button
          type="button"
          disabled={!canProceed}
          onClick={onNext}
          className={`flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all ${
            canProceed
              ? 'bg-gradient-to-r from-leaf to-primary text-slate-950 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95'
              : 'cursor-not-allowed bg-white/10 text-white/30'
          }`}
        >
          {t.reservation.nextStepSpace}
        </button>
      </div>
    </div>
  );
}
