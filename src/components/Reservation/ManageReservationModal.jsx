import React, { useState } from 'react';
import { Search, X, Calendar, Clock, MapPin, Users, AlertTriangle, CheckCircle, Loader2, QrCode } from 'lucide-react';
import { getReservationByReference, updateReservationStatus, formatDateFR } from '../../lib/reservationService';
import DigitalPassModal from './DigitalPassModal';

export default function ManageReservationModal({ isOpen, onClose }) {
  const [refInput, setRefInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!refInput.trim()) return;
    setLoading(true);
    setError('');
    setFeedback('');
    try {
      const res = await getReservationByReference(refInput);
      if (res) {
        setReservation(res);
      } else {
        setError("Aucune réservation trouvée pour ce numéro de référence.");
        setReservation(null);
      }
    } catch (err) {
      setError("Erreur lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm("Êtes-vous certain de vouloir annuler votre réservation ?")) return;
    setLoading(true);
    try {
      await updateReservationStatus(reservation.reference, 'annulee', 'Annulée par le client');
      setReservation(prev => ({ ...prev, statut: 'annulee' }));
      setFeedback("Votre réservation a bien été annulée.");
    } catch (err) {
      setError("Erreur lors de l'annulation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="glass relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-background/95 p-6 shadow-2xl">
          {/* Bouton Fermer */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="size-4" />
          </button>

          <h3 className="font-display text-xl font-bold text-white mb-2">
            Gérer ma réservation
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Entrez votre numéro de référence pour afficher votre Pass Numérique ou annuler votre table.
          </p>

          {/* Formulaire de recherche */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              required
              placeholder="Ex : GARDEN-2026-XXXX"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value.toUpperCase())}
              className="flex-1 rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white uppercase placeholder:normal-case placeholder:text-white/30 outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-slate-950 transition-transform active:scale-95"
            >
              {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Search className="size-3.5" />}
              Trouver
            </button>
          </form>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-300 mb-4">
              {error}
            </div>
          )}

          {feedback && (
            <div className="rounded-xl bg-leaf/10 border border-leaf/20 p-3 text-xs text-leaf mb-4 flex items-center gap-2">
              <CheckCircle className="size-4" /> {feedback}
            </div>
          )}

          {/* Détails de la réservation trouvée */}
          {reservation && (
            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-white text-sm uppercase">{reservation.nom}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                  reservation.statut === 'confirmee'
                    ? 'bg-leaf/20 text-leaf border border-leaf/30'
                    : reservation.statut === 'annulee'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {reservation.statut}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <div className="flex items-center gap-1.5 text-white/90">
                  <Calendar className="size-3.5 text-primary" /> {formatDateFR(reservation.date)}
                </div>
                <div className="flex items-center gap-1.5 text-white/90">
                  <Clock className="size-3.5 text-primary" /> {reservation.heure}
                </div>
                <div className="flex items-center gap-1.5 text-white/90">
                  <Users className="size-3.5 text-leaf" /> {reservation.personnes} pers.
                </div>
                <div className="flex items-center gap-1.5 text-white/90 truncate">
                  <MapPin className="size-3.5 text-primary" /> {reservation.zone_name || reservation.zone_id}
                </div>
              </div>

              {/* Bouton pour afficher le pass */}
              <button
                type="button"
                onClick={() => setShowPass(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-leaf to-primary py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                <QrCode className="size-4" /> Afficher mon Pass Numérique VIP
              </button>

              {reservation.statut !== 'annulee' && (
                <button
                  type="button"
                  onClick={handleCancelBooking}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/10 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <AlertTriangle className="size-3.5" /> Annuler cette réservation
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <DigitalPassModal
        reservation={reservation}
        isOpen={showPass}
        onClose={() => setShowPass(false)}
      />
    </>
  );
}
