import React, { useState, useEffect, useMemo } from 'react';
import { 
  getAllReservations, 
  updateReservationStatus, 
  getBlockedDates, 
  toggleBlockDate 
} from '../../lib/reservationService';
import { exportReservationsToExcel } from '../../lib/exportExcel';
import { 
  Users, 
  Calendar, 
  Download, 
  Search, 
  Check, 
  X, 
  Lock, 
  Unlock, 
  MessageSquare, 
  RefreshCw, 
  Phone 
} from 'lucide-react';

export default function AdminDashboardView({ onLogout }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('all'); // 'all', 'today', 'future'
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('Privatisation complète');

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await getAllReservations();
      setReservations(data || []);
      setBlockedDates(getBlockedDates());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Statistiques
  const stats = useMemo(() => {
    const total = reservations.length;
    const todayRes = reservations.filter(r => r.date === todayStr && r.statut !== 'annulee' && r.statut !== 'rejetee');
    const todayGuests = todayRes.reduce((acc, r) => acc + (Number(r.personnes) || 0), 0);
    const confirmedCount = reservations.filter(r => r.statut === 'confirmee').length;
    return { total, todayCount: todayRes.length, todayGuests, confirmedCount };
  }, [reservations, todayStr]);

  // Filtrage
  const filteredReservations = useMemo(() => {
    return reservations.filter(r => {
      // Filtre Date
      if (filterDate === 'today' && r.date !== todayStr) return false;
      if (filterDate === 'future' && r.date < todayStr) return false;

      // Filtre Statut
      if (filterStatus !== 'all' && r.statut !== filterStatus) return false;

      // Recherche
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.nom?.toLowerCase().includes(q);
        const matchPhone = r.telephone?.includes(q);
        const matchRef = r.reference?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchRef) return false;
      }

      return true;
    });
  }, [reservations, filterDate, filterStatus, searchQuery, todayStr]);

  const handleStatusChange = async (reference, newStatus) => {
    try {
      await updateReservationStatus(reference, newStatus);
      setReservations(prev =>
        prev.map(r => (r.reference === reference ? { ...r, statut: newStatus } : r))
      );
    } catch (e) {
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleAddBlockDate = (e) => {
    e.preventDefault();
    if (!newBlockDate) return;
    const updated = toggleBlockDate(newBlockDate, null, newBlockReason);
    setBlockedDates([...updated]);
    setNewBlockDate('');
  };

  const handleRemoveBlockDate = (date) => {
    const updated = toggleBlockDate(date, null);
    setBlockedDates([...updated]);
  };

  return (
    <div className="space-y-6">
      {/* En-tête Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            Tableau de Bord du Gérant
          </h2>
          <p className="text-xs text-muted-foreground">
            The Garden Rooftop · Cotonou
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReservations}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:bg-white/10 transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => exportReservationsToExcel(filteredReservations)}
            className="flex items-center gap-1.5 rounded-xl bg-leaf/20 border border-leaf/30 px-3.5 py-2 text-xs font-bold text-leaf hover:bg-leaf/30 transition-colors"
          >
            <Download className="size-3.5" /> Export Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* Cartes de Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Aujourd'hui</span>
          <span className="font-display text-2xl font-bold text-white mt-1 block">{stats.todayCount}</span>
          <span className="text-[11px] text-leaf">{stats.todayGuests} couverts prévus</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Confirmées</span>
          <span className="font-display text-2xl font-bold text-primary mt-1 block">{stats.confirmedCount}</span>
          <span className="text-[11px] text-muted-foreground">Sur l'ensemble</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Total Historique</span>
          <span className="font-display text-2xl font-bold text-white mt-1 block">{stats.total}</span>
          <span className="text-[11px] text-muted-foreground">Réservations</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Dates Privatisées</span>
          <span className="font-display text-2xl font-bold text-amber-400 mt-1 block">{blockedDates.length}</span>
          <span className="text-[11px] text-muted-foreground">Jours fermés</span>
        </div>
      </div>

      {/* Barre de Recherche & Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 size-4 text-white/40" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone (+229), référence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/30 outline-none focus:border-primary"
          />
        </div>

        {/* Filtres date */}
        <div className="flex gap-1.5">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'today', label: "Aujourd'hui" },
            { id: 'future', label: 'À venir' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterDate(f.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                filterDate === f.id
                  ? 'bg-primary text-slate-950 font-bold'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau des Réservations */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/30">
        <table className="w-full text-left text-xs text-white">
          <thead className="bg-white/5 text-[10px] text-muted-foreground uppercase tracking-wider border-b border-white/10">
            <tr>
              <th className="p-3">Réf & Client</th>
              <th className="p-3">Date & Heure</th>
              <th className="p-3">Convives & Espace</th>
              <th className="p-3">Téléphone WhatsApp</th>
              <th className="p-3">Statut</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  Aucune réservation trouvée pour ces critères.
                </td>
              </tr>
            ) : (
              filteredReservations.map(r => (
                <tr key={r.reference} className="hover:bg-white/5 transition-colors">
                  <td className="p-3">
                    <span className="font-mono text-[10px] text-primary block">{r.reference}</span>
                    <span className="font-bold text-white block mt-0.5">{r.nom}</span>
                    {r.occasion && <span className="text-[10px] text-muted-foreground">{r.occasion}</span>}
                  </td>
                  <td className="p-3">
                    <span className="font-medium text-white block">{r.date}</span>
                    <span className="text-[11px] text-leaf font-bold">{r.heure}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-white block">{r.personnes} pers.</span>
                    <span className="text-[10px] text-muted-foreground">{r.zone_name || r.zone_id}</span>
                    {r.demandes_speciales && (
                      <span className="text-[9px] text-amber-300 block italic truncate max-w-[150px]" title={r.demandes_speciales}>
                        📝 {r.demandes_speciales}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <a
                      href={`https://wa.me/${r.telephone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-[#25D366] hover:underline"
                    >
                      <Phone className="size-3" /> {r.telephone}
                    </a>
                  </td>
                  <td className="p-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                      r.statut === 'confirmee'
                        ? 'bg-leaf/20 text-leaf border border-leaf/30'
                        : r.statut === 'annulee'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {r.statut}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {r.statut !== 'confirmee' && (
                        <button
                          onClick={() => handleStatusChange(r.reference, 'confirmee')}
                          title="Confirmer"
                          className="grid size-7 place-items-center rounded-lg bg-leaf/20 text-leaf hover:bg-leaf/30 transition-colors"
                        >
                          <Check className="size-3.5" />
                        </button>
                      )}
                      {r.statut !== 'annulee' && (
                        <button
                          onClick={() => handleStatusChange(r.reference, 'annulee')}
                          title="Annuler"
                          className="grid size-7 place-items-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Module de Blocage de Dates (Privatisations) */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
        <h4 className="text-xs font-bold text-white flex items-center gap-2">
          <Lock className="size-3.5 text-amber-400" /> Bloquer une Date (Privatisation ou Fermeture)
        </h4>
        <form onSubmit={handleAddBlockDate} className="flex flex-col sm:flex-row gap-2">
          <input
            type="date"
            required
            value={newBlockDate}
            onChange={(e) => setNewBlockDate(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white outline-none focus:border-primary"
          />
          <input
            type="text"
            placeholder="Motif (ex: Soirée privée d'entreprise)"
            value={newBlockReason}
            onChange={(e) => setNewBlockReason(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="rounded-xl bg-amber-500/20 border border-amber-500/30 px-4 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition-colors"
          >
            Bloquer la date
          </button>
        </form>

        {blockedDates.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {blockedDates.map((b) => (
              <span
                key={b.date}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-[11px] text-red-300"
              >
                🔒 {b.date} ({b.reason})
                <button
                  type="button"
                  onClick={() => handleRemoveBlockDate(b.date)}
                  className="text-red-400 hover:text-white"
                  title="Débloquer"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
