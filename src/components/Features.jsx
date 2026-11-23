import React from 'react';
import { Accessibility, Sparkles, Wine, CreditCard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Features() {
  const { t } = useLanguage();

  const items = [
    {
      icon: Accessibility,
      title: t.features.accessibility.title,
      desc: t.features.accessibility.desc
    },
    {
      icon: Sparkles,
      title: t.features.atmosphere.title,
      desc: t.features.atmosphere.desc
    },
    {
      icon: Wine,
      title: t.features.drinks.title,
      desc: t.features.drinks.desc
    },
    {
      icon: CreditCard,
      title: t.features.parking.title,
      desc: t.features.parking.desc
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
