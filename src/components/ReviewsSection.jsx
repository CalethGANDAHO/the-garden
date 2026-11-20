import React from 'react';
import { restaurantReviews } from '../data/reviewsData';
import { Star, CheckCircle, MessageSquare } from 'lucide-react';

export default function ReviewsSection() {
  return (
    <section className="py-20 border-t border-white/5 bg-black/20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* En-tête Google Maps Reviews */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-leaf" /> Expérience Client
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-display font-extrabold text-white">
              Avis & Témoignages Vérifiés
            </h2>
          </div>

          {/* Badge Note Google */}
          <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <div className="flex flex-col items-center justify-center border-r border-white/10 pr-4">
              <span className="font-display text-3xl font-black text-amber-400">
                {restaurantReviews.rating}
              </span>
              <div className="flex text-amber-400 mt-0.5">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-400" />
                ))}
                <Star className="size-3.5 fill-amber-400/50" />
              </div>
            </div>
            <div className="text-xs">
              <span className="font-bold text-white block">Note Google Maps</span>
              <span className="text-muted-foreground">{restaurantReviews.totalReviews} avis de clients</span>
              <span className="text-[10px] text-leaf block mt-0.5 font-medium">Prix moyen : {restaurantReviews.priceRange}</span>
            </div>
          </div>
        </div>

        {/* Grille des avis */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {restaurantReviews.items.map((item, idx) => (
            <div
              key={idx}
              className="glass rounded-3xl border border-white/10 p-6 flex flex-col justify-between hover:border-primary/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="size-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{item.date}</span>
                </div>

                <p className="text-xs text-white/80 leading-relaxed italic mb-4">
                  « {item.comment} »
                </p>
              </div>

              <div className="border-t border-white/5 pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1">
                      {item.author} <CheckCircle className="size-3 text-leaf" />
                    </h4>
                    <span className="text-[10px] text-muted-foreground">{item.role}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-md bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-semibold text-primary">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
