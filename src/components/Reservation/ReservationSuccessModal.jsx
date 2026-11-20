import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, Calendar, Clock, MapPin, Users, Copy, Check, QrCode } from 'lucide-react';
import { generateWhatsAppClientLink, formatDateFR } from '../../lib/reservationService';
import DigitalPassModal from './DigitalPassModal';

export default function ReservationSuccessModal({ reservation, onClose }) {
  const [copied, setCopied] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (reservation) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4ade80', '#22d3ee', '#ffffff', '#fbbf24']
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [reservation]);

  if (!reservation) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reservation.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = generateWhatsAppClientLink(reservation);
  const dateLisible = formatDateFR(reservation.date);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
        <div className="glass relative w-full max-w-lg overflow-hidden rounded-3xl border border-primary/30 bg-background/95 p-6 sm:p-8 text-center shadow-2xl">
          {/* Icône de validation animée */}
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-leaf/20 text-leaf ring-4 ring-leaf/30 animate-bounce duration-1000">
            <CheckCircle2 className="size-10 text-leaf" />
          </div>

          <h3 className="mt-5 font-display text-2xl sm:text-3xl font-extrabold text-white">
            Table Confirmée avec Succès !
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Merci <strong className="text-white">{reservation.nom}</strong>, votre table est bien enregistrée.
          </p>

          {/* Numéro de réservation */}
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3">
            <div className="text-left">
              <span className="text-[10px] tracking-widest text-primary uppercase font-bold block">
                Numéro de Réservation
              </span>
              <span className="font-display text-lg font-black tracking-wider text-white">
                {reservation.reference}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 active:scale-95"
              title="Copier le numéro"
            >
              {copied ? <Check className="size-3.5 text-leaf" /> : <Copy className="size-3.5" />}
              {copied ? 'Copié' : 'Copier'}
            </button>
          </div>

          {/* Détails résumés */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 text-left text-xs bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-white/90">
              <Calendar className="size-3.5 text-primary" />
              <span className="truncate">{dateLisible}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Clock className="size-3.5 text-primary" />
              <span>{reservation.heure}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Users className="size-3.5 text-leaf" />
              <span>{reservation.personnes} pers.</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 truncate">
              <MapPin className="size-3.5 text-primary" />
              <span className="truncate">{reservation.zone_name || reservation.zone_id}</span>
            </div>
          </div>

          {/* Actions : Pass VIP & WhatsApp */}
          <div className="mt-6 space-y-3">
            {/* Bouton Ticket / Pass VIP Numérique */}
            <button
              onClick={() => setShowPass(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-leaf to-primary py-3.5 px-6 text-sm font-bold text-slate-950 shadow-lg shadow-primary/25 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <QrCode className="size-5" />
              Afficher mon Pass Numérique VIP (QR Code)
            </button>

            {/* Bouton WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] py-3 px-6 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#25D366]/20 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="size-4.5 fill-white" />
              Envoyer la confirmation au restaurant sur WhatsApp
            </a>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Conservez votre Pass sur votre portable pour le présenter à l'arrivée. Votre table est garantie 15 minutes.
            </p>

            <button
              onClick={onClose}
              className="w-full rounded-full border border-white/15 bg-white/5 py-2.5 text-xs font-semibold text-white/80 hover:bg-white/10 transition-colors"
            >
              Fermer et retourner au site
            </button>
          </div>
        </div>
      </div>

      {/* Modale plein écran du Pass Numérique avec QR Code */}
      <DigitalPassModal
        reservation={reservation}
        isOpen={showPass}
        onClose={() => setShowPass(false)}
      />
    </>
  );
}
