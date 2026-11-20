import React from 'react';
import { Accessibility, Sparkles, Wine, CreditCard } from 'lucide-react';

export default function Features() {
  const items = [
    {
      icon: Accessibility,
      title: "Accessibilité",
      desc: "Entrée & Toilettes accessibles aux personnes en fauteuil roulant (PMR)."
    },
    {
      icon: Sparkles,
      title: "Ambiance",
      desc: "Toit-terrasse panoramique, Happy Hour, Musique Live, Karaoké & Salle VIP."
    },
    {
      icon: Wine,
      title: "Boissons",
      desc: "Cocktails Signatures, Vins Fins de garde & Bières fraîches locales et importées."
    },
    {
      icon: CreditCard,
      title: "Parking & Paiement",
      desc: "Paiements mobiles NFC acceptés, stationnement facile et parking gratuit dans la rue."
    }
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 pb-12 pt-6 sm:px-8">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {items.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div
              key={i}
              className="glass lift flex flex-col gap-3 rounded-3xl border border-white/10 p-6 transition-all duration-300 hover:border-primary"
            >
              <div className="grid size-11 place-items-center rounded-2xl bg-primary/15 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="font-display font-bold text-base text-white">
                {feat.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
