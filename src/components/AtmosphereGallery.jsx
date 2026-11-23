import React from 'react';
import { galleryPhotos } from '../data/galleryData';
import { useLanguage } from '../context/LanguageContext';
import InstagramIcon from './icons/InstagramIcon';

export default function AtmosphereGallery() {
  const { t } = useLanguage();

  return (
    <section id="atmosphere" className="py-20 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Titre */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold tracking-[0.3em] text-primary uppercase flex items-center gap-1.5 hover:underline"
            >
              <InstagramIcon className="size-3.5" /> {t.atmosphere.tag}
            </a>
            <h2 className="mt-2 text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white">
              {t.atmosphere.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
            {t.atmosphere.desc}
          </p>
        </div>

        {/* Grille 6 photos */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
          {galleryPhotos.map((photo, i) => (
            <figure
              key={i}
              className="group relative aspect-square overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-black/40"
            >
              <img
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <figcaption className="hero-veil absolute inset-0 flex items-end p-4 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
