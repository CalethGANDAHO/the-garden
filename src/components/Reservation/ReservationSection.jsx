import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Step1DateTime from './Step1DateTime';
import Step2ZoneOccasion from './Step2ZoneOccasion';
import Step3ContactConfirm from './Step3ContactConfirm';
import ReservationSuccessModal from './ReservationSuccessModal';
import ManageReservationModal from './ManageReservationModal';
import { createReservation, generateWhatsAppFallbackLink } from '../../lib/reservationService';
import { MessageCircle, Search, ShieldCheck } from 'lucide-react';

export default function ReservationSection({ preselectedDish }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(0); // 0: Date/Heure, 1: Zone/Occasion, 2: Coordonnées
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);

  // Valeurs par défaut du formulaire
  const todayStr = new Date().toISOString().split('T')[0];
  const [booking, setBooking] = useState({
    date: todayStr,
    heure: '20:00',
    personnes: 2,
    zone_id: 'rooftop',
    occasion: 'Dîner standard',
    demandes_speciales: preselectedDish ? `Précommande : ${preselectedDish.name}` : '',
    nom: '',
    telephone: '',
    email: '',
    website_honeypot: ''
  });

  const updateField = (field, value) => {
    setBooking(prev => ({ ...prev, [field]: value }));
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await createReservation(booking);
      setConfirmedReservation(res);
      // Réinitialisation du formulaire
      setBooking({
        date: todayStr,
        heure: '20:00',
        personnes: 2,
        zone_id: 'rooftop',
        occasion: 'Dîner standard',
        demandes_speciales: '',
        nom: '',
        telephone: '',
        email: '',
        website_honeypot: ''
      });
      setStep(0);
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la réservation.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappFallbackUrl = generateWhatsAppFallbackLink();

  return (
    <section id="reserve" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <div className="glass overflow-hidden rounded-[2.5rem] p-6 sm:p-10 border border-white/15 bg-background/90 shadow-2xl">
        {/* En-tête avec indicateur d'étape */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-leaf" /> {t.reservation.tag}
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-display font-extrabold tracking-tight text-white">
              {step === 0 && t.reservation.step1Title}
              {step === 1 && t.reservation.step2Title}
              {step === 2 && t.reservation.step3Title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowManageModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-white/80 hover:bg-white/10 transition-colors"
              title="Retrouver une réservation existante"
            >
              <Search className="size-3.5 text-primary" /> {t.reservation.manageBtn}
            </button>
            <span className="shrink-0 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-primary">
              {t.reservation.stepIndicator} {step + 1} / 3
            </span>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-leaf to-primary transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / 3) * 100}%` }}
          />
        </div>

        {/* Corps des 3 étapes */}
        <div className="mt-8">
          {step === 0 && (
            <Step1DateTime
              booking={booking}
              onChange={updateField}
              onNext={() => setStep(1)}
            />
          )}

          {step === 1 && (
            <Step2ZoneOccasion
              booking={booking}
              onChange={updateField}
              onNext={() => setStep(2)}
              onPrev={() => setStep(0)}
            />
          )}

          {step === 2 && (
            <Step3ContactConfirm
              booking={booking}
              onChange={updateField}
              onSubmit={handleFinalSubmit}
              onPrev={() => setStep(1)}
              submitting={submitting}
              error={error}
            />
          )}
        </div>

        {/* Bouton de repli WhatsApp direct */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-leaf shrink-0" />
            <span>{t.reservation.freeBookingHint}</span>
          </div>

          <a
            href={whatsappFallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-semibold text-leaf hover:underline"
          >
            <MessageCircle className="size-4 fill-leaf text-slate-950" />
            {t.reservation.whatsappDirect}
          </a>
        </div>
      </div>

      {/* Modale de confirmation immédiate */}
      <ReservationSuccessModal
        reservation={confirmedReservation}
        onClose={() => setConfirmedReservation(null)}
      />

      {/* Modale de gestion/annulation */}
      <ManageReservationModal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
      />
    </section>
  );
}
