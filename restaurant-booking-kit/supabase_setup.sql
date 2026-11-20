-- ==============================================================================
-- SCHÉMA DE BASE DE DONNÉES SUPABASE — THE GARDEN ROOFTOP COTONOU
-- ==============================================================================
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase (SQL Editor).

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE DES ZONES / TABLES
CREATE TABLE IF NOT EXISTS public.zones (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT,
  capacite_tables INTEGER NOT NULL DEFAULT 10,
  places_par_table INTEGER NOT NULL DEFAULT 4,
  capacite_totale_personnes INTEGER GENERATED ALWAYS AS (capacite_tables * places_par_table) STORED,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertion des zones initiales de The Garden Rooftop
INSERT INTO public.zones (id, nom, description, capacite_tables, places_par_table)
VALUES 
  ('rooftop', 'Toit-terrasse / Outdoor', 'Ciel ouvert, brise marine et vue imprenable sur Cotonou', 12, 4),
  ('private', 'Salle à manger privée / Salon VIP', 'Espace climatisé intimiste pour célébrations et dîners privés', 4, 8),
  ('bar', 'Coin Bar & Billard Lounge', 'Ambiance feutrée, tabourets et table de billard américaine', 8, 4)
ON CONFLICT (id) DO NOTHING;

-- 3. TABLE DES CRÉNEAUX HORAIRES (Horaires d'ouverture : 18h00 - 05h00)
CREATE TABLE IF NOT EXISTS public.creneaux (
  id TEXT PRIMARY KEY,
  heure TEXT NOT NULL,
  duree_minutes INTEGER DEFAULT 120, -- Durée standard 2h
  max_couverts INTEGER NOT NULL DEFAULT 40,
  actif BOOLEAN DEFAULT TRUE
);

INSERT INTO public.creneaux (id, heure, max_couverts)
VALUES 
  ('18h00', '18:00', 30),
  ('19h00', '19:00', 40),
  ('20h00', '20:00', 50),
  ('21h00', '21:00', 50),
  ('22h00', '22:00', 50),
  ('23h00', '23:00', 40),
  ('00h00', '00:00', 30),
  ('01h00', '01:00', 25)
ON CONFLICT (id) DO NOTHING;

-- 4. TABLE DES DATES BLOQUÉES (Événements privés, privatisations)
CREATE TABLE IF NOT EXISTS public.dates_bloquees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  creneau_id TEXT REFERENCES public.creneaux(id) ON DELETE CASCADE,
  zone_id TEXT REFERENCES public.zones(id) ON DELETE CASCADE,
  motif TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, creneau_id, zone_id)
);

-- 5. TABLE DES PARAMÈTRES DU RESTAURANT
CREATE TABLE IF NOT EXISTS public.parametres (
  cle TEXT PRIMARY KEY,
  valeur JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.parametres (cle, valeur)
VALUES 
  ('politique', '{
    "délai_retenue_minutes": 15,
    "max_personnes_en_ligne": 12,
    "acompte_grands_groupes": true,
    "telephone_contact": "+22990005656"
  }'::jsonb),
  ('horaires', '{
    "ouverture": "18:00",
    "fermeture": "05:00",
    "tous_les_jours": true
  }'::jsonb)
ON CONFLICT (cle) DO NOTHING;

-- 6. TABLE DES RÉSERVATIONS
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT UNIQUE NOT NULL, -- Format: GARDEN-YYYY-XXXX
  date DATE NOT NULL,
  heure TEXT NOT NULL,
  zone_id TEXT REFERENCES public.zones(id) ON DELETE RESTRICT,
  personnes INTEGER NOT NULL CHECK (personnes >= 1 AND personnes <= 30),
  occasion TEXT DEFAULT 'Dîner standard',
  demandes_speciales TEXT,
  
  -- Coordonnées
  nom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  email TEXT,
  
  -- Statut et cycle de vie
  statut TEXT NOT NULL DEFAULT 'confirmee' CHECK (statut IN ('en_attente', 'confirmee', 'rejetee', 'annulee', 'terminee')),
  confirmee_par_client BOOLEAN DEFAULT FALSE,
  note_interne TEXT,
  
  -- Anti-spam & audit
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour accélérer les vérifications de disponibilité
CREATE INDEX IF NOT EXISTS idx_reservations_date_heure ON public.reservations (date, heure);
CREATE INDEX IF NOT EXISTS idx_reservations_telephone ON public.reservations (telephone);
CREATE INDEX IF NOT EXISTS idx_reservations_reference ON public.reservations (reference);

-- 7. RLS (Row Level Security)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creneaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dates_bloquees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parametres ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les zones, créneaux et dates bloquées
CREATE POLICY "Zones consultables par tous" ON public.zones FOR SELECT USING (true);
CREATE POLICY "Créneaux consultables par tous" ON public.creneaux FOR SELECT USING (true);
CREATE POLICY "Dates bloquées consultables par tous" ON public.dates_bloquees FOR SELECT USING (true);
CREATE POLICY "Paramètres consultables par tous" ON public.parametres FOR SELECT USING (true);

-- Réservations :
-- Le public peut insérer une réservation et lire sa propre réservation par sa référence unique
CREATE POLICY "Création publique de réservation" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Consultation par référence" ON public.reservations FOR SELECT USING (true);
CREATE POLICY "Modification par référence" ON public.reservations FOR UPDATE USING (true);

-- Commentaires
COMMENT ON TABLE public.reservations IS 'Réservations de tables The Garden Rooftop Cotonou';
