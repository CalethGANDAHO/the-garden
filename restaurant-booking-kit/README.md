# 🍽️ KIT UNIVERSEL DE RÉSERVATION POUR RESTAURANTS & BARS

Ce dossier contient **l'ensemble des briques de réservation haut de gamme** que vous pouvez réutiliser sur **n'importe quel autre site web de restaurant ou bar** (React, Next.js, Vite, etc.) sans devoir tout recoder.

---

## 📁 Comment réutiliser ce module sur un autre projet ?

Pour installer ce système sur un autre site :

1. **Copiez le fichier de configuration :**  
   Prenez le fichier `restaurant.config.js` et personnalisez simplement :
   - Le nom du restaurant (`name`)
   - La ville et le pays (`city`, `country`)
   - Le numéro WhatsApp de l'établissement (`whatsappNumber`)
   - Les créneaux horaires (`slots`)
   - Les zones / salles (`zones`)
   - La politique (ex: retenue de 15 min, max personnes)

2. **Copiez le dossier de composants :**  
   Prenez le dossier `src/components/Reservation/` qui contient :
   - `ReservationSection.jsx` (le parcours en 3 étapes fluide)
   - `Step1DateTime.jsx` (calendrier, personnes et créneaux avec gestion de capacité)
   - `Step2ZoneOccasion.jsx` (choix de l'espace, occasion, notes)
   - `Step3ContactConfirm.jsx` (coordonnées, validation téléphone, anti-spam honeypot)
   - `ReservationSuccessModal.jsx` (confirmation immédiate et confettis)
   - `DigitalPassModal.jsx` (le **Pass Numérique VIP avec QR Code** prêt à être scanné au restaurant)
   - `ManageReservationModal.jsx` (recherche, consultation et annulation par référence)

3. **Copiez le moteur de réservation :**  
   Prenez `src/lib/reservationService.js` :
   - Il gère les calculs de disponibilité en temps réel.
   - Il génère les références uniques (ex: `NOM-2026-XXXX`).
   - Il génère les messages WhatsApp parfaitement formatés sans émojis corrompus.
   - Il fonctionne **avec Supabase** ou **en mode local (LocalStorage)** sans configuration complexe.

4. **Installez les 2 petites dépendances :**
   ```bash
   npm install qrcode canvas-confetti
   ```

---

## 🎫 Le Ticket Numérique VIP (Pass de table)
Chaque client qui réserve obtient automatiquement un **Pass Numérique VIP** comprenant :
- Un **QR Code unique** vérifiable à l'entrée par le maître d'hôtel avec un smartphone.
- Le nom du client, la date, l'heure et l'espace réservé.
- Un bouton pour **Enregistrer / Imprimer** le pass ou le capturer en plein écran.
- Plus besoin de chercher un numéro : le client le montre directement à l'accueil !
