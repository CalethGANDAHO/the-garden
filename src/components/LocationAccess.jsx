import React from 'react';
import { MapPin, Clock, DollarSign, ExternalLink, Phone, Navigation } from 'lucide-react';

export default function LocationAccess() {
  const mapEmbedUrl = "https://maps.google.com/maps?q=9FF9%2B68%20Cotonou&t=&z=15&ie=UTF8&iwloc=&output=embed";
  const mapsDirectUrl = "https://maps.google.com/?q=9FF9+68,Cotonou,Benin";

  return (
    <section id="location" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-10 min-w-0">
          <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" /> Où nous trouver
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white">
            Localisation & Accès
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-start lg:gap-12">
          {/* Fiche d'informations */}
          <div className="glass rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-white">
                The Garden Rooftop
              </h3>
              <p className="text-xs text-primary font-semibold tracking-wide uppercase mt-0.5">
                Bar, Restaurant & Lounge à Cotonou
              </p>
            </div>

            <ul className="grid gap-5 text-sm">
              {/* Adresse */}
              <li className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <MapPin className="size-5" />
                </span>
                <div>
                  <strong className="block font-semibold text-white">Adresse & Repère</strong>
                  <span className="text-xs text-muted-foreground block mt-0.5">
                    Plus Code : <strong>9FF9+68 Cotonou, Bénin</strong>
                  </span>
                </div>
              </li>

              {/* Horaires */}
              <li className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Clock className="size-5" />
                </span>
                <div>
                  <strong className="block font-semibold text-white">Horaires d'ouverture</strong>
                  <span className="text-xs text-leaf font-medium block mt-0.5">
                    Ouvert 7 jours sur 7 : 18:00 — 05:00
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    Service tardif & cocktails en continu
                  </span>
                </div>
              </li>

              {/* Prix moyen */}
              <li className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <DollarSign className="size-5" />
                </span>
                <div>
                  <strong className="block font-semibold text-white">Fourchette de prix</strong>
                  <span className="text-xs text-muted-foreground block mt-0.5">
                    2.000 à 4.000 FCFA par personne en moyenne
                  </span>
                </div>
              </li>

              {/* Téléphone direct */}
              <li className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-leaf/10 text-leaf">
                  <Phone className="size-5" />
                </span>
                <div>
                  <strong className="block font-semibold text-white">Réservations directes</strong>
                  <a
                    href="tel:+22990005656"
                    className="text-xs text-primary font-bold hover:underline block mt-0.5"
                  >
                    +229 90 00 56 56
                  </a>
                </div>
              </li>
            </ul>

            <a
              href={mapsDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 py-3.5 px-4 text-xs font-bold text-white transition-colors"
            >
              <Navigation className="size-4 text-primary" />
              Ouvrir l'itinéraire Google Maps
            </a>
          </div>

          {/* Iframe Google Maps */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 aspect-[4/3] lg:aspect-[16/11] shadow-2xl relative">
            <iframe
              title="The Garden Rooftop — Localisation Cotonou"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full filter grayscale-[30%] contrast-[110%] brightness-[85%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
