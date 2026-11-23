import React, { useState, useMemo } from 'react';
import { useVibe } from '../context/VibeContext';
import { useLanguage } from '../context/LanguageContext';
import { menuItems } from '../data/menuData';
import { formatPrice } from '../lib/utils';
import { Sparkles, Moon, Sun, ArrowRight } from 'lucide-react';
import MenuModal from './MenuModal';

export default function Menu({ onSelectDishForReservation }) {
  const { vibe } = useVibe();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = [
    { id: 'all', label: t.menu.all },
    { id: 'cocktails', label: t.menu.cocktails },
    { id: 'grill', label: t.menu.grill },
    { id: 'late', label: t.menu.late }
  ];

  // Filtrage et tri contextuel Jour/Nuit
  const filteredItems = useMemo(() => {
    return menuItems
      .filter(item => activeCategory === 'all' || item.category === activeCategory)
      .sort((a, b) => {
        const aMatches = a.vibe === vibe || a.vibe === 'both';
        const bMatches = b.vibe === vibe || b.vibe === 'both';
        return Number(bMatches) - Number(aMatches);
      });
  }, [activeCategory, vibe]);

  return (
    <section id="menu" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8">
      {/* En-tête de section */}
      <div className="grid gap-4 sm:flex sm:items-end sm:justify-between">
        <div className="min-w-0">
          <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" /> {t.menu.tag}
          </span>
          <h2 className="mt-2 text-3xl font-display font-extrabold tracking-tight sm:text-5xl text-white">
            {t.menu.title}
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
          {vibe === 'night' ? t.menu.descNight : t.menu.descDay}
        </p>
      </div>

      {/* Catégories de filtres */}
      <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 rounded-full border px-5 py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 ${
              activeCategory === cat.id
                ? 'border-transparent bg-primary text-slate-950 font-semibold shadow-md shadow-primary/20 scale-105'
                : 'border-white/10 bg-secondary/40 text-muted-foreground hover:text-white hover:border-white/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grille des plats */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map(item => {
          const isVibeMatch = item.vibe === vibe || item.vibe === 'both';
          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedItem(item)}
              className="glass lift group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 text-left cursor-pointer transition-all duration-300 hover:border-primary/50"
            >
              {/* Photo du plat */}
              <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Badge contextuel */}
                {isVibeMatch && (
                  <span className="glass absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                    {vibe === 'night' ? (
                      <>
                        <Moon className="size-3 text-leaf" /> {t.menu.choiceNight}
                      </>
                    ) : (
                      <>
                        <Sun className="size-3 text-yellow-400" /> {t.menu.choiceDay}
                      </>
                    )}
                  </span>
                )}

                {/* Badge Prix */}
                <span className="absolute bottom-3 right-3 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-bold text-primary border border-primary/20">
                  {formatPrice(item.price)}
                </span>
              </div>

              {/* Détails */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {item.tagline}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-[11px] text-white/50">
                    {item.ingredients.slice(0, 3).join(', ')}...
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-primary group-hover:translate-x-1 transition-transform">
                    {t.menu.detailsBtn} <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modale de détail */}
      {selectedItem && (
        <MenuModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSelectForBooking={(item) => {
            if (onSelectDishForReservation) {
              onSelectDishForReservation(item);
            }
          }}
        />
      )}
    </section>
  );
}
