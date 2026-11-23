import React from 'react';
import { MapPin, Clock, Phone, Utensils, Car, Truck, ParkingCircle, CreditCard, Accessibility } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVibe } from '../context/VibeContext';
import InstagramIcon from './icons/InstagramIcon';

export default function Footer() {
  const { t } = useLanguage();
  const { vibe } = useVibe();
  const isNight = vibe === 'night';

  const serviceBadges = [
    { icon: Utensils, label: "Sur place" },
    { icon: Car, label: "Drive" },
    { icon: Truck, label: "Livraison" },
    { icon: ParkingCircle, label: "Parking gratuit" },
    { icon: CreditCard, label: "Paiements NFC" },
    { icon: Accessibility, label: "Accès PMR" },
  ];

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-white/10 transition-colors">
      {/* Arrière-plan stylisé */}
      <img
        src={isNight ? "/image/rooftop_lounge_night.webp" : "/image/clean_food_photograph.webp"}
        alt={isNight ? "The Garden Rooftop ambiance de nuit" : "The Garden Rooftop ambiance de jour"}
        loading="lazy"
        className="absolute inset-0 size-full object-cover opacity-20 transition-all duration-700"
      />
      <div className="hero-veil absolute inset-0" />

      {/* Contenu principal */}
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pt-20 pb-36 sm:px-8 md:grid-cols-3 lg:pb-24">
        {/* Colonne 1 : Identité */}
        <div>
          <span className="font-display text-3xl font-bold tracking-tight text-white block">
            The Garden
          </span>
          <p className="mt-1 text-xs tracking-[0.28em] text-primary uppercase font-bold">
            Rooftop · Bar · Restaurant
          </p>
          <p className="mt-4 max-w-xs text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t.footer.desc}
          </p>
        </div>

        {/* Colonne 2 : Coordonnées directes */}
        <ul className="grid content-start gap-3.5 text-xs sm:text-sm text-white/80">
          <li className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>9FF9+68 Cotonou, Bénin</span>
          </li>
          <li className="flex items-start gap-3">
            <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{t.location.hoursVal}</span>
          </li>
          <li className="flex items-start gap-3">
            <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
            <a href="tel:+22990005656" className="hover:text-primary transition-colors">
              +229 90 00 56 56
            </a>
          </li>
          <li className="flex items-start gap-3">
            <InstagramIcon className="mt-0.5 size-4 shrink-0 text-primary" />
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              @thegarden.cotonou
            </a>
          </li>
        </ul>

        {/* Colonne 3 : CTA Réservation */}
        <a
          href="#reserve"
          className="glass lift grid h-fit place-items-center rounded-3xl border border-white/10 p-6 text-center group hover:border-primary/50 transition-colors"
        >
          <span className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-primary transition-colors">
            {t.footer.ctaTitle}
          </span>
          <span className="mt-2 text-xs text-muted-foreground">
            {t.footer.ctaDesc}
          </span>
          <span className="mt-4 rounded-full bg-primary/20 border border-primary/30 px-4 py-1.5 text-xs font-semibold text-primary">
            {t.footer.ctaBtn}
          </span>
        </a>
      </div>

      {/* Badges de services du restaurant */}
      <div className="relative mx-auto max-w-6xl border-t border-white/10 px-5 py-6 sm:px-8">
        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-muted-foreground md:justify-between">
          <div className="flex flex-wrap items-center gap-4 justify-center">
            {serviceBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <span key={idx} className="flex items-center gap-1.5 text-white/70">
                  <Icon className="size-3.5 text-primary" />
                  {badge.label}
                </span>
              );
            })}
          </div>

          <div className="text-[11px] text-white/40">
            © {new Date().getFullYear()} {t.footer.rights}
          </div>
        </div>
      </div>
    </footer>
  );
}
