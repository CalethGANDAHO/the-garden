# 🌴 The Garden Rooftop — Bar & Restaurant (Cotonou, Bénin)

Site web officiel et système de réservation haut de gamme pour **The Garden Rooftop**, situé à Cotonou (Bénin).

Reconstruit avec une architecture moderne, fluide, ultra-rapide (optimisé mobile-first 3G/4G pour le Bénin), respectant scrupuleusement l'identité visuelle d'origine (ambiance lounge sombre, dégradés néons vert-cyan, glassmorphism, bascule Jour / Nuit) et enrichi d'un système de réservation complet connecté à Supabase et WhatsApp.

---

## ✨ Fonctionnalités Principales

### 📱 Expérience Client (Mobile-First)
- **Design & Ambiance :** Dark mode sophistiqué, glassmorphism, animations subtiles, typographies Montserrat & Inter.
- **Commutateur Jour / Nuit (`vibe`) :** Adapte dynamiquement les accroches et met en valeur les plats recommandés (*Choix du soir* / *Choix du jour*).
- **Menu & Gastronomie :** Cocktails signatures, grillades locales au feu de bois (Allocos, Suya, Bœuf), encas de fin de nuit, avec modale détaillant les ingrédients et prix en FCFA.
- **Avis Google Maps Vérifiés :** Intégration de la note (4,2/5 sur 236 avis) et des témoignages réels.
- **Programmation & Événements :** Mardi Karaoké, Jeudi Live Afrobeats, Vendredi/Samedi DJ Set, Dimanche Brunch.
- **SEO Local & Réseaux Sociaux :** Balises Open Graph, Twitter Cards, Schema.org `Restaurant` géolocalisé à Cotonou.

### 🛎️ Système de Réservation Haut de Gamme
1. **Parcours en 3 étapes :**
   - **Étape 1 :** Date, nombre de couverts, créneau horaire avec calcul de disponibilité en temps réel (18h00 à 01h00, pas de créneaux fermés).
   - **Étape 2 :** Choix de l'espace (*Toit-terrasse Outdoor*, *Salon VIP Privé*, *Coin Bar & Billard*), occasion (anniversaire, karaoké, etc.) et demandes particulières.
   - **Étape 3 :** Coordonnées (nom, téléphone béninois indicatif +229 validé, e-mail facultatif), récapitulatif et politique de retenue (15 min).
2. **Capacité & Anti-Surréservation :** Chaque créneau et chaque zone ont un nombre maximal de tables/couverts.
3. **Confirmation Immédiate :** Référence unique générée (`GARDEN-2026-XXXX`) avec confettis et bouton direct d'envoi de confirmation pré-remplie sur WhatsApp.
4. **Anti-Spam :** Protection Honeypot invisible pour les robots et limitation des réservations actives par numéro.
5. **Gestion Client :** Bouton « Gérer ma table » permettant au client de retrouver sa réservation avec son numéro pour consulter ou annuler sans frais (réduction des no-shows).
6. **Bouton de repli :** Possibilité de réserver à tout moment directement par WhatsApp.

### 📊 Tableau de Bord Restaurateur (Protégé par Mot de Passe)
- Accès discret via l'icône cadenas dans la barre de navigation.
- Mot de passe de sécurité (par défaut : `garden2026`, personnalisable dans `.env`).
- Statistiques en direct : couverts prévus ce soir, réservations du jour, total historique.
- Gestion des statuts : confirmer, annuler, contacter le client sur WhatsApp en 1 clic.
- Blocage de dates : privatisation complète ou partielle pour événements privés.
- **Export Excel (`.xlsx`) :** Téléchargement instantané de la liste des réservations pour le service en salle.

---

## 🛠️ Stack Technique

- **Frontend :** React 18 / 19, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti, SheetJS (XLSX).
- **Base de Données :** Supabase (PostgreSQL avec Row Level Security).
  - *Note :* L'application intègre un mode hors-ligne / fallback local miroir automatique : elle fonctionne parfaitement même sans clé Supabase !
- **Hébergement :** Netlify (optimisé avec `netlify.toml` et mise en cache des images WebP).

---

## 🚀 Installation & Lancement Local

### Prérequis
- Node.js (v18 ou supérieur)
- npm

### Commandes
```bash
# 1. Cloner ou ouvrir le dossier du projet
cd the-garden

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement local
npm run dev
```
Le site sera accessible sur `http://localhost:3000`.

---

## ⚙️ Variables d'Environnement

Créez un fichier `.env` à la racine (ou inspirez-vous de `.env.example`) :

```env
# Supabase (Optionnel pour tester, requis pour la synchronisation multi-appareils)
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-publique

# Restaurant
VITE_RESTAURANT_WHATSAPP=22990005656
VITE_RESTAURANT_PHONE=+229 90 00 56 56

# Mot de passe administrateur du restaurant
VITE_ADMIN_PASSWORD=garden2026
```

---

## 🗄️ Configuration de la Base de Données Supabase

1. Créez un projet gratuit sur [Supabase](https://supabase.com).
2. Rendez-vous dans le menu **SQL Editor**.
3. Ouvrez le fichier [supabase_setup.sql](supabase_setup.sql) fourni dans ce projet.
4. Copiez-collez son contenu et cliquez sur **Run**.
5. Récupérez vos clés dans `Project Settings > API` :
   - `Project URL` ➔ `VITE_SUPABASE_URL`
   - `anon public key` ➔ `VITE_SUPABASE_ANON_KEY`
6. Ajoutez-les dans votre fichier `.env` local et dans vos variables d'environnement sur Netlify !

---

## 🌐 Déploiement sur Netlify

### Méthode 1 : Déploiement Continu via GitHub (Recommandé)
1. Poussez votre code sur un dépôt GitHub (voir section suivante).
2. Connectez-vous sur [Netlify](https://app.netlify.com).
3. Cliquez sur **Add new site > Import an existing project > GitHub**.
4. Sélectionnez votre dépôt `the-garden`.
5. Netlify détecte automatiquement la configuration grâce au fichier `netlify.toml` :
   - Build command : `npm run build`
   - Publish directory : `dist`
6. Renseignez vos variables d'environnement dans Netlify (`Site configuration > Environment variables`).
7. Cliquez sur **Deploy site**.

### Méthode 2 : Déploiement Manuel (Drag & Drop)
1. Exécutez `npm run build`.
2. Glissez-déposez le dossier `dist/` généré directement sur [app.netlify.com/drop](https://app.netlify.com/drop).

---

## 🔒 Sauvegarde Git (Pour ne plus jamais perdre le code)

Le projet est initialisé avec Git. Pour le sauvegarder définitivement sur votre compte GitHub ou GitLab :

```bash
# 1. Vérifier l'état du dépôt
git status

# 2. Créer un nouveau dépôt sur GitHub (ex: the-garden-rooftop)
# 3. Lier votre dépôt local et pousser votre code
git remote add origin https://github.com/votre-nom-utilisateur/the-garden-rooftop.git
git branch -M main
git push -u origin main
```
Ainsi, votre code sera sauvegardé pour toujours dans le cloud !
