import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { formatDateFR } from '../../lib/reservationService';
import { useLanguage } from '../../context/LanguageContext';
import { X, Download, Share2, CheckCircle2, Calendar, Clock, Users, MapPin, Sparkles, Printer } from 'lucide-react';

export default function DigitalPassModal({ reservation, isOpen, onClose }) {
  const { t } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (reservation && isOpen) {
      // Génération du QR Code contenant les données du pass
      const verifyData = JSON.stringify({
        ref: reservation.reference,
        nom: reservation.nom,
        date: reservation.date,
        heure: reservation.heure,
        personnes: reservation.personnes,
        zone: reservation.zone_name || reservation.zone_id,
        restaurant: "The Garden Rooftop Cotonou"
      });

      QRCode.toDataURL(verifyData, {
        width: 240,
        margin: 1,
        color: {
          dark: '#0b1320',
          light: '#ffffff'
        }
      })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error("Erreur QR Code:", err));
    }
  }, [reservation, isOpen]);

  if (!isOpen || !reservation) return null;

  const dateLisible = formatDateFR(reservation.date);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative w-full max-w-sm sm:max-w-md my-auto">
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          aria-label="Fermer le pass"
          className="absolute -top-12 right-0 grid size-9 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Le Pass Numérique VIP (Printable & Screen) */}
        <div 
          id="printable-pass"
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-[#131f33] via-[#0d1624] to-[#080d16] text-white shadow-2xl"
        >
          {/* Bandeau supérieur décoratif */}
          <div className="bg-gradient-to-r from-leaf via-primary to-leaf p-3 text-center">
            <span className="text-[11px] font-black tracking-[0.25em] text-slate-950 uppercase flex items-center justify-center gap-1.5">
              <Sparkles className="size-3.5 fill-slate-950" /> {t.pass.badge}
            </span>
          </div>

          {/* En-tête du billet */}
          <div className="p-6 text-center border-b border-white/10">
            <span className="text-[10px] tracking-[0.3em] text-primary uppercase font-bold block">
              Cotonou · Bénin
            </span>
            <h2 className="font-display text-2xl font-black tracking-tight text-white mt-1">
              The Garden
            </h2>
            <p className="text-[11px] text-white/60 uppercase tracking-widest mt-0.5">
              Rooftop · Bar & Restaurant
            </p>

            {/* Badge de statut */}
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-leaf/20 border border-leaf/40 px-3.5 py-1 text-xs font-bold text-leaf shadow-sm">
              <CheckCircle2 className="size-3.5" /> {t.pass.confirmed}
            </div>
          </div>

          {/* QR Code de vérification maître d'hôtel */}
          <div className="py-6 px-6 bg-white/5 flex flex-col items-center justify-center text-center">
            <div className="p-2.5 bg-white rounded-2xl shadow-xl ring-4 ring-primary/20">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code ${reservation.reference}`}
                  className="size-40 sm:size-44 object-contain"
                />
              ) : (
                <div className="size-40 grid place-items-center text-slate-950 text-xs">
                  ...
                </div>
              )}
            </div>

            <span className="font-mono text-sm font-black tracking-widest text-primary mt-3 block">
              {reservation.reference}
            </span>
            <span className="text-[10px] text-white/50 block mt-0.5">
              {t.pass.scanHint}
            </span>
          </div>

          {/* Ligne perforée de découpe visuelle */}
          <div className="relative flex items-center justify-between px-2 py-1">
            <div className="size-5 rounded-full bg-black/90 -ml-4.5 border-r border-white/20" />
            <div className="flex-1 border-b-2 border-dashed border-white/20 mx-2" />
            <div className="size-5 rounded-full bg-black/90 -mr-4.5 border-l border-white/20" />
          </div>

          {/* Détails de la table */}
          <div className="p-6 space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-white/60">{t.pass.holder}</span>
              <span className="font-display font-extrabold text-sm text-white uppercase">
                {reservation.nom}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/5 p-2.5 border border-white/5">
                <span className="text-[10px] text-white/50 block flex items-center gap-1">
                  <Calendar className="size-3 text-primary" /> {t.pass.date}
                </span>
                <span className="font-semibold text-white block mt-0.5 truncate text-[11px]">
                  {dateLisible}
                </span>
              </div>

              <div className="rounded-xl bg-white/5 p-2.5 border border-white/5">
                <span className="text-[10px] text-white/50 block flex items-center gap-1">
                  <Clock className="size-3 text-primary" /> {t.pass.time}
                </span>
                <span className="font-bold text-leaf block mt-0.5 text-sm">
                  {reservation.heure}
                </span>
              </div>

              <div className="rounded-xl bg-white/5 p-2.5 border border-white/5">
                <span className="text-[10px] text-white/50 block flex items-center gap-1">
                  <Users className="size-3 text-primary" /> {t.pass.guests}
                </span>
                <span className="font-semibold text-white block mt-0.5 text-xs">
                  {reservation.personnes} {reservation.personnes > 1 ? t.reservation.guestsPlural : t.reservation.guestsSingle}
                </span>
              </div>

              <div className="rounded-xl bg-white/5 p-2.5 border border-white/5 truncate">
                <span className="text-[10px] text-white/50 block flex items-center gap-1">
                  <MapPin className="size-3 text-primary" /> {t.pass.space}
                </span>
                <span className="font-semibold text-white block mt-0.5 text-xs truncate">
                  {reservation.zone_name || reservation.zone_id}
                </span>
              </div>
            </div>

            {reservation.occasion && (
              <div className="text-[11px] text-white/70 bg-white/5 p-2 rounded-xl">
                <span className="text-white/40">{t.pass.occasion}</span> {reservation.occasion}
              </div>
            )}

            {/* Note d'accueil */}
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5 text-[10px] text-primary text-center">
              ⏱️ {t.pass.holdNotice}
            </div>
          </div>
        </div>

        {/* Boutons d'action bas de modale */}
        <div className="mt-4 flex gap-2.5">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 py-3 text-xs font-bold text-white transition-colors"
          >
            <Printer className="size-4 text-leaf" /> {t.pass.printBtn}
          </button>
          <button
            onClick={onClose}
            className="rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 text-xs font-semibold text-white/80 transition-colors"
          >
            {t.pass.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
