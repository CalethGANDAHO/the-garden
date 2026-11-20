/**
 * ==============================================================================
 * 🍽️ MODULE DE RÉSERVATION UNIVERSEL POUR RESTAURANTS & BARS
 * ==============================================================================
 * Modifiez simplement les valeurs ci-dessous pour adapter l'ensemble du système
 * de réservation à N'IMPORTE QUEL autre restaurant en moins de 2 minutes !
 */

export const RESTAURANT_CONFIG = {
  // 1. Identité de l'établissement
  identity: {
    name: "The Garden Rooftop",
    type: "Rooftop · Bar & Restaurant",
    tagline: "Sublimez vos nuits à Cotonou",
    city: "Cotonou",
    country: "Bénin",
    address: "9FF9+68 Cotonou, Bénin",
    currency: "FCFA", // ou 'EUR', 'USD', 'CAD', etc.
    logoText: "The Garden",
    prefixReference: "GARDEN" // Générera GARDEN-2026-XXXX
  },

  // 2. Coordonnées de contact & Réception WhatsApp
  contact: {
    phoneFormatted: "+229 90 00 56 56",
    whatsappNumber: "22990005656", // Avec indicatif pays, sans espaces ni '+'
    instagram: "@thegarden.cotonou",
    googleMapsPlusCode: "9FF9+68 Cotonou, Benin"
  },

  // 3. Politique de réservation
  policy: {
    holdTableMinutes: 15, // Délai de retenue de la table avant libération
    standardDurationMinutes: 120, // 2 heures par table
    maxGuestsOnline: 25, // Au-delà, message invitant à contacter le gérant
    alertLargeGroupThreshold: 10, // Seuil pour avertissement acompte
    maxActiveBookingsPerPhone: 3, // Protection anti-spam par numéro
  },

  // 4. Horaires et créneaux proposés (adaptables à chaque restaurant)
  slots: [
    { id: '18:00', label: '18:00', maxCapacity: 35 },
    { id: '19:00', label: '19:00', maxCapacity: 45 },
    { id: '20:00', label: '20:00', maxCapacity: 50 },
    { id: '21:00', label: '21:00', maxCapacity: 50 },
    { id: '22:00', label: '22:00', maxCapacity: 50 },
    { id: '23:00', label: '23:00', maxCapacity: 40 },
    { id: '00:00', label: '00:00', maxCapacity: 35 },
    { id: '01:00', label: '01:00', maxCapacity: 25 }
  ],

  // 5. Espaces / Zones du restaurant
  zones: [
    {
      id: "rooftop",
      name: "Toit-terrasse / Outdoor",
      detail: "Ciel ouvert, lumières de la ville, au plus près du DJ et de la brise nocturne.",
      image: "/image/sunrise_cocktail_bar.webp",
      maxTables: 12,
      capacityPerTable: 4
    },
    {
      id: "private",
      name: "Salle à manger privée / Salon VIP",
      detail: "Service exclusif, coin climatisé et isolé, ambiance VIP intimiste.",
      image: "/image/rooftop_lounge_night.webp",
      maxTables: 4,
      capacityPerTable: 8
    },
    {
      id: "bar",
      name: "Coin Bar & Billard",
      detail: "Sièges confortables en rotin, lumières chaudes, table de billard sur le côté.",
      image: "/image/rooftop_lounge_night.webp",
      maxTables: 8,
      capacityPerTable: 4
    }
  ],

  // 6. Occasions proposées au client
  occasions: [
    "Dîner standard",
    "Soirée Karaoké",
    "Anniversaire",
    "Dîner romantique en amoureux",
    "Sortie entre amis / Afterwork",
    "Événement privé / Dîner d'affaires"
  ],

  // 7. Mot de passe du tableau de bord restaurateur
  admin: {
    defaultPassword: "garden2026"
  }
};
