import React, { useState } from 'react';
import { User, Phone, Mail, ShieldCheck, ArrowLeft, Loader2, Clock, MapPin, Users, CheckCircle2 } from 'lucide-react';
import { zones } from '../../data/zonesData';
import { validateBeninPhone } from '../../lib/reservationService';
import { useLanguage } from '../../context/LanguageContext';

export default function Step3ContactConfirm({ booking, onChange, onSubmit, onPrev, submitting, error }) {
  const { t } = useLanguage();
  const [consent, setConsent] = useState(true);
  const [phoneError, setPhoneError] = useState('');

  const selectedZone = zones.find(z => z.id === booking.zone_id);

  const handlePhoneBlur = () => {
    if (booking.telephone) {
      const check = validateBeninPhone(booking.telephone);
      if (!check.valid) {
        setPhoneError(check.error);
      } else {
        setPhoneError('');
        onChange('telephone', check.formatted);
      }
    }
  };

  const isFormValid = 
    booking.nom.trim().length >= 2 &&
    booking.telephone.trim().length >= 8 &&
    !phoneError &&
    consent;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Messages d'erreur globaux */}
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
          ⚠️ {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Formulaire Coordonnées */}
        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <User className="size-4 text-primary" /> {t.reservation.contactTitle}
          </h3>

          {/* Champ Nom */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/90">
              {t.reservation.nameLabel}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 size-4 text-white/40" />
              <input
                type="text"
                required
                placeholder={t.reservation.namePlaceholder}
                value={booking.nom}
                onChange={(e) => onChange('nom', e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/40 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Champ Téléphone Bénin */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/90 flex justify-between">
              <span>{t.reservation.phoneLabel}</span>
              <span className="text-primary text-[11px]">{t.reservation.phonePriority}</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 size-4 text-white/40" />
              <input
                type="tel"
                required
                placeholder="+229 90 00 56 56"
                value={booking.telephone}
                onChange={(e) => {
                  onChange('telephone', e.target.value);
                  setPhoneError('');
                }}
                onBlur={handlePhoneBlur}
                className={`w-full rounded-2xl border pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors ${
                  phoneError
                    ? 'border-red-500 bg-red-950/20 focus:border-red-500'
                    : 'border-white/15 bg-black/40 focus:border-primary focus:ring-1 focus:ring-primary'
                }`}
              />
            </div>
            {phoneError ? (
              <p className="text-[11px] text-red-400">{phoneError}</p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                {t.reservation.phoneHint}
              </p>
            )}
          </div>

          {/* Champ E-mail (facultatif) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/90">
              {t.reservation.emailLabel} <span className="text-muted-foreground font-normal">{t.reservation.emailOptional}</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 size-4 text-white/40" />
              <input
                type="email"
                placeholder="koffi@exemple.com"
                value={booking.email}
                onChange={(e) => onChange('email', e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/40 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Champ Piège Anti-Spam (Honeypot invisible pour les humains) */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="website_honeypot"
              tabIndex={-1}
              autoComplete="off"
              value={booking.website_honeypot || ''}
              onChange={(e) => onChange('website_honeypot', e.target.value)}
            />
          </div>

          {/* Consentement */}
          <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 size-4 rounded accent-primary"
            />
            <span className="text-xs text-muted-foreground leading-relaxed">
              {t.reservation.consent}
            </span>
          </label>
        </div>

        {/* Récapitulatif & Politique */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-white border-b border-white/10 pb-3">
              {t.reservation.summaryTitle}
            </h3>

            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5 text-primary" /> {t.reservation.dateTime}
                </span>
                <span className="font-semibold text-white">
                  {booking.date} · {booking.heure}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Users className="size-3.5 text-leaf" /> {t.reservation.guests}
                </span>
                <span className="font-semibold text-white">
                  {booking.personnes} {booking.personnes > 1 ? t.reservation.guestsPlural : t.reservation.guestsSingle}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-primary" /> {t.reservation.space}
                </span>
                <span className="font-semibold text-white">
                  {selectedZone ? selectedZone.name : '—'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground">{t.reservation.occasion}</span>
                <span className="font-semibold text-white">
                  {booking.occasion}
                </span>
              </div>

              {booking.demandes_speciales && (
                <div className="pt-1">
                  <span className="text-xs text-muted-foreground block mb-1">{t.reservation.specialRequest}</span>
                  <p className="text-xs text-white/80 bg-black/30 p-2.5 rounded-xl border border-white/5">
                    « {booking.demandes_speciales} »
                  </p>
                </div>
              )}
            </div>

            {/* Politique claire */}
            <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3.5 text-xs text-white/90 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <ShieldCheck className="size-4" /> {t.reservation.policyTitle}
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground pt-1">
                <li>{t.reservation.policyHold}</li>
                <li>{t.reservation.policyCancel}</li>
              </ul>
            </div>
          </div>

          {/* Bouton de Validation Finale */}
          <div className="pt-6">
            <button
              type="button"
              disabled={!isFormValid || submitting}
              onClick={onSubmit}
              className={`flex w-full items-center justify-center gap-2 rounded-full py-4 px-6 text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
                isFormValid && !submitting
                  ? 'bg-gradient-to-r from-leaf to-primary text-slate-950 shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]'
                  : 'cursor-not-allowed bg-white/10 text-white/30'
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  {t.reservation.confirming}
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-5" />
                  {t.reservation.confirmBtn}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bouton Retour */}
      <div className="flex items-center justify-start pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={onPrev}
          disabled={submitting}
          className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="size-4" /> {t.reservation.backBtn}
        </button>
      </div>
    </div>
  );
}
