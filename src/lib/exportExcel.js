import * as XLSX from 'xlsx';

export function exportReservationsToExcel(reservations, filename = 'reservations-the-garden.xlsx') {
  if (!reservations || reservations.length === 0) {
    alert("Aucune réservation à exporter.");
    return;
  }

  const dataToExport = reservations.map(r => ({
    "Référence": r.reference,
    "Date": r.date,
    "Heure": r.heure,
    "Client": r.nom,
    "Téléphone": r.telephone,
    "E-mail": r.email || "Non renseigné",
    "Couverts": r.personnes,
    "Zone": r.zone_name || r.zone_id,
    "Occasion": r.occasion || "Standard",
    "Demandes particulières": r.demandes_speciales || "Aucune",
    "Statut": r.statut,
    "Créé le": new Date(r.created_at).toLocaleString("fr-FR")
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Réservations");

  // Ajustement automatique des largeurs de colonnes
  const colWidths = [
    { wch: 18 }, // Référence
    { wch: 12 }, // Date
    { wch: 8 },  // Heure
    { wch: 22 }, // Client
    { wch: 18 }, // Téléphone
    { wch: 24 }, // E-mail
    { wch: 10 }, // Couverts
    { wch: 20 }, // Zone
    { wch: 18 }, // Occasion
    { wch: 30 }, // Demandes
    { wch: 12 }, // Statut
    { wch: 18 }  // Créé le
  ];
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, filename);
}
