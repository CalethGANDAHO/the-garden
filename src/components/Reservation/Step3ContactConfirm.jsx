import React, { useState } from 'react';
import { User, Phone, Mail, ShieldCheck, ArrowLeft, Loader2, Clock, MapPin, Users, CheckCircle2 } from 'lucide-react';
import { zones } from '../../data/zonesData';
import { validateBeninPhone } from '../../lib/reservationService';

export default function Step3ContactConfirm({ booking, onChange, onSubmit, onPrev, submitting, error }) {
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
            <User className="size-4 text-primary" /> Vos coordonnées
          </h3>

          {/* Champ Nom */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/90">
              Nom complet ou prénom *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 size-4 text-white/40" />
              <input
                type="text"
                required
                placeholder="Ex : Koffi Mensah"
                value={booking.nom}
                onChange={(e) => onChange('nom', e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/40 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Champ Téléphone Bénin */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/90 flex justify-between">
              <span>Numéro WhatsApp / Téléphone * (Bénin +229)</span>
              <span className="text-primary text-[11px]">Canal prioritaire</span>
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
                Format accepté : +229 90 00 56 56, 90005656, 61000000...
              </p>
            )}
          </div>

          {/* Champ E-mail (facultatif) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/90">
              Adresse e-mail <span className="text-muted-foreground font-normal">(Optionnel)</span>
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
              J'accepte de recevoir la confirmation de ma réservation par WhatsApp/SMS. Aucune donnée n'est cédée à des tiers.
            </span>
          </label>
        </div>

        {/* Récapitulatif & Politique */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-white border-b border-white/10 pb-3">
              Récapitulatif de votre table
            </h3>

            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5 text-primary" /> Date & Heure
                </span>
                <span className="font-semibold text-white">
                  {booking.date} à {booking.heure}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Users className="size-3.5 text-leaf" /> Invités
                </span>
                <span className="font-semibold text-white">
                  {booking.personnes} {booking.personnes > 1 ? 'personnes' : 'personne'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-primary" /> Espace choisi
                </span>
                <span className="font-semibold text-white">
                  {selectedZone ? selectedZone.name : 'Non spécifié'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground">Occasion</span>
                <span className="font-semibold text-white">
                  {booking.occasion}
                </span>
              </div>

              {booking.demandes_speciales && (
                <div className="pt-1">
                  <span className="text-xs text-muted-foreground block mb-1">Demande spéciale :</span>
                  <p className="text-xs text-white/80 bg-black/30 p-2.5 rounded-xl border border-white/5">
                    « {booking.demandes_speciales} »
                  </p>
                </div>
              )}
            </div>

            {/* Politique claire */}
            <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3.5 text-xs text-white/90 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <ShieldCheck className="size-4" /> Politique de l'établissement
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground pt-1">
                <li>Votre table est conservée pendant <strong>15 minutes</strong> après l'heure convenue.</li>
                <li>Annulation sans frais possible à tout moment.</li>
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
                  Confirmation de votre table en cours...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-5" />
                  Confirmer ma Réservation
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
          <ArrowLeft className="size-4" /> Modifier l'espace
        </button>
      </div>
    </div>
  );
}
