import { supabase, isSupabaseConfigured } from './supabase';
import { zones } from '../data/zonesData';

export const SLOTS = [
  { id: '18:00', label: '18:00', maxCapacity: 35 },
  { id: '19:00', label: '19:00', maxCapacity: 45 },
  { id: '20:00', label: '20:00', maxCapacity: 50 },
  { id: '21:00', label: '21:00', maxCapacity: 50 },
  { id: '22:00', label: '22:00', maxCapacity: 50 },
  { id: '23:00', label: '23:00', maxCapacity: 40 },
  { id: '00:00', label: '00:00', maxCapacity: 35 },
  { id: '01:00', label: '01:00', maxCapacity: 25 },
];

export const OCCASIONS = [
  "Dîner standard",
  "Soirée Karaoké (Mardi)",
  "Anniversaire",
  "Dîner romantique en amoureux",
  "Sortie entre amis / Afterwork",
  "Événement privé / Dîner d'affaires"
];

const LOCAL_STORAGE_KEY = 'garden_reservations_data';
const BLOCKED_DATES_KEY = 'garden_blocked_dates';

// Récupérer le store local
function getLocalReservations() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalReservations(data) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Erreur sauvegarde locale:", e);
  }
}

function getLocalBlockedDates() {
  try {
    const raw = localStorage.getItem(BLOCKED_DATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalBlockedDates(dates) {
  try {
    localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(dates));
  } catch (e) {
    console.error(e);
  }
}

// Générer une référence unique GARDEN-2026-XXXX
export function generateReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const year = new Date().getFullYear();
  return `GARDEN-${year}-${rand}`;
}

// Valider un numéro de téléphone béninois (+229)
export function validateBeninPhone(phone) {
  if (!phone) return { valid: false, error: "Le numéro de téléphone est requis." };
  // Nettoyage des espaces, tirets et parenthèses
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  
  // Format international +229 ou 00229 ou format national 8 ou 10 chiffres
  const regex = /^(?:\+229|00229)?(01|4[0-9]|5[0-9]|6[0-9]|9[0-9])\d{6}$/;
  if (!regex.test(cleaned)) {
    return {
      valid: false,
      error: "Veuillez entrer un numéro béninois valide (ex: +229 90 00 56 56 ou 90005656)."
    };
  }
  // Normaliser en format standard +229XXXXXXXX
  let normalized = cleaned;
  if (normalized.startsWith('+229')) {
    normalized = normalized.substring(4);
  } else if (normalized.startsWith('00229')) {
    normalized = normalized.substring(5);
  }
  return { valid: true, formatted: `+229 ${normalized.substring(0, 2)} ${normalized.substring(2, 4)} ${normalized.substring(4, 6)} ${normalized.substring(6)}` };
}

// Calcul de la capacité restante par créneau pour une date donnée
export async function getSlotAvailability(date, guestCount = 2, selectedZone = null) {
  if (!date) return [];

  let existingReservations = [];

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('date', date)
        .neq('statut', 'annulee')
        .neq('statut', 'rejetee');
      
      if (!error && data) {
        existingReservations = data;
      }
    } catch (err) {
      console.warn("Fallback local pour la vérification des créneaux:", err);
      existingReservations = getLocalReservations().filter(
        r => r.date === date && r.statut !== 'annulee' && r.statut !== 'rejetee'
      );
    }
  } else {
    existingReservations = getLocalReservations().filter(
      r => r.date === date && r.statut !== 'annulee' && r.statut !== 'rejetee'
    );
  }

  const blockedDates = getLocalBlockedDates();
  const isDateFullyBlocked = blockedDates.some(b => b.date === date && !b.slotId);

  return SLOTS.map(slot => {
    if (isDateFullyBlocked) {
      return { ...slot, available: false, remainingGuests: 0, reason: "Privatisation complète" };
    }

    const isSlotBlocked = blockedDates.some(b => b.date === date && b.slotId === slot.id);
    if (isSlotBlocked) {
      return { ...slot, available: false, remainingGuests: 0, reason: "Créneau complet" };
    }

    // Calcul des couverts déjà réservés sur ce créneau
    const reservationsForSlot = existingReservations.filter(r => r.heure === slot.id);
    
    // Si une zone spécifique est sélectionnée, vérifier aussi la capacité de cette zone
    let zoneFull = false;
    if (selectedZone) {
      const zoneConfig = zones.find(z => z.id === selectedZone);
      if (zoneConfig) {
        const reservationsInZone = reservationsForSlot.filter(r => r.zone_id === selectedZone);
        const bookedTablesInZone = reservationsInZone.length;
        if (bookedTablesInZone >= zoneConfig.maxTables) {
          zoneFull = true;
        }
      }
    }

    const totalBookedGuests = reservationsForSlot.reduce((sum, r) => sum + (Number(r.personnes) || 0), 0);
    const remaining = Math.max(0, slot.maxCapacity - totalBookedGuests);
    const hasEnoughSpace = remaining >= guestCount && !zoneFull;

    return {
      ...slot,
      bookedGuests: totalBookedGuests,
      remainingGuests: remaining,
      available: hasEnoughSpace,
      reason: zoneFull ? `Zone ${selectedZone} complète` : (remaining < guestCount ? "Complet" : "Disponible")
    };
  });
}

// Création d'une réservation
export async function createReservation(bookingData) {
  // 1. Anti-spam Honeypot
  if (bookingData.website_honeypot) {
    throw new Error("Erreur de détection bot.");
  }

  // 2. Validation téléphone
  const phoneCheck = validateBeninPhone(bookingData.telephone);
  if (!phoneCheck.valid) {
    throw new Error(phoneCheck.error);
  }

  // 3. Limitation par numéro (max 3 réservations actives)
  const existingList = isSupabaseConfigured ? [] : getLocalReservations();
  const activeCount = existingList.filter(
    r => r.telephone.replace(/\s+/g, '') === phoneCheck.formatted.replace(/\s+/g, '') &&
         (r.statut === 'en_attente' || r.statut === 'confirmee')
  ).length;

  if (activeCount >= 3) {
    throw new Error("Vous avez déjà plusieurs réservations actives. Veuillez contacter directement le restaurant par WhatsApp ou téléphone.");
  }

  const reference = generateReference();
  const zoneInfo = zones.find(z => z.id === bookingData.zone_id);

  const reservationRecord = {
    reference,
    date: bookingData.date,
    heure: bookingData.heure,
    zone_id: bookingData.zone_id,
    zone_name: zoneInfo ? zoneInfo.name : bookingData.zone_id,
    personnes: Number(bookingData.personnes) || 2,
    occasion: bookingData.occasion || "Dîner standard",
    demandes_speciales: bookingData.demandes_speciales || "",
    nom: bookingData.nom.trim(),
    telephone: phoneCheck.formatted,
    email: bookingData.email ? bookingData.email.trim() : null,
    statut: "confirmee",
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([reservationRecord])
        .select()
        .single();

      if (error) throw error;
      return data || reservationRecord;
    } catch (err) {
      console.warn("Échec Supabase, enregistrement en local:", err);
      // Fallback local
      const current = getLocalReservations();
      current.unshift(reservationRecord);
      saveLocalReservations(current);
      return reservationRecord;
    }
  } else {
    const current = getLocalReservations();
    current.unshift(reservationRecord);
    saveLocalReservations(current);
    return reservationRecord;
  }
}

// Récupérer une réservation par référence (pour modifier / annuler)
export async function getReservationByReference(reference) {
  if (!reference) return null;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('reference', reference.trim().toUpperCase())
        .single();

      if (!error && data) return data;
    } catch (e) {
      console.warn(e);
    }
  }

  const local = getLocalReservations();
  return local.find(r => r.reference.toUpperCase() === reference.trim().toUpperCase()) || null;
}

// Mettre à jour le statut (Admin ou Client annulation)
export async function updateReservationStatus(reference, newStatus, internalNote = "") {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update({ statut: newStatus, note_interne: internalNote, updated_at: new Date().toISOString() })
        .eq('reference', reference)
        .select();

      if (!error) return data;
    } catch (err) {
      console.warn(err);
    }
  }

  const local = getLocalReservations();
  const index = local.findIndex(r => r.reference === reference);
  if (index !== -1) {
    local[index].statut = newStatus;
    if (internalNote) local[index].note_interne = internalNote;
    local[index].updated_at = new Date().toISOString();
    saveLocalReservations(local);
    return local[index];
  }
  return null;
}

// Obtenir toutes les réservations (pour le tableau de bord Restaurateur)
export async function getAllReservations() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: false })
        .order('heure', { ascending: true });

      if (!error && data) return data;
    } catch (err) {
      console.warn(err);
    }
  }

  return getLocalReservations();
}

// Gestion des dates bloquées
export function getBlockedDates() {
  return getLocalBlockedDates();
}

export function toggleBlockDate(date, slotId = null, reason = "Privatisation") {
  const current = getLocalBlockedDates();
  const existingIdx = current.findIndex(b => b.date === date && b.slotId === slotId);
  if (existingIdx !== -1) {
    current.splice(existingIdx, 1);
  } else {
    current.push({ date, slotId, reason, created_at: new Date().toISOString() });
  }
  saveLocalBlockedDates(current);
  return current;
}

// Formater une date YYYY-MM-DD en français lisible (ex: Samedi 21 novembre 2026)
function formatDateFR(dateStr) {
  if (!dateStr) return dateStr;
  try {
    const [year, month, day] = dateStr.split('-');
    const dateObj = new Date(year, parseInt(month) - 1, day);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formatted = dateObj.toLocaleDateString('fr-FR', options);
    // Première lettre en majuscule
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return dateStr;
  }
}

// Générateur du lien WhatsApp de confirmation pour le client (Mise en page VIP haut de gamme)
export function generateWhatsAppClientLink(reservation) {
  const phoneRestaurant = import.meta.env.VITE_RESTAURANT_WHATSAPP || '22990005656';
  const cleanPhone = phoneRestaurant.replace(/\D/g, '');
  const dateLisible = formatDateFR(reservation.date);

  let message = 
`🌴 *THE GARDEN ROOFTOP — COTONOU*
✨ *Confirmation de Réservation de Table*
━━━━━━━━━━━━━━━━━━━━

Bonjour l'équipe, je viens de finaliser ma réservation :

🔖 *RÉFÉRENCE :* \`${reservation.reference}\`
👤 *Nom :* *${reservation.nom.toUpperCase()}*
📅 *Date :* ${dateLisible}
⏰ *Heure :* *${reservation.heure}*
👥 *Invités :* *${reservation.personnes} ${reservation.personnes > 1 ? 'personnes' : 'personne'}*
📍 *Espace :* ${reservation.zone_name || reservation.zone_id}
🎉 *Occasion :* ${reservation.occasion}
`;

  if (reservation.demandes_speciales && reservation.demandes_speciales.trim()) {
    message += `📝 *Demande particulière :* _${reservation.demandes_speciales.trim()}_\n`;
  }

  message += 
`━━━━━━━━━━━━━━━━━━━━
Merci de bien vouloir me confirmer la table.
À très bientôt sous les étoiles ! 🍸`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// Générateur du lien WhatsApp de repli rapide
export function generateWhatsAppFallbackLink() {
  const phoneRestaurant = import.meta.env.VITE_RESTAURANT_WHATSAPP || '22990005656';
  const cleanPhone = phoneRestaurant.replace(/\D/g, '');
  const message = 
`🌴 *THE GARDEN ROOFTOP — COTONOU*
Bonjour l'équipe The Garden !

Je souhaite réserver une table chez vous. Pourriez-vous m'indiquer vos disponibilités pour ce soir ? 

Merci d'avance pour votre accueil ! ✨`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
